'''
Created on Jan 22, 2014

@author: mendt
'''
from pyramid.view import view_config
from vkviewer.python.models.messtischblatt.Users import Users
from vkviewer.python.tools import checkIsUser
from vkviewer import log

georeference_profile_query = 'SELECT georef.id as id, georef.messtischblattid as mtbid, georef.clipparameter_pure as clip_params, georef.timestamp as time, \
georef.isvalide as isvalide, md_core.titel as titel FROM georeferenzierungsprozess as georef, md_core WHERE georef.nutzerid = \'%s\' AND georef.messtischblattid = md_core.id'

@view_config(route_name='users_profile_georef', renderer='users_profile_georef.mako', permission='view',http_cache=0)
def georeference_profile_page(request):
    log.debug('Request - Get georeference profile page.')
    dbsession = request.db
    userid = checkIsUser(request)
    user = Users.by_username(userid, dbsession)
    try:
        log.debug('Query georeference profile information from database for user %s'%userid)
        query = georeference_profile_query%userid
        resultSet = dbsession.execute(query)
        
        log.debug('Create response list')
        georef_profile = []
        for record in resultSet:
            georef_profile.append({'georef_id':record['id'], 'mtb_id':record['mtbid'], 
                             'clip_params': record['clip_params'], 'time': record['time'],
                             'isvalide': record['isvalide'], 'titel': record['titel']})
        return {'georef_profile':georef_profile, 'points':user.bonuspunkte}
    except:
        pass
        return {}