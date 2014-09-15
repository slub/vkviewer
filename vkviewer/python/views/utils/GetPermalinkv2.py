from pyramid.response import Response
from pyramid.view import view_config
from pyramid.httpexceptions import HTTPFound

# database imports
from sqlalchemy.exc import DBAPIError
from vkviewer import log
from vkviewer.python.views.utils.GetPermalink import createPermalink

# renderer imports
import json
        
@view_config(route_name='permalinkv2', renderer='string', permission='view')
def getPermalinkForObjectidv2(request):
    """ Contains a permalink url for the given objectid"""
    try:
        log.info('Receive get permalink request.')
        objectid = request.GET.get('objectid')
        permalink = createPermalink(request, objectid)            
        return HTTPFound(location=permalink)
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
