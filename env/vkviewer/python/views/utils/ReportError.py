from pyramid.response import Response
from pyramid.view import view_config

# database imports
from sqlalchemy.exc import DBAPIError
from vkviewer import log
from vkviewer.python.tools import checkIsUser
from vkviewer.python.models.messtischblatt.Fehlermeldung import Fehlermeldung
from vkviewer.python.models.messtischblatt.Users import Users
from vkviewer.python.georef.utils import getTimestampAsPGStr
# renderer imports
import json

@view_config(route_name='report_error', renderer='string', permission='edit')
def report_error(request):
    try:
        log.debug('Report error is called')
        dbsession = request.db
            
        # parse parameter
        login = checkIsUser(request)
        objektid = request.params['id']
        referenz = request.params['reference']
        fehlerbeschreibung = request.params['message']
        if login and objektid and referenz and fehlerbeschreibung:
            # check if valide user
            if Users.by_username(login, dbsession):
                newFehlermeldung = Fehlermeldung(objektid = objektid, referenz = referenz, nutzerid = login,
                                                 fehlerbeschreibung = fehlerbeschreibung, timestamp = getTimestampAsPGStr())
                dbsession.add(newFehlermeldung)
                log.debug('Report error is registered in database')
                return json.dumps({'status':'confirmed'}, ensure_ascii=False, encoding='utf-8')
    except DBAPIError:
        log.error('Problems while trying to register report error in database')
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
