from pyramid.response import Response
from pyramid.view import view_config
from pyramid.httpexceptions import  HTTPBadRequest

from vkviewer.python.tools import getCookie
from vkviewer import log

""" This view allows the user to set a cookie for activating and deactivating the welcome page on the main
    page. 
    
    @param welcomepage - {String} 
        off - set a cookie for deactivating the welcome page
        on - set a cookie for activating the welome page 
"""
@view_config(route_name='set_visitor_cookie', renderer='string', permission='view',http_cache=0)
def set_visitor_cookie(request):
    log.info('Call view set_visitor_cookie with params: %s.'%request.params)
    
    # parse query parameter
    setCookie = ''
    if 'welcomepage' in request.GET:
        setCookie = request.GET['welcomepage']
        
    # create response
    if setCookie == 'off':
        log.debug('Set deactivate welcome page cookie.')
        response = Response()
        response.set_cookie('welcomepage', setCookie, max_age=31536000) # max_age = year
        return response
    elif setCookie == 'on' and getCookie(request, 'welcomepage') == 'off':
        log.debug('Set activate welcome page cookie.')
        response = Response()
        response.set_cookie('welcomepage', setCookie, max_age=31536000)
        return response
    else: 
        log.debug('Value of query parameter \'welcomepage\' is not supported')
        response = Response()
        return HTTPBadRequest(headers = response.headers)  
