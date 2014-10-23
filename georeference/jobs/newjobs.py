'''
Created on Oct 13, 2014

@aut
author: mendt
'''
from vkviewer.python.models.messtischblatt.Map import Map
from vkviewer.python.models.messtischblatt import RefMapLayer.RefMapsLayer
from vkviewer.python.utils.exceptions import GeoreferenceProcessingError

from georeference.csw.InsertMetadata import insertMetadata
from georeference.jobs.genericjobs import updateServices, processGeorefImage, getParsedGeorefParams

def runNewGeoreferenceProcess(job, dbsession, logger, testing = False):
    logger.info('Run georeference process with type "new" with id %s ...'%job.id)
        
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
 
    logger.info('Register new georeferenced map into database ...')
    updateNewGeoreferenceMapInDatabase(mapObj, job, destPath, dbsession)

    if not testing:
        # push metadata to catalogue
        logger.debug('Push metadata record for map %s to cataloge service ...'%mapObj.id)
        insertMetadata(id=mapObj.id,db=dbsession,logger=logger)
    
    return str(destPath)

def updateNewGeoreferenceMapInDatabase(mapObj, job, destPath, dbsession):
    mapObj.georefimage = destPath
    mapObj.isttransformiert = True
    
    # has to be updated
    refmapslayer = RefMapLayer.by_id(87, mapObj.id, dbsession)
    if not refmapslayer:
        refmapslayer = RefMapLayer(layerid=87, mapid=mapObj.id)
        dbsession.add(refmapslayer)
    
    # update process
    job.processed = True
    job.isactive = True
    dbsession.flush()
    
    