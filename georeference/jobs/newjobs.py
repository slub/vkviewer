'''
Created on Oct 13, 2014

@aut
author: mendt
'''
import ast, os
from vkviewer.python.utils.parser import parseGcps
from vkviewer.python.models.messtischblatt.Map import Map
from vkviewer.python.models.messtischblatt.RefMapsLayer import RefMapsLayer
from vkviewer.python.utils.exceptions import GeoreferenceProcessingError
from vkviewer.python.georef.georeferencer import georeference, addOverviews

from georeference.settings import DATABASE_SRID, TMP_DIR, GEOREF_TARGET_DIR
from georeference.csw.InsertMetadata import insertMetadata
from georeference.jobs.genericjobs import updateServices

def runNewGeoreferenceProcess(job, dbsession, logger, testing = False):
    logger.info('Run georeference process with type "new" with id %s ...'%job.id)
        
    # calculate georeference result 
    logger.info('Create persistent georeference result ...')
    mapObj = Map.by_id(job.mapsid, dbsession)
    georefParams = getParsedGeorefParams(job)
    clip_polygon = Map.getBoundingBoxObjWithEpsg(mapObj.id, dbsession, DATABASE_SRID).asShapefile(os.path.join(TMP_DIR, mapObj.apsdateiname+'clip_polygon'))
    destPath = georeference(mapObj.originalimage, os.path.join(GEOREF_TARGET_DIR,mapObj.apsdateiname+'.tif'), 
                TMP_DIR, georefParams, DATABASE_SRID, DATABASE_SRID, 'polynom', logger, clip_polygon)
    addOverviews(destPath, '2 4 8 16 32', logger)
        
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

def getParsedGeorefParams(job):
    parsedGeorefParameter = ast.literal_eval(str(job.georefparams))
    epsg_code = int(str(parsedGeorefParameter['target']).split(':')[1])
    if parsedGeorefParameter['source'] == 'pixel' and epsg_code == 4314:
        return parseGcps(parsedGeorefParameter['gcps'])
    raise GeoreferenceProcessingError('Could not parse georeference parameter from georeference process %s ...'%job.id)

def updateNewGeoreferenceMapInDatabase(mapObj, job, destPath, dbsession):
    mapObj.georefimage = destPath
    mapObj.isttransformiert = True
    
    # has to be updated
    refmapslayer = RefMapsLayer.by_id(87, mapObj.id, dbsession)
    if not refmapslayer:
        refmapslayer = RefMapsLayer(layerid=87, mapid=mapObj.id)
        dbsession.add(refmapslayer)
    
    # update process
    job.processed = True
    job.isactive = True
    dbsession.flush()
    
    