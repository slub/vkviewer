import traceback
from pyramid.view import view_config
from pyramid.httpexceptions import HTTPNotFound, HTTPBadRequest

from vkviewer import log
from vkviewer.python.utils.exceptions import GENERAL_ERROR_MESSAGE
from vkviewer.python.models.messtischblatt.Map import Map
from vkviewer.python.utils.idgenerator import parseOAI
from vkviewer.python.utils.exceptions import NotFoundException, ParsingException
    
def createPermalink(request, objectid):
    try:
        dbsession = request.db
        centroid = Map.getCentroid(objectid, dbsession, 900913)
        return request.host_url + '/vkviewer/?welcomepage=off&z=5&c=%s,%s&oid=%s'%(centroid[0],centroid[1],objectid)
    except NotFoundException:
        raise NotFoundException('Could not create permalink!')
        
@view_config(route_name='permalink', renderer='json', permission='view')
def getPermalinkForObjectid(request):
    """ Contains a permalink url for the given objectid"""
    try:
        log.debug('Receive get permalink request.')
        objectid = request.GET.get('objectid')
        
        # right now we need a bridge hear for moving from old number schema to new one
        parsed_id = parseOAI(objectid)
        
        # create the permalink
        permalink = createPermalink(request, parsed_id)            
        return {'url':permalink}
    except ParsingException as e:
        log.debug(e)
        return {}
    except NotFoundException as e:
        log.error(e)
        log.error(traceback.format_exc())
        raise HTTPNotFound(GENERAL_ERROR_MESSAGE)
    except Exception as e:
        log.error(e)
        log.error(traceback.format_exc())
        raise HTTPBadRequest(GENERAL_ERROR_MESSAGE)
