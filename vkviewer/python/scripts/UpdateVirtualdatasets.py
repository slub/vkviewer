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
# * 
# * Example command:
# * bin/python vkviewer/python/scripts/UpdateVirtualdatasets.py --mode 'testing' --host 'localhost' --user 'postgres' --password 'postgres' 
# *   --db 'messtischblattdb' --tmp_dir '/tmp/virtualdatasets' --vrt_dir '/tmp'

import logging, argparse, os, subprocess, sys
from datetime import datetime
from subprocess import CalledProcessError
from sqlalchemy.exc import IntegrityError

BASE_PATH = os.path.dirname(os.path.realpath(__file__))
BASE_PATH_PARENT = os.path.abspath(os.path.join(BASE_PATH, os.pardir))
sys.path.insert(0, BASE_PATH)
sys.path.append(BASE_PATH_PARENT)

from vkviewer.python.models.Meta import initializeDb
from vkviewer.python.models.messtischblatt.Virtualdatasets import Virtualdatasets
from vkviewer.python.utils.logger import createLogger
from vkviewer.python.utils.exceptions import  WrongParameterException

""" Default options """
# Directory for saving the temporary files
TMP_DIR = '/tmp'

# Target dir for georeference messtischblatt
GEOREF_TARGET_DIR = '/tmp'

# Target dir for saving the virtual datasets
VRT_TARGET_DIR = '/tmp'


""" Functions """
def loadDbSession(database_params): 
    logger.info('Initialize new database connection ...')
    sqlalchemy_enginge = 'postgresql+psycopg2://%(user)s:%(password)s@%(host)s:5432/%(db)s'%(database_params)
    try:
        return initializeDb(sqlalchemy_enginge)
    except:
        logger.error('Could not initialize database. Plase check your database settings parameter.')
        raise WrongParameterException('Could not initialize database. Plase check your database settings parameter.')

def buildCreateVrtCmd(target_path, shapefile_path):
    """ Create the command for producing a virtutal dataset via gdalbuildvrt command on 
        the basic of a shapefile        
        
        Arguments:
            target_path {string}
            shapefile_path {string} Shapefile which represents the tileindex and has a attribute 'LOCATION'
        Returns: {string}
    """
    return "gdalbuildvrt --config GDAL_CACHEMAX 500 -resolution 'highest' -hidenodata -addalpha -overwrite -tileindex \"LOCATION\" %s %s"%(target_path, '%s.shp'%shapefile_path)

def buildCreateShapeTileIndexCmd(timestamp, shp_path, database_params):
    """ Create the command for command line processing of a shapefile, which represents
        a tileindex for one timestamp for all historic messtischblaetter.
        
        Arguments:
            timestamp {Integer} Time in year
            shp_path {String}
            database_params {dict}
        Returns: {String} """    
    createShapeTileIndexCmd = "pgsql2shp -f %(shp_path)s -h %(host)s -u %(user)s -P '%(password)s' %(db)s \
    \"SELECT mtb.boundingbox, mtb.verzeichnispfad as location, zeit.time as time \
    FROM messtischblatt as mtb, md_zeit as zeit WHERE mtb.isttransformiert = True \
    AND mtb.id = zeit.id AND zeit.typ::text = 'a5064'::text AND zeit.datierung = %(timestamp)s\""             
    return createShapeTileIndexCmd % (dict({
        'shp_path': shp_path,                                  
        'timestamp': str(timestamp) 
    }.items() + database_params.items()))

    
def getVirtualDatasetCreateCommands(targetVrtPath, time, database_params):
    """ This function create a virtual dataset for the given parameters 
        
        Arguments:
            targetVrtPath {string}
            time {Integer}
            database_params {dict} for querying the database via pgsql2shp
            with_cache {Boolean} If true also a update cache command is created
        Returns: {list} commands for creating virtual datasets """
    shpTilePath = os.path.join(TMP_DIR, (str(time)))

    # collect commands 
    commands = []
    commands.append(buildCreateShapeTileIndexCmd(time, shpTilePath, database_params))
    commands.append(buildCreateVrtCmd(targetVrtPath, shpTilePath))
    # Comment out for testing purpose (time reduction)
    # commands.append(buildCreateVrtOverviewCmd(targetVrtPath))
    return commands
   
    
