from vkviewer.python.models.Meta import Base

from sqlalchemy import Column, Integer, String, DateTime, desc

class Metadata(Base):
    __tablename__ = 'metadata'
    __table_args__ = {'extend_existing':True}
    mapid = Column(Integer, primary_key=True)
    title = Column(String(255))
    titleshort = Column(String(70))
    serientitle = Column(String(255))
    description = Column(String(255))
    measures = Column(String(255))
    scale = Column(String(255))
    type = Column(String(255))
    technic = Column(String(255))
    ppn = Column(String(255))
    apspermalink = Column(String(255))
    imagelicence = Column(String(255))
    imageowner = Column(String(255))
    imagejpg = Column(String(255))
    imagezoomify = Column(String(255))
    timepublish = Column(DateTime(timezone=False))
    blattnr = Column(String(10))
    thumbssmall = Column(String(255))
    thumbsmid = Column(String(255))
    
    @classmethod
    def by_id(cls, id, session):
        return session.query(Metadata).filter(Metadata.mapid == id).first()
    
    @classmethod
    def all_byBlattnr(cls, blattnr, session):
        return session.query(Metadata).filter(Metadata.blattnr == blattnr).order_by(desc(Metadata.mapid))