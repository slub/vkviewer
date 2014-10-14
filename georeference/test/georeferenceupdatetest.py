'''
Created on Sep 29, 2014

@author: mendt
'''

import unittest, logging, time
from georeference.settings import DBCONFIG_PARAMS
from georeference.utils.tools import loadDbSession
from georeference.georeferenceupdate import runningResetJobs, runningNewJobs, runningUpdateJobs, lookForUpdateProcess
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
        
    @unittest.skip('Skip testRunningNewJobs')
    def testRunningNewJobs(self):
        print "--------------------------------------------------------------------------------------------"
        print "\n"
        print "Test if testRunningNewJobs runs correctly ..." 
        
        dbsession = loadDbSession(DBCONFIG_PARAMS, self.logger)      
        response = runningNewJobs(dbsession, self.logger, True)
        
        # add tests
        # @TODO
        
        dbsession.rollback()
  
    @unittest.skip('Skip testRunningNewJobs')
    def testRunningUpdateJobs(self):
        print "--------------------------------------------------------------------------------------------"
        print "\n"
        print "Test if testRunningUpdateJobs runs correctly ..." 
        
        dbsession = loadDbSession(DBCONFIG_PARAMS, self.logger)      
        response = runningUpdateJobs(dbsession, self.logger, True)
        
        # add tests
        # @TODO
        
        dbsession.rollback()
        
    @unittest.skip('Skip testLookForUpdateProcess')
    def testLookForUpdateProcess(self):
        print "--------------------------------------------------------------------------------------------"
        print "\n"
        print "Test if testLookForUpdateProcess runs correctly ..." 
        
        dbsession = loadDbSession(DBCONFIG_PARAMS, self.logger)      
        response = lookForUpdateProcess(dbsession, self.logger, True)
        
        # add tests
        # @TODO
        
        dbsession.rollback()
        
    #@unittest.skip('Skip testLookForUpdateProcess_Infinity')
    def testLookForUpdateProcess_Infinity(self):
        print "--------------------------------------------------------------------------------------------"
        print "\n"
        print "Test if testLookForUpdateProcess_Infinity runs correctly ..." 
        
        dbsession = loadDbSession(DBCONFIG_PARAMS, self.logger)      
        while True:
            print "New loop run ..."
            lookForUpdateProcess(dbsession, self.logger, True)
            dbsession.commit()
            print "Long sleep ..."
            time.sleep(10)
            
        
        # add tests
        # @TODO
        

if __name__ == "__main__":
    #import sys;sys.argv = ['', 'Test.testName']
    unittest.main()