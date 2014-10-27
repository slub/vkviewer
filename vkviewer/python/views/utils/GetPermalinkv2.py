import traceback
from pyramid.view import view_config
from pyramid.httpexceptions import HTTPFound, HTTPBadRequest
from sqlalchemy.exc import DBAPIError

from vkviewer import log
from vkviewer.python.models.messtischblatt.Map import Map
from vkviewer.python.utils.exceptions import GENERAL_ERROR_MESSAGE
from vkviewer.python.views.utils.GetPermalink import createPermalink

@view_config(route_name='permalinkv2', renderer='string', permission='view')
def getPermalinkForObjectidv2(request):
    """ Contains a permalink url for the given objectid"""
    try:
        log.info('Receive get permalink request.')
        objectid = request.GET.get('objectid')
        dbsession = request.db
        centroid = Map.getCentroid_byApsObjectid(objectid, dbsession, 900913)     
        mapid = Map.by_apsObjectId(objectid, dbsession).id
        return HTTPFound(location=request.host_url + '/vkviewer/?welcomepage=off&z=5&c=%s,%s&oid=%s'%(centroid[0],centroid[1],mapid))
    except DBAPIError:
        log.error(traceback.format_exc())
        raise HTTPBadRequest(GENERAL_ERROR_MESSAGE)