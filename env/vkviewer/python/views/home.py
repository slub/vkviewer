from pyramid.response import Response
from pyramid.view import view_config
from pyramid.httpexceptions import HTTPNotFound, HTTPFound
from pyramid.security import remember, forget
from pyramid.i18n import get_locale_name

from ..tools import checkIsUser
from ..i18n import LOCALES

""" basic start site """
@view_config(route_name='home', renderer='index_login.mako', permission='view',http_cache=0)
def index_page(request):  
    # checks if already a user cookie is set and if yes gives back the logined view
    if checkIsUser(request):
        target_url = request.route_url('home_login')
        return HTTPFound(location = target_url)
    else:
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