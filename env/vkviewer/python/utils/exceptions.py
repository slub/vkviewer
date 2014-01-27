'''
Created on Jan 27, 2014

@author: mendt
'''

class InternalAuthentificationError(Exception):
    """ Generic error which is raised instead an InternalServerError 
        in cases of failures in the authentification process
        
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