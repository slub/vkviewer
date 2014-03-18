from vkviewer.python.models.Meta import Base

from sqlalchemy import Column, String

class WebMappingService(Base):
    __tablename__ = 'webmappingservice'
    __table_args__ = {'extend_existing':True}
    servicename = Column(String(255), primary_key = True)
    onlineressource = Column(String(255))