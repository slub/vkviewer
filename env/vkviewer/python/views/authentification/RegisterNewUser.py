from pyramid.view import view_config
from pyramid.httpexceptions import HTTPFound
from pyramid.security import remember

from vkviewer.python.models.authentification import Users
import transaction
import json

@view_config(route_name='auth', renderer='string', match_param='action=new', request_method='POST')
def register_new_user(request):
    login_url = request.route_url('auth',action='new')
    referrer = request.url
    if referrer == login_url:
        referrer = '/'
    came_from = request.params.get('came_from')
    message = ''
    login = ''
    password = ''
    _ = request.translate
    if 'form.submitted' in request.params:
        # parse query parameter
        login = request.params['username']
        password = request.params['password']
        email = request.params['email']
        vorname = request.params['vorname'] 
        nachname = request.params['nachname']
        
        # init session 
        dbsession = request.db

        # check if there is already a user with the same login registered in the database
        if not Users.by_username(login, dbsession):
            # register new user in the databse
            newUser = Users(login=login, password=password, email=email, vorname=vorname, nachname=nachname)
            dbsession.add(newUser)

            # define response header
            #userName = newUser.vorname+' '+newUser.nachname
            headers = remember(request, login)
            # get target url and route to it
            target_url = request.route_url('home_login')
            transaction.commit()
            return HTTPFound(location = target_url, headers = headers)
        
        message = 'err_loginid_used'

    return json.dumps(dict(
        message = _(message),
        came_from = came_from,
        login = login,
        password = password,
    ), ensure_ascii=False, encoding='utf-8')
