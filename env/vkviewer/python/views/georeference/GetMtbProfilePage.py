'''
Created on Feb 6, 2014

@author: mendt
'''
from pyramid.view import view_config

@view_config(route_name='mtb_profile', renderer='mtb_profile.mako', permission='view',http_cache=3600)
def getPage_profileMtb(request):
    return {}