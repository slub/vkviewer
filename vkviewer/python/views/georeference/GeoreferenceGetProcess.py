from pyramid.view import view_config
from pyramid.httpexceptions import HTTPBadRequest, HTTPInternalServerError

# further tools
import logging, json, ast

# own import stuff
from vkviewer import log
from vkviewer.settings import ADMIN_ADDR
from vkviewer.python.models.messtischblatt.Map import Map
from vkviewer.python.models.messtischblatt.Georeferenzierungsprozess import Georeferenzierungsprozess
from vkviewer.python.models.messtischblatt.Metadata import Metadata
from vkviewer.python.georef.georeferenceexceptions import GeoreferenceParameterError
from vkviewer.python.utils.parser import parseMapObjForId

ERROR_MSG = "Please check your request parameters or contact the administrator (%s)."%ADMIN_ADDR
 
@view_config(route_name='georeference', renderer='json', permission='view', match_param='action=getprocess')
def georeferenceGetProcess(request):
    log.info('Receive request GetGeoreferenceProcess')
    
    try:
        request_data = None
        if request.method == 'POST':
            request_data = request.json_body
        
        mapObj = parseMapObjForId(request_data, 'objectid', request.db)
        log.debug('Objectid is valide: %s'%request_data)
        
        georeferenceid = None
        if 'georeferenceid' in request_data:
            georeferenceid = int(request_data['georeferenceid'])
            
        log.debug('Parsed parameters - mapid: %s, georeferenceid: %s'%(mapObj.id, georeferenceid))
        if georeferenceid:
            response = createResponseForSpecificGeoreferenceProcess(mapObj, request, georeferenceid)
        else:
            response = createGeneralResponse(mapObj, request)
        return json.dumps(response, ensure_ascii=False, encoding='utf-8')               
    except GeoreferenceParameterError as e:
        log.error(e)
        raise HTTPBadRequest(ERROR_MSG) 
    except Exception as e:
        log.error(e)
        raise HTTPInternalServerError(ERROR_MSG)

def createGeneralResponse(mapObj, request):
    log.debug('Create general response ...')
    
    isAlreadyGeorefProcess = Georeferenzierungsprozess.isGeoreferenced(mapObj.id, request.db)
    if isAlreadyGeorefProcess:
        return createResponseForSpecificGeoreferenceProcess(mapObj, request)
    else: 
        mtb_extent = Map.getExtent(mapObj.id, request.db)
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
        metadata = Metadata.by_id(mapObj.id, request.db)
        return {
                'type':'new',
                'objectid': mapObj.id,
                'georeferenceid':"", 
                'timestamp':"", 
                'gcps':gcps, 
                'extent': mtb_extent,
                'zoomify': metadata.imagezoomify,
                'metadata': {
                    'dateiname': mapObj.apsdateiname,
                    'titel_long': metadata.title,
                    'titel_short': metadata.titleshort
                }            
        }
    
def createResponseForSpecificGeoreferenceProcess(mapObj, request, georeferenceid = None):
    log.debug('Create response for specific georeference process ...')
    mtb_extent = Map.getExtent(mapObj.id, request.db)
    if georeferenceid is None:
        georeferenceprocess = Georeferenzierungsprozess.getActualGeoreferenceProcessForMapId(mapObj.id, request.db)
    else:
        georeferenceprocess = Georeferenzierungsprozess.by_id(georeferenceid, request.db)
    pure_clipparameters = ast.literal_eval(str(georeferenceprocess.clipparameter))
    
    # get the actual valide gcps
    gcps = None
    if georeferenceprocess.type == 'new':
        # in case of a new registered clip_parameter
        gcps = pure_clipparameters
    else:
        # in case of an update process
        gcps = pure_clipparameters['new']
          

    # get zoomify and metadata information
    log.debug('Create response ...')  
    metadata = Metadata.by_id(mapObj.id, request.db)
    response = {
            'type':'update',
            'objectid': mapObj.id,
            'georeferenceid':georeferenceprocess.id, 
            'timestamp':str(georeferenceprocess.timestamp), 
            'gcps':gcps, 
            'extent': mtb_extent,
            'zoomify': metadata.imagezoomify,
            'metadata': {
                'dateiname': mapObj.apsdateiname,
                'titel_long': metadata.title,
                'titel_short': metadata.titleshort
            }
    }    
                
    # check if there is an other user is working on this map right now
    areTherePendingUpdateProcesses = Georeferenzierungsprozess.arePendingProcessForMapId(mapObj.id, request.db)
    if areTherePendingUpdateProcesses:
        response['warn'] = 'There are other users who are working on this map right now. For preventing information losses please wait a minute and try again later.'   
    return response