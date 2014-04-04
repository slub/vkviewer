from pyramid.response import Response
from pyramid.view import view_config

# database imports
from sqlalchemy.exc import DBAPIError
from vkviewer.python.models.messtischblatt.Messtischblatt import Messtischblatt
from vkviewer.python.models.messtischblatt.MdZeit import MdZeit
from vkviewer import log

# renderer imports
import json

@view_config(route_name='gettimestampsforid', renderer='string', permission='view')
def getTimestampsForId(request):
    """ Returns a json document which contains a a list of messtischblatt tuples which
        have the same blattnumber like the given object. """
    try:
        log.info('Receive request for timestamps for a given object number.')
        dbsession = request.db
        object_id = request.GET.get('id')
        object = Messtischblatt.by_id(object_id, dbsession)
        spatial_relation_objects = Messtischblatt.allForBlattnr(object.blattnr, dbsession)
        response = []
        for rel_object in spatial_relation_objects:
            if rel_object.isttransformiert:
                time = MdZeit.by_id(rel_object.id, dbsession).datierung
                response.append({'id':rel_object.id,'time':time,'extent':Messtischblatt.getExtent(rel_object.id, dbsession)})
        return json.dumps({'maps':response}, ensure_ascii=False, encoding='utf-8')
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