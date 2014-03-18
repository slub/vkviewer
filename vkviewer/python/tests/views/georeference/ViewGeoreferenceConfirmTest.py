import unittest
import json
import transaction
 
from pyramid import testing
from vkviewer.python.tests.utils.BaseTestCaseAuthentification import login
from vkviewer.python.georef.georeferenceprocess import createGeoreferenceProcess
from vkviewer.python.views.georeference.GeoreferenceConfirm import GeoreferenceConfirm
from vkviewer.python.tests.utils.BaseTestCaseAuthentification import BaseTestCaseAuthentification

class ViewGeoreferenceConfirmTest_Short(BaseTestCaseAuthentification):
    
    def setUp(self):     
        self.config = testing.setUp()   
        self.config.registry.dbmaker = self.Session  
         
    def tearDown(self):
        testing.tearDown()    
        
    def createDummyGeorefProcess(self):
        self.dummyGeorefProcess = createGeoreferenceProcess(71055044, self.dbsession)
        georefid = self.dummyGeorefProcess.registerGeoreferenceProcess(login, '7440:7246,7280:1534,1216:1454,816:7342', False, 'waiting')
        return georefid  
        
    def deleteDummyGeorefProcess(self, georefid): 
        self.dbsession.execute("DELETE FROM georeferenzierungsprozess WHERE id = :georefid;", {'georefid':georefid})

        
    def testGeoreferenceConfirmCall_pass(self):
        georefid = ''
        try:
            georefid = self.createDummyGeorefProcess()
            params = {'georefid':georefid, 'mtbid':71055044}
            request = self.getRequestWithAuthentification(params)
            view = GeoreferenceConfirm(request)
            result = view.__call__()
            print "Test: testGeoreferenceConfirmCall_short_pass - Result %s"%result
            resultJson = json.loads(result)
            self.assertTrue('message' in result)
            self.assertEqual("Change validation status for georeference process!", resultJson['message'])
            self.assertTrue('georefid' in result)
        except:
            raise
        finally:
            self.deleteDummyGeorefProcess(georefid)
        
    """ Should fail in the future """
    def testGeoreferenceConfirmCall_pass_WrongMtbid(self):
        georefid = ''
        try:
            georefid = self.createDummyGeorefProcess()
            params = {'georefid':georefid, 'mtbid':71055045}
            request = self.getRequestWithAuthentification(params)
            view = GeoreferenceConfirm(request)
            result = view.__call__()
            print "Test: testGeoreferenceConfirmCall_short_pass_WrongMtbid - Result %s"%result
            resultJson = json.loads(result)
            self.assertTrue('message' in result)
            self.assertEqual("Change validation status for georeference process!", resultJson['message'])
            self.assertTrue('georefid' in result)
        except:
            raise
        finally:
            self.deleteDummyGeorefProcess(georefid)
            
    def testGeoreferenceConfirmCall_failWrongParams_Syntax(self):
        georefid = ''
        try:
            georefid = self.createDummyGeorefProcess()
            params = {'georefids':georefid, 'mtbid':71055044}
            request = self.getRequestWithAuthentification(params)
            view = GeoreferenceConfirm(request)
            result = view.__call__()
            print "Test: testGeoreferenceConfirmCall_short_failWrongParams_Syntax - Result %s"%result
            self.assertEqual(400, result.status_code)
        except:
            raise
        finally:
            self.deleteDummyGeorefProcess(georefid)
            
    def testGeoreferenceConfirmCall_failWrongParams_SyntaxMissing(self):
        try:
            georefid = self.createDummyGeorefProcess()
            params = {'mtbid':71055044}
            request = self.getRequestWithAuthentification(params)
            view = GeoreferenceConfirm(request)
            result = view.__call__()
            print "Test: testGeoreferenceConfirmCall_short_failWrongParams_Syntax - Result %s"%result
            self.assertEqual(400, result.status_code)
        except:
            raise
        finally:
            self.deleteDummyGeorefProcess(georefid)          

class ViewGeoreferenceConfirmTest_Long(BaseTestCaseAuthentification):
    
    def setUp(self):     
        self.config = testing.setUp()   
        self.config.registry.dbmaker = self.Session  
         
    def tearDown(self):
        testing.tearDown()    

        
    def testGeoreferenceConfirmCall_pass(self):
        params = {'mtbid':71055044, 'points':'7440:7246,7280:1534,1216:1454,816:7342'}
        request = self.getRequestWithAuthentification(params)
        view = GeoreferenceConfirm(request)
        result = view.__call__()
        print "Test: testGeoreferenceConfirmCall_pass - Result %s"%result
        resultJson = json.loads(result)
        self.assertTrue('message' in result)
        self.assertEqual("Georeference parameter saved!", resultJson['message'])
        self.assertTrue('georefid' in result)

    def testGeoreferenceConfirmCall_failWrongParams_Syntax(self):
        params = {'mtbid':71055044, 'pointss':'7440:7246,7280:1534,1216:1454,816:7342'}
        request = self.getRequestWithAuthentification(params)
        view = GeoreferenceConfirm(request)
        result = view.__call__()
        print "Test: testGeoreferenceConfirmCall_failWrongParams_Syntax - Result %s"%result
        self.assertEqual(400, result.status_code)

    def testGeoreferenceConfirmCall_failWrongParams_Missing(self):
        params = {'mtbid':71055044}
        request = self.getRequestWithAuthentification(params)
        view = GeoreferenceConfirm(request)
        result = view.__call__()
        print "Test: testGeoreferenceConfirmCall_failWrongParams_Missing - Result %s"%result
        self.assertEqual(400, result.status_code)  