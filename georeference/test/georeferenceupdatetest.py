'''
Created on Sep 29, 2014

@author: mendt
'''

import unittest, logging
from georeference.settings import DBCONFIG_PARAMS
from georeference.utils.tools import loadDbSession
from georeference.georeferenceupdate import runningResetJobs, runningNewJobs, runningUpdateJobs
from vkviewer.python.utils.logger import createLogger
from vkviewer.python.models.messtischblatt.Georeferenzierungsprozess import Georeferenzierungsprozess

class GeoreferenceUpdateTest(unittest.TestCase):

    @classmethod
    def setUpClass(cls):   
        print '=============='
        print 'Start georeferenceupdate tests ...'
        print '=============='
        cls.logger = createLogger(name = 'GeoreferenceUpdateTest', level = logging.DEBUG)
    
    @unittest.skip('Skip testRunningResetJobs')
    def testRunningResetJobs(self):
        print "--------------------------------------------------------------------------------------------"
        print "\n"
        print "Test if runningResetJobs runs correctly ..." 
        
        dbsession = loadDbSession(DBCONFIG_PARAMS, self.logger)      
        response = runningResetJobs(dbsession, self.logger, True)
        
        # check if the reset functions
        resetJobs = Georeferenzierungsprozess.getResetJobs(dbsession)
        counter = 0
        for job in resetJobs:
            counter += 1
        self.assertTrue(counter == 0, 'There are unprocessed reset jobs ...')
        
        dbsession.rollback()
        
    #@unittest.skip('Skip testRunningNewJobs')
    def testRunningNewJobs(self):
        print "--------------------------------------------------------------------------------------------"
        print "\n"
        print "Test if testRunningNewJobs runs correctly ..." 
        
        dbsession = loadDbSession(DBCONFIG_PARAMS, self.logger)      
        response = runningNewJobs(dbsession, self.logger, True)
        
        # add tests
        # @TODO
        
        dbsession.rollback()
  
    #@unittest.skip('Skip testRunningNewJobs')
    def testRunningUpdateJobs(self):
        print "--------------------------------------------------------------------------------------------"
        print "\n"
        print "Test if testRunningUpdateJobs runs correctly ..." 
        
        dbsession = loadDbSession(DBCONFIG_PARAMS, self.logger)      
        response = runningUpdateJobs(dbsession, self.logger, True)
        
        # add tests
        # @TODO
        
        dbsession.rollback()
if __name__ == "__main__":
    #import sys;sys.argv = ['', 'Test.testName']
    unittest.main()