import unittest
from pyramid import testing
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, scoped_session
from zope.sqlalchemy import ZopeTransactionExtension
from ...settings import dbconfig
from ...__init__ import db
 
class BaseTestCase(unittest.TestCase):
     
    @classmethod
    def setUpClass(cls):     
        cls.engine = create_engine(dbconfig, encoding='utf8', echo=True)
        cls.Session = scoped_session(sessionmaker(bind=cls.engine,extension=ZopeTransactionExtension()))

    def tearDown(self):
        testing.tearDown()
    
    def getRequestWithDb(self, request):
        request.db = self.config.registry.dbmaker()  
        return request
        
        
    