from pyramid.response import Response
from pyramid.view import view_config

# database imports
from sqlalchemy.exc import DBAPIError
from vkviewer.python.models.messtischblatt.Messtischblatt import Messtischblatt
from vkviewer.python.models.messtischblatt.MdZeit import MdZeit
from vkviewer import log

# renderer imports
import json

@view_config(route_name='permalink', renderer='string', permission='view')
def getPermalinkForObjectid(request):
    """ Contains a permalink url for the given objectid"""
    try:
        log.info('Receive get permalink request.')
        dbsession = request.db
        objectid = request.GET.get('objectid')
        centroid = Messtischblatt.getCentroid(objectid, dbsession, 900913)
        permalink = request.host_url + '/vkviewer/?welcomepage=off&z=5&c=%s,%s&oid=%s'%(centroid[0],centroid[1],objectid)
        return Response(permalink, content_type='text/plain', status_int=500)
    except DBAPIError:
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
