from sqlalchemy.ext.declarative import declarative_base

#DBSession = scoped_session(sessionmaker(extension=ZopeTransactionExtension()))
Base = declarative_base()

def initialize_sql(engine):
    Base.metadata.bind = engine
    Base.metadata.create_all(engine)
