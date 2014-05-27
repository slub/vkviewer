from pyramid.view import view_config
from pyramid.security import unauthenticated_userid
from pyramid.httpexceptions import HTTPFound
from vkviewer.python.security import groupfinder
from vkviewer.python.tools import checkIsUser, getCookie, appendParameterToQueryDict
from vkviewer import log

""" basic start site """
@view_config(route_name='home', renderer='main_page.mako', permission='view',http_cache=(0, {'public':True}))
@view_config(route_name='home1', renderer='main_page.mako', permission='view',http_cache=(0, {'public':True}))
def getMainPage(request):  
    log.info('Call view get_index_page.')
       
    # checks if already a user cookie is set and if yes gives back the logged in view
    userid = checkIsUser(request)
    if userid:            
        return HTTPFound(location = request.route_url('home_login', _query=appendParameterToQueryDict(request, 'georef', 'on')))
    
    if not withWelcomePage(request):
        return {'welcomepage':'off', 'faq_url': request.route_url('faq')}
    else: 
        return {'faq_url': request.route_url('faq')}

""" basic start site but logged in """
@view_config(route_name='home_login', renderer='main_page.mako', permission='edit',http_cache=(0, {'public':True}))
def getMainPageLoggedIn(request):
    # check if user has priviliges and if yes allow him to modify
    groups = groupfinder(unauthenticated_userid(request), request)
    with_modify = False
    if groups and 'g:moderator' in groups or 'g:admin' in groups:
        with_modify = True       
    return {'welcomepage':'off', 'faq_url': request.route_url('faq_loggedIn'), 'with_modify':with_modify}

def withWelcomePage(request):
    withWelcomePage = ''
    if 'welcomepage' in request.params:
        withWelcomePage = request.params['welcomepage']
    if getCookie(request, 'welcomepage') == 'off' or withWelcomePage == 'off':
        return False
    return True


    

