""" This module containts the login and authentification views """

from pyramid.response import Response
from pyramid.view import view_config
from pyramid.httpexceptions import HTTPNotFound, HTTPFound
from pyramid.security import remember, forget
from sqlalchemy.exc import DBAPIError

from ..models.authentification import Users, Fehlermeldung
from ..georef.utils import getTimestampAsPGStr
import transaction
import json


""" this view checks if the login is registered in the database and gets the vorname/nachname and 
    sends it back to client """
@view_config(route_name='auth', match_param='action=getscreen', renderer='login_screen.mako', http_cache=0)
def getLoginScreen(request):
    return {}

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

""" this view starts the process for a password reset """
@view_config(route_name='auth', renderer='string', match_param='action=reset', request_method='POST')
def reset_pw(request):
    reset_url = request.route_url('auth',action='reset')
    referrer = request.url
    if referrer == reset_url:
        referrer = '/'
    came_from = request.params.get('came_from')
    message = ''
    login = ''
    email = ''
    dbsession = request.db
    if 'form.submitted' in request.params:
        login = request.params['username']
        email = request.params['email']
        user = Users.by_username(login, dbsession)
        if user and user.email == email:
            # register ticket in database
            newTicket = Fehlermeldung(fehlerbeschreibung="Passwort reset", timestamp=getTimestampAsPGStr(), referenz="users", nutzerid=user.login);
            dbsession.add(newTicket);
            transaction.commit()
            
            # get target url and route to it
            return json.dumps({'message':'in progress'}, ensure_ascii=False, encoding='utf-8') 
        message = 'Failed login'

    return dict(
        message = message,
        url = request.application_url + '/reset',
        came_from = came_from,
        login = login,
        email = email,
    )

@view_config(route_name='auth', match_param='action=out')
def logout(request):
    headers = forget(request)
    return HTTPFound(location = request.route_url('home'),
                     headers = headers)