# -*- coding: utf-8 -*-
from pyramid.response import Response
from pyramid.view import view_config

# database imports
from sqlalchemy.exc import DBAPIError
from vkviewer import log
from vkviewer.settings import MTB_LAYER_ID
from vkviewer.python.tools import checkIsUser
from vkviewer.python.models.messtischblatt.Fehlermeldung import Fehlermeldung
from vkviewer.python.models.messtischblatt.Users import Users
from vkviewer.python.models.messtischblatt.Messtischblatt import Messtischblatt
from vkviewer.python.models.messtischblatt.Georeferenzierungsprozess import Georeferenzierungsprozess
from vkviewer.python.models.messtischblatt.RefMtbLayer import RefMtbLayer
from vkviewer.python.georef.utils import getTimestampAsPGStr

# renderer imports
import json

@view_config(route_name='evaluation-georeference', renderer='string', permission='moderator', match_param='action=publish')
def publishGeorefParameters(request):
    log.info('Request - Publish georeference result.')
    try:
        log.debug('Parse parameters ...')            
        objectid = request.params['objectid']
        georeferenceid = request.params['georeferenceid']
        messtischblatt = Messtischblatt.by_id(objectid, request.db)
        georeferenceprocess = Georeferenzierungsprozess.by_id(georeferenceid, request.db)
        
        log.debug('Udpate parameters')
        georeferenceprocess.publish = True
        messtischblatt.updated = False
        
        return json.dumps({'message':'The georeference process is now published. The georeference map will soon be updated and than ready for accessing.'}, ensure_ascii=False, encoding='utf-8')  
    except Exception as e:
        log.error('Error while trying to request georeference history information');
        log.error(e)
        return {}
    

