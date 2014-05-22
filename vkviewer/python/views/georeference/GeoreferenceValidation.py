from pyramid.view import view_config
from pyramid.httpexceptions import HTTPBadRequest, HTTPInternalServerError

# further tools
import os, gdal, json

# own import stuff
from vkviewer import log
from vkviewer.python.tools import checkIsUser
from vkviewer.settings import GEOREFERENCE_TMP_DIR, GEOREFERENCE_MAPFILE_FOLDER, GEOREFERENCE_MAPFILE_TEMPLATE, GEOREFERENCE_MAPFILE_DEFAULT_PARAMS
from vkviewer.python.views.georeference.AbstractGeoreference import AbstractGeoreference
from vkviewer.python.georef.georeferenceprocess import GeoreferenceProcessManager
from vkviewer.python.georef.utils import getUniqueId
from vkviewer.python.georef.mapfile import createMapfile
from vkviewer.python.georef.georeferenceexceptions import GeoreferenceParameterError
from vkviewer.python.models.messtischblatt.Messtischblatt import Messtischblatt
from vkviewer.python.georef.georeferencer import georeference

def validateId(id):
    errorMsg = "Object identifier is not valide."
    try:
        # check if mtbid is valide
        if (id != None):
            if isinstance(int(id), int) and len(str(id)) == 8:
                return True
            else:
                raise GeoreferenceParameterError(errorMsg)
    except:
        raise GeoreferenceParameterError(errorMsg)
    
def parseGcps(georeference):
    gcps = []
    for i in range(0,len(georeference)):
        gcps.append(gdal.GCP(georeference[i]['target'][0], georeference[i]['target'][1], 0, georeference[i]['source'][0],georeference[i]['source'][1]))
    return gcps
        
@view_config(route_name='georeference', renderer='string', permission='view', match_param='action=validation')
def georeferenceValidation(request):
    log.info('Receive request for processing georeference validation result')
    
    try:
        userid = checkIsUser(request)
        request_data = None
        if request.method == 'POST':
            request_data = request.json_body
            
        if request_data:
            validateId(request_data['id'])
            log.debug('Request data is valide: %s'%request_data)
            
        log.debug('Start creating validation result ...')
        messtischblatt = Messtischblatt.by_id(request_data['id'], request.db)
        # actual only support this option if target srs is EPSG:4314
        epsg_code = int(str(request_data['georeference']['target']).split(':')[1])
        if request_data['georeference']['source'] == 'pixel' and epsg_code == 4314:
            log.debug('Parse gcps ...')
            gcps = parseGcps(request_data['georeference']['gcps'])
            
            log.debug('Process georeference parameter ...')
            destPath = georeference(messtischblatt.original_path, os.path.join(GEOREFERENCE_MAPFILE_FOLDER,messtischblatt.dateiname+"::"+str(getUniqueId())+".vrt"), 
                         GEOREFERENCE_TMP_DIR, gcps, epsg_code, epsg_code, 'polynom', log)
        
            log.debug('Create temporary mapfile ...')
            wms_url = createMapfile(messtischblatt.dateiname, destPath, GEOREFERENCE_MAPFILE_TEMPLATE, GEOREFERENCE_MAPFILE_FOLDER, GEOREFERENCE_MAPFILE_DEFAULT_PARAMS)
            
            log.debug('Create response ...')  
            response = {'wms_url':wms_url,'layer_id':messtischblatt.dateiname,'extent':Messtischblatt.getExtent(messtischblatt.id, request.db)}
            return json.dumps(response, ensure_ascii=False, encoding='utf-8') 
        else:
            raise GeoreferenceParameterError('Wrong or missing service parameter')
    except GeoreferenceParameterError as e:
        message = 'Wrong or missing service parameter - %s'%e.value
        log.error(message)
        return HTTPBadRequest(message) 
    except Exception as e:
        message = 'Problems while computing validation result - %s'%e.value
        log.error(message)
        return HTTPInternalServerError(message)
        
