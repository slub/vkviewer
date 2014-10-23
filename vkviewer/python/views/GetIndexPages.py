from pyramid.view import view_config
from pyramid.security import unauthenticated_userid
from pyramid.httpexceptions import HTTPFound

from vkviewer.python.security import groupfinder
from vkviewer.python.tools import checkIsUser, getCookie, appendParameterToQueryDict
from vkviewer import log

""" basic start site """
@view_config(route_name='home', renderer='main.mako', permission='view',http_cache=(0, {'public':True}))
@view_config(route_name='home1', renderer='main.mako', permission='view',http_cache=(0, {'public':True}))
def getMainPage(request):  
    log.info('Call view get_index_page.')
       
    # checks if already a user cookie is set and if yes gives back the logged in view
    userid = checkIsUser(request)
    if userid:            
        if ('z' in request.params and 'c' in request.params and 'oid' in request.params) or 'georef' in request.params:
            return HTTPFound(location = request.route_url('home_login', _query=appendParameterToQueryDict(request)))
        return HTTPFound(location = request.route_url('home_login', _query=appendParameterToQueryDict(request, 'georef', 'on')))
    
    if not withWelcomePage(request):
        return {'welcomepage':'off'}
    else: 
        return {}

""" basic start site but logged in """
@view_config(route_name='home_login', renderer='main.mako', permission='edit',http_cache=(0, {'public':True}))
def getMainPageLoggedIn(request):
    # check if user has priviliges and if yes allow him to modify
    groups = groupfinder(unauthenticated_userid(request), request)
    with_modify = False
    if groups and 'g:moderator' in groups or 'g:admin' in groups:
        with_modify = True       
    return {'welcomepage':'off', 'with_modify':with_modify}

def withWelcomePage(request):
    withWelcomePage = ''
    if 'welcomepage' in request.params:
        withWelcomePage = request.params['welcomepage']
    if getCookie(request, 'welcomepage') == 'off' or withWelcomePage == 'off':
        return False
    return True


    

