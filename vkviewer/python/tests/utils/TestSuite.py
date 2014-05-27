'''
Created on Jan 27, 2014

@author: mendt
'''
import unittest
from SendMailTest import SendMailTest
from ParserTest import ParserTest

def test_suite():
    suite = unittest.TestSuite()
    loader = unittest.TestLoader()
    
    #suite.addTests(loader.loadTestsFromTestCase(SendMailTest))
    suite.addTests(loader.loadTestsFromTestCase(ParserTest))
    return suite

if __name__ == '__main__':
    unittest.TextTestRunner(verbosity=2).run(test_suite())