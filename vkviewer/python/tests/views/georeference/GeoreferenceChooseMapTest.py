# -*- coding: utf-8 -*-
import unittest
import json
import transaction
 
from pyramid import testing
from pyramid.httpexceptions import HTTPBadRequest
from webhelpers.paginate import Page

from vkviewer.python.tests.testtools.BaseTestCaseAuthentification import BaseTestCaseAuthentification
from vkviewer.python.views.georeference.GeoreferenceChooseMap import chooseGeoreferenceMap

class GeoreferenceChooseMapTest(BaseTestCaseAuthentification):
    
    def setUp(self):     
        self.config = testing.setUp()   
        self.config.registry.dbmaker = self.Session  
                 
    def tearDown(self):
        testing.tearDown()    
               
    def test_georeferenceChooseMapTest_success(self):
        
        print "--------------------------------------------------------------------------------------------"
        print "\n"
        print "Testing correct working of chooseGeoreferenceMap for an existing messtischblatt blattnr ..."
        
        params = {'blattnr':'52_15'}
        request = self.getRequestWithAuthentification(params)
        response = chooseGeoreferenceMap(request)
        
        print "Response - %s"%response
                
        self.assertTrue('paginator' in response, 'No pagination object in response ...')
        self.assertTrue(isinstance(response['paginator'], Page) ,'Response is not a pageination object ...')
        
    def test_georeferenceGetProcessWithOneParamInvalide_correctFail(self):
        
        print "--------------------------------------------------------------------------------------------"
        print "\n"
        print "Testing correct error behavior in case of wrong or missing parameter inputs ..."
        
        params_wrongParam = {'objectid':900157244}
        request_wrongParam = self.getRequestWithAuthentification(params_wrongParam)
        self.assertRaises(HTTPBadRequest, chooseGeoreferenceMap, request_wrongParam)
        
        request_missingParam = self.getRequestWithAuthentification({})
        self.assertRaises(HTTPBadRequest, chooseGeoreferenceMap, request_missingParam)

 
        

   
        
       

def test_suite():
    suite = unittest.TestSuite()
    loader = unittest.TestLoader()
    
    suite.addTests(loader.loadTestsFromTestCase(GeoreferenceChooseMapTest))
    return suite

if __name__ == '__main__':
    unittest.TextTestRunner(verbosity=2).run(test_suite())