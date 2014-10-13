'''
Created on Oct 13, 2014

@author: mendt
'''
from vkviewer.python.models.messtischblatt.Metadata import Metadata
from georeference.settings import DATABASE_SRID, CACHE_DIR, VRT_TARGET_DIR, DBCONFIG_PARAMS, TMP_DIR
from georeference.scripts.updatetms import buildTMSCache
from georeference.scripts.updatevrt import updateVirtualdatasetForTimestamp

def updateServices(mapObj, destPath, dbsession, logger):
    logger.info('Calculating tms cache and vrt...')
    buildTMSCache(destPath, CACHE_DIR, DATABASE_SRID, logger)
    
    metadata = Metadata.by_id(mapObj.id, dbsession)
    updateVirtualdatasetForTimestamp('%s-01-01 00:00:00'%metadata.timepublish.year, VRT_TARGET_DIR, TMP_DIR, DBCONFIG_PARAMS, dbsession, logger)