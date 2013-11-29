from pyramid.response import Response
from pyramid.view import view_config
from pyramid.httpexceptions import HTTPNotFound, HTTPFound, HTTPBadRequest
from pyramid.security import remember, forget
from pyramid.i18n import get_locale_name

from vkviewer.python.tools import checkIsUser, getCookie
from vkviewer.python.i18n import LOCALES
from vkviewer import log

""" basic start site """
@view_config(route_name='home', renderer='index_login.mako', permission='view',http_cache=0)
def get_index_page(request):  
    log.info('Call view get_index_page.')
    
    # checks if already a user cookie is set and if yes gives back the logged in view
    if checkIsUser(request):
        target_url = request.route_url('home_login')
        return HTTPFound(location = target_url)
    elif getCookie(request, 'welcomepage') == 'off':
        print "test"
        return {'welcomepage':'off'}
    else: 
        print "testtest"
        return {}

""" basic start site but logged in """
@view_config(route_name='home_login', renderer='index_georef.mako', permission='edit',http_cache=0)
def index_page_login(request):
    return {}


""" This is called for checking the localization of the application and sets the correct locales """
@view_config(route_name='set_locales')
def set_locale_cookie(request):
    if request.GET['language']:
        language = request.GET['language']
        if not language in LOCALES:
            language = request.registry.settings.default_locale_name
        response = Response()
        response.set_cookie('_LOCALE_', value=language, max_age=31536000)
        target_url = request.route_url('home')
    return HTTPFound(location = target_url, headers = response.headers)

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

@view_config(route_name='welcome', renderer='welcome.mako', permission='view',http_cache=0)
def welcome_page(request):  
    return {}
