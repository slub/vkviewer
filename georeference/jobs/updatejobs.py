'''
Created on Oct 13, 2014

@aut
author: mendt
'''
from vkviewer.python.models.messtischblatt.Map import Map
from vkviewer.python.models.messtischblatt.Georeferenzierungsprozess import Georeferenzierungsprozess
from georeference.jobs.georeferencejobs import activate, deactivate

def runUpdateGeoreferenceProcess(georefProcess, dbsession, logger, testing = False):
    """ This function update the georeference result for a given map object.
        
        @param vkviewer.python.models.messtischblatt.AdminJobs: georefProcess
        @param sqlalchemy.orm.session.Session: dbsession
        @param logging.Logger: logger
        @param boolean: testing (Default: False)
    """ 
    logger.info('Run georeference process with type "update" with id %s ...'%georefProcess.id)
    
    activeGeorefProcess = Georeferenzierungsprozess.getActualGeoreferenceProcessForMapId(georefProcess.mapid, dbsession)
    mapObj = Map.by_id(georefProcess.mapid, dbsession)
    
    logger.info('Deactivate old georeference processes ...')
    if activeGeorefProcess:
        deactivate(activeGeorefProcess, mapObj, dbsession, logger)
        
    logger.info('Activate new georeference processes ...')
    activate(georefProcess, mapObj, dbsession, logger)    