# -*- coding: utf-8 -*-
from pyramid.response import Response
from pyramid.view import view_config
from pyramid.httpexceptions import HTTPBadRequest

# database imports
from sqlalchemy.exc import DBAPIError
from vkviewer import log
from vkviewer.settings import ADMIN_ADDR
from vkviewer.python.tools import checkIsUser
from vkviewer.python.models.messtischblatt.Fehlermeldung import Fehlermeldung
from vkviewer.python.models.messtischblatt.Users import Users
from vkviewer.python.models.messtischblatt.Messtischblatt import Messtischblatt
from vkviewer.python.models.messtischblatt.Georeferenzierungsprozess import Georeferenzierungsprozess
from vkviewer.python.models.messtischblatt.RefMtbLayer import RefMtbLayer
from vkviewer.python.georef.utils import getTimestampAsPGStr

# renderer imports
import json

ERROR_MSG = "Please check your request parameters or contact the administrator (%s)."%ADMIN_ADDR

@view_config(route_name='evaluation-georeference', renderer='json', permission='moderator', match_param='action=setinvalide')
def setProcessToInValide(request):
    log.info('Request - Set admin evaluation of georeference process to invalide ....')
    try:           
        # remove georeference process
        if 'georeferenceid' in request.params:
            georeferenceid = request.params['georeferenceid']
            georeferenceprocess = Georeferenzierungsprozess.by_id(georeferenceid, request.db)
            georeferenceprocess.adminvalidation = 'invalide'
                
            return {'message':'The georeference process has been set to invalide.'}
        else:
            raise Exception('Missing parameter (georeferenceid) ...')
    except Exception as e:
        log.error(e)
        return HTTPBadRequest(ERROR_MSG);
    
@view_config(route_name='evaluation-georeference', renderer='json', permission='moderator', match_param='action=setisvalide')
def setProcessToIsValide(request):
    log.info('Request - Set admin evaluation of georeference process to isvalide ....')
    try:           
        # remove georeference process
        if 'georeferenceid' in request.params:
            georeferenceid = request.params['georeferenceid']
            georeferenceprocess = Georeferenzierungsprozess.by_id(georeferenceid, request.db)
            georeferenceprocess.adminvalidation = 'isvalide'
                
            return {'message':'The georeference process has been set to isvalide.'}
        else:
            raise Exception('Missing parameter (georeferenceid) ...')
    except Exception as e:
        log.error(e)
        return HTTPBadRequest(ERROR_MSG);
    
