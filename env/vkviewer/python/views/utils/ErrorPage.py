'''
Created on Jan 27, 2014

@author: mendt
'''
import logging
from pyramid.view import view_config
from pyramid.response import Response

#log = logging.getLogger(__name__)

class WrongPasswordError(Exception):
    """ Exception raised if there is the password for user is wrong
        
        Attributes:
            msg  -- explanation of the error
    """
    
    def __init__(self, msg):
        print "Check"
        self.msg = msg
    
@view_config(context=WrongPasswordError)
def failed_wrongpassword(exc, request):
    response =  Response('Failed validation: %s' % exc.msg)
    response.status_int = 500
    return response
