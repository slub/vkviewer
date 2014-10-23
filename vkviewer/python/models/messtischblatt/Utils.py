from vkviewer.python.models.Meta import Base
from vkviewer.python.models.messtischblatt.Map import Map
from vkviewer.python.models.messtischblatt.Metadata import Metadata
from webhelpers.paginate import PageURL_WebOb, Page


''' Specific query operations '''

""" This function computes via a SQL Query the total number of messtischblaetter, which
    are right now published for georeferencing
    @parma session - {SQLAlchemy.SessionObject} 
"""

def getCountOfPublishedMaps(session):
    query = 'SELECT count(istaktiv) FROM map WHERE istaktiv = True'
    result = session.execute(query).fetchone()
    return result['count']    
 
"""  This function computes via a SQL Query the occurrence of georeferenced 
     messtischblaetter. 
      
     @param session - {SQLAlchemy.SessionObject}
"""
def getCountOfGeorefMaps(session):
    query = 'SELECT count(isttransformiert) FROM map WHERE isttransformiert = True'
    result = session.execute(query).fetchone()
    return result['count']

""" This function creates a paginator object, which represents a list of messtischblaett objects 
    plus information over his zoomify representation for a given blattnumber. It will only choose
    such messtischblaetter which are not georeferenced yet.
    
    @param request - {Pyramid.Request}
    @param blattnr - {Messtischblatt.blattnr}
    @param session - {SQLAlchemy.SessionObject}
    @param page - {Integer}
    @return {Paginator} 
"""
# def getZoomifyCollectionForBlattnr(request, blattnr, session, page=1):
#     coll = []
#     metadata = Metadata.all_byBlattnr(blattnr, session)
#     for record in metadata:
#         map = Map.by_id(record.mapid, session)
#         if map.istaktiv and not map.isttransformiert and map.hasgeorefparams == 0:
#             item = {'mapid':map.id,'name':map.apsdateiname,'title':record.title,'title_short':record.titleshort,
#                     'zoomify':record.imagezoomify}
#             coll.append(item)
#     # create paginator
#     page_url = PageURL_WebOb(request)
#     return Page(coll, page, url=page_url, items_per_page=10)


# def getPaginatorForBlattnr(request, blattnr, session, page=1):
#     page_url = PageURL_WebOb(request)
#     
#     # get the collection for the paginator
#     pageinateColl = getCollectionForBlattnr(blattnr, session)
#     return Page(pageinateColl, page, url=page_url, items_per_page=10)