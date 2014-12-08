#!/usr/bin/env python
# -*- coding: utf-8 -*- 
'''
Created on 30.09.2014

@author: Leisen
'''
from pyramid.view import view_config
from vkviewer.python.models.messtischblatt.Users import Users
from vkviewer.python.models.messtischblatt.Uploads import Uploads
from vkviewer.python.tools import checkIsUser
from vkviewer import log

# query for getting all upload-maps from a special user
upload_profile_query = 'SELECT uploads.id as upload_id, uploads.mapid as upload_mapid, map.originalimage as imagepath, uploads.time as upload_time, \
metadata.title as title, metadata.timepublish as time, metadata.imagelicence as licence \
FROM uploads, map, metadata WHERE uploads.userid = \'%s\' AND uploads.mapid = map.id AND uploads.mapid = metadata.mapid ORDER BY upload_time'


@view_config(route_name='upload-profile', renderer='upload-profile.mako', permission='moderator', http_cache=0)
def getUploadProfilePage(request):
    log.debug('Request - Get Upload profile page.')
    dbsession = request.db
    username = checkIsUser(request)
    user = Users.by_username(username, dbsession)
    userid = user.id
    
    try:
        log.debug('Query Upload profile information from database for user %s'%userid)
        query_uploadprofile = upload_profile_query%userid
        
        resultSet = dbsession.execute(query_uploadprofile)
        
        log.debug('Create response list')
        
        upload_profile = []
        for record in resultSet:
            upload_profile.append({'upload_id':record['upload_id'], 'upload_mapid':record['upload_mapid'], 
                    'time': record['time'], 'licence': record['licence'], 'title': record['title'],
                    'upload_time':record['upload_time'], 'imagepath':record['imagepath']})  
                   
        log.debug('Response: %s'%upload_profile)   
            
        return {'upload_profile':upload_profile}
        
    except Exception as e:
        log.error('Error while trying to request upload history information');
        log.error(e)
        return {}             
        return {}
