#!/usr/bin/env python
# -*- coding: utf-8 -*- 

'''
Created on Jan 22, 2014

@author: mendt
'''

from pyramid.view import view_config
from vkviewer.python.models.messtischblatt.Users import Users
from vkviewer.python.tools import checkIsUser
from vkviewer import log

# query for getting all georeference processes from a special user
georeference_profile_query = 'SELECT georef.id as georef_id, georef.messtischblattid as mtbid, mtb.dateiname as key, box2d(st_transform(mtb.boundingbox, 900913)) as box,\
georef.clipparameter as clip_params, georef.timestamp as time_georef, georef.isvalide as isvalide, md_core.titel as titel, md_zeit.datierung as time, mtb.isttransformiert \
FROM georeferenzierungsprozess as georef, md_core, messtischblatt as mtb, md_zeit WHERE georef.nutzerid = \'%s\' AND georef.typevalidierung != \'waiting\' AND \
georef.messtischblattid = md_core.id AND georef.messtischblattid = mtb.id AND georef.messtischblattid = md_zeit.id AND \
md_zeit.typ = \'a5064\' ORDER BY time_georef DESC'



@view_config(route_name='users_profile_georef', renderer='users_profile_georef.mako', permission='view',http_cache=0)
def georeference_profile_page(request):
    log.info('Request - Get georeference profile page.')
    dbsession = request.db
    userid = checkIsUser(request)
    user = Users.by_username(userid, dbsession)
    try:
        log.debug('Query georeference profile information from database for user %s'%userid)
        query_georefprocess = georeference_profile_query%userid
                    
        resultSet = dbsession.execute(query_georefprocess)
        
        log.debug('Create response list')
        georef_profile = []
        for record in resultSet:              
            georef_profile.append({'georef_id':record['georef_id'], 'mtb_id':record['mtbid'], 
                    'clip_params': record['clip_params'], 'time': record['time'], 'transformed': record['isttransformiert'],
                    'isvalide': record['isvalide'], 'titel': record['titel'], 'key': record['key'],
                    'time_georef':record['time_georef'],'boundingbox':record['box'][4:-1].replace(' ',',')})
             
        log.debug('Response: %s'%georef_profile) 
        
        return {'georef_profile':georef_profile, 'points':user.bonuspunkte}
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