'''
Created on Oct 7, 2014

@author: mendt
'''
from georeference.csw.CswTransactionBinding import gn_transaction_delete
from georeference.settings import GN_SETTINGS
from vkviewer.python.models.messtischblatt.Map import Map
from vkviewer.python.models.messtischblatt.RefMtbLayer import RefMtbLayer
from vkviewer.python.utils.idgenerator import createOAI
from vkviewer.python.models.messtischblatt.Georeferenzierungsprozess import Georeferenzierungsprozess


def rollbackGeoreferenceProcess(job, dbsession, logger, testing = False):
    logger.debug('Doing a rollback from georeference process %s to %s ...'%(job.id, job.overwrites))
    
    # get old process
    logger.debug('Get overwriten valide georeference process ...')
    oldJob = Georeferenzierungsprozess.by_id(job.overwrites, dbsession)
    if oldJob.adminvalidation == 'isvalide':
        # update image for this process
        # @TODO
         
        logger.debug('Doing georeference process rollback on database ...')
        # reset actual process
        job.isactive = False
        oldJob.isactive = True
    elif oldJob.overwrites > 0:
        rollbackGeoreferenceProcess(oldJob, dbsession, logger)
    else:
        resetGeoreferenceProcess(job, dbsession, logger, testing)
    
def resetGeoreferenceProcess(job, dbsession, logger, testing = False):
    logger.debug('Reset map with id %s connected to georeference process %s ...'%(job.mapsid, job.id))
    
    # reset map object
    mapObj = Map.by_id(job.mapsid, dbsession)
    resetMapObject(mapObj, logger)
    
    # reset map layer relations
    # @TODO database refactoring
    # Right now not generic and can not expanded on map types
    logger.debug('Reset map - layer relations ...')
    refmtblayer = RefMtbLayer.by_id(87, mapObj.apsobjectid, dbsession)
    if refmtblayer:
        dbsession.delete(refmtblayer)
        
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