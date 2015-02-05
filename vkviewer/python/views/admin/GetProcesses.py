# -*- coding: utf-8 -*-
import traceback
from pyramid.view import view_config
from sqlalchemy import desc
from pyramid.httpexceptions import HTTPInternalServerError

# database imports
from vkviewer import log
from vkviewer.python.models.messtischblatt.Georeferenzierungsprozess import Georeferenzierungsprozess
from vkviewer.python.models.messtischblatt.Metadata import Metadata
from vkviewer.python.utils.exceptions import GENERAL_ERROR_MESSAGE
from vkviewer.python.utils.parser import convertUnicodeDictToUtf
from sqlalchemy.sql.expression import or_

@view_config(route_name='evaluation-georeference', renderer='json', permission='moderator', match_param='action=getprocess')
def getProcesses(request):
    try:
        log.info('Request - Get georeference processes.')
        
        if 'mapid' in request.params:
            log.debug('Get processes for mapid %s ...'%request.params['mapid'])
            queryData = request.db.query(Georeferenzierungsprozess, Metadata).join(Metadata, Georeferenzierungsprozess.mapid == Metadata.mapid)\
                .filter(Georeferenzierungsprozess.mapid == request.params['mapid'])\
                .order_by(desc(Georeferenzierungsprozess.id))
        elif 'userid' in request.params:
            log.debug('Get processes for userid %s ...'%request.params['userid'])
            queryData = request.db.query(Georeferenzierungsprozess, Metadata).join(Metadata, Georeferenzierungsprozess.mapid == Metadata.mapid)\
                .filter(Georeferenzierungsprozess.nutzerid == request.params['userid'])\
                .order_by(desc(Georeferenzierungsprozess.id))
        elif 'validation' in request.params:
            log.debug('Get processes for adminvalidation %s ...'%request.params['validation'])
            queryData = request.db.query(Georeferenzierungsprozess, Metadata).join(Metadata, Georeferenzierungsprozess.mapid == Metadata.mapid)\
                .filter(Georeferenzierungsprozess.adminvalidation == request.params['validation'])\
                .order_by(desc(Georeferenzierungsprozess.id))
        else:
            log.debug('Get all pending processes ...')
            queryData = request.db.query(Georeferenzierungsprozess, Metadata).join(Metadata, Georeferenzierungsprozess.mapid == Metadata.mapid)\
                .filter(or_(Georeferenzierungsprozess.adminvalidation == '', Georeferenzierungsprozess.adminvalidation == None))\
                .order_by(desc(Georeferenzierungsprozess.id))
    
        response = []
        for record in queryData:
            georef = record[0]
            metadata = record[1]
            # use encoded_georefParams for visualisation as string on the client side
            encoded_georefParams = str(convertUnicodeDictToUtf(georef.georefparams)).replace('\'','"')
            response.append({'georef_id':georef.id, 'mapid':georef.mapid, 
                'georef_params': encoded_georefParams, 'time': str(metadata.timepublish), 'processed': georef.processed,
                'adminvalidation': georef.adminvalidation, 'title': metadata.title, 'apsobjectid': georef.messtischblattid,
                'georef_time':str(georef.timestamp),'type':georef.type, 'userid': georef.nutzerid,
                'georef_isactive':georef.isactive})
        return response
    except Exception as e:
        log.error(e)
        log.error(traceback.format_exc())
        return HTTPInternalServerError(GENERAL_ERROR_MESSAGE);