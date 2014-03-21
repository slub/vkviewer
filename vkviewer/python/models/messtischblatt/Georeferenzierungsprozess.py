from vkviewer.python.models.Meta import Base
from sqlalchemy import Column, Integer, Boolean, String, DateTime

class Georeferenzierungsprozess(Base):
    __tablename__ = 'georeferenzierungsprozess'
    __table_args__ = {'extend_existing':True}
    id = Column(Integer, primary_key=True)
    messtischblattid = Column(Integer)
    clipparameter = Column(String(255))
    timestamp = Column(DateTime(timezone=False))
    isvalide = Column(Boolean)
    typevalidierung = Column(String(255))
    nutzerid = Column(String(255))
    refzoomify = Column(Boolean)
    
    @classmethod
    def by_id(cls, id, session):
        return session.query(Georeferenzierungsprozess).filter(Georeferenzierungsprozess.id == id).first()
    
    @classmethod 
    def by_idAndTimestamps(cls, id, timestamp, session):
        return session.query(Georeferenzierungsprozess).filter(Georeferenzierungsprozess.id == id, Georeferenzierungsprozess.timestamp == timestamp).first()

    @classmethod
    def by_messtischblattid(cls, id, session):
        return session.query(Georeferenzierungsprozess).filter(Georeferenzierungsprozess.messtischblattid == id).first()