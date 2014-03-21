'''
Created on May 30, 2013

@author: mendt
'''
from vkviewer.python.models.messtischblatt.Messtischblatt import Messtischblatt
from vkviewer.python.models.messtischblatt.Georeferenzierungsprozess import Georeferenzierungsprozess
from vkviewer.python.georef.georeferenceexceptions import GeoreferenceParameterError, GeoreferenceProcessRunningError
from vkviewer.python.georef.utils import getTimestampAsPGStr, runCommand
from vkviewer.python.georef.georeferenceutils import getGCPsAsString, addGCPToTiff, georeferenceTiff_fast, georeferenceTiff, getGCPs
from vkviewer.settings import srid_database

import shutil
import tempfile
import os

def parsePixelCoordinates(clippingParameter):
    ''' 
    parse the pixelcoordinates from the clipping parameter string
        
    @todo: maybe do the parsing of the clippingParameter early together with the validation of the
               service parameter 
    '''
    pixelCoords = []
    if ";" in clippingParameter:
        for point in clippingParameter.split(";"):
            x, y = point.split(",")
            pixelCoords.append((float(x),float(y)))
    elif ":" in clippingParameter:
        for point in clippingParameter.split(","):
            x, y = point.split(":")
            pixelCoords.append((float(x),float(y)))
    return pixelCoords

