import json
 
from pyramid import testing
from vkviewer.python.views.georeference.GeoreferenceUpdate import georeferenceUpdate
from vkviewer.python.tests.testtools.BaseTestCaseAuthentification import login, BaseTestCaseAuthentification
from vkviewer.python.models.messtischblatt.Georeferenzierungsprozess import Georeferenzierungsprozess

class GeoreferenceUpdateTest(BaseTestCaseAuthentification):
    
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
                {'new': {'source': 'pixel', 'target': 'EPSG:4314', 'gcps': [
                        {'source': [467, 923], 'target': [10.6666660308838, 51.4000015258789]}, 
                        {'source': [7281, 999], 'target': [10.8333339691162, 51.4000015258789]}, 
                        {'source': [7224, 7432], 'target': [10.8333339691162, 51.2999992370605]},
                        {'source': [258, 7471], 'target': [10.6666660308838, 51.2999992370605]}]},
                'remove':{'source': 'pixel', 'target': 'EPSG:4314', 'gcps':[]}},
                'id': 10000023}
        
    def tearDown(self):
        testing.tearDown()    
                              
    def test_georeferenceUpdate_pass(self):
        
        print "--------------------------------------------------------------------------------------------"
        print "\n"
        print "Testing correct working of georeferenceUpdate ..."

        # First test if it correctly response in case of existing georef process
        # Create dummy process
        georefProc = self.dummyProcess
        self.dbsession.add(georefProc)
        self.dbsession.flush()
        
        params = self.dummyParams
        request = self.getRequestWithAuthentification(params)
        request.json_body = params
        response = georeferenceUpdate(request)
        
        print "Response - %s"%response
                
        # Do tests
        parsed_response = json.loads(response)
        self.assertTrue('text' in parsed_response, 'Missing parameter (text) in response ...')
        self.assertTrue('georeferenceid' in parsed_response, 'Missing parameter (georeferenceid) in response ...')
        self.assertTrue('gcps' in parsed_response, 'Missing parameter (gcps) in response ...')
        self.assertEqual(parsed_response['gcps'], params['georeference']['new'], 'The response (georeferenceid) is not like expected ...')
        self.assertTrue('type' in parsed_response, 'Missing parameter (type) in response ...')
        self.assertEqual(parsed_response['type'], 'update', 'The response (type) is not like expected ...')
        
        self.dbsession.delete(georefProc)
        self.dbsession.flush()
        
    def test_georeferenceUpdate_correctFail(self):
        
        print "--------------------------------------------------------------------------------------------"
        print "\n"
        print "Testing correct working of georeferenceUpdate in case of now registered georeference process..."
      
        params = self.dummyParams
        request = self.getRequestWithAuthentification(params)
        request.json_body = params
        response = georeferenceUpdate(request)
        
        print "Response - %s"%response
                
        # Do tests
        parsed_response = json.loads(response)
        self.assertTrue('text' in parsed_response, 'Missing parameter (text) in response ...')
        self.assertEqual(parsed_response['text'], "There is no registered georeference process for this messtischblatt. Please move back to the confirm process.", 
                         'The response (text) is not like expected ...')
