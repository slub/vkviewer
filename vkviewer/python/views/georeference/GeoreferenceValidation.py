from pyramid.view import view_config
from pyramid.httpexceptions import HTTPBadRequest, HTTPInternalServerError

# further tools
import os, gdal, json

# own import stuff
from vkviewer import log
from vkviewer.settings import GEOREFERENCE_TMP_DIR, GEOREFERENCE_MAPFILE_FOLDER, GEOREFERENCE_MAPFILE_TEMPLATE, GEOREFERENCE_MAPFILE_DEFAULT_PARAMS
from vkviewer.python.utils.validation import validateId
from vkviewer.python.utils.parser import parseGcps
from vkviewer.python.georef.utils import getUniqueId
from vkviewer.python.georef.mapfile import createMapfile
from vkviewer.python.georef.georeferenceexceptions import GeoreferenceParameterError
from vkviewer.python.models.messtischblatt.Messtischblatt import Messtischblatt
from vkviewer.python.georef.georeferencer import georeference
        
@view_config(route_name='georeference', renderer='string', permission='view', match_param='action=validation')
def georeferenceValidation(request):
    log.info('Receive request for processing georeference validation result')
    
    try:
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
