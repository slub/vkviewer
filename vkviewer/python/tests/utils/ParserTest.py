'''
Created on May 23, 2014

@author: mendt
'''
import unittest
from pyramid import testing
from vkviewer.python.tests.utils.BaseTestCase import BaseTestCase
from vkviewer.python.utils.parser import getJsonDictPasspointsForMapObject

class ParserTest(BaseTestCase):

    def setUp(self):     
        self.config = testing.setUp()   
        self.config.registry.dbmaker = self.Session  
         
    def tearDown(self):
        testing.tearDown() 
        
    def testGetJsonDictPasspointsForMapObject(self):
        request = self.getRequestWithDb(testing.DummyRequest())
        response = getJsonDictPasspointsForMapObject(71056316, request.db)
        
        print '-------------------------------------'
        print 'Test response for getJsonDictPasspointsForMapObject'
        print response
        print '-------------------------------------'
        
        self.assertTrue(isinstance(response, dict), 'Test response has not expected type.')
            

def test_suite():
    suite = unittest.TestSuite()
    loader = unittest.TestLoader()
    suite.addTests(loader.loadTestsFromTestCase(ParserTest))
    return suite

if __name__ == '__main__':
    unittest.TextTestRunner(verbosity=2).run(test_suite())