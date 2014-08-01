#!/usr/bin/env python
# -*- coding: utf-8 -*-
#/******************************************************************************
# * $Id: UpdateMappingService.py 2014-01-28 jmendt $
# *
# * Project:  Virtuelles Kartenforum 2.0
# * Purpose:  This script encapsulate then tasks which are run for updating the vk2 mapping services. This 
# *           includes asking the database for new georeference process parameter and if they are available 
# *           it run's incremental for each timestamp the following process. At first it's calculate for all
# *           messtischblätter per timestamp the georeference maps. After that it recalculate the virtual    
# *           datasets for the timestamps, which are used for by the original wms for publishing the messtischblätter.
# *           After that it reseeds the cache for there extend of the new georeferenced messtischblätter for 
# *           the timestamp. At least it update's the database and pushed the metadata for the messtischblätter
# *           to the csw service. From this moment on the messtischblätter together with there metadata are 
# *           available for the users. 
# * Author:   Jacob Mendt
# * @todo:    Update georeference datasource
# *
# *
# ******************************************************************************
# * Copyright (c) 2014, Jacob Mendt
# *
# * Permission is hereby granted, free of charge, to any person obtaining a
# * copy of this software and associated documentation files (the "Software"),
# * to deal in the Software without restriction, including without limitation
# * the rights to use, copy, modify, merge, publish, distribute, sublicense,
# * and/or sell copies of the Software, and to permit persons to whom the
# * Software is furnished to do so, subject to the following conditions:
# *
# * The above copyright notice and this permission notice shall be included
# * in all copies or substantial portions of the Software.
# *
# * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
# * OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
# * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
# * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
# * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
# * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
# * DEALINGS IN THE SOFTWARE.
# ****************************************************************************/'''
import logging, argparse, os, subprocess, sys, ast
from datetime import datetime
from subprocess import CalledProcessError
from sqlalchemy.exc import IntegrityError

BASE_PATH = os.path.dirname(os.path.realpath(__file__))
BASE_PATH_PARENT = os.path.abspath(os.path.join(BASE_PATH, os.pardir))
ROOT_PATH = os.path.abspath(os.path.join(os.path.abspath(os.path.join(BASE_PATH_PARENT, os.pardir)), os.pardir))
sys.path.insert(0, BASE_PATH)
sys.path.append(BASE_PATH_PARENT)
sys.path.append(ROOT_PATH)

from vkviewer.settings import GN_SETTINGS
from vkviewer.python.models.Meta import initializeDb
from vkviewer.python.utils.logger import createLogger
from vkviewer.python.models.messtischblatt.Georeferenzierungsprozess import Georeferenzierungsprozess
from vkviewer.python.models.messtischblatt.Messtischblatt import Messtischblatt
from vkviewer.python.models.messtischblatt.MdZeit import MdZeit
from vkviewer.python.models.messtischblatt.RefMtbLayer import RefMtbLayer
from vkviewer.python.scripts.UpdateVirtualdatasets import updateVirtualdatasetForTimestamp
from vkviewer.python.scripts.UpdateCache import updateCache
from vkviewer.python.scripts.UpdateTMSCache import buildTsmCache
from vkviewer.python.scripts.csw.InsertMetadata import insertMetadata
from vkviewer.python.scripts.csw.CswTransactionBinding import gn_transaction_delete
from vkviewer.python.georef.georeferencer import georeference, addOverviews
from vkviewer.python.utils.parser import parseGcps
from vkviewer.python.utils.exceptions import GeoreferenceProcessingError, WrongParameterException

""" Default options """
# Threads which the mapcache_seeder uses
SEEDER_NRTHREADS = 2 
# EPSG Code of the grid coordinate system from the cache
SEEDER_EPSG = 900913

# Directory for saving the temporary files
TMP_DIR = '/tmp'

# Target dir for georeference messtischblatt
GEOREF_TARGET_DIR = '/tmp'

# Target dir for saving the virtual datasets
VRT_TARGET_DIR = '/tmp'
# Overview levels for VRT (see gdaladdo)
VRT_OVERVIEW_LEVELS = '64 128 256 512'

# Database parameter for messtischblatt db
PARAMS_DATABASE = {
    'host': '194.95.151.62',
    'user':'vkviewer',
    'password':'S1ubVK2.0!!',
    'db':'messtischblattdb',    
}

# Id of the database layer where the messtischblatt should be registered
MTB_LAYER_ID = 87

def loadDbSession(database_params): 
    logger.info('Initialize new database connection ...')
    sqlalchemy_enginge = 'postgresql+psycopg2://%(user)s:%(password)s@%(host)s:5432/%(db)s'%(database_params)
    try:
        return initializeDb(sqlalchemy_enginge)
    except:
        logger.error('Could not initialize database. Plase check your database settings parameter.')
        raise WrongParameterException('Could not initialize database. Plase check your database settings parameter.')
    
