'''
Created on Jan 27, 2014

@author: mendt
'''
import logging
from pyramid.view import view_config
from vkviewer.python.utils.exceptions import WrongPasswordError, MissingQueryParameterError, InternalAuthentificationError,WrongUserRegistrationData, WrongLoginDataError

log = logging.getLogger( __name__ )

@view_config(context=WrongPasswordError, renderer='error.mako')
def failed_wrong_password(exc, request):
    log.error( "Wrong password error: %s" % exc.msg)
    request.response.status = 400
    _ = request.translate
    return {'error_msg': _('error_msg_wrong_pw')}

@view_config(context=WrongLoginDataError, renderer='error.mako')
def failed_wrong_user_login_data(exc, request):
    log.error( "Wrong password error: %s" % exc.msg)
    request.response.status = 400
    _ = request.translate
    return {'error_msg': _('error_msg_wrong_user_login_data')}

@view_config(context=WrongUserRegistrationData, renderer='error.mako')
def failed_wrong_user_registration_data(exc, request):
    log.error( "Wrong password error: %s" % exc.msg)
    request.response.status = 400
    _ = request.translate
    return {'error_msg': _('error_msg_wrong_user_registration_data')}

@view_config(context=MissingQueryParameterError, renderer='error.mako')
def failed_missing_query_parameters(exc, request):
    log.error( "Wrong password error: %s" % exc.msg)
    request.response.status = 400
    _ = request.translate
    return {'error_msg': _('error_msg_missing_query_param')}

@view_config(context=InternalAuthentificationError, renderer='error.mako')
def failed_internal_auth(exc, request):
    log.error( "Wrong password error: %s" % exc.msg)
    request.response.status = 500
    _ = request.translate
    return {'error_msg': _('error_msg_interal_auth')}

@view_config(route_name='error_page',http_cache=0)
def getLoginScreen(request):
    raise WrongPasswordError('')
