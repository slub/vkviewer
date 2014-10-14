'''
Created on Oct 13, 2014

@aut
author: mendt
'''
from vkviewer.python.models.messtischblatt.Map import Map
from vkviewer.python.models.messtischblatt.Georeferenzierungsprozess import Georeferenzierungsprozess
from vkviewer.python.utils.exceptions import GeoreferenceProcessingError

from georeference.jobs.genericjobs import updateServices, processGeorefImage, getParsedGeorefParams
from georeference.jobs.newjobs import updateNewGeoreferenceMapInDatabase

def runUpdateGeoreferenceProcess(job, dbsession, logger, testing = False):
    logger.info('Run georeference process with type "update" with id %s ...'%job.id)

    # calculate georeference result 
    logger.info('Create persistent georeference result ...')
    mapObj = Map.by_id(job.mapsid, dbsession)
    georefParams = getParsedGeorefParams(job)
    destPath = processGeorefImage(mapObj, georefParams, dbsession, logger)
         
    # update vrt and tms services
    updateServices(mapObj, destPath, dbsession, logger)

    if destPath is None:
        logger.error('Something went wrong while trying to process a georeference process.')
        raise GeoreferenceProcessingError('Something went wrong while trying to process a georeference process.')
  
    if mapObj.isttransformiert == False:
        updateNewGeoreferenceMapInDatabase(mapObj, job, destPath, dbsession)
        
    logger.info('Register update georeferenced map into database ...')
    registerUpdateGeoreferenceMapInDatabase(job, destPath, dbsession)
      
    return str(destPath)


            
def registerUpdateGeoreferenceMapInDatabase(job, destPath, dbsession):
    # get actual active georeference process and deactive it
    activeJob = Georeferenzierungsprozess.by_id(job.overwrites, dbsession)
    if activeJob:               
        # deactive this job
        activeJob.isactive = False

    dbsession.flush()
    
    # update process
    job.processed = True
    job.isactive = True
    dbsession.flush()
    
    