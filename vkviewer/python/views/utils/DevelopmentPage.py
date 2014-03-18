'''
Created on Jan 30, 2014

@author: mendt
'''
from pyramid.view import view_config

@view_config(route_name='development_page', renderer='development.mako', permission='edit', http_cache=0)
def development_page(request):
    return {}