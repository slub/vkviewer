from vkviewer.python.models.Meta import Base

from sqlalchemy import Column, Integer,  String

class VBlattschnittMtb(Base):
    __tablename__ = 'vblattschnittmtb'  
    __table_args__ = {'extend_existing':True}
    blattnr = Column(String(255))
    mapid = Column(Integer, primary_key=True)
    time = Column(Integer)
    
    @classmethod
    def allForBlattnr(cls, blattnr, session):
        return session.query(VBlattschnittMtb).filter(VBlattschnittMtb.blattnr == blattnr)