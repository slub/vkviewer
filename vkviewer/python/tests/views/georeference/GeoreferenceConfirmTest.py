import unittest
import json
import transaction
 
from pyramid import testing
from vkviewer.python.views.georeference.GeoreferenceConfirm import georeferenceConfirm
from vkviewer.python.tests.testtools.BaseTestCaseAuthentification import login, BaseTestCaseAuthentification
from vkviewer.python.models.messtischblatt.Georeferenzierungsprozess import Georeferenzierungsprozess
class GeoreferenceConfirmTest(BaseTestCaseAuthentification):
    
    def setUp(self):     
        self.config = testing.setUp()   
        self.config.registry.dbmaker = self.Session  
        
        # create dummy georefprocess
        self.notReferencedObjId = 10000023
        self.dummyProcess = Georeferenzierungsprozess(
                    mapsid = 10000023, 
                    messtischblattid = 90015724, 
                    nutzerid = login, 
                    clipparameter = "{'Test':'Test'}", 
                    timestamp = "2014-08-09 12:20:26", 
                    type = 'new', 
                    refzoomify = True,
                    isactive = True,
                    processed = False,
                    overwrites = 0,
                    adminvalidation = ''
        )
        self.dummyParams = {'georeference': 
                {'source': 'pixel', 'target': 'EPSG:4314', 'gcps': [
                        {'source': [467, 923], 'target': [10.6666660308838, 51.4000015258789]}, 
                        {'source': [7281, 999], 'target': [10.8333339691162, 51.4000015258789]}, 
                        {'source': [7224, 7432], 'target': [10.8333339691162, 51.2999992370605]},
                        {'source': [258, 7471], 'target': [10.6666660308838, 51.2999992370605]}]}, 
                'id': 10000023}
        
    def tearDown(self):
        testing.tearDown()    
                        
    def test_georeferenceConfirm_newPass(self):
         
        print "--------------------------------------------------------------------------------------------"
        print "\n"
        print "Testing correct working of georeferenceConfirm for valide input parameters ..."
         
        params = self.dummyParams
        request = self.getRequestWithAuthentification(params)
        request.json_body = params
        response = georeferenceConfirm(request)
         
        print "Response - %s"%response
        # Do tests
        parsed_response = json.loads(response)
        self.assertTrue('text' in parsed_response, 'Missing parameter in response ...')
        self.assertEqual(parsed_response['text'], 'Georeference result saved. It will soon be ready for use.',
                         'The response parameter text is not like expected ...')
        self.assertTrue('georeferenceid' in parsed_response, 'Missing parameter in response ...')
        self.assertTrue('points' in parsed_response, 'Missing parameter in response ...')
        self.assertEqual(parsed_response['points'], 20, 'The response (points) is not like expected ...')
        self.assertTrue('gcps' in parsed_response, 'Missing parameter in response ...')
        self.assertEqual(parsed_response['gcps'], self.dummyParams['georeference'], 'The response (gcps) is not like expected ...')
        
    def test_georeferenceConfirm_dontPassBecauseOfExistingOne(self):
        
        print "--------------------------------------------------------------------------------------------"
        print "\n"
        print "Testing correct working of georeferenceGetProcess for an objectid for a existing process ..."

        # First test if it correctly response in case of existing georef process
        # Create dummy process
        georefProc = self.dummyProcess
        self.dbsession.add(georefProc)
        self.dbsession.flush()
        
        params = self.dummyParams
        request = self.getRequestWithAuthentification(params)
        request.json_body = params
        response = georeferenceConfirm(request)
        
        print "Response - %s"%response
                
        # Do tests
        parsed_response = json.loads(response)
        self.assertTrue('text' in parsed_response, 'Missing parameter in response ...')
        self.assertEqual(parsed_response['georeferenceid'], georefProc.id, 'The response (georeferenceid) is not like expected ...')
        
        self.dbsession.delete(georefProc)
        self.dbsession.flush()