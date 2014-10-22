from pyramid.view import view_config
from pyramid.httpexceptions import HTTPBadRequest, HTTPInternalServerError

# further tools
import json, ast

# own import stuff
from vkviewer import log
from vkviewer.python.utils.parser import convertUnicodeDictToUtf
from vkviewer.python.tools import checkIsUser
from vkviewer.python.georef.utils import getTimestampAsPGStr
from vkviewer.python.models.messtischblatt.Georeferenzierungsprozess import Georeferenzierungsprozess
from vkviewer.python.georef.georeferenceexceptions import GeoreferenceParameterError
from vkviewer.python.utils.parser import parseMapObjForId
from vkviewer.settings import ADMIN_ADDR
        
ERROR_MSG = "Please check your request parameters or contact the administrator (%s)."%ADMIN_ADDR

@view_config(route_name='georeference', renderer='json', permission='view', match_param='action=update')
def georeferenceUpdate(request):
    log.info('Receive request for processing georeference update result')
    
    try:
        userid = checkIsUser(request)
        
        request_data = None
        if request.method == 'POST':
            request_data = request.json_body
            
        mapObj = parseMapObjForId(request_data, 'id', request.db)
        log.debug('Id is valide: %s'%request_data)
            
        log.debug('Check if there exists a registered georeference process for this messtischblatt ...')
        if Georeferenzierungsprozess.isGeoreferenced(mapObj.id, request.db) == False:
            response = {'text':'There is no registered georeference process for this messtischblatt. Please move back to the confirm process.'}
            return response
        
        # actual only support this option if target srs is EPSG:4314
        log.debug('Saving georeference process in the database ...')
        if request_data['georeference']:
            encoded_clip_params = convertUnicodeDictToUtf(request_data['georeference'])
            georefProcess = registerUpdateGeoreferenceProcessInDb(mapObj, userid, str(encoded_clip_params), request.db)
            
            log.debug('Create response ...')
            # right now the premise is that for the updated gcps are equal to the removed gcps. For every
            # updated gcps the users get new points
            achievement_points = len(request_data['georeference']['remove']['gcps'])*5  
            response = {'text':'Georeference result updated. It will soon be ready for use.','georeferenceid':georefProcess.id, 'points':achievement_points, 
                        'gcps':request_data['georeference']['new'] ,'type':'update'}
            return response
        else:
            log.error('The remove and new parameters are not valide - %s')
            raise GeoreferenceParameterError('The remove and new parameters are not valide.')
      
        
    except GeoreferenceParameterError as e:
        log.error(e)
        raise HTTPBadRequest(ERROR_MSG) 
    except Exception as e:
        log.error(e)
        raise HTTPInternalServerError(ERROR_MSG)
    
def registerUpdateGeoreferenceProcessInDb(mapObj, userid, gcps, dbsession):
    log.debug('Create georeference process record ...')
    activeGeorefProcess = Georeferenzierungsprozess.getActualGeoreferenceProcessForMapId(mapObj.id, dbsession)
    georefProcess = Georeferenzierungsprozess(messtischblattid = mapObj.apsobjectid, nutzerid = userid, 
                georefparams = ast.literal_eval(gcps), clipparameter = gcps, timestamp = getTimestampAsPGStr(), isactive = False, type = 'update', 
                refzoomify = True, adminvalidation = '', processed = False, mapid = mapObj.id, overwrites = activeGeorefProcess.id)
    dbsession.add(georefProcess)
    dbsession.flush()  
    return georefProcess