from pyramid.view import view_config
from pyramid.httpexceptions import HTTPFound
from vkviewer.python.tools import checkIsUser, getCookie
from vkviewer import log

""" basic start site """
@view_config(route_name='home', renderer='index_page.mako', permission='view',http_cache=(0, {'public':True}))
@view_config(route_name='home1', renderer='index_page.mako', permission='view',http_cache=(0, {'public':True}))
def get_index_page(request):  
    log.info('Call view get_index_page.')
    
    # checks if welcome page is activate
    withWelcomePage = ''
    if 'welcomepage' in request.params:
        withWelcomePage = request.params['welcomepage']
    
    # checks if already a user cookie is set and if yes gives back the logged in view
    if checkIsUser(request):
        target_url = request.route_url('home_login', _query={'georef':'on'})
        return HTTPFound(location = target_url)
    elif getCookie(request, 'welcomepage') == 'off' or withWelcomePage == 'off':
        return {'welcomepage':'off', 'faq_url': request.route_url('faq')}
    else: 
        return {'faq_url': request.route_url('faq')}

""" basic start site but logged in """
@view_config(route_name='home_login', renderer='index_page.mako', permission='view',http_cache=(0, {'public':True}))
def get_index_page_loggedIn(request):
    return {'welcomepage':'off', 'faq_url': request.route_url('faq_loggedIn')}




    

