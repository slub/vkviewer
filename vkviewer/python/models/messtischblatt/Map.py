from sqlalchemy import Column, Integer, Boolean, String
from sqlalchemy import desc
from vkviewer.python.models.Meta import Base
from vkviewer.python.models.messtischblatt.Geometry import Geometry
from vkviewer.python.georef.geometry import createBBoxFromPostGISString


class Map(Base):
    __tablename__ = 'map'
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
    def all(cls, session):
        return session.query(Map).order_by(desc(Map.id))
        
    @classmethod
    def by_id(cls, id, session):
        return session.query(Map).filter(Map.id == id).first()
    
    @classmethod
    def by_apsObjectId(cls, apsObjectId, session):
        return session.query(Map).filter(Map.apsobjectid == apsObjectId).first()
    
    @classmethod
    def getBoundingBoxObjWithEpsg(cls, id, session, epsg=4314):
        query = 'SELECT st_astext(st_transform(boundingbox,  %s)) FROM map WHERE id = %s'%(epsg, id)
        pg_geometry = session.execute(query,{'id':id}).fetchone()[0]
        return createBBoxFromPostGISString(pg_geometry, epsg)
    
    @classmethod
    def getExtent(cls, id, session, epsg=4314):
        query = 'SELECT st_extent(st_transform(boundingbox, %s)) FROM map WHERE id = :id;'%epsg
        pg_extent = session.execute(query,{'id':id}).fetchone()[0]
        extent = pg_extent.replace(' ',',')[4:-1].split(',')
        parsed_extent = []
        for i in range(0,len(extent)):
            parsed_extent.append(float(extent[i]))
        return parsed_extent
    
    @classmethod
    def getCentroid(cls, id, session, epsg=4314):
        # Used for creating a permalink
        query = 'SELECT st_astext(st_centroid(st_transform(boundingbox, %s))) FROM map WHERE id = %s'%(epsg, id)
        pg_centroid = session.execute(query,{'id':id}).fetchone()[0]
        centroid = pg_centroid[6:-1].split(' ')
        parsed_centroid = []
        for i in range(0,len(centroid)):
            parsed_centroid.append(float(centroid[i]))
        return parsed_centroid
    
    @classmethod
    def getCentroid_byApsObjectid(cls, id, session, epsg=4314):
        # Used for creating a permalink
        query = 'SELECT st_astext(st_centroid(st_transform(boundingbox, %s))) FROM map WHERE apsobjectid = %s'%(epsg, id)
        pg_centroid = session.execute(query,{'id':id}).fetchone()[0]
        centroid = pg_centroid[6:-1].split(' ')
        parsed_centroid = []
        for i in range(0,len(centroid)):
            parsed_centroid.append(float(centroid[i]))
        return parsed_centroid
    
    @classmethod
    def getBox2d(cls, id, session, epsg=4314):
        query = 'SELECT box2d(st_transform(map.boundingbox, %s)) as box FROM map WHERE id = %s'%(epsg, id)
        return session.execute(query).fetchone()[0]
