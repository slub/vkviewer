import unittest
import json
 
from pyramid import testing
from pyramid.config import Configurator
from ...views import getTimestamps_forBlattnr
from ..__init__ import BaseTestCase
 
class ViewGettimestampsTests(BaseTestCase):
     
    def setUp(self):     
        self.config = testing.setUp()   
        self.config.registry.dbmaker = self.Session       
         
    def tearDown(self):
        testing.tearDown()
    
    def testGetTimestamps_forBlattnr_Passed(self):
        params = {'blattnr':'51_49'}
        request = self.getRequestWithDb(testing.DummyRequest(params=params, post=params))
        result = getTimestamps_forBlattnr(request)
        
        print "Test: testGetTimestamps_forBlattnr_Passed - Result: %s"%result
        
        self.assertIsInstance(result, str)
        
        resultJson = json.loads(result)
        self.assertIsInstance(resultJson['timestamps'], unicode)
        self.assertEqual(resultJson['timestamps'], "1943,1925,1915,1913,1906,")
        self.assertIsInstance(resultJson['occurence'], int)
        self.assertEqual(resultJson['occurence'], 5)
        
    def testGetTimestamps_forBlattnr_Failed_Empty_1(self):
        params = {'blattnr':'40_40'}
        request = self.getRequestWithDb(testing.DummyRequest(params=params, post=params))
        result = getTimestamps_forBlattnr(request)
         
        print "Test: testGetTimestamps_forBlattnr_Failed_Empty_1 - Result: %s"%result

        self.assertIsInstance(result, str)
        
        resultJson = json.loads(result)
        self.assertIsInstance(resultJson['timestamps'], unicode)
        self.assertEqual(resultJson['timestamps'], "")
        self.assertIsInstance(resultJson['occurence'], int)
        self.assertEqual(resultJson['occurence'], 0)
         
    def testGetTimestamps_forBlattnr_Failed_Empty_2(self):
        params = {'blattnr':'SELECT * FROM view_refgridmtb;'}
        request = self.getRequestWithDb(testing.DummyRequest(params=params, post=params))
        result = getTimestamps_forBlattnr(request)
          
        print "Test: testGetTimestamps_forBlattnr_Failed_Empty_2 - Result: %s"%result

        resultJson = json.loads(result)
        self.assertIsInstance(resultJson['timestamps'], unicode)
        self.assertEqual(resultJson['timestamps'], "")
        self.assertIsInstance(resultJson['occurence'], int)
        self.assertEqual(resultJson['occurence'], 0)
        