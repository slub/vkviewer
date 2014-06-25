import unittest
from vkviewer.python.tests.scripts.csw.TestChildMetadataBinding import TestChildMetadataBinding
from vkviewer.python.tests.scripts.csw.TestInsertMetadata import TestInsertMetadata

def test_suite():
    suite = unittest.TestSuite()
    loader = unittest.TestLoader()
    
    print '=============='
    print '=============='
    print 'Run test suite'
    
    suite.addTests(loader.loadTestsFromTestCase(TestChildMetadataBinding))
    suite.addTests(loader.loadTestsFromTestCase(TestInsertMetadata))
    return suite

if __name__ == '__main__':
    unittest.TextTestRunner(verbosity=2).run(test_suite())