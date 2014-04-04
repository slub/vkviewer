from vkviewer.python.models.Meta import Base
from sqlalchemy import Column, Integer, Boolean, String, DateTime

class MdZeit(Base):
    __tablename__ = 'md_zeit'
    __table_args__ = {'extend_existing':True}
    gid = Column(Integer, primary_key=True)
    id = Column(Integer)
    typ = Column(String(255))
    art = Column(String(255))
    datierung = Column(Integer)
    time = Column(DateTime(timezone=False))
    
    @classmethod
    def by_id(cls, id, session):
        return session.query(MdZeit).filter(MdZeit.id == id).filter(MdZeit.typ == 'a5064').first()