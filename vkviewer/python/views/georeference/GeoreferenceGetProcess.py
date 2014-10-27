from pyramid.view import view_config
from pyramid.httpexceptions import HTTPBadRequest, HTTPInternalServerError

# further tools
import traceback

# own import stuff
from vkviewer import log
from vkviewer.settings import ADMIN_ADDR
from vkviewer.python.models.messtischblatt.Map import Map
from vkviewer.python.models.messtischblatt.Georeferenzierungsprozess import Georeferenzierungsprozess
from vkviewer.python.models.messtischblatt.Metadata import Metadata
from vkviewer.python.utils.exceptions import ProcessIsInvalideException
from vkviewer.python.georef.georeferenceexceptions import GeoreferenceParameterError

ERROR_MSG = "Please check your request parameters or contact the administrator (%s)."%ADMIN_ADDR
 
@view_config(route_name='georeference', renderer='json', permission='view', match_param='action=getprocess')
def georeferenceGetProcess(request):
    log.info('Receive request GetGeoreferenceProcess')
    
    try:
        request_data = None
        if request.method == 'POST':
            request_data = request.json_body     
               
        if 'georeferenceid' in request_data:
            georeferenceid = int(request_data['georeferenceid'])
            log.debug('Parsed parameters - georeferenceid: %s'%georeferenceid)
            mapObj = Map.by_id(int(Georeferenzierungsprozess.by_id(georeferenceid, request.db).mapid), request.db)
            response = createResponseForSpecificGeoreferenceProcess(mapObj, request, georeferenceid)
        elif 'objectid' in request_data:
            mapObjId = request_data['objectid']
            log.debug('Parsed parameters - mapid: %s'%mapObjId)
            mapObj = Map.by_id(int(mapObjId), request.db)
            response = createGeneralResponse(mapObj, request)
        else:
            log.error('Could not find a georeferenceid or and objectid in the post request parameters ...')
            raise GeoreferenceParameterError
        return response    
    except GeoreferenceParameterError as e:
        log.error(e)
        log.error(traceback.format_exc())
        raise HTTPBadRequest(ERROR_MSG) 
    except ProcessIsInvalideException as e:
        log.error(e)
        log.error(traceback.format_exc())
        raise HTTPBadRequest('This georeference process is blocked for further work!')
    except Exception as e:
        log.error(e)
        log.error(traceback.format_exc())
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
    pure_clipparameters = georeferenceprocess.georefparams
    
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
    # @TODO use babel lingua fpr translation
    areTherePendingUpdateProcesses = Georeferenzierungsprozess.arePendingProcessForMapId(mapObj.id, request.db)
    if areTherePendingUpdateProcesses:
        if request.locale_name == 'de':
            warnMsg = 'Aktuell wird das Kartenblatt von anderen Nutzern bearbeitet. Um Informationsverluste zu vermeiden versuchen Sie es bitte noch einmal in ein 15 Minuten.'
        else:
            warnMsg = 'Right now another users is working on the georeferencing of this map sheet. For preventing information losses please try again in 15 minutes.'
        response['warn'] = warnMsg         
    return response