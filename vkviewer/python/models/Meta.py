from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import scoped_session, sessionmaker
from zope.sqlalchemy import ZopeTransactionExtension
 
def initialize_sql(engine):
    Base.metadata.bind = engine
    Base.metadata.create_all(engine)
    
def initializeDb(sqlalchemy_engine):
    engine = create_engine(sqlalchemy_engine, encoding='utf8', echo=True)
    DBSession = sessionmaker(bind=engine)
    Base.metadata.bind = engine
    Base.metadata.create_all(engine)
    return DBSession()

Base = declarative_base()