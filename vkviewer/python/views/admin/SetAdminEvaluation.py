# -*- coding: utf-8 -*-
import traceback
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
                
            if 'comment' in request.params:
                georeferenceprocess.comment = request.params['comment']
                
            return {'message':'The georeference process has been set to invalide.'}
        else:
            raise Exception('Missing parameter (georeferenceid) ...')
    except Exception as e:
        log.error(e)
        log.error(traceback.format_exc())
        return HTTPBadRequest(GENERAL_ERROR_MESSAGE);
    
@view_config(route_name='evaluation-georeference', renderer='json', permission='moderator', match_param='action=setisvalide')
def setProcessToIsValide(request):
    log.info('Request - Set admin evaluation of georeference process to isvalide ....')
    try:           
        # remove georeference process
        if 'georeferenceid' in request.params:
            georeferenceid = request.params['georeferenceid']
            georeferenceprocess = Georeferenzierungsprozess.by_id(georeferenceid, request.db)
            
            # check if there is no other active georeference process for this mapid
            # and if this is the case check if the earlier state was "invalide" and the
            # process should now be updated again
            activeGeorefprocess = Georeferenzierungsprozess.getActualGeoreferenceProcessForMapId(georeferenceprocess.mapid, request.db)
            if georeferenceprocess.adminvalidation == 'invalide' and activeGeorefprocess is None:
                georeferenceprocess.processed = False
                
            georeferenceprocess.adminvalidation = 'isvalide'
            
            if 'comment' in request.params:
                georeferenceprocess.comment = request.params['comment']
                
            return {'message':'The georeference process has been set to isvalide.'}
        else:
            raise Exception('Missing parameter (georeferenceid) ...')
    except Exception as e:
        log.error(e)
        log.error(traceback.format_exc())
        return HTTPBadRequest(GENERAL_ERROR_MESSAGE);