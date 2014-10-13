'''
Created on Oct 13, 2014

@aut
author: mendt
'''
import ast, os
from vkviewer.python.utils.parser import parseGcps
from vkviewer.python.models.messtischblatt.Map import Map
from vkviewer.python.models.messtischblatt.Georeferenzierungsprozess import Georeferenzierungsprozess
from vkviewer.python.utils.exceptions import GeoreferenceProcessingError
from vkviewer.python.georef.georeferencer import georeference, addOverviews

from georeference.settings import DATABASE_SRID, TMP_DIR, GEOREF_TARGET_DIR
from georeference.jobs.genericjobs import updateServices
from georeference.jobs.newjobs import updateNewGeoreferenceMapInDatabase

def runUpdateGeoreferenceProcess(job, dbsession, logger, testing = False):
    logger.info('Run georeference process with type "update" with id %s ...'%job.id)
    
    # at first check if there are multiple concurrency update processes
    # if yes take the last one and delete the others
    clearedJob = clearConcurrentUpdateJobs(job, dbsession, logger)
        
    if clearedJob.processed == True:
        logger.debug('Process has already processed, because of previous overwrites id conflicts ...')
        return True

    # calculate georeference result 
    logger.info('Create persistent georeference result ...')
    mapObj = Map.by_id(clearedJob.mapsid, dbsession)
    georefParams = getParsedGeorefParams(clearedJob)
    clip_polygon = Map.getBoundingBoxObjWithEpsg(mapObj.id, dbsession, DATABASE_SRID).asShapefile(os.path.join(TMP_DIR, mapObj.apsdateiname+'clip_polygon'))
    destPath = georeference(mapObj.originalimage, os.path.join(GEOREF_TARGET_DIR,mapObj.apsdateiname+'.tif'), 
                TMP_DIR, georefParams, DATABASE_SRID, DATABASE_SRID, 'polynom', logger, clip_polygon)
    addOverviews(destPath, '2 4 8 16 32', logger)
         
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

def clearConcurrentUpdateJobs(job, dbsession, logger):
    jobs = Georeferenzierungsprozess.getJobsWithSameOverwrites(job.overwrites, dbsession)
    
    counter = 0
    clearedJob = None
    for concurrentJob in jobs:
        counter += 1
        if clearedJob is None:
            clearedJob = concurrentJob
        else:
            dbsession.delete(concurrentJob)
            
    dbsession.flush()
    logger.debug('Cleared %s georeference process conflict with update georeference process %s ...'%(counter, clearedJob.id))
    return clearedJob
    
def getParsedGeorefParams(job):
    parsedGeorefParameter = ast.literal_eval(str(job.georefparams))['new']
    epsg_code = int(str(parsedGeorefParameter['target']).split(':')[1])
    if parsedGeorefParameter['source'] == 'pixel' and epsg_code == 4314:
        return parseGcps(parsedGeorefParameter['gcps'])
    raise GeoreferenceProcessingError('Could not parse georeference parameter from georeference process %s ...'%job.id)

def registerUpdateGeoreferenceMapInDatabase(job, destPath, dbsession):
    # get actual active georeference process and deactive it
    activeJob = Georeferenzierungsprozess.getActualGeoreferenceProcessForMapId(job.mapsid, dbsession)
    if activeJob:
        activeJob.isactive = False
    
    # update process
    job.processed = True
    job.isactive = True
    dbsession.flush()
    
    