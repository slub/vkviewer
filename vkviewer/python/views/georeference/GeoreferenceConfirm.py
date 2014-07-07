from pyramid.view import view_config
from pyramid.httpexceptions import HTTPBadRequest, HTTPInternalServerError

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
from vkviewer.python.models.messtischblatt.Users import Users
from vkviewer.python.georef.georeferenceexceptions import GeoreferenceParameterError

@view_config(route_name='georeference', renderer='string', permission='view', match_param='action=confirm')
def georeferenceConfirm(request):
    log.info('Receive request for processing georeference validation result')
    
    try:
        userid = checkIsUser(request)
        user = Users.by_username(userid, request.db)
        request_data = None
        if request.method == 'POST':
            request_data = request.json_body
            
        if request_data:
            validateId(request_data['id'])
            log.debug('Request data is valide: %s'%request_data)
            
        log.debug('Check if there is already a registered georeference process for this messtischblatt ...')
        messtischblatt = Messtischblatt.by_id(request_data['id'], request.db)
        isAlreadyGeorefProcess = Georeferenzierungsprozess.by_messtischblattid(messtischblatt.id, request.db)
        if isAlreadyGeorefProcess is not None:
            response = {'text':'There is already a registered georeference process for this messtischblatt. Please move forward to the update process.','georeferenceid':isAlreadyGeorefProcess.id}
            return json.dumps(response, ensure_ascii=False, encoding='utf-8')        
        
        # actual only support this option if target srs is EPSG:4314
        log.debug('Start saving georeference process in the database ...')
        epsg_code = int(str(request_data['georeference']['target']).split(':')[1])
        if request_data['georeference']['source'] == 'pixel' and epsg_code == 4314:
            log.debug('Create georeference process record ...')
            timestamp = getTimestampAsPGStr()
            georeference_parameter = str(convertUnicodeDictToUtf(request_data['georeference']))
            georefProcess = Georeferenzierungsprozess(messtischblattid = messtischblatt.id, nutzerid = userid, 
                clipparameter = georeference_parameter, timestamp = timestamp, isvalide = True, type = 'new', refzoomify = True, publish = False, processed = False)
            request.db.add(georefProcess)
            request.db.flush()
            
            log.debug('Creating passpoints ...')
#             gcps = request_data['georeference']['gcps']
#             passpoints = []
#             for i in range(0,len(gcps)):
#                 unrefPoint = [gcps[i]['source'][0],gcps[i]['source'][1]]
#                 refPoint = 'POINT(%s %s)'%(gcps[i]['target'][0], gcps[i]['target'][1])
#                 passpoint = Passpoint(objectid = messtischblatt.id, userid = user.id, unrefpoint = unrefPoint,
#                                       refpoint = refPoint, deprecated = False, timestamp = timestamp, georeferenceprocessid =  georefProcess.id)
#                 request.db.add(passpoint)
#                 passpoints.append(passpoints)
                
            log.debug('Create response ...')  
            ##gcps = getJsonDictPasspointsForMapObject(messtischblatt.id, request.db)
            response = {'text':'Georeference result saved. It will soon be ready for use.','georeferenceid':georefProcess.id, 'points':20,
                         'gcps':request_data['georeference'] ,'type':'confirm'}
            return json.dumps(response, ensure_ascii=False, encoding='utf-8') 
        else:
            raise GeoreferenceParameterError('Wrong or missing service parameter')
        
        
    except GeoreferenceParameterError as e:
        message = 'Wrong or missing service parameter - %s'%e.value
        log.error(message)
        return HTTPBadRequest(message) 
    except Exception as e:
        message = 'Problems while computing validation result - %s'%e
        log.error(message)
        return HTTPInternalServerError(message)