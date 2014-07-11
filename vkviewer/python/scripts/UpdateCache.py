#!/usr/bin/env python
# -*- coding: utf-8 -*-
#/******************************************************************************
# * $Id: UpdateCache.py 2014-01-28 jmendt $
# *
# * Project:  Virtuelles Kartenforum 2.0
# * Purpose:  This script simple update the hole cache
# * Author:   Jacob Mendt
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
import argparse, subprocess, logging, os, sys

BASE_PATH = os.path.dirname(os.path.realpath(__file__))
BASE_PATH_PARENT = os.path.abspath(os.path.join(BASE_PATH, os.pardir))
sys.path.insert(0, BASE_PATH)
sys.path.append(BASE_PATH_PARENT)

from vkviewer.python.utils.logger import createLogger

# Threads which the mapcache_seeder uses
SEEDER_NRTHREADS = 2 
# EPSG Code of the grid coordinate system from the cache
SEEDER_EPSG = 900913

# Database parameter for messtischblatt db
PARAMS_DATABASE = {
    'host': 'localhost',
    'user':'postgres',
    'password':'postgres',
    'db':'messtischblattdb',    
}

# Directory for saving the temporary files
TMP_DIR = '/tmp'

def buildCacheRestrictShapefile(time, shp_path, database_params, seeder_epgs):
    """ The created command uses pgsql2shp to compute a shapefile, which displays the
        spatial extend for which the cache should be updated. 
        
        Arguments:
            time {Integer} Number year
            shp_path {String}
            database_params {dict}
        Returns: {String} """
    cmd_template = "pgsql2shp -f %(shp_path)s -h %(host)s -u %(user)s -P '%(password)s' %(db)s \
        \"SELECT st_transform(mtb.boundingbox, %(target_epsg)s), zeit.time as time FROM messtischblatt as mtb, md_zeit as zeit WHERE \
        mtb.isttransformiert = True AND mtb.id = zeit.id AND zeit.typ::text = 'a5064'::text AND zeit.datierung = %(time)s\""  
    return cmd_template % (dict({
        'shp_path': shp_path,                                  
        'time': time,
        'target_epsg': seeder_epgs,
    }.items() + database_params.items()))
    
def buildSeedingCmd(time, seeder_threads, ogr_datasource=None):
    """ Create's a command for seeding the new vrt. Premise is preconfigured mapcache
        
        Arguments:
            timestamp {String}
            ogr_datasource {String} Path to ogr datasource
        Returns: {String} """
    if ogr_datasource is None:
        return "su - www-data -c \"mapcache_seed -c /usr/share/mapcache/mapcache.xml -t 'messtischblaetter' \
            -M 5,5 -v -D TIME=%s -i \"level-by-level\" -f -n %s \""%(time,seeder_threads)
    else:
        return "su - www-data -c \"mapcache_seed -c /usr/share/mapcache/mapcache.xml -t 'messtischblaetter' \
            -M 5,5 -v -D TIME=%s -i \"level-by-level\" -f -n %s -d \"%s\" \""%(time,seeder_threads,ogr_datasource)
    
def updateCache(time, database_params, tmp_dir, seeder_threads, seeder_epgs, logger, restricted=True):
    """ Processes for updating the cache 
            
    Arguments:
        time {integer}
        database_params (dict)
        restricted {Boolean} If the cache should be recalculate for the complete or a restricted area
        logger {Logger} """

    if restricted:
        restrict_cache_shp = os.path.join(tmp_dir, '%s_cache'%time)
        commands = []
        commands.append(buildCacheRestrictShapefile(time, restrict_cache_shp, database_params, seeder_epgs))
        commands.append(buildSeedingCmd(time, seeder_threads, restrict_cache_shp + '.shp'))
    else:
        # also add the creating command for restricted cache file for preventing the cache
        # to reseed time slots without timestamps 
        restrict_cache_shp = os.path.join(tmp_dir, '%s_cache'%time)
        commands = []
        commands.append(buildCacheRestrictShapefile(time, restrict_cache_shp, database_params, seeder_epgs))
        commands.append(buildSeedingCmd(time, seeder_threads))
         
    # now execute command
    for command in commands:
        logger.info('Execute - %s'%command)
        try:
             subprocess.check_call(command, shell = True)
        except:
            pass   
            return None
    
""" Main """    
if __name__ == '__main__':
    script_name = 'UpdateCache.py'
    parser = argparse.ArgumentParser(description = 'This scripts simple update the cache', prog = 'Script %s'%script_name)
    parser.add_argument('--time_range', type=str, default='1868/1945', help='Should be in the form "1868/1945". Works in collaboration with mode "update_cache" and describe\'s the time range, for which the cache should be updated.')
    parser.add_argument('--log_file', help='define a log file')
    parser.add_argument('--tmp_dir', default='/tmp', help='define directory for temporary files (default: /tmp)')
    parser.add_argument('--seeder_threads', default=2, help='Number of threads the seeder utility should use (default: 2')
    parser.add_argument('--host', help='host for messtischblattdb')
    parser.add_argument('--user', help='user for messtischblattdb')
    parser.add_argument('--password', help='password for messtischblattdb')
    parser.add_argument('--db', help='db name for messtischblattdb')  
    parser.add_argument('--with_restricted', default='true', help='Recalculates the cache only for the restricted area, given by the true area of interest (default: true).')
    arguments = parser.parse_args()
    
    # create logger
    if arguments.log_file:
        formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
        logger = createLogger('%s'%script_name, logging.DEBUG, logFile=''.join(arguments.log_file), formatter=formatter)
    else: 
        logger = createLogger('%s'%script_name, logging.DEBUG)   
        
    if arguments.seeder_threads:
        SEEDER_NRTHREADS = arguments.seeder_threads
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
        
    if arguments.with_restricted:
        if arguments.with_restricted.lower() == 'true':
            RESTRICTED_MODE = True
        if arguments.with_restricted.lower() == 'false':
            RESTRICTED_MODE = False
  
       
    timerange_str = arguments.time_range.split('/')
    start_time = int(timerange_str[0])
    end_time = int(timerange_str[1])
    
    logger.info('Start the cache for time period %s/%s ...'%(start_time, end_time))
    for time in range(start_time, end_time+1):
        if RESTRICTED_MODE:
            logger.info('Recalculate cache for restricted area and year %s ...'%time)
            updateCache(time, PARAMS_DATABASE, TMP_DIR, SEEDER_NRTHREADS, SEEDER_EPSG, logger, restricted=True)
        else:
            logger.info('Start updating the complete cache for hole area ...')
            updateCache(time, PARAMS_DATABASE, TMP_DIR, SEEDER_NRTHREADS, SEEDER_EPSG, logger, restricted=False)