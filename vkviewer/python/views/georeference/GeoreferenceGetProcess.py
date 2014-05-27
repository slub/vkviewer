from pyramid.view import view_config
from pyramid.httpexceptions import HTTPBadRequest, HTTPInternalServerError

# further tools
import logging, json, ast

# own import stuff
from vkviewer import log
from vkviewer.python.utils.validation import validateId
from vkviewer.python.utils.parser import getJsonDictPasspointsForMapObject
from vkviewer.python.tools import checkIsUser
from vkviewer.python.models.messtischblatt.Messtischblatt import Messtischblatt
from vkviewer.python.models.messtischblatt.Georeferenzierungsprozess import Georeferenzierungsprozess
from vkviewer.python.models.messtischblatt.MetadatenCore import MetadatenCore
from vkviewer.python.georef.georeferenceexceptions import GeoreferenceParameterError

@view_config(route_name='georeference', renderer='string', permission='view', match_param='action=getprocess')
def georeferenceConfirm(request):
    log.info('Receive request for processing georeference validation result')
    
    try:
        request_data = None
        if request.method == 'POST':
            request_data = request.json_body
        
        objectid = None
        if 'objectid' in request_data:
            validateId(request_data['objectid'])
            objectid = int(request_data['objectid'])
            log.debug('Objectid is valide: %s'%request_data)
        
        georeferenceid = None
        if 'georeferenceid' in request_data:
            georeferenceid = int(request_data['georeferenceid'])
            
        if georeferenceid:
            response = createResponseForSpecificGeoreferenceProcess(objectid, georeferenceid, request)
        else:
            response = createGeneralResponse(objectid, request)
        return json.dumps(response, ensure_ascii=False, encoding='utf-8')               
    except GeoreferenceParameterError as e:
        message = 'Wrong or missing service parameter - %s'%e.value
        log.error(message)
        return HTTPBadRequest(message) 
    except Exception as e:
        message = 'Problems while creating response for getprocess request - %s'%e
        log.error(message)
        return HTTPInternalServerError(message)

def createGeneralResponse(objectid, request):
    log.debug('Create general response ...')
    lastGeoreferenceId = ''
    lastTimestamp = ''
    messtischblatt = Messtischblatt.by_id(objectid, request.db)
    mtb_extent = Messtischblatt.getExtent(objectid, request.db)
    isAlreadyGeorefProcess = Georeferenzierungsprozess.by_messtischblattid(messtischblatt.id, request.db, True)
    if isAlreadyGeorefProcess:
        lastGeoreferenceId = isAlreadyGeorefProcess.id
        lastTimestamp = isAlreadyGeorefProcess.timestamp
        gcps = getJsonDictPasspointsForMapObject(messtischblatt.id, request.db)
    else: 
        gcps = {
            'source':'pixel',
            'target':'EPSG:4314',
            'gcps': [
                {"source":[], "target":[mtb_extent[0],mtb_extent[1]]},
                {"source":[], "target":[mtb_extent[0],mtb_extent[3]]},
                {"source":[], "target":[mtb_extent[2],mtb_extent[1]]},
                {"source":[], "target":[mtb_extent[2],mtb_extent[3]]}
            ]
        }
            
    # get zoomify and metadata information
    log.debug('Create response ...')  
    metadata = MetadatenCore.by_id(messtischblatt.id, request.db)
    return {
            'objectid': messtischblatt.id,
            'georeferenceid':lastGeoreferenceId, 
            'timestamp':str(lastTimestamp), 
            'gcps':gcps, 
            'extent': mtb_extent,
            'zoomify': {
                'properties': messtischblatt.zoomify_properties,
                'width': messtischblatt.zoomify_width,
                'height': messtischblatt.zoomify_height
            },
            'metadata': {
                'dateiname': messtischblatt.dateiname,
                'titel_long': metadata.titel,
                'titel_short': metadata.titel_short
            }            
    }
    
def createResponseForSpecificGeoreferenceProcess(objectid, georeferenceid, request):
    log.debug('Create response for specific georeference process ...')
    messtischblatt = Messtischblatt.by_id(objectid, request.db)
    mtb_extent = Messtischblatt.getExtent(objectid, request.db)
    georeferenceprocess = Georeferenzierungsprozess.by_id(georeferenceid, request.db)
    pure_clipparameters = ast.literal_eval(str(georeferenceprocess.clipparameter))
    gcps = None
    if 'new' in pure_clipparameters:
        gcps = pure_clipparameters['new']
    else:
        gcps = pure_clipparameters
          
    # get zoomify and metadata information
    log.debug('Create response ...')  
    metadata = MetadatenCore.by_id(messtischblatt.id, request.db)
    return {
            'objectid': messtischblatt.id,
            'georeferenceid':georeferenceid, 
            'timestamp':str(georeferenceprocess.timestamp), 
            'gcps':gcps, 
            'extent': mtb_extent,
            'zoomify': {
                'properties': messtischblatt.zoomify_properties,
                'width': messtischblatt.zoomify_width,
                'height': messtischblatt.zoomify_height
            },
            'metadata': {
                'dateiname': messtischblatt.dateiname,
                'titel_long': metadata.titel,
                'titel_short': metadata.titel_short
            }            
    }