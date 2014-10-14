'''
Created on Sep 25, 2014

@author: mendt
'''
import time 
from vkviewer.python.models.messtischblatt.Georeferenzierungsprozess import Georeferenzierungsprozess
from georeference.jobs.resetjobs import rollbackGeoreferenceProcess, resetGeoreferenceProcess
from georeference.jobs.newjobs import runNewGeoreferenceProcess
from georeference.jobs.updatejobs import runUpdateGeoreferenceProcess


def lookForUpdateProcess(dbsession, logger, testing = False):
    runningResetJobs(dbsession, logger, testing)
    runningNewJobs(dbsession, logger, testing)
    runningUpdateJobs(dbsession, logger, testing)
    
    if not testing:
        dbsession.commit()    
    
def runningResetJobs(dbsession, logger, testing = False):
    logger.info('Check for reset jobs ...')
    resetJobs = Georeferenzierungsprozess.getResetJobs(dbsession)
    
    counterRollbacks = 0
    counterResets = 0
    for job in resetJobs:
        if job.type == 'update':
            logger.debug('Doing a rollback for georeference process id - %s'%job.id)
            rollbackGeoreferenceProcess(job, dbsession, logger, testing)
            counterRollbacks += 1
        elif job.type == 'new':
            logger.debug('Doing a reset for georeference process id - %s'%job.id)
            resetGeoreferenceProcess(job, dbsession, logger, testing)
            counterResets += 1
        else:
            raise Exception('Missing type information for georeference process ...')
    
    logger.info('Processed %s rollbacks and %s resets.'%(counterRollbacks, counterResets))
    
def runningNewJobs(dbsession, logger, testing = False):
    logger.info('Check for unprocessed georeference jobs ...')
    unprocessedJobs = Georeferenzierungsprozess.by_getUnprocessedGeorefProcesses(dbsession)
    
    counterNew = 0
    for job in unprocessedJobs:
        if job.type == 'new' and job.overwrites == 0:
            logger.debug('Process a new georeference process with id - %s'%job.id)
            runNewGeoreferenceProcess(job, dbsession, logger, testing)
            counterNew += 1
    
    logger.debug('Processed %s new georeference process.'%counterNew)
    
def runningUpdateJobs(dbsession, logger, testing = False):
    logger.info('Check for unprocessed georeference jobs ...')
    unprocessedJobs = Georeferenzierungsprozess.by_getUnprocessedGeorefProcesses(dbsession)
    
    # sort jobs by overwrite id
    overwrites = []
    for job in unprocessedJobs:
        if job.type == 'update' and job.overwrites > 0 and job.overwrites not in overwrites:
            overwrites.append(job.overwrites)
            
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