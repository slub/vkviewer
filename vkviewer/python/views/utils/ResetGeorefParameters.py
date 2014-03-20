# -*- coding: utf-8 -*-
from pyramid.response import Response
from pyramid.view import view_config

# database imports
from sqlalchemy.exc import DBAPIError
from vkviewer import log
from vkviewer.settings import MTB_LAYER_ID
from vkviewer.python.tools import checkIsUser
from vkviewer.python.models.messtischblatt.Fehlermeldung import Fehlermeldung
from vkviewer.python.models.messtischblatt.Users import Users
from vkviewer.python.models.messtischblatt.Messtischblatt import Messtischblatt
from vkviewer.python.models.messtischblatt.Georeferenzierungsprozess import Georeferenzierungsprozess
from vkviewer.python.models.messtischblatt.RefMtbLayer import RefMtbLayer
from vkviewer.python.georef.utils import getTimestampAsPGStr

# renderer imports
import json

@view_config(route_name='report', renderer='string', permission='moderator', match_param='action=resetgeorefparameters')
def resetGeorefParameters(request):
    try:
        log.info('Receive a reset georeference parameter requests.')
        login = checkIsUser(request)
        dbsession = request.db
        messtischblatt_id = request.params['mtbid']
        georeference_process = Georeferenzierungsprozess.by_messtischblattid(messtischblatt_id, dbsession)
        referenz = georeference_process.clipparameter_pure
        fehlerbeschreibung = 'Zuruecksetzen von Georeferenzierungsparameter für GeorefId=%s'%georeference_process.id
        if login and messtischblatt_id and referenz and fehlerbeschreibung and Users.by_username(login, dbsession):
            log.debug('Save reset process in table fehlermeldungen ...')
            newFehlermeldung = Fehlermeldung(objektid = messtischblatt_id, referenz = referenz, nutzerid = login,
                        fehlerbeschreibung = fehlerbeschreibung, timestamp = getTimestampAsPGStr())
            dbsession.add(newFehlermeldung)
            
            log.debug('Remove georeference process ...')
            dbsession.delete(georeference_process)
            
            
            log.debug('Remove refmtblayer ...')
            refmtblayer = RefMtbLayer.by_id(MTB_LAYER_ID, messtischblatt_id, dbsession)
            dbsession.delete(refmtblayer)
            
            log.debug('Update messtischblatt db ...')
            messtischblatt = Messtischblatt.by_id(messtischblatt_id, dbsession) 
            messtischblatt.isttransformiert = False
            
            return json.dumps({'status':'confirmed'}, ensure_ascii=False, encoding='utf-8')
    except DBAPIError:
        log.error('Problems while trying to remove georeference parameter from the database ...')
        return Response(conn_err_msg, content_type='text/plain', status_int=500)


    
conn_err_msg = """\
Pyramid is having a problem using your SQL database.  The problem
might be caused by one of the following things:

1.  You may need to run the "initialize_tutorial_db" script
    to initialize your database tables.  Check your virtual 
    environment's "bin" directory for this script and try to run it.

2.  Your database server may not be running.  Check that the
    database server referred to by the "sqlalchemy.url" setting in
    your "development.ini" file is running.

After you fix the problem, please restart the Pyramid application to
try it again.
"""
