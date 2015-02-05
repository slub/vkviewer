'''
Created on Dec 3, 2014

@author: mendt
'''
from vkviewer.python.models.messtischblatt.RefMapLayer import RefMapLayer
from vkviewer.python.utils.idgenerator import createOAI
from vkviewer.python.utils.exceptions import GeoreferenceProcessingError

from georeference.csw.InsertMetadata import insertMetadata
from georeference.csw.CswTransactionBinding import gn_transaction_delete
from georeference.settings import GN_SETTINGS, MAPPING_LAYERID
from georeference.jobs.genericjobs import updateServices, processGeorefImage, getParsedGeorefParams

def activate(georefProcess, mapObj, dbsession, logger):
    """ This function activates a georeference process for a mapObj.
        
        @param vkviewer.python.models.messtischblatt.Georeferenzierungsprozess: job
        @param vkviewer.python.models.messtischblatt.Map: mapObj
        @param sqlalchemy.orm.session.Session: dbsession
        @param logging.Logger: logger
    """ 
    logger.debug('Activate georeference process with id %s ...'%georefProcess.id)
    
    logger.debug('Create persistent georeference result ...')
    georefParams = getParsedGeorefParams(georefProcess)
    destPath = processGeorefImage(mapObj, georefParams, dbsession, logger)
        
    # update vrt and tms services
    updateServices(mapObj, destPath, dbsession, logger)
    
    if destPath is None:
        logger.error('Something went wrong while trying to process a georeference process.')
        raise GeoreferenceProcessingError('Something went wrong while trying to process a georeference process.')
 
    logger.debug('Set map as active ...')
  
    mapObj.georefimage = destPath
    mapObj.isttransformiert = True
     
    # push metadata to catalogue
    logger.debug('Push metadata record for map %s to cataloge service ...'%mapObj.id)
    insertMetadata(id=mapObj.id,db=dbsession,logger=logger)
        
    # has to be updated
    layerid = MAPPING_LAYERID[mapObj.maptype]
    refmapslayer = RefMapLayer.by_id(layerid, mapObj.id, dbsession)
    if not refmapslayer:
        refmapslayer = RefMapLayer(layerid=layerid, mapid=mapObj.id)
        dbsession.add(refmapslayer)
    
    # update process
    georefProcess.processed = True
    georefProcess.isactive = True
    dbsession.flush()
    
def deactivate(georefProcess, mapObj, dbsession, logger):    
    """ This function deactivates a georeference process for a mapObj.
        
        @param vkviewer.python.models.messtischblatt.Georeferenzierungsprozess: job
        @param vkviewer.python.models.messtischblatt.Map: mapObj
        @param sqlalchemy.orm.session.Session: dbsession
        @param logging.Logger: logger
    """ 
    logger.debug('Deactivate georeference process with id %s ...'%georefProcess.id)
    
    # reset mapObj
    mapObj.isttransformiert = False
    mapObj.georefimage = ''
    
    # reset map layer relations
    # @TODO database refactoring
    # Right now not generic and can not expanded on map types
    logger.debug('Reset map - layer relations ...')
    refmaplayer = RefMapLayer.by_id(MAPPING_LAYERID[mapObj.maptype], mapObj.id, dbsession)
    if refmaplayer:
        dbsession.delete(refmaplayer)
        
    logger.debug('Remove metadata record from catalog instance ...')
    oai = createOAI(mapObj.id)
    gn_transaction_delete(oai, GN_SETTINGS['gn_username'], GN_SETTINGS['gn_password'], logger)
        
    logger.debug('Deactivate job ...')
    georefProcess.isactive = False
    dbsession.flush()