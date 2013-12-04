from pyramid.httpexceptions import HTTPBadRequest

# own import stuff
from vkviewer import log
from vkviewer.python.tools import checkIsUser
from vkviewer.python.georef.georeferenceprocess import parsePixelCoordinates
from vkviewer.python.georef.georeferenceexceptions import GeoreferenceParameterError

""" generic class for the georeference process """
class AbstractGeoreference(object):
    
    def __init__(self, request):
        self.request = request
    
    """ method: __parseQueryParameter__    
        This method parse the query parameter from the request and adds them as attributes to the
        class object. Further it validates the parameters. """
    def __parseQueryParameter__(self):
        # get parameter values
        for key in self.request.params:
            self.__setAttribute__(key)

    def __parseUserId__(self):
        self.userid = checkIsUser(self.request)
        if not self.userid:
            raise GeoreferenceParameterError('Missing userid!')
        else:
            log.debug("Userid - %s"%self.userid)
        
    def __validateMtbId__(self):
        errorMsg = "Messtischblatt id is not valide."
        try:
            # check if mtbid is valide
            if (self.mtbid != None):
                if isinstance(int(self.mtbid), int) and len(str(self.mtbid)) == 8:
                    return True
                else:
                    raise GeoreferenceParameterError(errorMsg)
        except:
            raise GeoreferenceParameterError(errorMsg)
        
    def __validatePoints__(self):       
        errorMsg = "Georeference points are not valide."         
        try:
            # check if mtbid is valide
            if (self.points != None):
                if parsePixelCoordinates(self.points) and len(parsePixelCoordinates(self.points)) == 4:
                    return True
                else:
                    raise GeoreferenceParameterError(errorMsg)    
        except:
            raise GeoreferenceParameterError(errorMsg)        
        
    def __validateGeorefId__(self):
        errorMsg = "Georeference process id are not valide."
        try: 
            if (self.georefid != None):
                if isinstance(int(self.georefid), int):
                    return True
                else: 
                    raise GeoreferenceParameterError(errorMsg)    
        except:
            raise GeoreferenceParameterError(errorMsg) 
    
    """ method: __setAttribute__    
        This method adds the request parameter as attributes to the object. """
    def __setAttribute__(self, name):
        # parse the value from the request
        value = self.request.params[name]
        
        # check if the value is None
        if value == None:
            message = "Missing input value for query parameter %s"%name
            log.error(message)
            raise HTTPBadRequest(message)
        
        # set attribute
        setattr(self, name, value)
        return True   