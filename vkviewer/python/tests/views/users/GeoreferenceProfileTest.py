'''
Created on Jan 22, 2014

@author: mendt
'''
import unittest
import transaction
 
from pyramid import testing
from vkviewer.python.tests.utils.BaseTestCaseAuthentification import login
from vkviewer.python.georef.georeferenceprocess import createGeoreferenceProcess
from vkviewer.python.tests.utils.BaseTestCaseAuthentification import BaseTestCaseAuthentification
from vkviewer.python.views.users.GeoreferenceProfile import georeference_profile_page

class GeoreferenceProfileTest(BaseTestCaseAuthentification):
    
    def setUp(self):     
        self.config = testing.setUp()   
        self.config.registry.dbmaker = self.Session  
         
    def tearDown(self):
        testing.tearDown()    
        
    def createDummyGeorefProcess(self):
        self.dummyGeorefProcess = createGeoreferenceProcess(71055044, self.dbsession)
        georefid = self.dummyGeorefProcess.registerGeoreferenceProcess(login, '7440:7246,7280:1534,1216:1454,816:7342', True, 'user')
        transaction.commit()
        return georefid  
        
    def deleteDummyGeorefProcess(self, georefid): 
        self.dbsession = self.Session()
        self.dbsession.execute("DELETE FROM georeferenzierungsprozess WHERE id = :georefid;", {'georefid':georefid})
        transaction.commit()

        
    def testGeoreference_profile_page(self):
        georefid = ''
        try:
            georefid = self.createDummyGeorefProcess()
            params = {'georefid':georefid, 'mtbid':71055044}
            request = self.getRequestWithAuthentification(params)
            result = georeference_profile_page(request)
            print "Test: testGeoreference_profile_page - Result %s"%result
            self.assertIsNotNone(result, 'Function georeference_profile_page - Response is None.')
            self.assertTrue(isinstance(result, dict), 'Function georeference_profile_page - Response is not a list.')
            self.assertTrue('georef_profile' in result, 'Function georeference_profile_page - <georef_profile> is not in response.')
            self.assertTrue('points' in result, 'Function georeference_profile_page - <points> is not in response.')
        except:
            raise
        finally:
            self.deleteDummyGeorefProcess(georefid)