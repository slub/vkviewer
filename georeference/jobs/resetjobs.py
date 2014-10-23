'''
Created on Oct 7, 2014

@author: mendt
'''
from vkviewer.python.models.messtischblatt.Map import Map
from vkviewer.python.models.messtischblatt.RefMapLayer import RefMapLayer
from vkviewer.python.utils.idgenerator import createOAI
from vkviewer.python.models.messtischblatt.Georeferenzierungsprozess import Georeferenzierungsprozess
from vkviewer.python.utils.exceptions import GeoreferenceProcessingError

from georeference.csw.CswTransactionBinding import gn_transaction_delete
from georeference.settings import GN_SETTINGS, MAPPING_LAYERID
from georeference.jobs.genericjobs import updateServices, processGeorefImage, getParsedGeorefParams

def rollbackGeoreferenceProcess(job, dbsession, logger, testing = False):
    logger.debug('Doing a rollback from georeference process %s to %s ...'%(job.id, job.overwrites))
    
    # get old process
    logger.debug('Get overwriten valide georeference process ...')
    oldJob = Georeferenzierungsprozess.by_id(job.overwrites, dbsession)
    if oldJob.adminvalidation == 'isvalide' or oldJob.adminvalidation == '':
        # update image for this process
        logger.info('Update persistent georeference result ...')
        mapObj = Map.by_id(job.mapid, dbsession)
        
        georefParams = getParsedGeorefParams(oldJob)
        destPath = processGeorefImage(mapObj, georefParams, dbsession, logger)
        updateServices(mapObj, destPath, dbsession, logger)
    
        if destPath is None:
            logger.error('Something went wrong while trying to process a georeference process.')
            raise GeoreferenceProcessingError('Something went wrong while trying to process a georeference process.')
         
        logger.debug('Doing georeference process rollback on database ...')
        # reset actual process
        job.isactive = False
        dbsession.flush()
        oldJob.isactive = True
        return 
    elif oldJob.overwrites > 0:
        rollbackGeoreferenceProcess(oldJob, dbsession, logger)
        return
    else:
        resetGeoreferenceProcess(job, dbsession, logger, testing)
    
def resetGeoreferenceProcess(job, dbsession, logger, testing = False):
    logger.debug('Reset map with id %s connected to georeference process %s ...'%(job.mapid, job.id))
    
    # reset map object
    mapObj = Map.by_id(job.mapid, dbsession)
    resetMapObject(mapObj, logger)
    
    # reset map layer relations
    # @TODO database refactoring
    # Right now not generic and can not expanded on map types
    logger.debug('Reset map - layer relations ...')
    refmaplayer = RefMapLayer.by_id(MAPPING_LAYERID[mapObj.maptype], mapObj.id, dbsession)
    if refmaplayer:
        dbsession.delete(refmaplayer)
        
    logger.debug('Remove metadata record from catalog instance ...')
    if not testing:
        oai = createOAI(map.id)
        gn_transaction_delete(oai, GN_SETTINGS['gn_username'], GN_SETTINGS['gn_password'], logger)
        
    logger.debug('Deactivate job ...')
    job.isactive = False
    return True    

def resetMapObject(mapObj, logger):
    logger.debug('Reset map object into unreferenced state.')
    
    mapObj.isttransformiert = False
    mapObj.hasgeorefparams = 0
    mapObj.georefimage = ''