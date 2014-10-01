'''
Created on Sep 29, 2014

@author: mendt
'''

import unittest, logging
from vkviewer.python.utils.logger import createLogger

class GeoreferenceUpdateTest(unittest.TestCase):

    @classmethod
    def setUpClass(cls):   
        print '=============='
        print 'Start georeferenceupdate tests ...'
        print '=============='
        cls.logger = createLogger(name = 'GeoreferenceUpdateTest', level = logging.INFO)
        
    def testCreateVrt(self):
        self.logger.info('Test if create vrt works ...')

        
  
        
if __name__ == "__main__":
    #import sys;sys.argv = ['', 'Test.testName']
    unittest.main()