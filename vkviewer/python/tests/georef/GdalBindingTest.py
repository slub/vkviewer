'''
Created on Apr 14, 2014

@author: mendt
'''
import unittest
import os
import gdal
from gdalconst import *

class GdalBindingTest(unittest.TestCase):

    @classmethod
    def setUpClass(cls):   
        print '=============='
        print 'Start gdal binding tests ...'
        print '=============='
        cls.proj =  '+proj=longlat +ellps=bessel +datum=potsdam +no_defs'
        cls.dir = os.path.join(os.path.dirname(os.path.realpath(__file__)), '../test-data')
        cls.file = os.path.join(cls.dir,'test.tif')
        cls.file_vrt = os.path.join(cls.dir,'test.vrt')

    def testIfFileExists(self):
        print 'Test if file exists\n'
        self.assertTrue(os.path.exists(self.file),'Test file wasn\'t found')
        print '=============='

    def testGdalOpen(self):
        print 'Test if gdal open functions ...'
        dataset = gdal.Open(self.file, GA_ReadOnly)
        self.assertTrue(dataset, 'Test if gdal open works.')
        print '=============='
        
    def testGettingDatasetInformation(self):
        print 'Test if gdal get dataset information functions ...'
        dataset = gdal.Open(self.file, GA_ReadOnly)
        print 'Driver: ', dataset.GetDriver().ShortName,'/', \
          dataset.GetDriver().LongName
        print 'Size is ',dataset.RasterXSize,'x',dataset.RasterYSize, \
              'x',dataset.RasterCount
        print 'Projection is ',dataset.GetProjection()
        
        geotransform = dataset.GetGeoTransform()
        self.assertTrue(geotransform, 'No geotransform response founded.')
        if not geotransform is None:
            print 'Origin = (',geotransform[0], ',',geotransform[3],')'
            print 'Pixel Size = (',geotransform[1], ',',geotransform[5],')'
        print '=============='
        
    def testCreateVRT(self):
        print 'Test if gdal could create a vrt ...'
        out_format = 'VRT'
        dst_file = os.path.join(self.dir, 'test_proj.vrt')
        dataset = gdal.Open(self.file, GA_ReadOnly)
        dst_driver = gdal.GetDriverByName(out_format)
        dst_dataset = dst_driver.CreateCopy(dst_file, dataset,0)
        dst_dataset.SetProjection(self.proj)
        del dst_dataset
        self.assertTrue(os.path.exists(dst_file), 'Could not find vrt file')
        os.remove(dst_file)
        print '=============='
        
    def testAddGCPToVRT(self):
        print 'Test if gdal could add gcps to VRT ...'
        out_format = 'VRT'
        dst_file = os.path.join(self.dir, 'test_gcps.vrt')
        dataset = gdal.Open(self.file_vrt, GA_ReadOnly)
        dst_driver = dataset.GetDriver()
        dst_dataset = dst_driver.CreateCopy(dst_file, dataset,0)
        gcp = gdal.GCP(10, 10, 0, 100, 100)
        dst_dataset.SetGCPs([gcp], self.proj)
        del dst_dataset
        self.assertTrue(os.path.exists(dst_file), 'Could not find vrt file')
        os.remove(dst_file)
        print '=============='           

if __name__ == "__main__":
    #import sys;sys.argv = ['', 'Test.testName']
    unittest.main()