# -*- coding: utf-8 -*-
import unittest
import json
import transaction
 
from pyramid import testing
from pyramid.httpexceptions import HTTPBadRequest

from vkviewer.python.tests.testtools.BaseTestCaseAuthentification import login, BaseTestCaseAuthentification
from vkviewer.python.views.georeference.GeoreferenceGetProcess import georeferenceGetProcess
from vkviewer.python.models.messtischblatt.Georeferenzierungsprozess import Georeferenzierungsprozess

class GeoreferenceGetProcessTest(BaseTestCaseAuthentification):
    
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
         
    def tearDown(self):
        testing.tearDown()    
               
    def test_georeferenceGetProcessWithOneParamValide_success(self):
        
        print "--------------------------------------------------------------------------------------------"
        print "\n"
        print "Testing correct working of georeferenceGetProcess for an objectid for a existing process ..."

        # First test if it correctly response in case of existing georef process
        # Create dummy process
        georefProc = self.dummyProcess
        self.dbsession.add(georefProc)
        self.dbsession.flush()
        
        params = {'objectid':90015724}
        request = self.getRequestWithAuthentification(params)
        request.json_body = params
        response = georeferenceGetProcess(request)
        
        print "Response - %s"%response
                
        # Do tests
        parsed_response = json.loads(response)
        self.assertEqual(parsed_response['gcps'], {"Test": "Test"},'Wrong or missing parameter in response ...')
        self.assertEqual(parsed_response['extent'], [14.3333330154419, 52.5999984741211, 14.5000009536743, 52.7000007629395],
                         'Wrong or missing parameter in response ...')
        self.assertEqual(parsed_response['objectid'], 10000023,'Wrong or missing parameter in response ...')
        self.assertEqual(parsed_response['timestamp'], "2014-08-09 12:20:26",'Wrong or missing parameter in response ...')
        self.assertEqual(parsed_response['georeferenceid'], georefProc.id,'Wrong or missing parameter in response ...')
        self.assertEqual(parsed_response['type'], "update",'Wrong or missing parameter in response ...')
        self.assertEqual(parsed_response['zoomify'], "http://fotothek.slub-dresden.de/zooms/df/dk/0010000/df_dk_0010001_3352_1918/ImageProperties.xml",'Wrong or missing parameter in response ...')
        self.assertEqual(parsed_response['metadata']['dateiname'], "df_dk_0010001_3352_1918"
                         ,'Wrong or missing parameter in response ...')
        
        self.dbsession.delete(georefProc)
        self.dbsession.flush()
        
        print "--------------------------------------------------------------------------------------------"
        print "\n"
        print "Testing correct working of georeferenceGetProcess for a new objectid ..."

        params = {'objectid':90015724}
        request = self.getRequestWithAuthentification(params)
        request.json_body = params
        response = georeferenceGetProcess(request)
        
        print "Response - %s"%response
        
        # Do tests
        parsed_response = json.loads(response)
        self.assertEqual(parsed_response['gcps'], {
                "source": "pixel", "target": "EPSG:4314", 
                "gcps": [ {"source": [], "target": [14.3333330154419, 52.5999984741211]}, {"source": [], "target": [14.3333330154419, 52.7000007629395]}, 
                         {"source": [], "target": [14.5000009536743, 52.5999984741211]}, {"source": [], "target": [14.5000009536743, 52.7000007629395]}]},
                         'Wrong or missing parameter in response ...')
        self.assertEqual(parsed_response['extent'], [14.3333330154419, 52.5999984741211, 14.5000009536743, 52.7000007629395],
                         'Wrong or missing parameter in response ...')
        self.assertEqual(parsed_response['objectid'], 10000023,'Wrong or missing parameter in response ...')
        self.assertEqual(parsed_response['timestamp'], "",'Wrong or missing parameter in response ...')
        self.assertEqual(parsed_response['georeferenceid'], "",'Parameter should exist in response ...')
        self.assertEqual(parsed_response['type'], "new",'Wrong or missing parameter in response ...')
        self.assertEqual(parsed_response['zoomify'], "http://fotothek.slub-dresden.de/zooms/df/dk/0010000/df_dk_0010001_3352_1918/ImageProperties.xml",'Wrong or missing parameter in response ...')
        self.assertEqual(parsed_response['metadata']['dateiname'], "df_dk_0010001_3352_1918"
                         ,'Wrong or missing parameter in response ...')
        
    def test_georeferenceGetProcessWithOneParamInvalide_correctFail(self):
        
        print "--------------------------------------------------------------------------------------------"
        print "\n"
        print "Testing correct error behavior in case of wrong one parameter inputs ..."
        
        params_wrongObjId = {'objectid':900157244}
        request_wrongObjId = self.getRequestWithAuthentification(params_wrongObjId)
        request_wrongObjId.json_body = params_wrongObjId
        self.assertRaises(HTTPBadRequest, georeferenceGetProcess, request_wrongObjId)
        
        params_wrongParam = {'georeferenceid':11}
        request_wrongParam = self.getRequestWithAuthentification(params_wrongParam)
        request_wrongParam.json_body = params_wrongParam
        self.assertRaises(HTTPBadRequest, georeferenceGetProcess, request_wrongParam)
        
    def test_georeferenceGetProcessWithTwoParamValide_success(self):
        
        print "--------------------------------------------------------------------------------------------"
        print "\n"
        print "Testing correct working of georeferenceGetProcess for an objectid/georeferenceid for a existing process ..."

        # First test if it correctly response in case of existing georef process
        # Create dummy process
        georefProc = self.dummyProcess
        georefProc.clipparameter = "{'new': {'source': 'pixel', 'target': 'EPSG:4314',\
                                            'gcps': [{'source': [8681, 1013], 'target': [8.50000095367432, 54.7000007629395]},\
                                                     {'source': [8576, 7372], 'target': [8.50000095367432, 54.5999984741211]},\
                                                     {'source': [2358, 7260], 'target': [8.33333301544189, 54.5999984741211]},\
                                                     {'source': [2465, 888], 'target': [8.33333301544189, 54.7000007629395]}]},\
                                    'remove': {'source': 'pixel', 'target': 'EPSG:4314', 'gcps': [\
                                    {'source': [483, 7227], 'target': [8.33333301544189, 54.5999984741211]}, {'source': [464, 840], 'target': [8.33333301544189, 54.7000007629395]}]}}"
        georefProc.type = 'update'
        self.dbsession.add(georefProc)
        self.dbsession.flush()
        
        params = {'objectid':90015724, 'georeferenceid':georefProc.id}
        request = self.getRequestWithAuthentification(params)
        request.json_body = params
        response = georeferenceGetProcess(request)
        
        print "Response - %s"%response
                
        # Do tests
        parsed_response = json.loads(response)
        self.assertEqual(parsed_response['gcps'], {"source": "pixel", "target": "EPSG:4314", 
                        "gcps": [{"source": [8681, 1013], "target": [8.50000095367432, 54.7000007629395]},  {"source": [8576, 7372], "target": 
                        [8.50000095367432, 54.5999984741211]}, {"source": [2358, 7260], "target": [8.33333301544189, 54.5999984741211]},
                        {"source": [2465, 888], "target": [8.33333301544189, 54.7000007629395]}]},'Wrong or missing parameter in response ...')
        self.assertEqual(parsed_response['extent'], [14.3333330154419, 52.5999984741211, 14.5000009536743, 52.7000007629395],
                         'Wrong or missing parameter in response ...')
        self.assertEqual(parsed_response['objectid'], 10000023,'Wrong or missing parameter in response ...')
        self.assertEqual(parsed_response['timestamp'], "2014-08-09 12:20:26",'Wrong or missing parameter in response ...')
        self.assertEqual(parsed_response['georeferenceid'], georefProc.id,'Wrong or missing parameter in response ...')
        self.assertEqual(parsed_response['type'], "update",'Wrong or missing parameter in response ...')
        self.assertEqual(parsed_response['zoomify'], "http://fotothek.slub-dresden.de/zooms/df/dk/0010000/df_dk_0010001_3352_1918/ImageProperties.xml",'Wrong or missing parameter in response ...')
        self.assertEqual(parsed_response['metadata']['dateiname'], "df_dk_0010001_3352_1918"
                         ,'Wrong or missing parameter in response ...')
        
        self.dbsession.delete(georefProc)
        
       

def test_suite():
    suite = unittest.TestSuite()
    loader = unittest.TestLoader()
    
    suite.addTests(loader.loadTestsFromTestCase(GeoreferenceGetProcessTest))
    return suite

if __name__ == '__main__':
    unittest.TextTestRunner(verbosity=2).run(test_suite())