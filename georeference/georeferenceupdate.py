'''
Created on Sep 25, 2014

@author: mendt
'''
import time 
from vkviewer.python.models.messtischblatt.Georeferenzierungsprozess import Georeferenzierungsprozess
from georeference.jobs.resetjobs import rollbackGeoreferenceProcess, resetGeoreferenceProcess
from georeference.jobs.newjobs import runNewGeoreferenceProcess
from georeference.jobs.updatejobs import runUpdateGeoreferenceProcess


def do(logger):
    logger.info('Start doing ...')
    time.sleep(7)
    logger.info('End doing ...')
    
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
    
    counterUpdate = 0
    # the overwrites parameter is important to prevent multiple processing
    # of conflicting georeference update processes
    overwrites= []
    for job in unprocessedJobs:
        if job.type == 'update' and job.overwrites > 0 and job.overwrites not in overwrites:
            logger.debug('Process a update georeference process with id - %s'%job.id)
            runUpdateGeoreferenceProcess(job, dbsession, logger, testing)
            overwrites.append(job.overwrites)
            counterUpdate += 1
    
    logger.debug('Processed %s update georeference process.'%counterUpdate)