def getGeoreferenceProcessQueue(dbsession, logger):
    """ This functions build a georeference process queue. For this it looks for entries 
        in the georeference table with status unprocessed and extends it with georeference process
        for which the equivalent map object has status updated. 
        
        Arguments:
            dbsession {sqlalchemy.orm.session.Session}
            logger (Logger)
        Returns:
            dictionary where the key is a timestamp and the value a list object containing 
            tuple which contain orm mapper for the tables georeferenzierungsprozess and
            messtischblatt """
    try:
        # response object 
        response = { 'georeference':{}, 'reset': [] }
        
        # get unprocessed georeference process
        dictProcessingQueueGeoref = {}
        unprocessedGeorefProcs = Georeferenzierungsprozess.by_getUnprocessedGeorefProcesses(dbsession)
        for georefProc in unprocessedGeorefProcs:
            dictProcessingQueueGeoref[georefProc.messtischblattid] = georefProc
            
        # get updated messtischblätter
        updatedMesstischblaetter = Messtischblatt.getUpdatedMesstischblaetter(dbsession)
        for messtischblatt in updatedMesstischblaetter:
            # if there is no process for this mtb in the dictProcessingQueueGeoref than get one and add it
            if not messtischblatt.id in dictProcessingQueueGeoref:
                georefProc = Georeferenzierungsprozess.getLatestGeorefProcessForObjectId(messtischblatt.id, dbsession)
                # if georefProc is None there is no more georeference process and the map object 
                # should be resetted
                if georefProc is None:
                    response['reset'].append(messtischblatt.id)
                else:
                    dictProcessingQueueGeoref[messtischblatt.id] = georefProc
        
        # sort the georeference process by timestamps
        for key in dictProcessingQueueGeoref:
            # get timestamp for the equivalent map object to the georeference process
            time = MdZeit.by_id(dictProcessingQueueGeoref[key].messtischblattid, dbsession).time.year
            if time in response['georeference']:
                response['georeference'][time].append(dictProcessingQueueGeoref[key])
            else:
                response['georeference'][time] = [dictProcessingQueueGeoref[key]]
        return response
    except:
        logger.error('Unknown error while trying to create the georeference processing queue ...')
        raise        

def processSingleGeorefProc(georefProc, dbsession, logger, testing = False):
    logger.debug('Process single georeference process with id %s ...'%georefProc.id)
    
    # calculate georeference result 
    logger.debug('Create persistent georeference result ...')
    messtischblatt = Messtischblatt.by_id(georefProc.messtischblattid, dbsession)
    if str(georefProc.type) == 'update': 
        parsedGeorefParameter = ast.literal_eval(str(georefProc.clipparameter))['new']
    else:
        parsedGeorefParameter = ast.literal_eval(str(georefProc.clipparameter))
        
    epsg_code = int(str(parsedGeorefParameter['target']).split(':')[1])
    if parsedGeorefParameter['source'] == 'pixel' and epsg_code == 4314:
        gcps = parseGcps(parsedGeorefParameter['gcps'])
        clip_polygon = messtischblatt.BoundingBoxObj.asShapefile(os.path.join(TMP_DIR, messtischblatt.dateiname+'clip_polygon'))
        destPath = georeference(messtischblatt.original_path, os.path.join(GEOREF_TARGET_DIR,messtischblatt.dateiname+'.tif'), 
                         TMP_DIR, gcps, epsg_code, epsg_code, 'polynom', logger, clip_polygon)
        addOverviews(destPath, '2 4 8 16 32', logger)
        if destPath is None:
            logger.error('Something went wrong while trying to process a georeference process.')
            raise GeoreferenceProcessingError('Something went wrong while trying to process a georeference process.')
    
    if not testing:
        # push metadata to catalogue
        logger.debug('Push metadata record for messtischblatt %s to cataloge service ...'%messtischblatt.id)
        insertMetadata(id=messtischblatt.id,db=dbsession,logger=logger)
    
    # update database
    logger.debug('Update database ...')

    # update verzeichnispfad for messtischblatt
    georefProc.processed = True
    messtischblatt.verzeichnispfad = destPath
    messtischblatt.isttransformiert = True 
    refmtblayer = RefMtbLayer.by_id(MTB_LAYER_ID, messtischblatt.id, dbsession)
    if not refmtblayer:
        refmtblayer = RefMtbLayer(layer=MTB_LAYER_ID, messtischblatt=messtischblatt.id)
        dbsession.add(refmtblayer)
    dbsession.flush()   
        
    return str(destPath)

def resetMapObject(mapObjectId, dbsession, logger, testing = False):
    logger.debug('Reset map object into unreferenced state.')
    messtischblatt = Messtischblatt.by_id(mapObjectId, dbsession)
    messtischblatt.isttransformiert = False
    messtischblatt.hasgeorefparams = 0
    messtischblatt.verzeichnispfad = messtischblatt.original_path
    refmtblayer = RefMtbLayer.by_id(MTB_LAYER_ID, messtischblatt.id, dbsession)
    if refmtblayer:
        dbsession.remove(refmtblayer)
        
    if testing:
        dbsession.rollback()
    
    logger.debug('Remove metadata record from catalog instance')
    if not testing:
        gn_transaction_delete('vk20-md-%s'%messtischblatt.id, GN_SETTINGS['gn_username'], GN_SETTINGS['gn_password'], logger)
    return True

