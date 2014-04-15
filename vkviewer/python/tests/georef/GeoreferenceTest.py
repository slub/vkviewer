'''
Created on Apr 14, 2014

@author: mendt
'''
import unittest, os, gdal, logging
from gdalconst import *
from vkviewer.python.georef.georeferencer import createVrt, georeference, createClipShapefile, clipRasterWithShapfile, createGCPs
from vkviewer.python.utils.logger import createLogger
from vkviewer.python.georef.geometry import BoundingBox

class GeoreferenceTest(unittest.TestCase):

    @classmethod
    def setUpClass(cls):   
        print '=============='
        print 'Start georeferencing tests ...'
        print '=============='
        cls.proj =  '+proj=longlat +ellps=bessel +datum=potsdam +no_defs'
        cls.dir = os.path.join(os.path.dirname(os.path.realpath(__file__)), '../test-data')
        cls.file = os.path.join(cls.dir,'test.tif')
        cls.file_vrt = os.path.join(cls.dir,'test.vrt')
        cls.clip_raster = os.path.join(cls.dir,'test_georef.tif')
        cls.clip_shp = os.path.join(cls.dir,'test_shp.shp')
        cls.logger = createLogger('GeoreferenceTest', logging.DEBUG)
        cls.gcps = []
        cls.gcps.append(gdal.GCP(21.1666679382324, 55.7999992370605, 0, 7057,7348))
        cls.gcps.append(gdal.GCP(21.1666679382324, 55.9000015258789, 0, 7043,879))
        cls.gcps.append(gdal.GCP(20.9999980926514, 55.7999992370605, 0, 985,7331))
        cls.gcps.append(gdal.GCP(20.9999980926514, 55.9000015258789, 0, 969,869))
        cls.boundingbox = [[20.9999980926514,55.7999992370605],[20.9999980926514,55.9000015258789],
                           [21.1666679382324,55.9000015258789],[21.1666679382324,55.7999992370605],
                           [20.9999980926514,55.7999992370605]]
        
    def testCreateVrt(self):
        print 'Test if create vrt works ...'
        dst_path = os.path.join(self.dir, 'test_createVrt.vrt')
        dataset = gdal.Open(self.file, GA_ReadOnly)
        response_file = createVrt(dataset, dst_path)
        self.assertTrue(os.path.exists(dst_path), 'Could not find created vrt file')
        self.assertTrue(isinstance(response_file, gdal.Dataset), 'Response is not of type gdal.Dataset')
        del dataset
        os.remove(dst_path)
        print '=============='
        
    def testGeoreference(self):
        print 'Test georeference function ...'
        dst_path = os.path.join(self.dir, 'test_georeference.tif')
        response_file = georeference(self.file, dst_path, self.dir, self.gcps, 4314, 4314, 'polynom', self.logger)
        self.assertTrue(os.path.exists(dst_path), 'Could not find created vrt file ...')
        self.assertEqual(response_file, dst_path, 'Response is not like expected ...')
        
        response_dataset = gdal.Open(response_file, GA_ReadOnly)
        self.assertTrue(response_dataset.GetProjection() == 'GEOGCS["DHDN",DATUM["Deutsches_Hauptdreiecksnetz",SPHEROID["Bessel 1841",6377397.155,299.1528128000008,AUTHORITY["EPSG","7004"]],TOWGS84[598.1,73.7,418.2,0.202,0.045,-2.455,6.7],AUTHORITY["EPSG","6314"]],PRIMEM["Greenwich",0],UNIT["degree",0.0174532925199433],AUTHORITY["EPSG","4314"]]', 'Response has not expected coordinate system ...')
        del response_dataset
        os.remove(dst_path)
        print '=============='
        
    def testGeoreferenceWithClip(self):
        print 'Test georeference with clipfunction ...'
        dst_path = os.path.join(self.dir, 'test_georeference_clip.tif')
        response_file = georeference(self.file, dst_path, self.dir, self.gcps, 4314, 4314, 'polynom', self.logger, self.clip_shp)
        self.assertTrue(os.path.exists(dst_path), 'Could not find created vrt file ...')
        self.assertEqual(response_file, dst_path, 'Response is not like expected ...')
        
        response_dataset = gdal.Open(response_file, GA_ReadOnly)
        self.assertTrue(response_dataset.GetProjection() == 'GEOGCS["DHDN",DATUM["Deutsches_Hauptdreiecksnetz",SPHEROID["Bessel 1841",6377397.155,299.1528128000008,AUTHORITY["EPSG","7004"]],TOWGS84[598.1,73.7,418.2,0.202,0.045,-2.455,6.7],AUTHORITY["EPSG","6314"]],PRIMEM["Greenwich",0],UNIT["degree",0.0174532925199433],AUTHORITY["EPSG","4314"]]', 'Response has not expected coordinate system ...')
        del response_dataset
        os.remove(dst_path)
        print '=============='
        
    def testCreateClipShapefile(self):
        print 'Test create clip shapfile function ...'
        dst_path = os.path.join(self.dir, 'test_shapefile')
        response_file = createClipShapefile(self.boundingbox, dst_path, 4314)
        self.assertTrue('%s.shp'%dst_path == response_file, 'Response is not like expected ...')
        
        os.remove('%s.shp'%dst_path)
        os.remove('%s.dbf'%dst_path)
        os.remove('%s.prj'%dst_path)
        os.remove('%s.shx'%dst_path)
        print '=============='        
        
    def testClipRasterWithShapfile(self):
        print 'Test clip raster with shapfile function ...'
        dst_path = dst_path = os.path.join(self.dir, 'test_clip.tif')
        response = clipRasterWithShapfile(self.clip_raster, dst_path, self.clip_shp, self.logger)
        self.assertTrue(dst_path == response, 'Response is not like expected.')
        self.assertTrue(os.path.exists(dst_path), 'Could not found clip result')
        os.remove(dst_path)
        print '=============='  
        
    def testCreateGCPs(self):
        print 'Test clip raster with shapfile function ...'
        clipparameters = '985.27322387696:8628.600769043,7056.9926300049:8619.2794799805,7043.318145752:2149.7222900391,969.47880554199:2167.4909973145'
        boundingbox = BoundingBox(20.9999980926514, 55.7999992370605, 21.1666679382324, 55.9000015258789, 4314)
        response = createGCPs(clipparameters, boundingbox.getCornerPointsAsList(), 9498)
        for gcp in response:
            print gcp
        self.assertTrue(isinstance(response, list), 'Response is not like expected.')
        print '=============='  