from vkviewer.python.models.Meta import Base
from vkviewer.python.models.messtischblatt.Geometry import Geometry
from vkviewer.python.georef.geometry import createBBoxFromPostGISString
from sqlalchemy import Column, Integer, Boolean, String

class Map(Base):
    __tablename__ = 'maps'
    __table_args__ = {'extend_existing':True}
    id = Column(Integer, primary_key=True)
    apsobjectid = Column(Integer)
    apsdateiname = Column(String(255))
    originalimage = Column(String(255))
    georefimage = Column(String(255))
    isttransformiert = Column(Boolean)
    istaktiv = Column(Boolean)
    maptype = Column(String(255))
    hasgeorefparams = Column(Integer)
    boundingbox = Column(Geometry)    
    
    @classmethod
    def by_id(cls, id, session):
        return session.query(Map).filter(Map.id == id).first()
    
    @classmethod
    def by_apsObjectId(cls, apsObjectId, session):
        return session.query(Map).filter(Map.apsobjectid == apsObjectId).first()
    
    @classmethod
    def getBoundingBoxObjWithEpsg(cls, id, session, epsg=4314):
        query = 'SELECT st_astext(st_transform(boundingbox,  %s)) FROM maps WHERE id = %s'%(epsg, id)
        pg_geometry = session.execute(query,{'id':id}).fetchone()[0]
        return createBBoxFromPostGISString(pg_geometry, epsg)