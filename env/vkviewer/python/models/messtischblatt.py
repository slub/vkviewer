from ..models import Base
from sqlalchemy import Column, Integer, Boolean, String, DateTime, BINARY 
from sqlalchemy.types import UserDefinedType
from sqlalchemy import func, desc, ForeignKey
from sqlalchemy.orm import relationship, backref

from webhelpers.paginate import PageURL_WebOb, Page
from webhelpers.text import urlify

class Geometry(UserDefinedType):   
    def get_col_spec(self):
        return "GEOMETRY"
    
    def bind_expression(self, bindvalue):
        return func.ST_GeomFromText(bindvalue, type_=self)
    
    def column_expression(self, col):
        return func.ST_AsText(col, type_=self)

class Messtischblatt(Base):
    __tablename__ = 'messtischblatt'
    id = Column(Integer, primary_key=True)
    blattnr = Column(String(255))
    dateiname = Column(String(255))
    verzeichnispfad = Column(String(255))
    archivpfad = Column(String(255))
    isttransformiert = Column(Boolean)
    istkomprimiert = Column(Boolean)
    istaktiv = Column(Boolean)
    mdtype = Column(String(255))
    hasgeorefparams = Column(Integer)
    archivpfad_vk2 = Column(String(255))
    verzeichnispfad_original = Column(String(255))
    hasjpeg = Column(Boolean)
    jpegpath = Column(String(255))
    zoomify_properties = Column(String(255))
    zoomify_width = Column(Integer)
    zoomify_height = Column(Integer)
    
    @classmethod
    def all(cls, session):
        return session.query(Messtischblatt).order_by(desc(Messtischblatt.id))
    
    @classmethod
    def allForBlattnr(cls, blattnr, session):
        return session.query(Messtischblatt).filter(Messtischblatt.blattnr == blattnr).order_by(desc(Messtischblatt.id))
    
    @classmethod
    def by_id(cls, id, session):
        return session.query(Messtischblatt).filter(Messtischblatt.id == id).first()
    
    @classmethod
    def get_paginator_forBlattnr(cls, request, blattnr, page=1):
        page_url = PageURL_WebOb(request)
        return Page([{'mtbid':1},{'mtbid':2},{'mtbid':3},{'mtbid':4}], page, url=page_url, items_per_page=10)
        #return Page(Messtischblatt.all(), page, url=page_url, items_per_page=10)
    
    @property
    def slug(self):
        return urlify(self.dateiname)
 
    @property
    def boundingbox(self, session):
        query = 'SELECT st_astext(boundingbox) FROM messtischblatt WHERE id = :id;'
        return session.execute(query,{'id':self.id}).fetchone()[0]

class ViewRefGridMtb(Base):
    __tablename__ = 'view_refgridmtb'    
    blattnr = Column(String(255))
    id = Column(Integer, primary_key=True)
    time = Column(Integer)
    
    @classmethod
    def allForBlattnr(cls, blattnr, session):
        return session.query(ViewRefGridMtb).filter(ViewRefGridMtb.blattnr == blattnr)

class MetadatenCore(Base):
    __tablename__ = 'md_core'
    id = Column(Integer, primary_key=True)
    titel = Column(String(255))
    serientitel = Column(String(255))
    gattung = Column(String(255))
    sachbegriffe = Column(String(255))
    beschreibung = Column(String(255))
    technik = Column(String(255))
    masse = Column(String(255))
    massstab = Column(String(255))
    schlagworte = Column(String(255))
    ppn = Column(String(255))
    
    @classmethod
    def by_id(cls, id, session):
        return session.query(MetadatenCore).filter(MetadatenCore.id == id).first()
           
class WebMappingService(Base):
    __tablename__ = 'webmappingservice'
    servicename = Column(String(255), primary_key = True)
    onlineressource = Column(String(255))

class Georeferenzierungsprozess(Base):
    __tablename__ = 'georeferenzierungsprozess'
    id = Column(Integer, primary_key=True)
    messtischblattid = Column(Integer)
    clipparameter_pure = Column(String(255))
    timestamp = Column(DateTime(timezone=False))
    isvalide = Column(Boolean)
    typevalidierung = Column(String(255))
    nutzerid = Column(String(255))
    
    @classmethod
    def by_id(cls, id, session):
        return session.query(Georeferenzierungsprozess).filter(Georeferenzierungsprozess.id == id).first()



        
#class RefMtbWms(Base):
#    __tablename__ = 'refmtbwms'
#    messtischblatt = Column(Integer, primary_key = True,ForeignKey('messtischblatt.id'))
#    webmappingservice = Column(Unicode(255), primary_key = True, ForeignKey('webmappingservice.servicename'))

''' Specific query operations '''
def getWmsUrlForMtb(mtbid, session):
    query = 'SELECT webmappingservice.onlineressource FROM webmappingservice, refmtbwms WHERE \
                    refmtbwms.messtischblatt = :mtbid AND webmappingservice.servicename = \
                    refmtbwms.webmappingservice;'
    result = session.execute(query,{'mtbid':mtbid}).fetchone()
    return result['onlineressource']

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
