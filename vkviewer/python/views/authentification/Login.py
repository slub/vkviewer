from pyramid.view import view_config
from pyramid.httpexceptions import HTTPFound
from pyramid.security import remember

from vkviewer.python.models.messtischblatt.Users import Users
from vkviewer.python.utils.exceptions import InternalAuthentificationError, WrongLoginDataError, WrongPasswordError
import json

""" this view checks if the login is registered in the database and gets the vorname/nachname and 
    sends it back to client """
@view_config(route_name='auth', renderer='string', match_param='action=in', request_method='POST')
def login(request):
    
    login = ''
    password = ''
    _ = request.translate
    dbsession = request.db
    
    try:
        login = request.params['username']
        password = request.params['password']
        user = Users.by_username(login, dbsession)
        if not password or not user:
            raise WrongLoginDataError('The login data for user %s seems not to be valide, please try again.')   
        
        if 'form.submitted' in request.params:
            if user and user.validate_password(password):
                # define response header
                #userName = user.vorname+' '+user.nachname
                headers = remember(request, login)
                # get target url and route to it
                target_url = request.route_url('home_login',_query={'georef':'on'})
                return HTTPFound(location = target_url, headers = headers)   
            else:
                raise WrongPasswordError('Password for the user %s is not valid, please try again.')  
    except WrongPasswordError, WrongLoginDataError:
        raise 
    except:
        raise InternalAuthentificationError('Internal server error while trying to login user. Please try again or contact the page administrator.')
