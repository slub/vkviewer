'''
Created on Mar 6, 2014

@author: mendt
'''
import unittest, logging
from vkviewer.settings import DBCONFIG
from vkviewer.python.utils.logger import createLogger
from vkviewer.python.models.Meta import initializeDb
from vkviewer.python.georef.utils import getTimestampAsPGStr
from vkviewer.python.models.messtischblatt.Georeferenzierungsprozess import Georeferenzierungsprozess
from vkviewer.python.scripts.UpdateDataSoruce import getGeoreferenceProcessQueue, processSingleGeorefProc, resetMapObject


class TestUpdateGeorefDataSources(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.sqlalchemy_logger = createLogger('sqlalchemy.engine', logging.DEBUG)
        cls.logger = createLogger('TestUpdateGeorefDataSources', logging.DEBUG)
        cls.dbsession = initializeDb(DBCONFIG)
    
    @classmethod
    def getDummyGeorefProcess(cls):
        return Georeferenzierungsprozess(messtischblattid = 71055048, nutzerid = 'user', 
            clipparameter = "{'source': 'pixel', 'target': 'EPSG:4314', 'gcps': [{'source': [451.0, 7662.0], 'target': [16.1666660308838, 50.2999992370605]}, {'source': [480.0, 1198.0], 'target': [16.1666660308838, 50.4000015258789]}, {'source': [7374.0, 1229.0], 'target': [16.3333339691162, 50.4000015258789]}, {'source': [7341.0, 7689.0], 'target': [16.3333339691162, 50.2999992370605]}]}", 
            timestamp = getTimestampAsPGStr(), isvalide = True, type = 'new', refzoomify = True, publish = False, processed = False)
        
    def testGetGeoreferenceProcessQueue(self):
        response = getGeoreferenceProcessQueue(self.dbsession, self.logger)
        self.assertTrue(isinstance(response, dict), 'Response is not a dictionary object.')
        self.assertTrue('georeference' in response, 'Response doesn\'t contain a key with the value "georeference".')
        self.assertTrue(isinstance(response['georeference'], dict), 'Response type for response[\'georeference\'] is not a dict.')
        self.assertTrue('reset' in response, 'Response doesn\'t contain a key with the value "reset".')
        self.assertTrue(isinstance(response['reset'], list), 'Response type for response[\'reset\'] is not a list.')
    
    def testProcessSingleGeorefProc(self):
        georefProcess = self.getDummyGeorefProcess()
        response = processSingleGeorefProc(georefProcess, self.dbsession, self.logger, testing = True)
        self.assertIsNotNone(response, 'Response is None.')
        self.assertTrue(isinstance(response, str), 'Response is not a string.')
    
    def testResetMapObject(self):
        response = resetMapObject(71055048, self.dbsession, self.logger, testing = True)
        self.assertIsNotNone(response, 'Response is None.')
        self.assertTrue(response, 'Response is not True.')
        
#     #@unittest.skip('testGetGeoreferenceProcessQueue')      
#     def testGetGeoreferenceProcessQueue(self):
#         try:
#             georefid = self.getDummyGeorefProcess()
#             response = getGeoreferenceProcessQueue(self.dbsession, self.logger)
#             
#             print "Response testGetGeoreferenceProcessQueue - %s"%response
#             print response.keys()
#             
#             self.assertIsNotNone(response, 'Function getGeoreferenceProcessQueue - Response is None but not expected.')
#             self.assertTrue(len(response) > 0, 'Function getGeoreferenceProcessQueue - No response object.')
#             self.assertTrue(isinstance(response.keys(), list), 'Function getGeoreferenceProcessQueue - Response object is not a dictionary.')
#         except Exception as e:
#             self.assertTrue(isinstance(e, GeoreferenceProcessNotFoundError), 'Function testGetGeoreferenceProcess - \
#                 Doesn\'t return a GeoreferenceProcessNotFoundErrpr.')
#             if not isinstance(e, GeoreferenceProcessNotFoundError):
#                 raise
#         finally:
#             self.deleteDummyGeorefProcess(georefid)
#     
#     @unittest.skip('testComputeGeoreferenceResult')                            
#     def testComputeGeoreferenceResult(self):
#         try:
#             # create dummy georeference process
#             georefid = self.getDummyGeorefProcess()
#             georefprocess = Georeferenzierungsprozess.by_id(georefid, self.dbsession)
#             mtb = Messtischblatt.by_id(georefprocess.messtischblattid, self.dbsession)
#             response = computeGeoreferenceResult(georefprocess, mtb, self.dbsession, self.logger)
#             
#             self.assertIsNotNone(response, 'Function testComputeGeoreferenceResult - Response is None but not expected.')
#             self.assertEqual(response, '/home/mendt/Documents/tmp/tmp/df_dk_0010001_4648_1938.tif', 
#                 'Function testComputeGeoreferenceResult - response is not like expected.')
#         except:
#             raise
#         finally:
#             self.deleteDummyGeorefProcess(georefid)
#                    
#     @unittest.skip('testUpdateDatabase')  
#     def testUpdateDatabase(self):
#         try:
#             # create dummy data
#             mtb_dest_path = '/home/mendt/Documents/tmp/tmp/df_dk_0010001_4648_1938.tif'
#             mtb = Messtischblatt.by_id(71055048, self.dbsession)
#             mtb_verzeichnispfad = mtb.verzeichnispfad
#             mtb_isttransformiert = mtb.isttransformiert
#              
#             response = updateDatabase(mtb_dest_path, mtb, self.dbsession, self.logger)
#             self.assertEqual(mtb.verzeichnispfad, mtb_dest_path, 'Function testUpdateDatabase - Expected a verzeichnispfad %s but failed.'% mtb_dest_path)
#             self.assertEqual(mtb.isttransformiert, True, 'Function testUpdateDatabase - Expected a isttransformiert True but failed.')
# 
#         except:
#             raise
#         finally:
#             # restore database status
#             mtb.verzeichnispfad = mtb_verzeichnispfad
#             mtb.isttransformiert = mtb_isttransformiert
#             
#     @unittest.skip('test_updateVrt_withoutCache')
#     def test_updateVrt_withoutCache(self):
#         
#         print "=============================="
#         print "The update vrt without cache ..."
#         print "=============================="
# 
#         response = updateVrt(database_params = params_database, logger = self.logger, dbsession = self.dbsession, 
#                              vrt = Virtualdatasets.by_timestamp('1919-01-01 00:00:00', self.dbsession))
#         
#         print 'Response test_updateVrt_withoutCache - %s'%response
# 
#     @unittest.skip('test_updateVrt_withCache')
#     def test_updateVrt_withCache(self):
#         
#         print "=============================="
#         print "The update vrt with cache ..."
#         print "=============================="
#         
#         response = updateVrt(database_params = params_database, logger = self.logger, dbsession = self.dbsession, 
#                              vrt = Virtualdatasets.by_timestamp('1919-01-01 00:00:00', self.dbsession), refresh_cache = True)
#  
#     @unittest.skip('test_scriptProductionMode')     
#     def test_scriptProductionMode(self):
#         class DummyArgs( object ):
#             pass
#         
#         args = DummyArgs()
#         setattr(args, 'mode', 'testing')
#         print args.mode
#         
#         response = scriptProductionMode(args, self.logger)

if __name__ == "__main__":
    #import sys;sys.argv = ['', 'Test.testName']
    unittest.main()