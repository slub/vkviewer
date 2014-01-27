'''
Created on Jan 27, 2014

@author: mendt
'''
import transaction
from pyramid.view import view_config
from pyramid.httpexceptions import HTTPFound, HTTPInternalServerError, HTTPBadRequest
from vkviewer.python.tools import checkIsUser
from vkviewer.python.utils.exceptions import MissingQueryParameterError
from vkviewer.python.models.messtischblatt.Users import Users
from vkviewer.python.views.utils.ErrorPage import WrongPasswordError

@view_config(route_name='change_pw', renderer='change_pw.mako', match_param='action=page', permission='edit',http_cache=0)
def change_pw_page(request):
    return {}

""" update the passwords  """
@view_config(route_name='change_pw', match_param='action=update', permission='edit', request_method='POST')
def change_pw(request):
    login = ''
    old_password = ''
    new_password = ''
    _ = request.translate
    dbsession = request.db
    
    try:
        # parse query parameter 
        login = checkIsUser(request)
        old_password = request.params['old_password']
        new_password = request.params['new_password']    
        if not login or not old_password or not new_password:
            raise MissingQueryParameterError('Some post parameters are missing.')
        
        # get user and check is the correct password
        if 'form.submitted' in request.params:
            # get actual user
            login = checkIsUser(request)
            user = Users.by_username(login, dbsession)
            if user and user.validate_password(old_password):
                # change password
                user._set_password(new_password)
                transaction.commit()
                
                # define response header
                # get target url and route to it
                target_url = request.route_url('home_login')
                return HTTPFound(location = target_url)   
            else:
                raise MissingQueryParameterError('Password for the user is not valid')           
    except MissingQueryParameterError, WrongPasswordError:
        raise WrongPasswordError('')
    except:
        raise WrongPasswordError('')
    
