'''
Created on Jan 17, 2014

@author: mendt
'''
from sqlalchemy import Column, Integer

from vkviewer.python.models.Meta import Base

class RefMtbLayer(Base):
    __tablename__ = 'refmtblayer'
    __table_args__ = {'extend_existing':True}
    layer = Column(Integer, primary_key=True)
    messtischblatt = Column(Integer, primary_key=True)
    
    @classmethod
    def by_id(cls, layerid, mtbid, session):
        return session.query(RefMtbLayer).filter(RefMtbLayer.layer == layerid).filter(RefMtbLayer.messtischblatt == mtbid).first()

