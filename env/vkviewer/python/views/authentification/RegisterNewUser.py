from pyramid.view import view_config
from pyramid.httpexceptions import HTTPFound
from pyramid.security import remember

from vkviewer.python.models.messtischblatt.Users import Users
from vkviewer.python.utils.exceptions import InternalAuthentificationError, WrongUserRegistrationData
import transaction
import json

@view_config(route_name='auth', renderer='string', match_param='action=new', request_method='POST')
def register_new_user(request):

    login = ''
    password = ''
    _ = request.translate
    dbsession = request.db
    try:
        login = request.params['username']
        password = request.params['password']
        email = request.params['email']
        vorname = request.params['vorname'] 
        nachname = request.params['nachname']
        
        if not login or not password or not email or not vorname or not nachname:
            raise WrongUserRegistrationData('Missing user registration information.')
        
        if 'form.submitted' in request.params:
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
        
    except WrongUserRegistrationData:
        raise 
    except:
        raise InternalAuthentificationError('Internal server error while trying to register user. Please try again or contact the page administrator.')
        
