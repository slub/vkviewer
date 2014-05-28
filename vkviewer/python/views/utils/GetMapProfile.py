'''
Created on Feb 6, 2014

@author: mendt
'''
from pyramid.view import view_config
from vkviewer import log
from vkviewer.python.models.messtischblatt.Messtischblatt import Messtischblatt
from vkviewer.python.models.messtischblatt.MetadatenCore import MetadatenCore
from vkviewer.python.models.messtischblatt.MdDatensatz import MdDatensatz
from vkviewer.python.utils.exceptions import InternalAuthentificationError

@view_config(route_name='map_profile', renderer='profile_map.mako', permission='view', http_cache=3600)
def getPage_profileMtb(request):
    try:
        messtischblatt_id = None
        if 'objectid' in request.params:
            messtischblatt_id = request.params['objectid']
            log.info('Receive get map profile page for id %s.'%messtischblatt_id)
        
        messtischblatt = Messtischblatt.by_id(messtischblatt_id, request.db)                
        metadata = MetadatenCore.by_id(messtischblatt.id, request.db)
        metadata_datensatz = MdDatensatz.by_ObjectId(messtischblatt.id, request.db)
        return {'zoomify_prop':messtischblatt.zoomify_properties,'zoomify_width':messtischblatt.zoomify_width,
                'zoomify_height':messtischblatt.zoomify_height,'key':messtischblatt.dateiname,
                'titel_long': metadata.titel,'titel_short': metadata.titel_short, 'permalink': metadata_datensatz.permalink}
    except:
        log.error('Internal server error while trying to get profile page. Please try again or contact the page administrator.')
        raise InternalAuthentificationError('Internal server error while trying to get profile page. Please try again or contact the page administrator.')