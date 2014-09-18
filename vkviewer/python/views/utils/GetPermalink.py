from pyramid.view import view_config
from pyramid.httpexceptions import HTTPNotFound, HTTPBadRequest

# database imports
from vkviewer.python.models.messtischblatt.Messtischblatt import Messtischblatt
from vkviewer.python.models.messtischblatt.Map import Map
from vkviewer.python.utils.IdGenerator import parseOAI
from vkviewer.python.utils.exceptions import NotFoundException
from vkviewer import log

ERROR_MSG = "Please check the syntax of your request parameters or contact the administrator."

def mapObjectId(objectid, dbsession):
    """ 
        This function is need for mapping from the new id schema to old one.
        
        objectid {Integer} 
        dbsession {sqlalchemy.orm.session.Session} 
        
    """
    map = Map.by_id(objectid, dbsession)
    return map.apsobjectid
    
def createPermalink(request, objectid):
    try:
        dbsession = request.db
        centroid = Messtischblatt.getCentroid(objectid, dbsession, 900913)
        return request.host_url + '/vkviewer/?welcomepage=off&z=5&c=%s,%s&oid=%s'%(centroid[0],centroid[1],objectid)
    except NotFoundException:
        raise NotFoundException('Could not create permalink!')
        
@view_config(route_name='permalink', renderer='json', permission='view')
def getPermalinkForObjectid(request):
    """ Contains a permalink url for the given objectid"""
    try:
        log.info('Receive get permalink request.')
        objectid = request.GET.get('objectid')
        
        # right now we need a bridge hear for moving from old number schema to new one
        oai = parseOAI(objectid)
        old_objectid = mapObjectId(oai, request.db)
        
        # create the permalink
        permalink = createPermalink(request, old_objectid)            
        return {'url':permalink}
    except NotFoundException as e:
        log.error(e)
        raise HTTPNotFound(ERROR_MSG)
    except Exception as e:
        log.error(e)
        raise HTTPBadRequest(ERROR_MSG)
