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

@view_config(route_name='georeference_evaluation', renderer='string', permission='moderator', match_param='action=delete')
def deleteGeorefParameters(request):
    log.info('Request - Delete georeference result.')
    try:           
        # remove georeference process
        georeferenceid = request.params['georeferenceid']
        georeferenceprocess = Georeferenzierungsprozess.by_id(georeferenceid, request.db)
        messtischblattid = georeferenceprocess.messtischblattid
        request.db.delete(georeferenceprocess)
        
        # mark the messtischblatt as updated
        messtischblatt = Messtischblatt.by_ObjectId(messtischblattid, request.db)
        messtischblatt.udpated = True
                
        return json.dumps({'message':'The georeference process has been removed.'}, ensure_ascii=False, encoding='utf-8') 
    except Exception as e:
        log.error('Error while trying to request georeference history information');
        log.error(e)
        return {}
    

