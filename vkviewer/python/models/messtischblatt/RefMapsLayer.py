'''
Created on Jan 17, 2014

@author: mendt
'''
from sqlalchemy import Column, Integer

from vkviewer.python.models.Meta import Base

class RefMapsLayer(Base):
    __tablename__ = 'refmapslayer'
    __table_args__ = {'extend_existing':True}
    layerid = Column(Integer, primary_key=True)
    mapid = Column(Integer, primary_key=True)
    
    @classmethod
    def by_id(cls, layerid, mapid, session):
        return session.query(RefMapsLayer).filter(RefMapsLayer.layerid == layerid).filter(RefMapsLayer.mapid == mapid).first()

