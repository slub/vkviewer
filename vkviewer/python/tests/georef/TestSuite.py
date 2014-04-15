import unittest
from GdalBindingTest import GdalBindingTest
from GeoreferenceTest import GeoreferenceTest

def test_suite():
    suite = unittest.TestSuite()
    loader = unittest.TestLoader()
    
    print '=============='
    print '=============='
    print 'Run test suite'
    
    suite.addTests(loader.loadTestsFromTestCase(GdalBindingTest))
    suite.addTests(loader.loadTestsFromTestCase(GeoreferenceTest))
    return suite

if __name__ == '__main__':
    unittest.TextTestRunner(verbosity=2).run(test_suite())