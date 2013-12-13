import unittest
import json
 
from pyramid import testing
from webhelpers.paginate import Page
from vkviewer.python.views.utils.GetWelcomePage import getWelcomePage
from vkviewer.python.tests import BaseTestCase
 
class ViewGetWelcomePageTest(BaseTestCase):
     
    def setUp(self):     
        self.config = testing.setUp()   
        self.config.registry.dbmaker = self.Session       
         
    def tearDown(self):
        testing.tearDown()
    
    def testGetWelcomePage_passed(self):
        request = self.getRequestWithDb(testing.DummyRequest())
        result = getWelcomePage(request)         
        print "Test: testGetWelcomePage_passed - Result: %s"%result        
        self.assertTrue(isinstance(result['paginator'], Page))
        self.assertTrue('occurrence_mtbs' in result)
        self.assertTrue(isinstance(result['occurrence_mtbs'], int))
        self.assertTrue('possible_mtbs' in result)
        self.assertTrue(isinstance(result['possible_mtbs'], int))
        self.assertTrue('georef_rel' in result)
        self.assertTrue(isinstance(result['georef_rel'], int))

        