class GeoreferenceProcessManager(object):
    """ Class encapsulated a georeference process for one mtb """   
         
    def __init__(self, dbsession, tmp_dir, logger):
        self.srid = srid_database
        self.dbsession = dbsession;
        self.tmp_dir = tmp_dir;
        self.logger = logger
    
    def __executeCommands__(self, commandsArr):
        try:
            for command in commandsArr:
                print(command)
                self.logger.debug("Running commands: %s"%command)
                runCommand(command)
            return True
        except: 
            self.logger.error('Problems while running command - %s'%command)
            raise
        
    """ method: __getGcpAsStrings__
    
        @param - clipParams {Integer:Integer;...} - String list of points which are representing the georeference parameter
        @param - refFile {String} - Path to file to which the clipping parameters refer
        @param - boundingbox  {BoundingBox} 
        @return - {List} - list of gcps
        
        this method create gcps as string for using in gdal commands or as a simple list of tuple """
    def __getGcpAsStrings__(self, clipParams, refFile, boundingbox):
            # parse the pixelcoordinates, match them to the correct geographic corner and create
            # ground control points
            parsedLatLonCoords = parsePixelCoordinates(clipParams)       
            gcps =  getGCPsAsString(parsedLatLonCoords, refFile, boundingbox.getCornerPointsAsList())
            return gcps

    """ method: __runFastGeoreferencing__
    
        @param - georefObject {Georeferenzierungsprozess} - ORM object which encapsulte the corresponding database record
        @param - tmpDir {String} - path to working director
        @param - destPath {String} - complete path to the georeference result
        
        This function produce the georeference result. """
    def __runFastGeoreferencing__(self, georefObject, messtischblatt, tmpDir, destPath):    
        try:
            # create a shapefile which represents the boundingbox of the messtischblatt and is latery used for clipping
            shpPath = messtischblatt.BoundingBoxObj.asShapefile(os.path.join(tmpDir,"shape"))
                           
            # get gcps
            ground_control_points = self.__getGcpAsStrings__(georefObject.clipparameter, 
                messtischblatt.original_path, messtischblatt.BoundingBoxObj)
                
            # gather commands for georeference process
            commands = []
            tmpTargetPath = os.path.join(tmpDir,"gcpTiff.tif")
            commands.append(addGCPToTiff(ground_control_points, srid_database, messtischblatt.original_path,tmpTargetPath))
            commands.append(georeferenceTiff_fast(shpPath,self.srid,tmpTargetPath,destPath))
            
            if self.__executeCommands__(commands):
                return destPath
            else:
                raise GeoreferenceProcessRunningError('Something went wrong while trying to process a fast georefercing process')
        except:
            self.logger.error('Something went wrong while trying to process a fast georefercing process')
            raise
    
    """ method: registerGeoreferenceProcess
    
        @param - messtischblattid {Integer} 
        @param - userid {String}
        @param - clipParams {Integer:Integer;...} - String list of points which are representing the georeference parameter
        @param - isvalide {Boolean} - is true if the clipParams are checked for validation
        @param - typeValidation {String} - could be 'waiting' or 'confirm' or 'disabled'
        @return - georefid {Integer} - georeference process id from database
        
        @TODO - refactor to using orm mapper. Problem with the serials
        This method register the georeference process in the database. """
    def registerGeoreferenceProcess(self, messtischblattid, userid=None, clipParams=None, isvalide=False, typeValidation='none', refzoomify=True):
        # get timestamp
        timestamp = getTimestampAsPGStr()
        georefProcess = Georeferenzierungsprozess(messtischblattid = messtischblattid, nutzerid = userid, 
                clipparameter = clipParams, timestamp = timestamp, isvalide = isvalide, typevalidierung = typeValidation, refzoomify = refzoomify)
        self.dbsession.add(georefProcess)
        self.dbsession.flush()
        return georefProcess  
    
    def confirmExistingGeoreferenceProcess(self, georefid, isvalide=False, typeValidation='user'):
            # get georef data from database and parse them
            georefProc = Georeferenzierungsprozess.by_id(georefid, self.dbsession)
            
            # change valdation status of georeference process in database
            georefProc.isvalide = isvalide
            georefProc.typevalidierung = typeValidation
            self.dbsession.flush()
            self.logger.debug("Change validation status of georeference process with id %s!"%georefid)
            
            # register passpunkte
            #self.updatePasspunkte(georefProc)
            #self.dbSession.commit()
            #self.logger.info("Ground control points for georeference process with id %s registered!"%georefid)
            return georefid       
             
    """ method: confirmNewGeoreferenceProcess        
        This method confirms a given georeference process or register a georeference process confirmed. 
        
        @param - messtischblattid {Integer} 
        @param - userid {String}
        @param - clipParams {Integer:Integer;...} - String list of points which are representing the georeference parameter
        @param - isvalide {Boolean} - is true if the clipParams are checked for validation
        @param - typeValidation {String} - could be 'waiting' or 'confirm' or 'disabled'
        @param - georefid {Integer}"""       
    def confirmNewGeoreferenceProcess(self, messtischblattid, userid=None, clipParams=None, isvalide=False, typeValidation='none'):
        # register process
        georefProc = self.registerGeoreferenceProcess(messtischblattid, userid, clipParams, isvalide, typeValidation)
        self.logger.debug("Georeference process with id %s registered!"%georefProc.id)
            
        # register passpunkte
        # get georef data from database and parse them
        #georefProc = Georeferenzierungsprozess.by_id(georefid, self.dbSession)
        #self.updatePasspunkte(georefProc)
        #self.dbSession.commit()
        #self.logger.info("Ground control points for georeference process with id %s registered!"%georefid)
        return georefProc.id 

    """ method: updatePasspunkte
    
        @param - georefProc {SQLAlchemy.Georeferenzierungsprozess} 
        @return {True} - if successful
        
        This method registered the passpoints in the database for a given georef id """
    def updatePasspunkte(self, georefProc): 
        # get gcps
        gcps = self.__getGCP__(georefProc.clipparameter_pure)
        
        # insert the gcps in the database
        query_InsertPasspunkt = "INSERT INTO passpunkt(georefid, mtbid, pixelpoint, georefpoint) VALUES("\
                    ":georefid,:mtbid,:pixel,ST_GeomFromText('POINT(:x :y)', 4314))"
        for gcp in gcps:
            pixelPoint = ','.join(str(i) for i in gcp[0])
            xCoordPoint, yCoordPoint = gcp[1]
            values =  {'georefid':georefProc.id,'mtbid':georefProc.messtischblattid,
                       'pixel':pixelPoint,'x':xCoordPoint, 'y':yCoordPoint}
            self.dbSession.execute(query_InsertPasspunkt, values)   
            self.dbSession.flush()
        return True



            


      
