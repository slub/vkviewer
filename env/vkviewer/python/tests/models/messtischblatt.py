import unittest
from pyramid import testing
from vkviewer.python.tests import BaseTestCase
from vkviewer.python.models.messtischblatt import getCountOfGeorefMesstischblaetter, getZoomifyCollectionForBlattnr
from webhelpers.paginate import Page

class ViewMesstischblattFunctionsTests(BaseTestCase):
     
    def setUp(self):     
        self.config = testing.setUp()   
        self.config.registry.dbmaker = self.Session       
         
    def tearDown(self):
        testing.tearDown()
    
    def testGetCountOfGeorefMesstischblaetter_pass(self):
        dbsession = self.config.registry.dbmaker()
        result = getCountOfGeorefMesstischblaetter(dbsession)
        print "Test: testGetCountOfGeorefMesstischblaetter_pass - Result: %s"%result
        self.assertTrue(isinstance(int(result), int))
        
    def testGetZoomifyCollectionForBlattnr_pass_1(self):
        request = self.getRequestWithDb(testing.DummyRequest())
        result = getZoomifyCollectionForBlattnr(request, '46_48', request.db)
        print "Test: testGetZoomifyCollectionForBlattnr_pass_1 - Result: %s"%result
        self.assertTrue(isinstance(result, Page))

    def testGetZoomifyCollectionForBlattnr_pass(self):
        request = self.getRequestWithDb(testing.DummyRequest())
        result = getZoomifyCollectionForBlattnr(request, '100_100', request.db)
        print "Test: testGetZoomifyCollectionForBlattnr_pass_2 - Result: %s"%result
        self.assertTrue(isinstance(result, Page))