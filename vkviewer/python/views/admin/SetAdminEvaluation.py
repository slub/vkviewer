# -*- coding: utf-8 -*-
import traceback
from pyramid.view import view_config
from pyramid.httpexceptions import HTTPBadRequest

from vkviewer import log
from vkviewer.python.tools import checkIsUser
from vkviewer.python.utils.exceptions import GENERAL_ERROR_MESSAGE
from vkviewer.python.georef.utils import getTimestampAsPGStr
from vkviewer.python.models.messtischblatt.Georeferenzierungsprozess import Georeferenzierungsprozess
from vkviewer.python.models.messtischblatt.AdminJobs import AdminJobs

@view_config(route_name='evaluation-georeference', renderer='json', permission='moderator', match_param='action=setinvalide')
def setProcessToInValide(request):
    log.info('Request - Set admin evaluation of georeference process to invalide ....')
    try:           
        # remove georeference process
        if 'georeferenceid' in request.params:
            georeferenceid = request.params['georeferenceid']
            userid = checkIsUser(request)
            comment = '' if 'comment' not in request.params else request.params['comment']
            
            # check if georeference id exist
            georeferenceprocess = Georeferenzierungsprozess.by_id(georeferenceid, request.db)
            if georeferenceprocess:
                newJob = createNewAdminJob(georeferenceprocess, 'invalide', userid, comment)
                request.db.add(newJob)
                
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
            userid = checkIsUser(request)
            comment = '' if 'comment' not in request.params else request.params['comment']
            
            # check if georeference id exist
            georeferenceprocess = Georeferenzierungsprozess.by_id(georeferenceid, request.db)
            if georeferenceprocess:
                newJob = createNewAdminJob(georeferenceprocess, 'isvalide', userid, comment)
                request.db.add(newJob)
                
            return {'message':'The georeference process has been set to isvalide.'}
        else:
            raise Exception('Missing parameter (georeferenceid) ...')
    except Exception as e:
        log.error(e)
        log.error(traceback.format_exc())
        return HTTPBadRequest(GENERAL_ERROR_MESSAGE);
    
def createNewAdminJob(georeferenceprocess, setto, userid, comment):
    return AdminJobs(georefid = georeferenceprocess.id, processed = False, setto = setto, 
                     timestamp = getTimestampAsPGStr(), comment = comment, userid = userid)