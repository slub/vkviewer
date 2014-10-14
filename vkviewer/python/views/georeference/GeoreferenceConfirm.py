from pyramid.view import view_config
from pyramid.httpexceptions import HTTPBadRequest, HTTPInternalServerError

# further tools
import logging
import json

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

@view_config(route_name='georeference', renderer='json', permission='view', match_param='action=confirm')
def georeferenceConfirm(request):
    log.info('Receive request for processing georeference validation result')
    
    try:
        userid = checkIsUser(request)
        
        request_data = None
        if request.method == 'POST':
            request_data = request.json_body
            
        mapObj = parseMapObjForId(request_data, 'id', request.db)
        log.debug('Id is valide: %s'%request_data)
            
        log.debug('Check if there is already a registered georeference process for this messtischblatt ...')
        if Georeferenzierungsprozess.isGeoreferenced(mapObj.id, request.db):
            msg = 'There is already a georeference process for this process. Please load again and start on the latest changes.'
            log.debug(msg)
            
            georeferenceid = Georeferenzierungsprozess.getActualGeoreferenceProcessForMapId(mapObj.id, request.db).id
            response = {'text':msg,'georeferenceid':georeferenceid}
            return json.dumps(response, ensure_ascii=False, encoding='utf-8')        
        
        # actual only support this option if target srs is EPSG:4314
        log.debug('Start saving georeference process in the database ...')
        epsg_code = int(str(request_data['georeference']['target']).split(':')[1])
        if request_data['georeference']['source'] == 'pixel' and epsg_code == 4314:
            log.debug('Create georeference process record ...')
            timestamp = getTimestampAsPGStr()
            georeference_parameter = str(convertUnicodeDictToUtf(request_data['georeference']))
            georefProcess = Georeferenzierungsprozess(messtischblattid = mapObj.apsobjectid, nutzerid = userid, 
                georefparams = georeference_parameter, clipparameter = georeference_parameter, timestamp = timestamp, isactive = True, type = 'new', 
                refzoomify = True, adminvalidation = '', processed = False, mapsid = mapObj.id, overwrites = 0)
            request.db.add(georefProcess)
            request.db.flush()
                
            log.debug('Create response ...')  
            response = {'text':'Georeference result saved. It will soon be ready for use.','georeferenceid':georefProcess.id, 'points':20,
                         'gcps':request_data['georeference'] ,'type':'confirm'}
            return json.dumps(response, ensure_ascii=False, encoding='utf-8') 
        else:
            raise GeoreferenceParameterError('Wrong or missing service parameter')
        
    except GeoreferenceParameterError as e:
        log.error(e)
        raise HTTPBadRequest(ERROR_MSG) 
    except Exception as e:
        log.error(e)
        raise HTTPInternalServerError(ERROR_MSG)