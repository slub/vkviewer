import unittest
from pyramid import testing
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, scoped_session
from zope.sqlalchemy import ZopeTransactionExtension

from vkviewer.settings import dbconfig
from vkviewer import db
 
class BaseTestCase(unittest.TestCase):
     
    @classmethod
    def setUpClass(cls):     
        cls.engine = create_engine(dbconfig, encoding='utf8', echo=True)
        cls.Session = scoped_session(sessionmaker(bind=cls.engine,extension=ZopeTransactionExtension()))
        cls.dbsession = cls.Session()

    def tearDown(self):
        testing.tearDown()
    
    def getRequestWithDb(self, request):
        request.db = self.dbsession
        return request
        
