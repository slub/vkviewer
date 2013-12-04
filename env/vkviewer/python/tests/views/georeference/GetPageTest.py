import unittest
import json
 
from pyramid import testing
from webhelpers.paginate import Page
from vkviewer.python.views.georeference.GetPage import getPage_chooseGeorefMtb
from vkviewer.python.tests import BaseTestCase
 
class ViewGetPage_chooseGeorefMtbTests(BaseTestCase):
     
    def setUp(self):     
        self.config = testing.setUp()   
        self.config.registry.dbmaker = self.Session       
         
    def tearDown(self):
        testing.tearDown()
    
    def testGetPage_chooseGeorefMtb_Passed_1(self):
        params = {'blattnr':'46_48'}
        request = self.getRequestWithDb(testing.DummyRequest(params=params, post=params))
        result = getPage_chooseGeorefMtb(request)         
        print "Test: testGetTimestamps_forBlattnr_Passed_1 - Result: %s"%result        
        self.assertTrue(isinstance(result['paginator'], Page))

    def testGetPage_chooseGeorefMtb_Passed_2(self):
        params = {'blattnr':'100_100'}
        request = self.getRequestWithDb(testing.DummyRequest(params=params, post=params))
        result = getPage_chooseGeorefMtb(request)         
        print "Test: testGetTimestamps_forBlattnr_Passed_2 - Result: %s"%result        
        self.assertTrue(isinstance(result['paginator'], Page))
        
    def testGetPage_chooseGeorefMtb_Fail_MissingParams(self):
        request = self.getRequestWithDb(testing.DummyRequest())
        result = getPage_chooseGeorefMtb(request)         
        print "Test: testGetPage_chooseGeorefMtb_Fail_MissingParams - Result: %s"%result        
        self.assertTrue(isinstance(result, dict))
        
