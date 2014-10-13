import unittest, logging
from sqlalchemy.orm.session import Session
from vkviewer.python.utils.logger import createLogger
from georeference.settings import DBCONFIG_PARAMS
from georeference.utils.tools import loadDbSession

class ToolsTest(unittest.TestCase):

    @classmethod
    def setUpClass(cls):   
        print '=============='
        print 'Start tools tests ...'
        print '=============='
        cls.logger = createLogger(name = 'Tools', level = logging.INFO)
        
    def testloadDbSession(self):
        
        print "--------------------------------------------------------------------------------------------"
        print "\n"
        print "Test if database connection is initialize correctly ..." 
        
        response = loadDbSession(DBCONFIG_PARAMS, self.logger)        
        print "Response - %s"%response
        self.assertTrue(isinstance(response, Session), "Response is not of type like expected ...")