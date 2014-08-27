# -*- coding: utf-8 -*-
import ast, json
from pyramid.view import view_config

# database imports
from vkviewer import log
from vkviewer.python.utils.parser import convertUnicodeDictToUtf

# query for getting all georeference processes from a special user
georeference_evaluation_query = 'SELECT georef.id as georef_id, georef.messtischblattid as mtbid, mtb.dateiname as key,\
georef.clipparameter as clip_params, georef.timestamp as time_georef, georef.isvalide as isvalide, md_core.titel as titel, md_zeit.datierung as time, mtb.isttransformiert, \
georef.publish as published, georef.type as type, georef.nutzerid as userid \
FROM georeferenzierungsprozess as georef, md_core, messtischblatt as mtb, md_zeit WHERE georef.publish = FALSE AND \
georef.messtischblattid = md_core.id AND georef.messtischblattid = mtb.id AND georef.messtischblattid = md_zeit.id AND \
md_zeit.typ = \'a5064\' ORDER BY time_georef ASC'

@view_config(route_name='georeference_evaluation', renderer='georeference_evaluation.mako', permission='moderator', match_param='action=evaluation')
def getAdminEvaluationPage(request):
    log.info('Request - Get georeference profile page.')
    try:            
        resultSet = request.db.execute(georeference_evaluation_query)
        
        log.debug('Create response list')
        georef_profile = []
        for record in resultSet:   
            encoded_clip_params = str(convertUnicodeDictToUtf(ast.literal_eval(record['clip_params']))).replace('\'','"')           
            georef_profile.append({'georef_id':record['georef_id'], 'mtb_id':record['mtbid'], 
                    'clip_params': encoded_clip_params, 'time': record['time'], 'transformed': record['isttransformiert'],
                    'isvalide': record['isvalide'], 'titel': record['titel'], 'key': record['key'],
                    'time_georef':record['time_georef'],'type':record['type'], 'userid': record['userid'],
                    'published':record['published']})
             
        log.debug('Response: %s'%georef_profile) 
        
        return {'georef_profile':georef_profile}
    except Exception as e:
        log.error('Error while trying to request georeference history information');
        log.error(e)
        return {}
    
def parseGeorefTransformed(resultProxy):
    resultDict = {}
    for record in resultProxy:
        boundingbox = record['box'][4:-1].replace(' ',',')
        resultDict[record['id']] = {'mtbid':record['id'],'time_georef':record['time'],'boundingbox':boundingbox}
    return resultDict
