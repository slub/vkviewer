import unittest, os, gdal, logging, time, uuid
from gdalconst import *
from vkviewer.python.georef.georeferencer import georeference
from vkviewer.python.utils.logger import createLogger
from concurrencytest import ConcurrentTestSuite, fork_for_tests

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
        cls.THREAD_RUNS = 10
    
    def testGeoreferenceWithClip(self, test_text=None):
        if not test_text:
            test_text = 'SINGLE'
        print '%s - Test georeference with clipfunction ...'%test_text
        dst_path = os.path.join(self.dir, '%s:test_georeference_clip.tif'%uuid.uuid4())
        response_file = georeference(self.file, dst_path, self.dir, self.gcps, 4314, 4314, 'polynom', self.logger, self.clip_shp)
        print 'Response file is %s'%response_file
        self.assertTrue(os.path.exists(dst_path), 'Could not find created vrt file ...')
        self.assertEqual(response_file, dst_path, 'Response is not like expected ...')
         
        response_dataset = gdal.Open(response_file, GA_ReadOnly)
        self.assertTrue(response_dataset.GetProjection() == 'GEOGCS["DHDN",DATUM["Deutsches_Hauptdreiecksnetz",SPHEROID["Bessel 1841",6377397.155,299.1528128000008,AUTHORITY["EPSG","7004"]],TOWGS84[598.1,73.7,418.2,0.202,0.045,-2.455,6.7],AUTHORITY["EPSG","6314"]],PRIMEM["Greenwich",0],UNIT["degree",0.0174532925199433],AUTHORITY["EPSG","4314"]]', 'Response has not expected coordinate system ...')
        del response_dataset
        os.remove(dst_path)
        print '=============='
        
    def testThread1(self):
        thread_name = "THREAD 1"
        for i in range(0,self.THREAD_RUNS):
            text = "%s - Run %s"%(thread_name, i)
            self.testGeoreferenceWithClip(text)
            
    def testThread2(self):
        thread_name = "THREAD 2"
        for i in range(0,self.THREAD_RUNS):
            text = "%s - Run %s"%(thread_name, i)
            self.testGeoreferenceWithClip(text)  
            
    def testThread3(self):
        thread_name = "THREAD 3"
        for i in range(0,self.THREAD_RUNS):
            text = "%s - Run %s"%(thread_name, i)
            self.testGeoreferenceWithClip(text)      
            
    def testThread4(self):
        thread_name = "THREAD 4"
        for i in range(0,self.THREAD_RUNS):
            text = "%s - Run %s"%(thread_name, i)
            self.testGeoreferenceWithClip(text)      
            
    def testThread5(self):
        thread_name = "THREAD 5"
        for i in range(0,self.THREAD_RUNS):
            text = "%s - Run %s"%(thread_name, i)
            self.testGeoreferenceWithClip(text)            

    def testThread6(self):
        thread_name = "THREAD 6"
        for i in range(0,self.THREAD_RUNS):
            text = "%s - Run %s"%(thread_name, i)
            self.testGeoreferenceWithClip(text)   
            
    def testThread7(self):
        thread_name = "THREAD 7"
        for i in range(0,self.THREAD_RUNS):
            text = "%s - Run %s"%(thread_name, i)
            self.testGeoreferenceWithClip(text)   
            
    def testThread8(self):
        thread_name = "THREAD 8"
        for i in range(0,self.THREAD_RUNS):
            text = "%s - Run %s"%(thread_name, i)
            self.testGeoreferenceWithClip(text)   
            
    def testThread9(self):
        thread_name = "THREAD 9"
        for i in range(0,self.THREAD_RUNS):
            text = "%s - Run %s"%(thread_name, i)
            self.testGeoreferenceWithClip(text)   
            
    def testThread10(self):
        thread_name = "THREAD 10"
        for i in range(0,self.THREAD_RUNS):
            text = "%s - Run %s"%(thread_name, i)
            self.testGeoreferenceWithClip(text)   
                    
def test_suite():
    suite = unittest.TestLoader().loadTestsFromTestCase(GeoreferenceTest)
    
    print '=============='
    print '=============='
    print 'Run test suite'
    
    #suite.addTests(loader.loadTestsFromTestCase(GeoreferenceTest))
    return ConcurrentTestSuite(suite, fork_for_tests(10))

if __name__ == '__main__':
    unittest.TextTestRunner(verbosity=2).run(test_suite())