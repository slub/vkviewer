'''
Created on May 30, 2013

@author: mendt
'''

class GeoreferenceProcessBlockedError(Exception):
    '''
    Error which should be raised if a georeference process for the requested messtischblatt was already
    done or is still running.
    '''

    def __init__(self, value):
       self.value = value
       
    def __str__(self):
        return repr(self.value)
    
class GeorefServiceTypeError(Exception):
    '''
    Service type is not supported
    '''

    def __init__(self, value):
       self.value = value
       
    def __str__(self):
        return repr(self.value)

class GeoreferenceFactoryError(Exception):
    '''
    Generic Error for the GeoreferenceFactory class
    '''

    def __init__(self, value):
       self.value = value
       
    def __str__(self):
        return repr(self.value)
    
class GeoreferenceProcessRunningError(Exception):
    '''
    Error which should be raised if there are problems why a georeference process for a messtischblatt was
    running.
    '''

    def __init__(self, value):
       self.value = value
       
    def __str__(self):
        return repr(self.value)    
    
class GeoreferenceParameterError(Exception):
    '''
    Error which should be raised if there are problems why a georeference process for a messtischblatt was
    running.
    '''

    def __init__(self, value):
       self.value = value
       
    def __str__(self):
        return repr(self.value)
    
class GdalInfoParsingError(Exception):
    '''
    Error which should be raised if a there are problems while parsing a raster file via gdalinfo/python
    binding.
    '''

    def __init__(self, value):
       self.value = value
       
    def __str__(self):
        return repr(self.value)     