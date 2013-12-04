from pyramid.view import view_config

from vkviewer.python.models.messtischblatt.Users import Users
from vkviewer.python.models.messtischblatt.Fehlermeldung import Fehlermeldung
from vkviewer.python.georef.utils import getTimestampAsPGStr
import transaction
import json

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
