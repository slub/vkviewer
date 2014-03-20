from pyramid.view import view_config
from pyramid.httpexceptions import HTTPBadRequest, HTTPInternalServerError

# further tools
import logging
import json

# own import stuff
from vkviewer import log
from vkviewer.settings import tmp_dir
from vkviewer.python.views.georeference.AbstractGeoreference import AbstractGeoreference
from vkviewer.python.georef.georeferenceprocess import GeoreferenceProcessManager
from vkviewer.python.georef.georeferenceexceptions import GeoreferenceParameterError

""" View for handling the georeference process in case of a confirmation action.
    A confirmation actions means that the view confirm the results of a already 
    registered georeference process or register a georeference process without
    validation """
class GeoreferenceConfirm(AbstractGeoreference):
     
    def __init__(self, request):
       AbstractGeoreference.__init__(self, request)
     
    """ method: __call__        
        @param - mtbid {Integer} - id of a messtischblatt
        @param - userid {String} - id of a user 
        @param - points {Double:Double;...} - 4 pixel points coordinates which are reference to the original 
                                              messtischblatt file """
    @view_config(route_name='georeferencer', renderer='string', permission='edit', match_param='action=confirm')
    def __call__(self):
        log.info("Start processing georeference confirmation request.")
            
        try:
            # parse query parameter and check if they are valide
            self.__parseQueryParameter__()
            self.__parseUserId__()
         
            # initialize georef process
            dbsession = self.request.db
            
            log.debug('Initialize GeoreferenceProcessManager ...')
            georef_process_manager = GeoreferenceProcessManager(dbsession, tmp_dir, log)
             
            if hasattr(self, 'georefid'):
                log.debug('Confirm existing georeference process ...')
                self.__validateQueryParameterWithGeorefId__()
                return self.__confirmExistingGeorefProcess__(self.georefid, georef_process_manager)
            elif not hasattr(self, 'georefid'):
                log.debug('Confirm new georeference process ...')
                self.__validateQueryParameterWithoutGeorefId__()
                return self.__registerNewConfirmedGeorefProcess__(georef_process_manager)
            else: 
                # error handling
                log.error("Error while processing georeference confirmation request!")
                raise
        except GeoreferenceParameterError as e:
            log.error('Wrong or missing service parameter - %s'%e)
            return HTTPBadRequest('Wrong or missing service parameter') 
        except Exception as e:
            log.error('Problems while computing validation result - %s'%e)
            return HTTPInternalServerError('Problems while computing validation result')
 
    def __confirmExistingGeorefProcess__(self, georefid, georef_process_manager):
        georefid = georef_process_manager.confirmExistingGeoreferenceProcess(georefid=self.georefid,
            isvalide=True,typeValidation='user')
        response = {'georefid':georefid,'message':'Change validation status for georeference process!'}
        return json.dumps(response, ensure_ascii=False, encoding='utf-8')
    
    def __registerNewConfirmedGeorefProcess__(self, georef_process_manager):
        georefid = georef_process_manager.confirmNewGeoreferenceProcess(userid=self.userid,
            clipParams=self.points,isvalide=False,typeValidation='disabled')
        response = {'georefid':georefid,'message':'Georeference parameter saved!'}
        return json.dumps(response, ensure_ascii=False, encoding='utf-8')
    
    def __validateQueryParameterWithGeorefId__(self):
        try:
            isValideMtb = isValideGeorefId = False
        
            isValideMtb = self.__validateMtbId__()
            isValideGeorefId = self.__validateGeorefId__()
            
            return self.__queryParameterWithGeorefIdAreValide__(isValideMtb, isValideGeorefId)
        except Exception as e: 
            message = "Parameter for confirmation request for georef id are not valide - %s"%e.value
            log.error(message)
            raise GeoreferenceParameterError(message)
        
    def __validateQueryParameterWithoutGeorefId__(self):
        try:
            isValideMtb = isValidePoints = False
        
            isValideMtb = self.__validateMtbId__() 
            isValidePoints = self.__validatePoints__()
              
            return self.__queryParameterWithoutGeorefIdAreValide__(isValideMtb, isValidePoints)   
        except Exception as e: 
            message = "Parameter for confirmation request without georef id are not valide - %s"%e.value
            log.error(message)
            raise GeoreferenceParameterError(message)
        
    def __queryParameterWithGeorefIdAreValide__(self, isValideMtb, isValideGeorefId):   
        if isValideMtb and isValideGeorefId:
            log.debug("MtbId: %s, Georefid: %s - are valide"%(self.mtbid,self.georefid))
            return True
        else:
            message = "The query parameter are not valide"
            log.error(message)
            raise GeoreferenceParameterError(message)     
        
    def __queryParameterWithoutGeorefIdAreValide__(self, isValideMtb, isValidePoints):       
        if isValideMtb and isValidePoints:
            log.debug("MtbId: %s, Points: %s - are valide"%(self.mtbid,self.points))
            return True
        else:
            message = "The query parameter are not valide"
            log.error(message)
            raise GeoreferenceParameterError(message)           

