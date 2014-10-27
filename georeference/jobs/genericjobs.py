'''
Created on Oct 13, 2014

@author: mendt
'''
import os, ast
from vkviewer.python.utils.parser import parseGcps
from vkviewer.python.models.messtischblatt.Metadata import Metadata
from vkviewer.python.models.messtischblatt.Map import Map
from vkviewer.python.utils.exceptions import GeoreferenceProcessingError
from vkviewer.python.georef.georeferencer import georeference, addOverviews

from georeference.settings import DATABASE_SRID, CACHE_DIR, VRT_TARGET_DIR, DBCONFIG_PARAMS, TMP_DIR, GEOREF_TARGET_DIR
from georeference.scripts.updatetms import buildTMSCache
from georeference.scripts.updatevrt import updateVirtualdatasetForTimestamp

def updateServices(mapObj, destPath, dbsession, logger):
    logger.info('Calculating tms cache and vrt...')
    buildTMSCache(destPath, CACHE_DIR, DATABASE_SRID, logger)
    
    metadata = Metadata.by_id(mapObj.id, dbsession)
    updateVirtualdatasetForTimestamp('%s-01-01 00:00:00'%metadata.timepublish.year, VRT_TARGET_DIR, TMP_DIR, DBCONFIG_PARAMS, dbsession, logger)
    
def processGeorefImage(mapObj, georefParams, dbsession, logger):  
    clip_polygon = Map.getBoundingBoxObjWithEpsg(mapObj.id, dbsession, DATABASE_SRID).asShapefile(os.path.join(TMP_DIR, mapObj.apsdateiname+'clip_polygon'))
    destPath = georeference(mapObj.originalimage, os.path.join(GEOREF_TARGET_DIR, mapObj.apsdateiname+'.tif'), 
                TMP_DIR, georefParams, DATABASE_SRID, DATABASE_SRID, 'polynom', logger, clip_polygon)
    addOverviews(destPath, '2 4 8 16 32', logger)
    return destPath

def getParsedGeorefParams(job):
    if job.type == 'update':
        parsedGeorefParameter = ast.literal_eval(str(job.georefparams))['new']
    else:
        parsedGeorefParameter = ast.literal_eval(str(job.georefparams))
    epsg_code = int(str(parsedGeorefParameter['target']).split(':')[1])
    if parsedGeorefParameter['source'] == 'pixel' and epsg_code == 4314:
        return parseGcps(parsedGeorefParameter['gcps'])
    raise GeoreferenceProcessingError('Could not parse georeference parameter from georeference process %s ...'%job.id)

