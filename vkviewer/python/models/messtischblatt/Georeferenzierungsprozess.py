from vkviewer.python.models.Meta import Base
from sqlalchemy import Column, Integer, Boolean, String, DateTime, desc, asc

class Georeferenzierungsprozess(Base):
    __tablename__ = 'georeferenzierungsprozess'
    __table_args__ = {'extend_existing':True}
    id = Column(Integer, primary_key=True)
    messtischblattid = Column(Integer)
    georefparams = Column(String(255))
    timestamp = Column(DateTime(timezone=False))
    type = Column(String(255))
    nutzerid = Column(String(255))
    refzoomify = Column(Boolean)
    processed = Column(Boolean)
    isactive = Column(Boolean)
    overwrites = Column(Integer)
    adminvalidation = Column(String(20))
    mapsid = Column(Integer)
    
    @classmethod
    def all(cls, session):
        return session.query(Georeferenzierungsprozess).order_by(desc(Georeferenzierungsprozess.id))
    
    @classmethod
    def by_id(cls, id, session):
        return session.query(Georeferenzierungsprozess).filter(Georeferenzierungsprozess.id == id).first()
    
    @classmethod 
    def by_idAndTimestamps(cls, id, timestamp, session):
        return session.query(Georeferenzierungsprozess).filter(Georeferenzierungsprozess.id == id, Georeferenzierungsprozess.timestamp == timestamp).first()

    @classmethod
    def by_messtischblattid(cls, id, session, latest = False):
        if latest:
            return session.query(Georeferenzierungsprozess).filter(Georeferenzierungsprozess.messtischblattid == id).order_by(desc(Georeferenzierungsprozess.timestamp)).first()
        return session.query(Georeferenzierungsprozess).filter(Georeferenzierungsprozess.messtischblattid == id).first()
    
    @classmethod
    def by_getNewGeorefProcessForObjectId(cls, id, session):
        return session.query(Georeferenzierungsprozess).filter(Georeferenzierungsprozess.messtischblattid == id)\
            .filter(Georeferenzierungsprozess.type == 'New')\
            .order_by(desc(Georeferenzierungsprozess.timestamp))
            
    # @deprecated
    @classmethod
    def by_getLatestValidGeorefProcessForObjectId(cls, id, session):
        return session.query(Georeferenzierungsprozess).filter(Georeferenzierungsprozess.messtischblattid == id)\
            .filter(Georeferenzierungsprozess.publish == True)\
            .order_by(desc(Georeferenzierungsprozess.timestamp)).first()
                                 
    @classmethod
    def by_getUnprocessedGeorefProcesses(cls, session):
        return session.query(Georeferenzierungsprozess).filter(Georeferenzierungsprozess.processed == False)\
            .filter(Georeferenzierungsprozess.adminvalidation != 'invalide')

    @classmethod    
    def getLatestGeorefProcessForObjectId(cls, id, session):
        return session.query(Georeferenzierungsprozess).filter(Georeferenzierungsprozess.messtischblattid == id).order_by(desc(Georeferenzierungsprozess.timestamp)).first()
    
    @classmethod
    def getActualGeoreferenceProcessForMapId(cls, mapId, session):
        return session.query(Georeferenzierungsprozess).filter(Georeferenzierungsprozess.mapsid == mapId)\
            .filter(Georeferenzierungsprozess.isactive == True).first()
    
    @classmethod
    def getResetJobs(cls, session):
        return session.query(Georeferenzierungsprozess).filter(Georeferenzierungsprozess.isactive == True)\
            .filter(Georeferenzierungsprozess.adminvalidation == 'invalide')
            
    @classmethod
    def getJobsWithSameOverwrites(cls, overwrites, session):
        return session.query(Georeferenzierungsprozess).filter(Georeferenzierungsprozess.overwrites == overwrites)\
            .order_by(desc(Georeferenzierungsprozess.timestamp))
            
    @classmethod
    def isGeoreferenced(cls, mapId, session):
        georefProcess = session.query(Georeferenzierungsprozess).filter(Georeferenzierungsprozess.mapsid == mapId)\
            .filter(Georeferenzierungsprozess.isactive == True)\
            .order_by(desc(Georeferenzierungsprozess.timestamp)).first()
        if georefProcess is None:
            return False
        return True
    
    @classmethod
    def arePendingProcessForMapId(cls, mapId, session):
        # at first get the actual overwrite id
        actualOverwriteId = cls.getActualGeoreferenceProcessForMapId(mapId, session).id
        georefProcesses = session.query(Georeferenzierungsprozess).filter(Georeferenzierungsprozess.mapsid == mapId)\
            .filter(Georeferenzierungsprozess.overwrites == actualOverwriteId)\
            .filter(Georeferenzierungsprozess.isactive == False).all()
        if len(georefProcesses) > 0:
            return True
        return False