from pyramid.view import view_config
from pyramid.httpexceptions import HTTPInternalServerError

# database imports
from sqlalchemy.exc import DBAPIError
from vkviewer import log
from vkviewer.settings import DATABASE_SRID
from vkviewer.python.utils.exceptions import GENERAL_ERROR_MESSAGE
from vkviewer.python.models.messtischblatt.Metadata import Metadata
from vkviewer.python.models.messtischblatt.VBlattschnittMtb import VBlattschnittMtb
from vkviewer.python.models.messtischblatt.Map import Map

@view_config(route_name='gettimestampsforid', renderer='json', permission='view')
def getTimestampsForId(request):
    """ Returns a json document which contains a a list of messtischblatt tuples which
        have the same blattnumber like the given object. """
    try:
        log.info('Receive request for timestamps for a given object number.')
        dbsession = request.db
        object_id = request.GET.get('id')
        metadataObj = Metadata.by_id(object_id, dbsession)
        spatial_relation_objects = VBlattschnittMtb.allForBlattnr(metadataObj.blattnr, dbsession)
        
        #create response
        response = []
        for rel_object in spatial_relation_objects:
            if rel_object.isttransformiert:
                response.append({'id':rel_object.mapid,'time':rel_object.time,'extent': Map.getExtent(rel_object.map, dbsession, DATABASE_SRID)})
        return {'maps':response}
    except DBAPIError as e:
        log.error(e)
        raise HTTPInternalServerError(GENERAL_ERROR_MESSAGE)