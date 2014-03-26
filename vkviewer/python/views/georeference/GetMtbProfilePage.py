'''
Created on Feb 6, 2014

@author: mendt
'''
from pyramid.view import view_config
from pyramid.security import authenticated_userid
from vkviewer import log
from vkviewer.python.security import groupfinder
from vkviewer.python.models.messtischblatt.Messtischblatt import Messtischblatt
from vkviewer.python.utils.exceptions import InternalAuthentificationError

@view_config(route_name='mtb_profile', renderer='mtb_profile.mako', permission='view',http_cache=3600)
def getPage_profileMtb(request):
    try:
        messtischblatt_id = None
        if 'id' in request.params:
            messtischblatt_id = request.params['id']
            log.info('Receive get profile mtb page for id %s.'%messtischblatt_id)
        
        messtischblatt = Messtischblatt.by_id(messtischblatt_id, request.db)
        
        user_id = authenticated_userid(request)
        if user_id:
            groups = groupfinder(user_id, request)
            if groups and 'g:moderator' in groups or 'g:admin' in groups:
                return {'with_modify':True, 'zoomify_prop':messtischblatt.zoomify_properties,
                        'zoomify_width':messtischblatt.zoomify_width,'zoomify_height':messtischblatt.zoomify_height,
                        'key':messtischblatt.dateiname}
                
        return {'zoomify_prop':messtischblatt.zoomify_properties,'zoomify_width':messtischblatt.zoomify_width,
                'zoomify_height':messtischblatt.zoomify_height,'key':messtischblatt.dateiname}
    except:
        log.error('Internal server error while trying to get profile page. Please try again or contact the page administrator.')
        raise InternalAuthentificationError('Internal server error while trying to get profile page. Please try again or contact the page administrator.')