def updateDataSources(dbsession, database_params, vrt_target_dir, tmp_dir, cache_dir, logger, testing = True):   
    
    logger.info('Get georeference processing queue ...')
    processingQueue = getGeoreferenceProcessQueue(dbsession, logger)

    logger.info('Reset objects ...')
    for objectId in processingQueue['reset']:
        logger.info('Reset object with id %s ...'%objectId)
        resetMapObject(objectId, dbsession, logger, testing)
        
    logger.info('Update single georeferencing ...')
    for timestamp in processingQueue['georeference']:
        logger.info('Update timestamps %s ...'%timestamp)
        for georefProcess in processingQueue['georeference'][timestamp]:
            logger.info('Update georeferencing for objectid %s ...'%georefProcess.messtischblattid)
            processSingleGeorefProc(georefProcess, dbsession, logger, testing)
            logger.info('Calculating tms cache ...')
            messtischblatt = Messtischblatt.by_id(georefProcess.messtischblattid, dbsession)
            buildTsmCache(messtischblatt.verzeichnispfad, cache_dir, logger)
            
        logger.info('Recalculate virtualdataset ...')
        if not testing:
            dbsession.commit()
        
        updateVirtualdatasetForTimestamp('%s-01-01 00:00:00'%timestamp, vrt_target_dir, tmp_dir, database_params, dbsession, logger, testing=testing)
        
    logger.info('Finishing updating the single georeferencing ...')        
            
    return True
    
""" Main """    
if __name__ == '__main__':
    parser = argparse.ArgumentParser(description = 'This scripts handles the updating of the datasources of the Virtuelles Kartenforum 2.0. It could \
        process persistent georeference mtbs, publish metadata records, update the virtual datasets and reseeding the cache. If wantet it could also be used \
        to reseed the hole cache.', prog = 'Script UpdateGeorefDataSources.py')
    
    # parse command line
    parser = argparse.ArgumentParser(description='Parse the key/value pairs from the command line!')
    parser.add_argument('--mode', type=str, default='testing', help='Run in "production" or "testing" mode. Without mode parameter it run\'s in testing mode.')
    parser.add_argument('--host', help='host for messtischblattdb')
    parser.add_argument('--user', help='user for messtischblattdb')
    parser.add_argument('--password', help='password for messtischblattdb')
    parser.add_argument('--db', help='db name for messtischblattdb')
    parser.add_argument('--log_file', help='define a log file')
    parser.add_argument('--tmp_dir', default='/tmp', help='define directory for temporary files (default: /tmp')
    parser.add_argument('--vrt_dir', default='/tmp', help='define directory for vrt files (default: /tmp')
    parser.add_argument('--georef_dir', default='/tmp', help='define directory for georeference messtischblatt files (default: /tmp')
    parser.add_argument('--layerid', default=87, help='database layer id, which represents the vrt time layer (default: 87)')
    parser.add_argument('--cache_dir', default=87, help='directory where the cache files should be placed.')
    arguments = parser.parse_args()
    
    # create logger
    if arguments.log_file:
        formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
        sqlalchemy_logger = createLogger('sqlalchemy.engine', logging.DEBUG, logFile=''.join(arguments.log_file), formatter=formatter)     
        logger = createLogger('UpdateGeorefDataSources', logging.DEBUG, logFile=''.join(arguments.log_file), formatter=formatter)
    else: 
        sqlalchemy_logger = createLogger('sqlalchemy.engine', logging.WARN)
        logger = createLogger('UpdateGeorefDataSources', logging.DEBUG)   

    # parse parameter parameters
    if arguments.host:
        PARAMS_DATABASE['host'] = arguments.host
    if arguments.user:
        PARAMS_DATABASE['user'] = arguments.user
    if arguments.password:
        PARAMS_DATABASE['password'] = arguments.password
    if arguments.db:
        PARAMS_DATABASE['db'] = arguments.db
    if arguments.tmp_dir:
        TMP_DIR = arguments.tmp_dir
    if arguments.vrt_dir:
        VRT_TARGET_DIR = arguments.vrt_dir
    if arguments.georef_dir:
        GEOREF_TARGET_DIR = arguments.georef_dir
    if arguments.layerid:
        MTB_LAYER_ID = arguments.layerid    
    if arguments.cache_dir:
        CACHE_DIR = arguments.cache_dir
    
    dbsession = loadDbSession(PARAMS_DATABASE)          
    if arguments.mode == 'testing':
        updateDataSources(dbsession, PARAMS_DATABASE, VRT_TARGET_DIR, TMP_DIR, CACHE_DIR, logger, testing = True)
    else:
        updateDataSources(dbsession, PARAMS_DATABASE, VRT_TARGET_DIR, TMP_DIR, CACHE_DIR, logger, testing = False)
        
