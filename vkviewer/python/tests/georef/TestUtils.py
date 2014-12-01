import unittest, os
 
from vkviewer.python.georef.utils import getImageSize
from vkviewer.python.tests.settings import CLIPPED_GEOREF_IMAGE
 
class TestUtils(unittest.TestCase):
     
    def test_getImageSize(self):
        image_path = os.path.join(os.path.dirname(os.path.realpath(__file__)), '../%s'%CLIPPED_GEOREF_IMAGE)
        result_dictionary = getImageSize(image_path)
        self.assertTrue(isinstance(result_dictionary, dict), 'Response - %s - is not a dictionary.'%result_dictionary)
        self.assertEqual(result_dictionary['x'], 8379, 'X size - %s - is not like expected.'%result_dictionary['x'])
        self.assertEqual(result_dictionary['y'], 5028, 'Y size - %s - is not like expected.'%result_dictionary['y'])
        
        # should return null because of missing image
        image_path = os.path.join(os.path.dirname(os.path.realpath(__file__)), CLIPPED_GEOREF_IMAGE)
        result_none = getImageSize(image_path)
        self.assertIsNone(result_none, 'Response - %s - is not None, but expected.'%result_none)

        
         
def test_suite():
    suite = unittest.TestSuite()
    loader = unittest.TestLoader()
    
    print '=============='
    print '=============='
    print 'Run test suite'
    
    suite.addTests(loader.loadTestsFromTestCase(TestUtils))
    return suite

if __name__ == '__main__':
    unittest.TextTestRunner(verbosity=2).run(test_suite())
