'''
Created on Feb 6, 2014

@author: mendt
'''
from pyramid.view import view_config
from pyramid.security import authenticated_userid

from vkviewer.python.security import groupfinder

@view_config(route_name='mtb_profile', renderer='mtb_profile.mako', permission='view',http_cache=3600)
def getPage_profileMtb(request):
    user_id = authenticated_userid(request)
    if user_id:
        groups = groupfinder(user_id, request)
        if groups and 'g:moderator' in groups or 'g:admin' in groups:
            return {'with_modify':True}
    return {}