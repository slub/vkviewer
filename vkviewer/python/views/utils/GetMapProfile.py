'''
Created on Feb 6, 2014

@author: mendt
'''
import traceback
from pyramid.view import view_config
from pyramid.httpexceptions import HTTPFound

from vkviewer import log
from vkviewer.python.models.messtischblatt.Map import Map
from vkviewer.python.models.messtischblatt.Metadata import Metadata
from vkviewer.python.utils.exceptions import InternalAuthentificationError
from vkviewer.python.views.utils.GetPermalink import createPermalink
from vkviewer.python.utils.idgenerator import createOAI

@view_config(route_name='profile-map', renderer='profile-map.mako', permission='view', http_cache=3600)
def getPage_profileMtb(request):
    try:
        messtischblatt_id = None
        if 'objectid' in request.params:
            maps_id = request.params['objectid']
            log.info('Receive get map profile page for id %s.'%messtischblatt_id)
        
        georef = False
        if 'georef' in request.params and request.params['georef'].lower() == 'true':
            georef = True
        
        if georef:
            permalink = createPermalink(request, maps_id)
            return HTTPFound(location=permalink)
        
        mapObj = Map.by_id(maps_id, request.db)                
        metadata = Metadata.by_id(maps_id, request.db)        
        oai = createOAI(mapObj.id)
        
        return {'zoomify':metadata.imagezoomify,'key':oai,
                'titel_long': metadata.title,'titel_short': metadata.titleshort, 'permalink': metadata.apspermalink}
    except:
        log.error('Internal server error while trying to get profile page. Please try again or contact the page administrator.')
        log.error(traceback.format_exc())
        raise InternalAuthentificationError('Internal server error while trying to get profile page. Please try again or contact the page administrator.')