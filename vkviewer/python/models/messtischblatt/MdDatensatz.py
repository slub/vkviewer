from vkviewer.python.models.Meta import Base
from sqlalchemy import Column, Integer, String

class MdDatensatz(Base):
    __tablename__ = 'md_datensatz'
    __table_args__ = {'extend_existing':True}
    id = Column(Integer, primary_key=True)
    urheber_institution = Column(String(255))
    urheber_personen = Column(String(255))
    bildrechte = Column(String(255))
    kategorie_1 = Column(String(255))
    kategorie_2 = Column(String(255))
    permalink = Column(String(255))
    
    @classmethod
    def by_ObjectId(cls, id, session):
        return session.query(MdDatensatz).filter(MdDatensatz.id == id).first()