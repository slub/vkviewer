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
from settings import layer_id

# query for getting all georeference processes form a special user
georeference_profile_query = 'SELECT georef.id as id, georef.messtischblattid as mtbid, georef.clipparameter_pure as clip_params, georef.timestamp as time, \
georef.isvalide as isvalide, md_core.titel as titel FROM georeferenzierungsprozess as georef, md_core WHERE georef.nutzerid = \'%s\' AND \
georef.messtischblattid = md_core.id ORDER BY time DESC'

# query to get the messtischblätter which are already processed and published
georeference_profile_transformed_query = 'SELECT layer.mtbid as id, box2d(layer.boundingbox) as box, layer.time as time \
FROM view_layers as layer, georeferenzierungsprozess as georef WHERE georef.messtischblattid = layer.mtbid AND layer.id = %s \
AND georef.nutzerid = \'%s\''

@view_config(route_name='users_profile_georef', renderer='users_profile_georef.mako', permission='view',http_cache=0)
def georeference_profile_page(request):
    log.debug('Request - Get georeference profile page.')
    dbsession = request.db
    userid = checkIsUser(request)
    user = Users.by_username(userid, dbsession)
    try:
        log.debug('Query georeference profile information from database for user %s'%userid)
        query_georefprocess = georeference_profile_query%userid
        query_georefTransformed = georeference_profile_transformed_query%(layer_id, userid)
        
        print '========================='
        print 'Query: %s'%query_georefTransformed
        print '========================='
        
        resultDict_transformed = parseGeorefTransformed(dbsession.execute(query_georefTransformed))        
        resultSet = dbsession.execute(query_georefprocess)
        
        log.debug('Create response list')
        georef_profile = []
        for record in resultSet:
            if record['mtbid'] in resultDict_transformed:                
                georef_profile.append({'georef_id':record['id'], 'mtb_id':record['mtbid'], 
                                 'clip_params': record['clip_params'], 'time': record['time'],
                                 'isvalide': record['isvalide'], 'titel': record['titel'], 
                                 'transformed':resultDict_transformed[record['mtbid']]})
            else:                
                georef_profile.append({'georef_id':record['id'], 'mtb_id':record['mtbid'], 
                                 'clip_params': record['clip_params'], 'time': record['time'],
                                 'isvalide': record['isvalide'], 'titel': record['titel']})
             
        print '========================='
        print 'Response: %s'%georef_profile
        print '========================='  
        
        return {'georef_profile':georef_profile, 'points':user.bonuspunkte}
    except:
        pass
        return {}
    
def parseGeorefTransformed(resultProxy):
    resultDict = {}
    for record in resultProxy:
        resultDict[record['id']] = {'mtbid':record['id'],'time':record['time'],'boundingbox':record['box']}
    return resultDict