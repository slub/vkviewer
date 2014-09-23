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

from vkviewer.settings import DBCONFIG_PARAMS
from vkviewer.python.models.Meta import initializeDb
from vkviewer.python.utils.logger import createLogger
from vkviewer.python.models.messtischblatt.Messtischblatt import Messtischblatt
from vkviewer.python.models.messtischblatt.Map import Map
from vkviewer.python.utils.exceptions import WrongParameterException

def loadDbSession(database_params, logger): 
    logger.info('Initialize new database connection ...')
    sqlalchemy_enginge = 'postgresql+psycopg2://%(user)s:%(password)s@%(host)s:5432/%(db)s'%(database_params)
    try:
        return initializeDb(sqlalchemy_enginge)
    except:
        logger.error('Could not initialize database. Plase check your database settings parameter.')
        raise WrongParameterException('Could not initialize database. Plase check your database settings parameter.')
    
def generateMapsObjFromMesstischblattObj(messtischblatt):
    # get relevant parameters
    apsobjectid = messtischblatt.id
    apsdateiname = messtischblatt.dateiname
    originalimage = messtischblatt.original_path
    istaktiv = messtischblatt.istaktiv
    isttransformiert = messtischblatt.isttransformiert
    hasgeorefparams = messtischblatt.hasgeorefparams
    maptype = messtischblatt.mdtype
    boundingbox = messtischblatt.boundingbox
    if isttransformiert:
        georefimage = messtischblatt.verzeichnispfad
    else:
        georefimage = ''
        
    return Map(apsobjectid = apsobjectid, apsdateiname = apsdateiname, originalimage = originalimage, 
                istaktiv = istaktiv, isttransformiert = isttransformiert, hasgeorefparams = hasgeorefparams,
                maptype = maptype, boundingbox = boundingbox, georefimage = georefimage)
    
def main():
    logger = createLogger('FillMapsTable', logging.DEBUG)   
    dbsession = loadDbSession(DBCONFIG_PARAMS, logger)
    
    ## get all messtischblätter and iterate over them
    messtischblaetter = Messtischblatt.all(dbsession)
    for messtischblatt in messtischblaetter:
        logger.info('Process messtischblatt with apsobjectid %s'%messtischblatt.id)
        mapObj = generateMapsObjFromMesstischblattObj(messtischblatt)
        dbsession.add(mapObj)
    dbsession.commit()
        
    
""" Main """    
if __name__ == '__main__':
    main()
