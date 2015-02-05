'''
Created on Jan 27, 2015

@author: uli
'''
import unittest, os, locale, logging
import gdal
from gdalconst import *
from vkviewer.python.script.CreateZoomifyTiles import getImageSize,\
    calculateTierSize, calculateTileCountUpToTier, createTiles, sortTileToTileGroups
from vkviewer.python.utils.logger import createLogger


class TestCreatezoomifyTiles(unittest.TestCase):

    @classmethod
    def setUpClass(cls):   
        cls.dir = os.path.join(os.path.dirname(os.path.realpath(__file__)), 'test-data')
        cls.file = os.path.join(cls.dir,'world.jpg')
        cls.logger = createLogger('TestCreatezoomifyTiles', logging.DEBUG)
    
    def testIfFileExists(self):
        print 'Test if file exists\n'
        self.assertTrue(os.path.exists(self.file),'Test file wasn\'t found')
        print '=============='      

    def testGdalOpen(self):
        print 'Test if gdal open works.\n'
        dataset = gdal.Open(self.file.encode(locale.getpreferredencoding()))
        self.assertTrue(dataset, 'gdal open do not work.')
        print '=============='  
        
    def testgetImageSize(self):
        print 'Test image size function.\n'
        response = getImageSize(self.file)
        self.assertTrue(response, 'Failed to open the test-data - %s'%response)
        self.assertEqual(response, {'y': 6234.0, 'x': 7747.0}, 'The image size is not like expected - %s'%response)
        print '=============='  
        
    def testCalculateTierSize(self):
        print 'Test to calculate the number of tiles per tier.\n'
        size = getImageSize(self.file)
        tierSizeInTiles = calculateTierSize(size['x'], size['y'])
        self.assertEqual(tierSizeInTiles, [[31.0, 25.0], [16.0, 13.0], [8.0, 7.0], [4.0, 4.0], [2.0, 2.0], [1.0, 1.0]], 'The tier size is not like expected - %s'%tierSizeInTiles)
        print '=============='  
    
    def testCalculateTileCountUpToTier(self):
        print 'Test sorting the tile to tilegroups'
        size = getImageSize(self.file)
        tierSizeInTiles = calculateTierSize(size['x'], size['y'])
        tileCountUpToTier = calculateTileCountUpToTier(tierSizeInTiles)
        self.assertEqual(tileCountUpToTier, [0, 1.0, 5.0, 21.0, 77.0, 285.0], 'The tileCount is not like expected - %s'%tileCountUpToTier)
        print 'the tileCount up to tier is: %s'%tileCountUpToTier
        print '=============='
    
    def testCreateTiles(self):
        print 'Test creating tiles'
        size = getImageSize(self.file)
        tierSizeInTiles = calculateTierSize(size['x'], size['y'])
        tileCountUpToTier = calculateTileCountUpToTier(tierSizeInTiles)
        outputDir = os.path.join(self.dir, 'zoomifytiles')
        self.assertTrue(os.path.exists(outputDir), 'Could not find created output dir ...')
        targetDir = createTiles(self.file, tierSizeInTiles, tileCountUpToTier, size['x'], size['y'], outputDir, self.logger)
        self.assertTrue(targetDir, 'Failed to CreateTiles in Directory - %s'%targetDir)
        print 'The targetDir is: %s'%targetDir
        print '=============='

  


if __name__ == "__main__":
    #import sys;sys.argv = ['', 'Test.testName']
    unittest.main()