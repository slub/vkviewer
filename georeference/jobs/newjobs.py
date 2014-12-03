'''
Created on Oct 13, 2014

@aut
author: mendt
'''
from vkviewer.python.models.messtischblatt.Map import Map
from georeference.jobs.georeferencejobs import activate

def runNewGeoreferenceProcess(georefProcess, dbsession, logger, testing = False):
    """ This function process new georeference result for a given map object.
        
        @param vkviewer.python.models.messtischblatt.AdminJobs: georefProcess
        @param sqlalchemy.orm.session.Session: dbsession
        @param logging.Logger: logger
        @param boolean: testing (Default: False)
    """ 
    logger.info('Run georeference process with type "new" with id %s ...'%georefProcess.id)
    mapObj = Map.by_id(georefProcess.mapid, dbsession)
    logger.info('Activate new georeference processes ...')
    activate(georefProcess, mapObj, dbsession, logger)    
    
    