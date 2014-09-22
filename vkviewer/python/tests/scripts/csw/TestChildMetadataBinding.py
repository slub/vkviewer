#!/usr/bin/env python
# -*- coding: utf-8 -*- 
'''
Created on Jan 9, 2014

@author: mendt
'''

import unittest, logging, tempfile, shutil, os
from datetime import datetime
from vkviewer.settings import TEMPLATE_FILES, DATABASE_SRID
from vkviewer.python.scripts.csw.InsertMetadata import createTemporaryCopy
from vkviewer.python.scripts.csw.ChildMetadataBinding import ChildMetadataBinding

class TestChildMetadataBinding(unittest.TestCase):
    
    @classmethod
    def setUpClass(cls):
        logging.basicConfig(level=logging.DEBUG)
        cls.logger = logging.getLogger('sqlalchemy.engine')

    def testInitChildMetadataBinding(self):
        try:
            mdFile = createTemporaryCopy(TEMPLATE_FILES['child'], TEMPLATE_FILES['tmp_dir'])
            mdEditor = ChildMetadataBinding(mdFile, self.logger)
            self.assertTrue(isinstance(mdEditor, ChildMetadataBinding), 'Function: testInitChildMetadataBinding - Response is not of type ChildMetadatabinding.')
        except:
            raise
        finally:
            os.remove(mdFile)

    def testUpdateAbstract(self):
        try:
            updateValue = 'Grünheide b. Wilkieten. - Hrsg. 1911, red. Änd. 1939. - 1:25000. - [Berlin]: Reichsamt für Landesaufnahme, 1939. - 1 Kt. ---'
            tmpDirectory = tempfile.mkdtemp('', 'tmp_', TEMPLATE_FILES['tmp_dir'])
            mdFile = createTemporaryCopy(TEMPLATE_FILES['child'], tmpDirectory)
            mdEditor = ChildMetadataBinding(mdFile, self.logger)
            response = mdEditor.updateAbstract(updateValue)
            self.assertTrue(response, 'Function: testUpdateAbstract - Response is not like expected.')
            
            # check if value is correctly set
            for element in mdEditor.root.iter(mdEditor.ns['gmd']+'abstract' ):
                valueElement = mdEditor.__getCharacterStringElement__(element)
                self.assertEqual(updateValue,valueElement.text, 'Function: testUpdateAbstract - Response is not equal to the expected response.')
        except:
            raise
        finally:
            shutil.rmtree(tmpDirectory)

    def testUpdateBoundingBox(self):
        try:
            updateWestBoundLonValue = 21.49
            updateEastBoundLonValue = 21.66
            updateSouthBoundLatValue = 55.49
            updateNorthBoundLatValue = 55.59
            tmpDirectory = tempfile.mkdtemp('', 'tmp_', TEMPLATE_FILES['tmp_dir'])
            mdFile = createTemporaryCopy(TEMPLATE_FILES['child'], tmpDirectory)
            mdEditor = ChildMetadataBinding(mdFile, self.logger)
            response = mdEditor.updateBoundingBox(updateWestBoundLonValue, updateEastBoundLonValue, updateSouthBoundLatValue, updateNorthBoundLatValue)
            self.assertTrue(response, 'Function: testUpdateBoundingBox - Response is not like expected.')
            
            # check if value is correctly set
            geograhicBoundingBoxElement = mdEditor.__getChildElement__(parentElementId=mdEditor.ns['gmd']+'identificationInfo', childElementId=mdEditor.ns['gmd']+'EX_GeographicBoundingBox')
            # test updateWestBoundLonValue
            for element in geograhicBoundingBoxElement.iter(mdEditor.ns['gmd']+'westBoundLongitude'):
                valueElement = element.find(mdEditor.ns['gco']+'Decimal')
                self.assertEqual(updateWestBoundLonValue,valueElement.text, 'Function: testUpdateBoundingBox - Response is not equal to the expected response.')
            
            # test updateEastBoundLonValue
            for element in geograhicBoundingBoxElement.iter(mdEditor.ns['gmd']+'eastBoundLongitude'):
                valueElement = element.find(mdEditor.ns['gco']+'Decimal')
                self.assertEqual(updateEastBoundLonValue,valueElement.text, 'Function: testUpdateBoundingBox - Response is not equal to the expected response.')
            
            # test updateSouthBoundLatValue
            for element in geograhicBoundingBoxElement.iter(mdEditor.ns['gmd']+'southBoundLatitude'):
                valueElement = element.find(mdEditor.ns['gco']+'Decimal')
                self.assertEqual(updateSouthBoundLatValue,valueElement.text, 'Function: testUpdateBoundingBox - Response is not equal to the expected response.')
                
            # test updateNorthBoundLatValue
            for element in geograhicBoundingBoxElement.iter(mdEditor.ns['gmd']+'northBoundLatitude'):
                valueElement = element.find(mdEditor.ns['gco']+'Decimal')
                self.assertEqual(updateNorthBoundLatValue,valueElement.text, 'Function: testUpdateBoundingBox - Response is not equal to the expected response.')
        except:
            raise
        finally:
            shutil.rmtree(tmpDirectory)
                                
    def testUpdateDateStamp(self):
        try:
            updateValue = datetime.now().isoformat(' ')
            tmpDirectory = tempfile.mkdtemp('', 'tmp_', TEMPLATE_FILES['tmp_dir'])
            mdFile = createTemporaryCopy(TEMPLATE_FILES['child'], tmpDirectory)
            mdEditor = ChildMetadataBinding(mdFile, self.logger)
            response = mdEditor.updateDateStamp(updateValue)
            self.assertTrue(response, 'Function: testUpdateDateStamp - Response is not like expected.')
            
            # check if value is correctly set
            for element in mdEditor.root.iter(mdEditor.ns['gmd']+'dateStamp' ):
                valueElement = element.find(mdEditor.ns['gco']+'Date')
                self.assertEqual(updateValue,valueElement.text, 'Function: testUpdateDateStamp - Response is not equal to the expected response.')
        except:
            raise
        finally:
            shutil.rmtree(tmpDirectory)  
                           
    def testUpdateHierarchyLevelName(self):
        try:
            updateValue = 'Messtischblatt'
            tmpDirectory = tempfile.mkdtemp('', 'tmp_', TEMPLATE_FILES['tmp_dir'])
            mdFile = createTemporaryCopy(TEMPLATE_FILES['child'], tmpDirectory)
            mdEditor = ChildMetadataBinding(mdFile, self.logger)
            response = mdEditor.updateHierarchyLevelName(updateValue)
            self.assertTrue(response, 'Function: testUpdateHierarchyLevelName - Response is not like expected.')
            
            # check if value is correctly set
            for element in mdEditor.root.iter(mdEditor.ns['gmd']+'hierarchyLevelName' ):
                valueElement = mdEditor.__getCharacterStringElement__(element)
                self.assertEqual(updateValue,valueElement.text, 'Function: testUpdateHierarchyLevelName - Response is not equal to the expected response.')
        except:
            raise
        finally:
            shutil.rmtree(tmpDirectory)
            
    def testUpdateId(self):
        try:
            updateValue = 'df_dk_0010001_0192'
            tmpDirectory = tempfile.mkdtemp('', 'tmp_', TEMPLATE_FILES['tmp_dir'])
            mdFile = createTemporaryCopy(TEMPLATE_FILES['child'], tmpDirectory)
            mdEditor = ChildMetadataBinding(mdFile, self.logger)
            response = mdEditor.updateId(updateValue)
            self.assertTrue(response, 'Function: testUpdateId - Response is not like expected.')
            
            # check if value is correctly set
            for element in mdEditor.root.iter(mdEditor.ns['gmd']+'fileIdentifier' ):
                valueElement = mdEditor.__getCharacterStringElement__(element)
                self.assertEqual(updateValue,valueElement.text, 'Function: testUpdateId - Response is not equal to the expected response.')
        except:
            raise
        finally:
            shutil.rmtree(tmpDirectory)
            
    def testUpdateOnlineResource(self):
        try:
            updateValue = [
                {
                    'url':'http://kartenforum.slub-dresden.de/vkviewer/permalink?objectid=',
                    'protocol':'HTTP',
                    'name':'Permalink'
                },
                {
                    'url':'testWMS',
                    'protocol':'OGC:WMS-1.1.1-http-get-map',
                    'name':'WEB MAP SERVICE (WMS)'
                },
                {
                    'url':'testperma',
                    'protocol':'HTTP',
                    'name':'Permalink'
                }                        
            ]           
            
            tmpDirectory = tempfile.mkdtemp('', 'tmp_', TEMPLATE_FILES['tmp_dir'])
            mdFile = createTemporaryCopy(TEMPLATE_FILES['child'], tmpDirectory)
            mdEditor = ChildMetadataBinding(mdFile, self.logger)
            response = mdEditor.updateOnlineResource(updateValue)
            self.assertTrue(response, 'Function: testUpdatePermalink - Response is not like expected.')
            
            # check if value is correctly set
            '''digitalTransferOptionsElement = mdEditor.__getChildElement__(parentElementId=mdEditor.ns['gmd']+'distributionInfo', 
                        childElementId=mdEditor.ns['gmd']+'MD_DigitalTransferOptions')
            for element in digitalTransferOptionsElement.iter(mdEditor.ns['gmd']+'linkage'):
                valueElement = element.find(mdEditor.ns['gmd']+'URL')
                self.assertEqual(updateValue,valueElement.text, 'Function: testUpdatePermalink - Response is not equal to the expected response.')'''
        except:
            raise
        finally:
            shutil.rmtree(tmpDirectory)
            
    def testUpdateReferenceDate(self):
        try:
            updateValue = '1940'
            tmpDirectory = tempfile.mkdtemp('', 'tmp_', TEMPLATE_FILES['tmp_dir'])
            mdFile = createTemporaryCopy(TEMPLATE_FILES['child'], tmpDirectory)
            mdEditor = ChildMetadataBinding(mdFile, self.logger)
            response = mdEditor.updateReferenceDate(updateValue)
            self.assertTrue(response, 'Function: testUpdateReferenceDate - Response is not like expected.')
            
            # check if value is correctly set
            for element in mdEditor.root.iter(mdEditor.ns['gmd']+'CI_Date' ):
                self.logger.debug('Element for identifier <gmd:CI_Date> founded.')
                dateElement = element.find(mdEditor.ns['gmd']+'date')
                valueElement = dateElement.find(mdEditor.ns['gco']+'Date')
                self.assertEqual(updateValue,valueElement.text, 'Function: testUpdateReferenceDate - Response is not equal to the expected response.')
        except:
            raise
        finally:
            shutil.rmtree(tmpDirectory)

    def testUpdateReferenceTime(self):
        try:
            startUpdateValue = '1940-01-01'
            endUpdateValue = '1940-12-31'
            tmpDirectory = tempfile.mkdtemp('', 'tmp_', TEMPLATE_FILES['tmp_dir'])
            mdFile = createTemporaryCopy(TEMPLATE_FILES['child'], tmpDirectory)
            mdEditor = ChildMetadataBinding(mdFile, self.logger)
            response = mdEditor.updateReferenceTime(startUpdateValue, endUpdateValue)
            self.assertTrue(response, 'Function: testUpdateReferenceTime - Response is not like expected.')
            
            # check if value is correctly set
            temporalExtentElement = mdEditor.__getChildElement__(parentElementId=mdEditor.ns['gmd']+'identificationInfo', childElementId=mdEditor.ns['gmd']+'EX_TemporalExtent')
            # test startUpdateValue
            for element in temporalExtentElement.iter(mdEditor.ns['gml']+'begin'):
                timeInstant = element.find(mdEditor.ns['gml']+'TimeInstant')
                timePosition = timeInstant.find(mdEditor.ns['gml']+'timePosition')                
                self.assertEqual(startUpdateValue,timePosition.text, 'Function: testUpdateReferenceTime - Response is not equal to the expected response.')
    
            # test endUpdateValue
            for element in temporalExtentElement.iter(mdEditor.ns['gml']+'end'):
                timeInstant = element.find(mdEditor.ns['gml']+'TimeInstant')
                timePosition = timeInstant.find(mdEditor.ns['gml']+'timePosition')
                self.assertEqual(endUpdateValue,timePosition.text, 'Function: testUpdateReferenceTime - Response is not equal to the expected response.')
        except:
            raise
        finally:
            shutil.rmtree(tmpDirectory)
                          
    def testUpdateTitle(self):
        try:
            updateValue = 'Meßtischblatt 0495 : Grünheide b. Wilkieten, 19399'
            tmpDirectory = tempfile.mkdtemp('', 'tmp_', TEMPLATE_FILES['tmp_dir'])
            mdFile = createTemporaryCopy(TEMPLATE_FILES['child'], tmpDirectory)
            mdEditor = ChildMetadataBinding(mdFile, self.logger)
            response = mdEditor.updateTitle(updateValue)
            self.assertTrue(response, 'Function: testTitle - Response is not like expected.')
            
            # check if value is correctly set
            for element in mdEditor.root.iter(mdEditor.ns['gmd']+'title' ):
                valueElement = mdEditor.__getCharacterStringElement__(element)
                self.assertEqual(updateValue,valueElement.text, 'Function: testTitle - Response is not equal to the expected response.')
        except:
            raise
        finally:
            shutil.rmtree(tmpDirectory)
        
    def testUpdateGraphicOverview(self):
        try:
            updateValue = [
                #'http://kartenforum.slub-dresden.de/cgi-bin/mtbows?SERVICE=WMS&amp;VERSION=1.1.1&amp;REQUEST=GetMap&amp;LAYERS=Historische%20Messtischblaetter&amp;TRANSPARENT=true&amp;FORMAT=image%2Fpng&amp;STYLES=&amp;SRS=EPSG%3A4314&amp;BBOX=20.9999980927,55.7999992371,21.1666679382,55.9000015259&amp;WIDTH=40&amp;HEIGHT=40&amp;TIME=19344',
                #'http://fotothek.slub-dresden.de/thumbs/df/dk/0010000/df_dk_0010001_0192.jpg',
                'http://fotothek.slub-dresden.de/mids/df/dk/0010000/df_dk_0010001_0192.jpg'
            ]
            
            tmpDirectory = tempfile.mkdtemp('', 'tmp_', TEMPLATE_FILES['tmp_dir'])
            mdFile = createTemporaryCopy(TEMPLATE_FILES['child'], tmpDirectory)
            mdEditor = ChildMetadataBinding(mdFile, self.logger)
            response = mdEditor.updateGraphicOverview(updateValue)
            self.assertTrue(response, 'Function: testUpdateGraphicOverview - Response is not like expected.')
            
            # check if value is correctly set
            xmlHierarchy = [
                mdEditor.ns['gmd']+'identificationInfo', 
                mdEditor.ns['gmd']+'MD_DataIdentification',
                mdEditor.ns['gmd']+'graphicOverview',
                mdEditor.ns['gmd']+'MD_BrowseGraphic',
                mdEditor.ns['gmd']+'fileName', 
                mdEditor.ns['gco']+'CharacterString'
            ]
            valueElements = mdEditor.root.findall('/'.join(xmlHierarchy))
                    
            self.assertTrue(len(valueElements) == 1, 'Function: testUpdateGraphicOverview - Response has not the expected length')
            self.assertEqual(valueElements[0].text,updateValue[0], 'Function: testUpdateGraphicOverview - Response is not equal to the expected response.')
            #self.assertEqual(valueElements[1].text,updateValue[1], 'Function: testUpdateGraphicOverview - Response is not equal to the expected response.')
            #self.assertEqual(valueElements[2].text,updateValue[2], 'Function: testUpdateGraphicOverview - Response is not equal to the expected response.')
        except:
            raise
        finally:
            shutil.rmtree(tmpDirectory)
                                                   
    def testSaveFile(self):
        try:
            tmpDirectory = tempfile.mkdtemp('', 'tmp_', TEMPLATE_FILES['tmp_dir'])
            mdFile = createTemporaryCopy(TEMPLATE_FILES['child'], tmpDirectory, 'xml')
            mdEditor = ChildMetadataBinding(mdFile, self.logger)
            destFile = os.path.join(TEMPLATE_FILES['tmp_dir'], 'test1')
            response = mdEditor.saveFile(destFile)
            self.assertEqual(destFile, response, 'Function: testSaveFile - Response is not like expected.')
            self.assertTrue(os.path.isfile(response), 'Function: testSaveFile - File does not exist.')
        except:
            raise
        finally:
            shutil.rmtree(tmpDirectory)        
            
def test_suite():
    suite = unittest.TestSuite()
    loader = unittest.TestLoader()
    
    print '=============='
    print '=============='
    print 'Run test suite'
    
    suite.addTests(loader.loadTestsFromTestCase(TestChildMetadataBinding))
    return suite

if __name__ == '__main__':
    unittest.TextTestRunner(verbosity=2).run(test_suite())