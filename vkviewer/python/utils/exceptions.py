'''
This module contains a collection of exception classes. Exceptions typically be derived from the `Exception`_ class. 
Errors are thrown when something during the processing of the user request went wrong.

:Date: Created on Jan 27, 2014
:Authors: mendt

.. _Exception: https://docs.python.org/2/library/exceptions.html#exceptions.Exception
'''

class InternalAuthentificationError(Exception):
    """ Generic error which is raised instead an InternalServerError 
        in cases of failures in the authentification process.
        
        Attributes:
            msg  -- explanation of the error
    """
    
    def __init__(self, msg):
        self.msg = msg
        
    def __str__(self):
        return repr(self.msg)  
        
class WrongLoginDataError(Exception):
    """ Error which is thrown in case of of wrong login information data.
        
        Attributes:
            msg  -- explanation of the error
    """
    
    def __init__(self, msg):
        self.msg = msg
        
    def __str__(self):
        return repr(self.msg)
    
class WrongUserRegistrationData(Exception):
    """ Error which is thrown in case of of wrong user registration information data.
        
        Attributes:
            msg  -- explanation of the error
    """
    
    def __init__(self, msg):
        self.msg = msg
        
    def __str__(self):
        return repr(self.msg)
        
class MissingQueryParameterError(Exception):
    """ Exception raised if there is a missing query parameter
        
        Attributes:
            msg  -- explanation of the error
    """
    
    def __init__(self, msg):
        self.msg = msg
        
    def __str__(self):
        return repr(self.msg)
    
class WrongPasswordError(Exception):
    """ Exception raised if the password is not correct
        
        Attributes:
            msg  -- explanation of the error
    """
    
    def __init__(self, msg):
        self.msg = msg
        
    def __str__(self):
        return repr(self.msg)
    
class GeoreferenceProcessNotFoundError(Exception):
    """ Exception raised if there is not georeference process waiting for process 
        
        Attributes:
            msg  -- explanation of the error
    """
    
    def __init__(self, msg):
        self.msg = msg
        
    def __str__(self):
        return repr(self.msg)
        
class GeoreferenceProcessingError(Exception):
    """ Exception raised if there are problems while trying to compute a georeference process result 
        
        Attributes:
            msg  -- explanation of the error
    """
    
    def __init__(self, msg):
        self.msg = msg
        
    def __str__(self):
        return repr(self.msg)        
    
class WrongParameterException(Exception):
    """ Raised if there are wrong parameters
        
        Attributes:
            msg  -- explanation of the error
    """
    
    def __init__(self, msg):
        self.msg = msg
        
    def __str__(self):
        return repr(self.msg)  
    
class MissingParameterException(Exception):
    """ Raised if there are missing parameters
        
        Attributes:
            msg  -- explanation of the error
    """
    
    def __init__(self, msg):
        self.msg = msg
        
    def __str__(self):
        return repr(self.msg)
    
class ParsingException(Exception):
    """ Raised if the are problems with the parsing
        
        Attributes:
            msg  -- explanation of the error
    """
    
    def __init__(self, msg):
        self.msg = msg
        
    def __str__(self):
        return repr(self.msg)    
    
class NotFoundException(Exception):
   
    def __init__(self, msg):
        self.msg = msg
        
    def __str__(self):
        return repr(self.msg)
    
class ProcessIsInvalideException(Exception):
   
    def __init__(self, msg):
        self.msg = msg
        
    def __str__(self):
        return repr(self.msg)
    
# Error Messages
GENERAL_ERROR_MESSAGE = 'Something went wrong while trying to process your requests. Please try again or contact the administrators of the Virtual Map Forum 2.0.'