'''
Created on May 23, 2014

@author: mendt
'''
from vkviewer.python.models.Meta import Base
from vkviewer.python.models.messtischblatt.Geometry import Geometry
from sqlalchemy import Column, Integer, Boolean, String, DateTime
from sqlalchemy import desc
from sqlalchemy.dialects import postgresql


class Passpoint(Base):
    __tablename__ = 'passpoint'
    __table_args__ = {'extend_existing':True}
    id = Column(Integer, primary_key=True)
    objectid = Column(Integer)
    unrefpoint = Column(postgresql.ARRAY(Integer))
    refpoint = Column(Geometry)
    deprecated = Column(Boolean) 
    timestamp = Column(DateTime(timezone=False))
    userid = Column(Integer)
    georeferenceprocessid = Column(Integer)
    
    @classmethod
    def getCrs(cls):
        return 'EPSG:4314'
    
    @classmethod
    def all(cls, session):
        return session.query(Passpoint).order_by(desc(Passpoint.id))
    
    @classmethod
    def allForObjectId(cls, objectid, session, withDeprecated = True):
        if withDeprecated:
            return session.query(Passpoint).filter(Passpoint.objectid == objectid).order_by(desc(Passpoint.id))
        else:
            return session.query(Passpoint).filter(Passpoint.objectid == objectid).filter(Passpoint.deprecated == False).order_by(desc(Passpoint.id))
    
    @classmethod
    def by_id(cls, id, session):
        return session.query(Passpoint).filter(Passpoint.id == id).first()
    
    @classmethod
    def by_ObjectIdUnrefPointRefPoint(self, objectid, unrefpoint, refpoint, dbsession):
        return dbsession.query(Passpoint).filter(Passpoint.objectid == objectid).filter(Passpoint.unrefpoint == unrefpoint)\
            .filter(Passpoint.refpoint == refpoint).first()
        
    @classmethod
    def doesPasspointExist(cls, passpoint, passpoints):
        for point in passpoints:
            if point.unrefpoint == passpoint.unrefpoint and point.refpoint == passpoint.refpoint:
                return point
        return False
    
    @property
    def refpointAsArray(self):
        refpoint_stripped = self.refpoint[6:-1].split(' ')
        return [float(refpoint_stripped[0]), float(refpoint_stripped[1])] 
    