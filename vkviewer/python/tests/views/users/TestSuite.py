'''
Created on Jan 22, 2014

@author: mendt
'''
import unittest
from GeoreferenceProfileTest import GeoreferenceProfileTest

def test_suite():
    suite = unittest.TestSuite()
    loader = unittest.TestLoader()
    
    suite.addTests(loader.loadTestsFromTestCase(GeoreferenceProfileTest))
    return suite

if __name__ == '__main__':
    unittest.TextTestRunner(verbosity=2).run(test_suite())