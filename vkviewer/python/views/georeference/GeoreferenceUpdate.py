from pyramid.view import view_config
from pyramid.httpexceptions import HTTPBadRequest, HTTPInternalServerError
from sqlalchemy.exc import InvalidRequestError

# further tools
import logging
import json

# own import stuff
from vkviewer import log
from vkviewer.python.utils.parser import convertUnicodeDictToUtf
from vkviewer.python.utils.validation import validateId
from vkviewer.python.tools import checkIsUser
from vkviewer.python.georef.utils import getTimestampAsPGStr
from vkviewer.python.models.messtischblatt.Messtischblatt import Messtischblatt
from vkviewer.python.models.messtischblatt.Georeferenzierungsprozess import Georeferenzierungsprozess
from vkviewer.python.georef.georeferenceexceptions import GeoreferenceParameterError

@view_config(route_name='georeference', renderer='string', permission='view', match_param='action=update')
def georeferenceUpdate(request):
    log.info('Receive request for processing georeference update result')
    
    try:
        userid = checkIsUser(request)
        
        request_data = None
        if request.method == 'POST':
            request_data = request.json_body
            
        if request_data:
            validateId(request_data['id'])
            log.debug('Request data is valide: %s'%request_data)
            
        log.debug('Check if there exists a registered georeference process for this messtischblatt ...')
        messtischblatt = Messtischblatt.by_id(request_data['id'], request.db)
        isAlreadyGeorefProcess = Georeferenzierungsprozess.by_messtischblattid(messtischblatt.id, request.db)
        if isAlreadyGeorefProcess is None:
            response = {'text':'There is no registered georeference process for this messtischblatt. Please move back to the confirm process.'}
            return json.dumps(response, ensure_ascii=False, encoding='utf-8')        
        
        # actual only support this option if target srs is EPSG:4314
        log.debug('Saving georeference process in the database ...')
        if request_data['georeference']:
            encoded_clip_params = convertUnicodeDictToUtf(request_data['georeference'])
            georefProcess = registerNewGeoreferenceProcessInDb(messtischblatt.id, userid, str(encoded_clip_params), 'update', request.db)
            
            log.debug('Set update status for messtischblatt ...')
            messtischblatt.setIsUpdated(True)
            
            log.debug('Create response ...')
            # right now the premise is that for the updated gcps are equal to the removed gcps. For every
            # updated gcps the users get new points
            achievement_points = len(request_data['georeference']['remove']['gcps'])*5  
            #gcps = getJsonDictPasspointsForMapObject(messtischblatt.id, request.db)
            response = {'text':'Georeference result updated. It will soon be ready for use.','georeferenceid':georefProcess.id, 'points':achievement_points, 
                        'gcps':request_data['georeference']['new'] ,'type':'update'}
            return json.dumps(response, ensure_ascii=False, encoding='utf-8') 
        else:
            log.error('The remove and new parameters are not valide - %s')
            raise GeoreferenceParameterError('The remove and new parameters are not valide.')
      
        
    except GeoreferenceParameterError as e:
        message = 'Wrong or missing service parameter - %s'%e.value
        log.error(message)
        return HTTPBadRequest(message) 
    except Exception as e:
        message = 'Problems while computing validation result - %s'%e
        log.error(message)
        return HTTPInternalServerError(message)
    
def registerNewGeoreferenceProcessInDb(objectid, userid, gcps, type, dbsession):
    log.debug('Create georeference process record ...')
    timestamp = getTimestampAsPGStr()
    georefProcess = Georeferenzierungsprozess(messtischblattid = objectid, nutzerid = userid, 
        clipparameter = gcps, timestamp = timestamp, isvalide = True, type = type, refzoomify = True, publish = False, processed = False)
    dbsession.add(georefProcess)
    dbsession.flush()  
    return georefProcess