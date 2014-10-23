# -*- coding: utf-8 -*-
from pyramid.view import view_config
from pyramid.httpexceptions import HTTPBadRequest

from vkviewer import log
from vkviewer.python.utils.exceptions import GENERAL_ERROR_MESSAGE
from vkviewer.settings import ADMIN_ADDR
from vkviewer.python.models.messtischblatt.Georeferenzierungsprozess import Georeferenzierungsprozess

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
        return HTTPBadRequest(GENERAL_ERROR_MESSAGE);
    
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
        return HTTPBadRequest(GENERAL_ERROR_MESSAGE);
    
