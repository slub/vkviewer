from pyramid.response import Response
from pyramid.view import view_config, forbidden_view_config
from pyramid.httpexceptions import HTTPNotFound, HTTPFound
from pyramid.security import remember, forget

# database imports
from sqlalchemy.exc import DBAPIError
from ..models.messtischblatt import getCollectionForBlattnr, ViewRefGridMtb

# renderer imports
import json



""" Returns a json document which contains a timestamps string and a occurence value for
    a given blattnr.
    @param - blattnr -
    
    @return - timestamps - List of timestamps seperated by a comma
    @return - occurence - how many timestamps are occure for this blattnr"""
@view_config(route_name='gettimestamps', renderer='string', permission='view')
def getTimestamps_forBlattnr(request):
    try:
        dbsession = request.db
        results = ViewRefGridMtb.allForBlattnr(request.GET.get('blattnr'), dbsession)
        occurence = 0
        timestamps = ''
        for refGridMtb in results:
            occurence += 1
            timestamps += '%s,'%refGridMtb.time 
        return json.dumps({'occurence':occurence,'timestamps':timestamps}, ensure_ascii=False, encoding='utf-8')
    except DBAPIError:
        return Response(conn_err_msg, content_type='text/plain', status_int=500)

# """ developing getwms """
# @view_config(route_name='getwms', renderer='georef.mako', permission='view',http_cache=0)
# def getwms(request):
#     paginator = getPaginatorForBlattnr(request, request.GET.get('blattnr')) 
#     return {'paginator':paginator}



    
    
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