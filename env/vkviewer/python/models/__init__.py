from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import scoped_session, sessionmaker
from zope.sqlalchemy import ZopeTransactionExtension
 
def initialize_sql(engine):
    Base.metadata.bind = engine
    Base.metadata.create_all(engine)
    
Base = declarative_base()




    


