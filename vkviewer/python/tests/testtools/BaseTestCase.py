import unittest
from pyramid import testing
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, scoped_session
from zope.sqlalchemy import ZopeTransactionExtension

from vkviewer.settings import DBCONFIG_PARAMS

 
class BaseTestCase(unittest.TestCase):
     
    @classmethod
    def setUpClass(cls):     
        sqlalchemy_enginge = 'postgresql+psycopg2://%(user)s:%(password)s@%(host)s:5432/%(db)s'%(DBCONFIG_PARAMS)
        cls.engine = create_engine(sqlalchemy_enginge, encoding='utf8', echo=True)
        cls.Session = scoped_session(sessionmaker(bind=cls.engine,extension=ZopeTransactionExtension()))
        cls.dbsession = cls.Session()

    def tearDown(self):
        testing.tearDown()
    
    def getRequestWithDb(self, request):
        request.db = self.dbsession
        return request
        
