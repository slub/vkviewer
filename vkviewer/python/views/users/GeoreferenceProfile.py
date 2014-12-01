#!/usr/bin/env python
# -*- coding: utf-8 -*- 

'''
Created on Jan 22, 2014

@author: mendt
'''
import traceback
from pyramid.view import view_config
from pyramid.httpexceptions import HTTPInternalServerError
from sqlalchemy import desc

from vkviewer import log
from vkviewer.python.utils.exceptions import GENERAL_ERROR_MESSAGE
from vkviewer.python.models.messtischblatt.Users import Users
from vkviewer.python.models.messtischblatt.Georeferenzierungsprozess import Georeferenzierungsprozess
from vkviewer.python.models.messtischblatt.Metadata import Metadata
from vkviewer.python.models.messtischblatt.Map import Map
from vkviewer.python.tools import checkIsUser


# query for getting all georeference processes from a special user
georeference_profile_query = 'SELECT georef.id as georef_id, georef.messtischblattid as mtbid, mtb.dateiname as key, box2d(st_transform(mtb.boundingbox, 900913)) as box,\
georef.clipparameter as clip_params, georef.timestamp as time_georef, georef.isvalide as isvalide, md_core.titel as titel, md_zeit.datierung as time, mtb.isttransformiert, \
georef.publish as published, georef.type as type \
FROM georeferenzierungsprozess as georef, md_core, messtischblatt as mtb, md_zeit WHERE georef.nutzerid = \'%s\' AND \
georef.messtischblattid = md_core.id AND georef.messtischblattid = mtb.id AND georef.messtischblattid = md_zeit.id AND \
md_zeit.typ = \'a5064\' ORDER BY time_georef DESC'

@view_config(route_name='profile-georeference', renderer='profile-georeference.mako', permission='edit',http_cache=0)
def georeference_profile_page(request):
    log.info('Request - Get georeference profile page.')
    dbsession = request.db
    userid = checkIsUser(request)
    user = Users.by_username(userid, dbsession)
    try:
        log.debug('Query georeference profile information from database for user %s'%userid)
        queryData = request.db.query(Georeferenzierungsprozess, Metadata, Map).join(Metadata, Georeferenzierungsprozess.mapid == Metadata.mapid)\
            .join(Map, Georeferenzierungsprozess.mapid == Map.id)\
            .filter(Georeferenzierungsprozess.nutzerid == userid)\
            .order_by(desc(Georeferenzierungsprozess.id))

        log.debug('Create response list')
        georef_profile = []
        for record in queryData:
            georef = record[0]
            metadata = record[1]
            mapObj = record[2]
            boundingbox = Map.getBox2d(georef.mapid, dbsession, 900913)
            georef_profile.append({'georef_id':georef.id, 'mapid':georef.mapid, 
                    'clip_params': georef.georefparams, 'time': metadata.timepublish, 'transformed': georef.processed,
                    'isvalide': georef.adminvalidation, 'titel': metadata.title, 'key': mapObj.apsdateiname,
                    'time_georef':georef.timestamp,'boundingbox':boundingbox[4:-1].replace(' ',','),'type':georef.type,
                    'published':georef.processed})
             
        log.debug('Response: %s'%georef_profile) 
        
        return {'georef_profile':georef_profile, 'points':user.bonuspunkte}
    except Exception as e:
        log.error('Error while trying to request georeference history information');
        log.error(e)
        log.error(traceback.format_exc())
        raise HTTPInternalServerError(GENERAL_ERROR_MESSAGE)
    
def parseGeorefTransformed(resultProxy):
    resultDict = {}
    for record in resultProxy:
        boundingbox = record['box'][4:-1].replace(' ',',')
        resultDict[record['id']] = {'mtbid':record['id'],'time_georef':record['time'],'boundingbox':boundingbox}
    return resultDict