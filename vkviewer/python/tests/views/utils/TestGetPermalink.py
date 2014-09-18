import unittest
 
from pyramid import testing
from pyramid.httpexceptions import HTTPNotFound, HTTPBadRequest
from vkviewer.python.views.utils.GetPermalink import getPermalinkForObjectid
from vkviewer.python.tests.testtools.BaseTestCase import BaseTestCase

TEST_CASE_SUCCESS = 'oai:de:slub-dresden:vk:id-10000003'
TEST_CASE_ERROR_1 = 'oai:de:slub-dresden:vk:did-70000001'
TEST_CASE_ERROR_2 = 'oai:de:slub-dresden:vk:id-70000001'


class TestGetPermalink(BaseTestCase):
     
    def setUp(self):     
        self.config = testing.setUp()   
        self.config.registry.dbmaker = self.Session       
         
    def tearDown(self):
        testing.tearDown()
    
    def test_getPermalinkForObjectid_success(self):
        request = self.getRequestWithDb(testing.DummyRequest(params={'objectid':TEST_CASE_SUCCESS}))
        response = getPermalinkForObjectid(request)
        
        print "========================================"
        print "TEST - test_getPermalinkForObjectid_success"
        self.assertEquals(response['url'], 'http://example.com/vkviewer/?welcomepage=off&z=5&c=677130.590558,6283170.15587&oid=90017456', 
                          'Response - %s - is not like expected (equal).'%response)
        print "========================================"

    def test_getPermalinkForObjectid_correctFail(self):
        request1 = self.getRequestWithDb(testing.DummyRequest(params={'objectid':TEST_CASE_ERROR_1}))
        request2 = self.getRequestWithDb(testing.DummyRequest(params={'objectid':TEST_CASE_ERROR_2}))
        
        print "========================================"
        print "TEST - test_getPermalinkForObjectid_correctFail"
        self.assertRaises(HTTPBadRequest, getPermalinkForObjectid, request2)
        self.assertRaises(HTTPBadRequest, getPermalinkForObjectid, request1)
        print "========================================"

        
def test_suite():
    suite = unittest.TestSuite()
    loader = unittest.TestLoader()
    
    suite.addTests(loader.loadTestsFromTestCase(TestGetPermalink))
    return suite

if __name__ == '__main__':
    unittest.TextTestRunner(verbosity=2).run(test_suite())