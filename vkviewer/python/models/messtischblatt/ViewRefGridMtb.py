from vkviewer.python.models.Meta import Base

from sqlalchemy import Column, Integer,  String

class ViewRefGridMtb(Base):
    __tablename__ = 'view_refgridmtb'  
    __table_args__ = {'extend_existing':True}
    blattnr = Column(String(255))
    id = Column(Integer, primary_key=True)
    time = Column(Integer)
    
    @classmethod
    def allForBlattnr(cls, blattnr, session):
        return session.query(ViewRefGridMtb).filter(ViewRefGridMtb.blattnr == blattnr)