from vkviewer.python.models.Meta import Base
from vkviewer.python.models.messtischblatt.Geometry import Geometry
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