# """ View for handling the georeference process in case of a validation action.
#     A validation actions means that the view computes dynamically a georeference 
#     result for the given request parameter and send them back to the client via 
#     indirect link on a wms """
# class GeoreferenceValidation(AbstractGeoreference):
#     
#     def __init__(self, request):
#        AbstractGeoreference.__init__(self, request)
#     
#     """ method: __call__        
#         @param - mtbid {Integer} - id of a messtischblatt
#         @param - userid {String} - id of a user 
#         @param - points {Double:Double;...} - 4 pixel points coordinates which are reference to the original 
#                                               messtischblatt file """
#     @view_config(route_name='georeference', renderer='string', permission='view', match_param='action=validation')
#     def __call__(self):
#         log.info("Start processing georeference validation result.")
#         
#         try:
#             request_data = None
#             if self.request
#             # parse query parameter and check if they are valide
#             self.__parseQueryParameter__()
#             self.__validateQueryParameter__()
#             self.__parseUserId__()
#       
#             # initialize georef process
#             dbsession = self.request.db
#             
#             messtischblatt = Messtischblatt.by_id(self.mtbid, dbsession)
#             # georeferenceProcess = createGeoreferenceProcess(self.mtbid, dbsession, tmp_dir, log)
#             
#             # create validation result and get destination path and georeference id
#             validationResultPath = os.path.join(dest_mapfilefolder,messtischblatt.dateiname+"::"+str(getUniqueId())+".vrt")
#             
#             # new stuff
#             georef_process_manager = GeoreferenceProcessManager(dbsession, tmp_dir, log)
#             georefProcess = georef_process_manager.registerGeoreferenceProcess(messtischblattid=self.mtbid, userid=self.userid, 
#                 clipParams=self.points, isvalide=False, typeValidation='waiting', refzoomify=True)
# 
#             destPath = georef_process_manager.__runFastGeoreferencing__(georefProcess, messtischblatt, tmp_dir, validationResultPath)
#             
#             #georefId, destPath = georeferenceProcess.fastGeoreference(self.userid,self.points,validationResultPath)
#             # create mapfile for georeference result
#             log.debug('Create temporary mapfile.')
#             wms_url = createMapfile(messtischblatt.dateiname, destPath, 
#                                     src_mapfilepath, dest_mapfilefolder, mapfileInitParameter)  
#             response = {'wms_url':wms_url,'layer_id':messtischblatt.dateiname,'georefid':georefProcess.id,'extent':Messtischblatt.getExtent(messtischblatt.id, dbsession)}
#             return json.dumps(response, ensure_ascii=False, encoding='utf-8') 
#         except GeoreferenceParameterError as e:
#             message = 'Wrong or missing service parameter - %s'%e.value
#             log.error(message)
#             return HTTPBadRequest(message) 
#         except Exception as e:
#             message = 'Problems while computing validation result - %s'%e.value
#             log.error(message)
#             return HTTPInternalServerError(message)
# 
#     """ method: __validateQueryParameter__
#         This method checks if the input query parameter are valide """
#     def __validateQueryParameter__(self):
#         isValideMtb = isValidePoints = False
#         
#         try:
#             # check if mtbid / points / userid is valide
#             isValideMtb = self.__validateMtbId__()
#             isValidePoints = self.__validatePoints__()
#             
#             # now check if valMtbId and valPoints are True
#             self.__queryParameterAreValide__(isValideMtb, isValidePoints)
#         except Exception as e:
#             log.error(e.value)
#             raise     
# 
#     def __queryParameterAreValide__(self, isValideMtb, isValidePoints):
#         if isValideMtb and isValidePoints:
#             log.debug("MtbId: %s, Points: %s - are valide"%(self.mtbid,self.points))
#             return True
#         else:
#             message = "The query parameter are not valide"
#             log.error(message)
#             raise GeoreferenceParameterError(message) 
