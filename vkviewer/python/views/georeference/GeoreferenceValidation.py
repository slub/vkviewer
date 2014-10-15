from pyramid.view import view_config
from pyramid.httpexceptions import HTTPBadRequest, HTTPInternalServerError

# further tools
import os, gdal, json

# own import stuff
from vkviewer import log
from vkviewer.settings import GEOREFERENCE_TMP_DIR, GEOREFERENCE_MAPFILE_FOLDER, GEOREFERENCE_MAPFILE_TEMPLATE, GEOREFERENCE_MAPFILE_DEFAULT_PARAMS
from vkviewer.python.utils.parser import parseGcps
from vkviewer.python.georef.utils import getUniqueId
from vkviewer.python.georef.mapfile import createMapfile
from vkviewer.python.georef.georeferenceexceptions import GeoreferenceParameterError
from vkviewer.python.models.messtischblatt.Map import Map
from vkviewer.python.georef.georeferencer import georeference
from vkviewer.python.utils.parser import parseMapObjForId
from vkviewer.settings import ADMIN_ADDR
        
ERROR_MSG = "Please check your request parameters or contact the administrator (%s)."%ADMIN_ADDR

@view_config(route_name='georeference', renderer='json', permission='view', match_param='action=validation')
def georeferenceValidation(request):
    log.info('Receive request for processing georeference validation result')
    
    try:
        request_data = None
        if request.method == 'POST':
            request_data = request.json_body
          
        mapObj = parseMapObjForId(request_data, 'id', request.db)
        log.debug('Id is valide: %s'%request_data)
                      
        log.debug('Start creating validation result ...')
        # actual only support this option if target srs is EPSG:4314
        epsg_code = int(str(request_data['georeference']['target']).split(':')[1])
        if request_data['georeference']['source'] == 'pixel' and epsg_code == 4314:
            log.debug('Parse gcps ...')
            gcps = parseGcps(request_data['georeference']['gcps'])
            
            log.debug('Process georeference parameter ...')
            destPath = georeference(mapObj.originalimage, os.path.join(GEOREFERENCE_MAPFILE_FOLDER,mapObj.apsdateiname+"::"+str(getUniqueId())+".vrt"), 
                         GEOREFERENCE_TMP_DIR, gcps, epsg_code, epsg_code, 'polynom', log)
        
            log.debug('Create temporary mapfile ...')
            wms_url = createMapfile(mapObj.apsdateiname, destPath, GEOREFERENCE_MAPFILE_TEMPLATE, GEOREFERENCE_MAPFILE_FOLDER, GEOREFERENCE_MAPFILE_DEFAULT_PARAMS)
            
            log.debug('Create response ...')  
            response = {'wms_url':wms_url,'layer_id':mapObj.apsdateiname,'extent':Map.getExtent(mapObj.id, request.db)}
            return response 
        else:
            raise GeoreferenceParameterError('Wrong or missing service parameter')
    except GeoreferenceParameterError as e:
        log.error(e)
        raise HTTPBadRequest(ERROR_MSG) 
    except Exception as e:
        log.error(e)
        raise HTTPInternalServerError(ERROR_MSG)
