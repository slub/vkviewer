from pyramid.view import view_config
from pyramid.httpexceptions import HTTPFound
from pyramid.security import remember

from vkviewer.python.models.messtischblatt.Users import Users
import json

""" this view checks if the login is registered in the database and gets the vorname/nachname and 
    sends it back to client """
@view_config(route_name='auth', renderer='string', match_param='action=in', request_method='POST')
def login(request):
    login_url = request.route_url('auth',action='in')
    referrer = request.url
    if referrer == login_url:
        referrer = '/'
    came_from = request.referer ## request.params.get('came_from')
    message = ''
    login = ''
    password = ''
    _ = request.translate
    dbsession = request.db
    if 'form.submitted' in request.params:
        login = request.params['username']
        password = request.params['password']
        user = Users.by_username(login, dbsession)
        if user and user.validate_password(password):
            # define response header
            #userName = user.vorname+' '+user.nachname
            headers = remember(request, login)
            # get target url and route to it
            target_url = request.route_url('home_login')
            return HTTPFound(location = target_url, headers = headers)   
        message = 'err_wrong_password' 

    return json.dumps(dict(
        message = _(message),
        came_from = came_from,
        login = login,
        password = password,
    ), ensure_ascii=False, encoding='utf-8')
