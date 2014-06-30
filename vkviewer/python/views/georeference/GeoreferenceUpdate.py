from pyramid.view import view_config
from pyramid.httpexceptions import HTTPBadRequest, HTTPInternalServerError
from sqlalchemy.exc import InvalidRequestError

# further tools
import logging
import json

# own import stuff
from vkviewer import log
from vkviewer.python.utils.validation import validateId
from vkviewer.python.utils.parser import getJsonDictPasspointsForMapObject
from vkviewer.python.tools import checkIsUser
from vkviewer.python.georef.utils import getTimestampAsPGStr
from vkviewer.python.models.messtischblatt.Messtischblatt import Messtischblatt
from vkviewer.python.models.messtischblatt.Georeferenzierungsprozess import Georeferenzierungsprozess
from vkviewer.python.models.messtischblatt.Users import Users
from vkviewer.python.models.messtischblatt.Passpoint import Passpoint
from vkviewer.python.georef.georeferenceexceptions import GeoreferenceParameterError

@view_config(route_name='georeference', renderer='string', permission='view', match_param='action=update')
def georeferenceUpdate(request):
    log.info('Receive request for processing georeference update result')
    
    try:
        userid = checkIsUser(request)
        user = Users.by_username(userid, request.db)
        
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
            georefProcess = registerNewGeoreferenceProcessInDb(messtischblatt.id, userid, str(request_data['georeference']), 'update', request.db)

        # this is actual mtb specific behavior 
        log.debug('Parse remove and new passpoints ...')
        registeredPasspoints = Passpoint.allForObjectId(messtischblatt.id, request.db)
        removePasspoints = []
        newPasspoints = []
        if 'remove' in request_data['georeference'] and len(request_data['georeference']['remove']['gcps']) > 0:
            removePasspoints = getRemovePasspointList(request_data['georeference']['remove']['gcps'], georefProcess, request.db)
        if 'new' in request_data['georeference'] and len(request_data['georeference']['new']['gcps']) > 0:    
            newPasspoints = getNewPasspointList(request_data['georeference']['new']['gcps'], georefProcess, registeredPasspoints, user.id)
            
        log.debug('Check if remove and new passpoints are valide ...')
        if areRemoveAndNewPasspointsValide(removePasspoints, newPasspoints):
            log.debug('Remove old passpoints ...')
            for passpoint in removePasspoints:
                request.db.delete(passpoint)
                request.db.flush()
                
            log.debug('Add new passpoints ...')
            for passpoint in newPasspoints:
                request.db.add(passpoint)
                request.db.flush()
            
            log.debug('Set update status for messtischblatt ...')
            messtischblatt.updated = True
            
            log.debug('Create response ...')
            points = len(newPasspoints)*5  
            gcps = getJsonDictPasspointsForMapObject(messtischblatt.id, request.db)
            response = {'text':'Georeference result updated. It will soon be ready for use.','georeferenceid':georefProcess.id, 'points':points, 'gcps':gcps ,'type':'update'}
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
        clipparameter = gcps, timestamp = timestamp, isvalide = True, type = type, refzoomify = True, publish = False)
    dbsession.add(georefProcess)
    dbsession.flush()  
    return georefProcess

def getRemovePasspointList(georeference_parameter, georeference_process, dbsession):
    removePasspoints = []
    for i in range(0, len(georeference_parameter)):
        unrefPoint = [georeference_parameter[i]['source'][0],georeference_parameter[i]['source'][1]]
        refPoint = 'POINT(%s %s)'%(georeference_parameter[i]['target'][0], georeference_parameter[i]['target'][1])
        passpoint = Passpoint.by_ObjectIdUnrefPointRefPoint(georeference_process.messtischblattid, unrefPoint, refPoint,dbsession)
        removePasspoints.append(passpoint)
    return removePasspoints
            
def getNewPasspointList(georeference_parameter, georeference_process, registeredPasspoints, userid):
    newPasspoints = []
    for i in range(0,len(georeference_parameter)):
        unrefPoint = [georeference_parameter[i]['source'][0],georeference_parameter[i]['source'][1]]
        refPoint = 'POINT(%s %s)'%(georeference_parameter[i]['target'][0], georeference_parameter[i]['target'][1])
        passpoint = Passpoint(objectid = georeference_process.messtischblattid, userid = userid, unrefpoint = unrefPoint,
            refpoint = refPoint, deprecated = False, timestamp = georeference_process.timestamp, georeferenceprocessid =  georeference_process.id)
        if not isPasspointInPasspointListByUnrefPoint(passpoint, registeredPasspoints):
            newPasspoints.append(passpoint)
    return newPasspoints
                            
def isPasspointInPasspointListByUnrefPoint(passpoint, passpointList):
    for x in passpointList:
        if x.objectid == passpoint.objectid and x.unrefpoint == passpoint.unrefpoint:
            return True
    return False

def areRemoveAndNewPasspointsValide(removePasspoints, newPasspoints):
    if (len(removePasspoints) != len(newPasspoints)):
        return False
    
    for x in removePasspoints:
        # check if removePasspoint has a corresponding part in newPasspoint
        hasEqualNewPasspoint = False
        for y in newPasspoints:
            if x.objectid == y.objectid and x.refpoint == y.refpoint:
                hasEqualNewPasspoint = True
        
        if not hasEqualNewPasspoint:
            return False
    return True