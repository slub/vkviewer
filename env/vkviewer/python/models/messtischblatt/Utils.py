from vkviewer.python.models.Meta import Base
from vkviewer.python.models.messtischblatt.Messtischblatt import Messtischblatt
from vkviewer.python.models.messtischblatt.MetadatenCore import MetadatenCore
from webhelpers.paginate import PageURL_WebOb, Page


''' Specific query operations '''
def getWmsUrlForMtb(mtbid, session):
    query = 'SELECT webmappingservice.onlineressource FROM webmappingservice, refmtbwms WHERE \
                    refmtbwms.messtischblatt = :mtbid AND webmappingservice.servicename = \
                    refmtbwms.webmappingservice;'
    result = session.execute(query,{'mtbid':mtbid}).fetchone()
    return result['onlineressource']

""" This function computes via a SQL Query the total number of messtischblaetter, which
    are right now published for georeferencing
    @parma session - {SQLAlchemy.SessionObject} 
"""

def getCountOfPublishedMesstischblaetter(session):
    query = 'SELECT count(istaktiv) FROM messtischblatt WHERE istaktiv = True'
    result = session.execute(query).fetchone()
    return result['count']    

"""  This function computes via a SQL Query the occurrence of georeferenced 
     messtischblaetter. 
     
     @param session - {SQLAlchemy.SessionObject}
"""
def getCountOfGeorefMesstischblaetter(session):
    query = 'SELECT count(isttransformiert) FROM messtischblatt WHERE isttransformiert = True'
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
def getZoomifyCollectionForBlattnr(request, blattnr, session, page=1):
    coll = []
    mtbs = Messtischblatt.allForBlattnr(blattnr, session)
    for mtb in mtbs:
        metadata = MetadatenCore.by_id(mtb.id, session)
        if mtb.mdtype == 'M' and mtb.istaktiv:
            item = {'mtbid':mtb.id,'layername':mtb.dateiname,'titel':metadata.titel,'titel_short':metadata.titel_short,
                    'zoomify_prop':mtb.zoomify_properties,'zoomify_width':mtb.zoomify_width,'zoomify_height':mtb.zoomify_height}
            coll.append(item)
    # create paginator
    page_url = PageURL_WebOb(request)
    return Page(coll, page, url=page_url, items_per_page=10)

def getCollectionForBlattnr(blattnr, session):
    coll =[]
    mtbs = Messtischblatt.allForBlattnr(blattnr, session)
    for mtb in mtbs:
        wms_url = getWmsUrlForMtb(mtb.id, session)
        metadata = MetadatenCore.by_id(mtb.id, session)
        item = {'wms_url':wms_url,'mtbid':mtb.id,'layername':mtb.dateiname,'titel':metadata.titel,
                'zoomify_prop':mtb.zoomify_properties,'zoomify_width':mtb.zoomify_width,
                'zoomify_height':mtb.zoomify_height}
        coll.append(item)
    return coll

def getPaginatorForBlattnr(request, blattnr, session, page=1):
    page_url = PageURL_WebOb(request)
    
    # get the collection for the paginator
    pageinateColl = getCollectionForBlattnr(blattnr, session)
    return Page(pageinateColl, page, url=page_url, items_per_page=10)