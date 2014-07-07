'''
Created on Mar 6, 2014

@author: mendt
'''
import unittest, logging
from vkviewer.settings import DBCONFIG,DBCONFIG_PARAMS
from vkviewer.python.utils.logger import createLogger
from vkviewer.python.models.Meta import initializeDb
from vkviewer.python.scripts.UpdateVirtualdatasets import updateVirtualdatasetForTimestamp#getProcessQueue


class TestUpdateVirtualdatasets(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.sqlalchemy_logger = createLogger('sqlalchemy.engine', logging.DEBUG)
        cls.logger = createLogger('TestUpdateGeorefDataSources', logging.DEBUG)
        cls.dbsession = initializeDb(DBCONFIG)

    def testProcessUpdateProcessForTimestamp(self):
        response = updateVirtualdatasetForTimestamp('1868-01-01 00:00:00', DBCONFIG_PARAMS, self.dbsession, self.logger, testing=True)
        self.assertIsNone(response, 'Response is not "None" like expected.')
        
        response = updateVirtualdatasetForTimestamp('1900-01-01 00:00:00', DBCONFIG_PARAMS, self.dbsession, self.logger, testing=True)
        self.assertTrue(isinstance(response, str), 'Response is not a "string" like expected.')

if __name__ == "__main__":
    #import sys;sys.argv = ['', 'Test.testName']
    unittest.main()