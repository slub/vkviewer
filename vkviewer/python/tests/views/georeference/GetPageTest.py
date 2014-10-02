import unittest
import json
 
from pyramid import testing
from webhelpers.paginate import Page
from vkviewer.python.views.georeference.GetPage import getGeoreferencePage
from vkviewer.python.tests.testtools.BaseTestCase import BaseTestCase
 
class GetPageTest(BaseTestCase):
     
    def setUp(self):     
        self.config = testing.setUp()   
        self.config.registry.dbmaker = self.Session       
         
    def tearDown(self):
        testing.tearDown()
    
    def testGetPage_getGeoreferencePage_Passed(self):
        
        print "--------------------------------------------------------------------------------------------"
        print "\n"
        print "Testing correct working of getGeoreferencePage with valide parameters ..."
        
        params = {'id':10002567}
        request = self.getRequestWithDb(testing.DummyRequest(params=params, post=params))
        response = getGeoreferencePage(request)               
        
        print "Response - %s"%response
        
        self.assertTrue('objectid' in response, 'Missing parameter objectid ....')
        self.assertEqual(response['objectid'], 10002567, 'Response for objectid not like expected ...')
        
