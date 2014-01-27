import transaction
from pyramid.view import view_config
from pyramid.httpexceptions import HTTPFound

from vkviewer.python.models.messtischblatt.Users import Users
from vkviewer.python.models.messtischblatt.Fehlermeldung import Fehlermeldung
from vkviewer.python.georef.utils import getTimestampAsPGStr
from vkviewer.python.utils.exceptions import MissingQueryParameterError, InternalAuthentificationError
from vkviewer.python.utils.mail import sendMail
from vkviewer.python.tools import generateRandomString

@view_config(route_name='auth', renderer='reset_pw.mako', match_param='action=page_reset', http_cache=0)
def reset_pw_page(request):
    return {}

@view_config(route_name='auth', renderer='reset_pw_success.mako', match_param='action=page_reset_success', http_cache=0)
def reset_pw_page_success(request):
    return {}

""" this view starts the process for a password reset """
@view_config(route_name='auth', renderer='string', match_param='action=reset', request_method='POST')
def reset_pw(request):
    dbsession = request.db
    try:
        login = request.params['username']
        email = request.params['email']
        
        if not login or not email:
            raise MissingQueryParameterError('Missing information for reset password process.')
    
        if 'form.submitted' in request.params:
            user = Users.by_username(login, dbsession)
            if user and user.email == email:
                # register ticket in database
                newTicket = Fehlermeldung(fehlerbeschreibung="Passwort reset", timestamp=getTimestampAsPGStr(), referenz="users", nutzerid=user.login, objektid=user.id);
                dbsession.add(newTicket);
                
                # reset password 
                newPassword = generateRandomString(10) 
                user._set_password(newPassword)
                
                # send new password
                reset_msg = password_reset_msg % newPassword
                response = sendMail(user.email, 'Your password has been changed!', reset_msg)
                if not response:
                    raise InternalAuthentificationError('Internal server error while trying to send you your new password. Please try again or contact the page administrator.')
                
                # create response
                target_url = request.route_url('auth', action='page_reset_success')
                transaction.commit()
                return HTTPFound(location = target_url)   
            else:
                raise InternalAuthentificationError('Internal server error while trying to change password. Please try again or contact the page administrator.')
            
        else:
            raise MissingQueryParameterError('Missing form validation.')

    except MissingQueryParameterError, InternalAuthentificationError:
        raise
    except:
        raise
        
password_reset_msg = 'Your password has be reset. Your new password is: \n %s \nPlease change your new password in your user menu.\n\nKind regards, \n\nyour SLUB Team.'