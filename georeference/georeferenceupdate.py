'''
Created on Sep 25, 2014

@author: mendt
'''
import logging
from vkviewer.python.models.messtischblatt.Georeferenzierungsprozess import Georeferenzierungsprozess
from vkviewer.python.models.messtischblatt.AdminJobs import AdminJobs
from vkviewer.python.utils.logger import createLogger
from georeference.jobs.newjobs import runNewGeoreferenceProcess 
from georeference.jobs.updatejobs import runUpdateGeoreferenceProcess
from georeference.jobs.adminjobs import setIsValide, setInValide
from georeference.settings import DBCONFIG_PARAMS
from georeference.utils.tools import loadDbSession

def lookForUpdateProcess(dbsession, logger, testing = False):
    runningNewJobs(dbsession, logger, testing)
    runningUpdateJobs(dbsession, logger, testing)
    runningAdminJobs(dbsession, logger, testing)
    
    if not testing:
        dbsession.commit()    
    
def runningAdminJobs(dbsession, logger, testing):
    logger.info('Check for admin jobs')
    jobs = AdminJobs.getUnprocessedJobs(dbsession)
    
    # process jobs
    for job in jobs:
        if job.setto == 'isvalide':
            setIsValide(job, dbsession, logger)
            job.processed = True
        elif job.setto == 'invalide':
            setInValide(job, dbsession, logger)
            job.processed = True
    
def runningNewJobs(dbsession, logger, testing = False):
    logger.info('Check for unprocessed georeference jobs ...')
    unprocessedJobs = Georeferenzierungsprozess.by_getUnprocessedGeorefProcessesTypeOfNew(dbsession)
    
    counterNew = 0
    for job in unprocessedJobs:
        logger.debug('Process a new georeference process with id - %s'%job.id)
        runNewGeoreferenceProcess(job, dbsession, logger, testing)
        counterNew += 1
    
    logger.debug('Processed %s new georeference process.'%counterNew)
    
def runningUpdateJobs(dbsession, logger, testing = False):
    logger.info('Fetch overwrite id for unprocessed georeference jobs ...')
    overwrites = Georeferenzierungsprozess.by_getOverwriteIdsOfUnprocessedGeorefProcessesTypeOfUpdate(dbsession)
                 
    counter = 0
    # clear all unnecessary overwrites and run update process for the actual process
    for overwrite in overwrites:
        # check if there is an old race conflict
        if not clearRaceConflicts(overwrite, dbsession):
            counter += 1
            jobs = Georeferenzierungsprozess.getJobsWithSameOverwrites(overwrite, dbsession)
            pendingJob = None
            for job in jobs:
                if pendingJob is None:
                    pendingJob = job
                else:
                    dbsession.delete(job)
                    
            logger.debug('Process a update georeference process with id - %s'%job.id)
            runUpdateGeoreferenceProcess(pendingJob, dbsession, logger, testing)
    
    logger.debug('Processed %s update georeference process.'%counter)
    
def clearRaceConflicts(overwrite, dbsession):
    # double check if there are jobs which should be deleted
    # this clears the case that while there was on job activated in the past
    # there was still because of concurrency another jobs registered with the same
    # overwrites id
    possibleConflictJobs = Georeferenzierungsprozess.getJobsWithSameOverwrites(overwrite, dbsession)

    alreadyActiveJob = None
    for conflictJob in possibleConflictJobs:
        if conflictJob.isactive == True:
            alreadyActiveJob = conflictJob
            
    if alreadyActiveJob is not None:
        for conflictJob in possibleConflictJobs:
            if conflictJob.id != alreadyActiveJob.id:
                dbsession.delete(conflictJob)  
        return True
    return False

""" Main """    
if __name__ == '__main__':
    logger = createLogger(name = 'test', level = logging.DEBUG)
    logger.info('Looking for pending georeference processes ...')
    dbsession = loadDbSession(DBCONFIG_PARAMS, logger)  
    lookForUpdateProcess(dbsession, logger, True)
    dbsession.commit()
