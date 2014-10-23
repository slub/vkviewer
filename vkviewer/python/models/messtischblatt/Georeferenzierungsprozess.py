import json
from vkviewer.python.models.Meta import Base
from sqlalchemy import Column, Integer, Boolean, String, DateTime, desc, asc, PickleType

class JsonPickleType(PickleType):
    impl = String
    
class Georeferenzierungsprozess(Base):
    __tablename__ = 'georeferenzierungsprozess'
    __table_args__ = {'extend_existing':True}
    id = Column(Integer, primary_key=True)
    messtischblattid = Column(Integer)
    georefparams = Column(JsonPickleType(pickler=json))
    clipparameter = Column(String(255))
    timestamp = Column(DateTime(timezone=False))
    type = Column(String(255))
    nutzerid = Column(String(255))
    refzoomify = Column(Boolean)
    processed = Column(Boolean)
    isactive = Column(Boolean)
    overwrites = Column(Integer)
    adminvalidation = Column(String(20))
    mapid = Column(Integer)
    
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
            .filter(Georeferenzierungsprozess.adminvalidation != 'invalide')\
            .order_by(asc(Georeferenzierungsprozess.timestamp))
            
    @classmethod
    def by_getUnprocessedGeorefProcessesTypeOfNew(cls, session):
        return session.query(Georeferenzierungsprozess).filter(Georeferenzierungsprozess.processed == False)\
            .filter(Georeferenzierungsprozess.adminvalidation != 'invalide')\
            .filter(Georeferenzierungsprozess.type == 'new')\
            .filter(Georeferenzierungsprozess.overwrites == 0)\
            .order_by(asc(Georeferenzierungsprozess.timestamp))
            
    @classmethod
    def by_getUnprocessedGeorefProcessesTypeOfUpdate(cls, session):
        return session.query(Georeferenzierungsprozess).filter(Georeferenzierungsprozess.processed == False)\
            .filter(Georeferenzierungsprozess.adminvalidation != 'invalide')\
            .filter(Georeferenzierungsprozess.type == 'update')\
            .filter(Georeferenzierungsprozess.overwrites > 0)\
            .order_by(asc(Georeferenzierungsprozess.timestamp))

    @classmethod
    def by_getOverwriteIdsOfUnprocessedGeorefProcessesTypeOfUpdate(cls, session):
        query_overwrites = session.query(Georeferenzierungsprozess.overwrites).filter(Georeferenzierungsprozess.processed == False)\
            .filter(Georeferenzierungsprozess.adminvalidation != 'invalide')\
            .filter(Georeferenzierungsprozess.type == 'update')\
            .filter(Georeferenzierungsprozess.overwrites > 0)\
            .group_by(Georeferenzierungsprozess.overwrites)
        
        # sort jobs by overwrite id
        overwrites = []
        for tuple in query_overwrites:
            overwrites.append(tuple[0])
        return overwrites
            
    @classmethod    
    def getLatestGeorefProcessForObjectId(cls, id, session):
        return session.query(Georeferenzierungsprozess).filter(Georeferenzierungsprozess.messtischblattid == id).order_by(desc(Georeferenzierungsprozess.timestamp)).first()
    
    @classmethod
    def getActualGeoreferenceProcessForMapId(cls, mapId, session):
        return session.query(Georeferenzierungsprozess).filter(Georeferenzierungsprozess.mapid == mapId)\
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
        georefProcess = session.query(Georeferenzierungsprozess).filter(Georeferenzierungsprozess.mapid == mapId)\
            .filter(Georeferenzierungsprozess.isactive == True)\
            .order_by(desc(Georeferenzierungsprozess.timestamp)).first()
        if georefProcess is None:
            return False
        return True
    
    @classmethod
    def arePendingProcessForMapId(cls, mapId, session):
        # at first get the actual overwrite id
        actualOverwriteId = cls.getActualGeoreferenceProcessForMapId(mapId, session).id
        georefProcesses = session.query(Georeferenzierungsprozess).filter(Georeferenzierungsprozess.mapid == mapId)\
            .filter(Georeferenzierungsprozess.overwrites == actualOverwriteId)\
            .filter(Georeferenzierungsprozess.isactive == False).all()
        if len(georefProcesses) > 0:
            return True
        return False