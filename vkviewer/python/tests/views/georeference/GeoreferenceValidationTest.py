import unittest
import json
 
from pyramid import testing
from pyramid.httpexceptions import HTTPBadRequest
from vkviewer.python.views.georeference.GeoreferenceValidation import georeferenceValidation
from vkviewer.python.tests.testtools.BaseTestCaseAuthentification import BaseTestCaseAuthentification

class GeoreferenceValidationTest(BaseTestCaseAuthentification):
    
    def setUp(self):     
        self.config = testing.setUp()   
        self.config.registry.dbmaker = self.Session  
        self.dummyParams = {'georeference': 
                {'source': 'pixel', 'target': 'EPSG:4314', 'gcps': [
                        {'source': [467, 923], 'target': [10.6666660308838, 51.4000015258789]}, 
                        {'source': [7281, 999], 'target': [10.8333339691162, 51.4000015258789]}, 
                        {'source': [7224, 7432], 'target': [10.8333339691162, 51.2999992370605]},
                        {'source': [258, 7471], 'target': [10.6666660308838, 51.2999992370605]}]}, 
                'id': 10002567}
        #self.config.testing_securitypolicy(userid='jmendt')     
         
    def tearDown(self):
        testing.tearDown()    
    
    def test_georeferenceValidation_success(self):
        
        print "--------------------------------------------------------------------------------------------"
        print "\n"
        print "Testing correct working of georeferenceValidation with valide parameters ..."
       
        params = self.dummyParams
        request = self.getRequestWithAuthentification(params)
        request.json_body = params
        response = georeferenceValidation(request)
        
        print "Response - %s"%response
                
        resultJson = json.loads(response)
        self.assertTrue('layer_id' in resultJson, 'Missing parameter layer_id ....')
        self.assertEqual('df_dk_0010001_4630_1928', resultJson['layer_id'], 'Wrong parameter for layer_id ...')
        self.assertTrue('wms_url' in resultJson, 'Wrong parameter for wms_url ...')
        self.assertTrue('extent' in resultJson, 'Wrong parameter for extent ...')
        
    def test_georeferenceValidation_correctFail(self):
        
        print "--------------------------------------------------------------------------------------------"
        print "\n"
        print "Testing correct error behavior in case of wrong id parameter ..."
        
        params_wrongObjId = self.dummyParams
        params_wrongObjId['id'] = 1
        request_wrongObjId = self.getRequestWithAuthentification(params_wrongObjId)
        request_wrongObjId.json_body = params_wrongObjId
        self.assertRaises(HTTPBadRequest, georeferenceValidation, request_wrongObjId)
        

    
#     def testGeoreferenceValidateCall_failWrongParams_MissingUserid(self):
#         params = {'test':71055044,'points':'7440:7246,7280:1534,1216:1454,816:7342'}
#         request = self.getRequestWithDb(testing.DummyRequest(params=params, post=params))
#         view = GeoreferenceValidate(request)
#         result = view.__call__()
#         print "Test: testGeoreferenceValidateCall_failWrongParams_MissingUserid - Result %s"%result
#         self.assertEqual(400, result.status_code)
#         
#     def testGeoreferenceValidateCall_failWrongParams_Missing_1(self):
#         params = {'test':71055044,'points':'7440:7246,7280:1534,1216:1454,816:7342'}
#         request = self.getRequestWithAuthentification(params)
#         view = GeoreferenceValidate(request)
#         result = view.__call__()
#         print "Test: testGeoreferenceValidateCall_failWrongParams_Missing_1 - Result %s"%result
#         self.assertEqual(400, result.status_code)
#   
#     def testGeoreferenceValidateCall_failWrongParams_Missing_2(self):
#         params = {'mtbid':71055044,'tes':'7440:7246,7280:1534,1216:1454,816:7342'}
#         request = self.getRequestWithAuthentification(params)
#         view = GeoreferenceValidate(request)
#         result = view.__call__()
#         print "Test: testGeoreferenceValidateCall_failWrongParams_Missing_2 - Result %s"%result
#         self.assertEqual(400, result.status_code)
#         
#     def testGeoreferenceValidateCall_failWrongParams_Syntax_1(self):
#         params = {'mtbid':71055044,'points':'7440:7246,7280:1534,1216:1454'}
#         request = self.getRequestWithAuthentification(params)
#         view = GeoreferenceValidate(request)
#         result = view.__call__()
#         print "Test: testGeoreferenceValidateCall_failWrongParams_Syntax_1 - Result %s"%result
#         self.assertEqual(400, result.status_code)
#  
#     def testGeoreferenceValidateCall_failWrongParams_Syntax_2(self):
#         params = {'mtbid':71055044,'points':'7440;7246;7280.1534,1216:1454'}
#         request = self.getRequestWithAuthentification(params)
#         view = GeoreferenceValidate(request)
#         result = view.__call__()
#         print "Test: testGeoreferenceValidateCall_failWrongParams_Syntax_2 - Result %s"%result     
#         self.assertEqual(400, result.status_code)
#  
#     def testGeoreferenceValidateCall_failWrongParams_Syntax_3(self):
#         params = {'mtbid':'test','points':'7440:7246,7280:1534,1216:1454,816:7342'}
#         request = self.getRequestWithAuthentification(params)
#         view = GeoreferenceValidate(request)
#         result = view.__call__()
#         print "Test: testGeoreferenceValidateCall_failWrongParams_Syntax_3 - Result %s"%result             
#         self.assertEqual(400, result.status_code)

