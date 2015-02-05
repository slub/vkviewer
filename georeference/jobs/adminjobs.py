'''
Created on Oct 7, 2014

@author: mendt
'''
from vkviewer.python.models.messtischblatt.Map import Map
from vkviewer.python.models.messtischblatt.Georeferenzierungsprozess import Georeferenzierungsprozess
from georeference.jobs.georeferencejobs import activate, deactivate
 
def getLastValidGeoreferenceProcess(overwritesId, dbsession, logger):
    """ This function goes down the overwrite chain and looks for the last valid
        georeference process
        
        @param Integer: job
        @param sqlalchemy.orm.session.Session: dbsession
        @param logging.Logger: logger
    """ 
    georefProcess = Georeferenzierungsprozess.by_id(overwritesId, dbsession)
    if georefProcess.adminvalidation == 'isvalide' or georefProcess.adminvalidation == '':
        return georefProcess
    elif georefProcess.overwrites > 0:
        return getLastValidGeoreferenceProcess(georefProcess.overwrites, dbsession, logger)
    else:
        return None
    
def setIsValide(job, dbsession, logger, testing = False):
    """ This function sets a georeference process as 'isvalide' and if there is no other
        newer georeference process for this map its activate this georeference process for this 
        map.
        
        @param vkviewer.python.models.messtischblatt.AdminJobs: job
        @param sqlalchemy.orm.session.Session: dbsession
        @param logging.Logger: logger
        @param boolean: testing (Default: False)
    """ 
    logger.debug('Set georeference process for id %s to isvalide ...'%(job.georefid))
    
    # set georeferenceprocess to isvalide
    georefProcess = Georeferenzierungsprozess.by_id(job.georefid, dbsession)
    
    # check if there is an other process which is newer and more up to date
    activeGeorefProcess = Georeferenzierungsprozess.getActualGeoreferenceProcessForMapId(georefProcess.mapid, dbsession)
    mapObj = Map.by_id(georefProcess.mapid, dbsession)
    if activeGeorefProcess and activeGeorefProcess.id >= georefProcess.id:
        logger.info('The georeference process with the id %s or younger process is already active for this map object.'%georefProcess.id)
        pass
    elif activeGeorefProcess and activeGeorefProcess.id < georefProcess.id:
        logger.info('Activate the is valide georeference process and deactive old one ...')
        deactivate(activeGeorefProcess, mapObj, dbsession, logger)
        activate(georefProcess, mapObj, dbsession, logger)
    else:
        logger.info('Activate georeference process %s for the map object %s ...'%(georefProcess.id, georefProcess.mapid))
        activate(georefProcess, mapObj, dbsession, logger)
        
        if georefProcess.adminvalidation == 'invalide':
            mapObj.hasgeorefparams = mapObj.hasgeorefparams + 1
        
    georefProcess.adminvalidation = 'isvalide'
    
def setInValide(job, dbsession, logger, testing = False):
    """ This function sets a georeference process as 'isvalide' and if there is no other
        newer georeference process for this map its activate this georeference process for this 
        map.
        
        @param vkviewer.python.models.messtischblatt.AdminJobs: job
        @param sqlalchemy.orm.session.Session: dbsession
        @param logging.Logger: logger
        @param boolean: testing (Default: False)
    """ 
    logger.debug('Set georeference process for id %s to isvalide ...'%(job.georefid))
    
    # set georeferenceprocess to isvalide
    georefProcess = Georeferenzierungsprozess.by_id(job.georefid, dbsession)
    
    # update map object and datasource
    mapObj = Map.by_id(georefProcess.mapid, dbsession)
    if georefProcess.isactive == True and georefProcess.overwrites > 0:
        logger.info('Deactive georeference process and activate georeference process with id %s ...'%georefProcess.overwrites)
        
        # deactive the georeference process
        deactivate(georefProcess, mapObj, dbsession, logger)
            
        # look if there is a valid overwrite id and if yes activate the matching 
        # process
        newGeorefProcess = getLastValidGeoreferenceProcess(georefProcess.overwrites, dbsession, logger)
        if newGeorefProcess:
            activate(newGeorefProcess, mapObj, dbsession, logger)   
            
    elif georefProcess.isactive == True and georefProcess.overwrites == 0:
        logger.info('Deactive georeference process %s ...'%georefProcess.overwrites)
        
        # deactive the georeference process
        deactivate(georefProcess, mapObj, dbsession, logger)
        
    logger.debug('Set georeference process with id %s to inactive ...'%georefProcess.overwrites)        
    if georefProcess.adminvalidation != 'invalide':
        georefProcess.adminvalidation = 'invalide'
        mapObj.hasgeorefparams = 0 if mapObj.hasgeorefparams - 1 < 0 else mapObj.hasgeorefparams - 1
        
            

    
    
    