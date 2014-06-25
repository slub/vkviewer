from vkviewer.python.models.Meta import Base

from sqlalchemy import Column, Integer, String, desc

class MetadatenBildmedium(Base):
    __tablename__ = 'md_bildmedium'
    __table_args__ = {'extend_existing':True}
    id = Column(Integer, primary_key=True)
    art = Column(String(255))
    eigentuemer = Column(String(255))
    dateiname = Column(String(255))
    zoomify = Column(String(255))
    alte_bildnummer = Column(Integer)
    farbe = Column(String(255))
    aufnahmejahr = Column(Integer)
    typ = Column(String(255))
    
    @classmethod
    def by_id(cls, id, session):
        return session.query(MetadatenBildmedium).filter(MetadatenBildmedium.id == id).first()
    
    @classmethod
    def all(cls, session):
        return session.query(MetadatenBildmedium).order_by(desc(MetadatenBildmedium.id))