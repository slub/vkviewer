import unittest
import json
 
from pyramid import testing
from webhelpers.paginate import Page
from vkviewer.python.views.utils.GetTimestampsForId import getTimestampsForId
from vkviewer.python.tests import BaseTestCase

TEST_OBJECT_1 = {'id':71055582,'extent':'1521174.25,6621076,1539725.375,6638782.5','time':1930}


class ViewGetTimestampsForIdTest(BaseTestCase):
     
    def setUp(self):     
        self.config = testing.setUp()   
        self.config.registry.dbmaker = self.Session       
         
    def tearDown(self):
        testing.tearDown()
    
    def testGetTimestampForId_passed(self):
        request = self.getRequestWithDb(testing.DummyRequest(params={'id':TEST_OBJECT_1['id']}))
        result = getTimestampsForId(request)    
        print "========================================"
        print "TEST - GetTimestampForId - Assert: pass."
        print "RESULTS: %s"%result
        result_encode = json.loads(result)
        self.assertTrue(isinstance(result_encode, dict), 'Response is not a dictonary.')
        self.assertTrue('maps' in result_encode, 'Missing maps property in response.')        
        self.assertTrue(isinstance(result_encode['maps'], list), 'Response is not a list.')
        self.assertTrue(len(result_encode['maps'])>0, 'Response is an empty list')
        self.assertTrue('id' in result_encode['maps'][0], 'Missing parameter in response')
        self.assertTrue('extent' in result_encode['maps'][0], 'Missing parameter in response')
        self.assertTrue('time' in result_encode['maps'][0], 'Missing parameter in response')     
        print "========================================\n"

        
