import unittest
import json
 
from pyramid import testing
from vkviewer.python.views.georeference.GeoreferenceValidate import GeoreferenceValidate
#from ...utils.BaseTestCaseAuthentification import BaseTestCaseAuthentification
from vkviewer.python.tests.utils.BaseTestCaseAuthentification import BaseTestCaseAuthentification

class ViewGeoreferenceValidateTest(BaseTestCaseAuthentification):
    
    def setUp(self):     
        self.config = testing.setUp()   
        self.config.registry.dbmaker = self.Session  
        #self.config.testing_securitypolicy(userid='jmendt')     
         
    def tearDown(self):
        testing.tearDown()    
    
    def testGeoreferenceValidateCall_pass(self):
        params = {'mtbid':71055044,'points':'7440:7246,7280:1534,1216:1454,816:7342'}
        request = self.getRequestWithAuthentification(params)
        view = GeoreferenceValidate(request)
        result = view.__call__()
        print "Test: testGeoreferenceValidateCall_pass - Result %s"%result
        resultJson = json.loads(result)
        self.assertTrue('layer_id' in result)
        self.assertEqual("df_dk_0010001_4648_1912", resultJson['layer_id'])
        self.assertTrue('georefid' in result)
        self.assertTrue(isinstance(int(resultJson['georefid']),int))
        self.assertTrue('wms_url' in result)
    
    def testGeoreferenceValidateCall_failWrongParams_MissingUserid(self):
        params = {'test':71055044,'points':'7440:7246,7280:1534,1216:1454,816:7342'}
        request = self.getRequestWithDb(testing.DummyRequest(params=params, post=params))
        view = GeoreferenceValidate(request)
        result = view.__call__()
        print "Test: testGeoreferenceValidateCall_failWrongParams_MissingUserid - Result %s"%result
        self.assertEqual(400, result.status_code)
        
    def testGeoreferenceValidateCall_failWrongParams_Missing_1(self):
        params = {'test':71055044,'points':'7440:7246,7280:1534,1216:1454,816:7342'}
        request = self.getRequestWithAuthentification(params)
        view = GeoreferenceValidate(request)
        result = view.__call__()
        print "Test: testGeoreferenceValidateCall_failWrongParams_Missing_1 - Result %s"%result
        self.assertEqual(400, result.status_code)
  
    def testGeoreferenceValidateCall_failWrongParams_Missing_2(self):
        params = {'mtbid':71055044,'tes':'7440:7246,7280:1534,1216:1454,816:7342'}
        request = self.getRequestWithAuthentification(params)
        view = GeoreferenceValidate(request)
        result = view.__call__()
        print "Test: testGeoreferenceValidateCall_failWrongParams_Missing_2 - Result %s"%result
        self.assertEqual(400, result.status_code)
        
    def testGeoreferenceValidateCall_failWrongParams_Syntax_1(self):
        params = {'mtbid':71055044,'points':'7440:7246,7280:1534,1216:1454'}
        request = self.getRequestWithAuthentification(params)
        view = GeoreferenceValidate(request)
        result = view.__call__()
        print "Test: testGeoreferenceValidateCall_failWrongParams_Syntax_1 - Result %s"%result
        self.assertEqual(400, result.status_code)
 
    def testGeoreferenceValidateCall_failWrongParams_Syntax_2(self):
        params = {'mtbid':71055044,'points':'7440;7246;7280.1534,1216:1454'}
        request = self.getRequestWithAuthentification(params)
        view = GeoreferenceValidate(request)
        result = view.__call__()
        print "Test: testGeoreferenceValidateCall_failWrongParams_Syntax_2 - Result %s"%result     
        self.assertEqual(400, result.status_code)
 
    def testGeoreferenceValidateCall_failWrongParams_Syntax_3(self):
        params = {'mtbid':'test','points':'7440:7246,7280:1534,1216:1454,816:7342'}
        request = self.getRequestWithAuthentification(params)
        view = GeoreferenceValidate(request)
        result = view.__call__()
        print "Test: testGeoreferenceValidateCall_failWrongParams_Syntax_3 - Result %s"%result             
        self.assertEqual(400, result.status_code)

