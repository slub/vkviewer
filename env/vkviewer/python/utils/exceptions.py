'''
Created on Jan 27, 2014

@author: mendt
'''
class MissingQueryParameterError(Exception):
    """ Exception raised if there is a missing query parameter
        
        Attributes:
            msg  -- explanation of the error
    """
    
    def __init__(self, msg):
        self.msg = msg
        
    def __str__(self):
        return repr(self.msg)
    
