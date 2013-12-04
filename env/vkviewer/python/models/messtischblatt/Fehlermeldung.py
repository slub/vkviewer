from vkviewer.python.models.Meta import Base
from sqlalchemy import Column, Integer, String, DateTime

class Fehlermeldung(Base):
    __tablename__ = 'fehlermeldungen'
    __table_args__ = {'extend_existing':True}
    id = Column(Integer, primary_key=True)
    fehlerbeschreibung = Column(String(255))
    objektid = Column(Integer)
    timestamp = Column(DateTime(timezone=False))
    referenz = Column(String(255))
    nutzerid = Column(String(255))  