def updateVrt( database_params, logger = None, dbsession = None, vrt = None):
    """ Processes a refreshed virtual dataset, updates the cache and after all update the 
        database relations in messtischblatt db
            
    Arguments:
        database_params (dict)
        refresh_cache (Boolean}: if set to true the cache is refreshed
        dbsession {sqlalchemy.orm.session.Session}
        logger {Logger}
        vrt {src.models.Virtualdataset} """
    try:
        logger.info('Starting updating virtual datasets for timestamp %s ...'%vrt.timestamp)
        targetVrtPath  = os.path.join(VRT_TARGET_DIR, '%s.vrt'%vrt.timestamp.year)
        commands = getVirtualDatasetCreateCommands(targetVrtPath, vrt.timestamp.year, database_params)
        
        # now execute command
        for command in commands:
            logger.info('Execute - %s'%command)
            subprocess.check_call(command, shell = True)
            
        # now update database
        logger.info('Update database state for virtual datasets ...')
        # update boundingbox of virtual dataset
        query = "UPDATE virtualdatasets SET boundingbox = ( SELECT st_setsrid(st_envelope(st_extent(boundingbox)),4314) \
            FROM (SELECT mtb.boundingbox as boundingbox FROM messtischblatt as mtb, md_zeit as zeit WHERE mtb.isttransformiert = True \
            AND mtb.id = zeit.id AND zeit.typ::text = 'a5064'::text AND zeit.datierung = %s) as foo) WHERE id = %s;"
        dbsession.execute(query%(vrt.timestamp.year, vrt.id))
        # update last update timestamp
        vrt.lastupdate = str(datetime.now())
        return targetVrtPath
    except CalledProcessError as e:
        logger.error('CalledProcessError while trying to run a command for updating the virtual datasets.')
        pass
    except:
        raise
           
def updateVirtualdatasetForTimestamp( timestamp, database_params, dbsession, logger, testing=False):
    """ This function controls the complete update process for one timestamp 
        
    Arguments:
        timestamp {Integer}
        dbsession {sqlalchemy.orm.session.Session}
        logger {Logger}
        testing {Boolean} """ 
    logger.info('Update virtualdataset for timestamp %s ...'%timestamp)
    vrt = Virtualdatasets.by_timestamp(timestamp, dbsession)
    targetVrtPath = updateVrt( database_params, logger = logger, dbsession = dbsession, vrt = vrt)

    # necessary that following processes consider actual changes    
    if testing:
        dbsession.rollback()
    
    logger.info('Update process for timestamp %s finished.'%timestamp)
    return targetVrtPath



""" Main """    
if __name__ == '__main__':
    parser = argparse.ArgumentParser(description = 'This scripts updates the virtualdatasets for all or for a single \
        timestamp.', prog = 'Script UpdateVirtualdatasets.py')
    
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
    database_params = {}
    if arguments.host:
        database_params['host'] = arguments.host
    if arguments.user:
        database_params['user'] = arguments.user
    if arguments.password:
        database_params['password'] = arguments.password
    if arguments.db:
        database_params['db'] = arguments.db
    if arguments.tmp_dir:
        TMP_DIR = arguments.tmp_dir
    if arguments.vrt_dir:
        VRT_TARGET_DIR = arguments.vrt_dir
        
    testing = False
    if arguments.mode is "production":
        testing = True    

    logger.info('Start updating the virtualdatasets')
    for value in range(1868, 1946):
        updateVirtualdatasetForTimestamp('%s-01-01 00:00:00'%value, database_params, loadDbSession(database_params), logger, testing=testing)
        
