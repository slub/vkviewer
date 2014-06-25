'''
Created on May 30, 2013

@author: mendt
'''
import shutil
import tempfile
import os

from vkviewer.settings import srid_database, DATABASE_SRID, GEOREFERENCE_OVERVIEW_LEVELS
from vkviewer.python.models.messtischblatt.Georeferenzierungsprozess import Georeferenzierungsprozess
from vkviewer.python.georef.utils import getTimestampAsPGStr, runCommand
from vkviewer.python.georef.georeferencer import georeference, createGCPs
from vkviewer.python.georef.georeferenceexceptions import GeoreferenceProcessRunningError

""" function: addGCPToTiff

    @param - gcPoints {list of gcp} - list of ground control points
    @param - srid {Integer} - epsg code of coordiante system
    @param - srcPath {String}
    @param - destPath {String}
    @return - command {String}
    
    Add the ground control points via gdal_translate to the src tiff file """
def addGCPToTiff(gcPoints,srs,srcPath,destPath):
            
    def addGCPToCommandStr(command,gcPoints):
        for string in gcPoints:
            command = command+"-gcp "+str(string)+" "
        return command
        
    command = "gdal_translate --config GDAL_CACHEMAX 500 -a_srs epsg:%s "%srs
    command = addGCPToCommandStr(command,gcPoints)
    command = command+str(srcPath)+" "+str(destPath)
    return command

""" function: georeferenceTiff_stable

    @param - shapefilePath {String}
    @param - srid {Integer} - epsg code of coordiante system
    @param - srcPath {String}
    @param - destPath {String}
    @return - command {String}
    
    Georeferencing via gdalwarp """
def georeferenceTiff_stable(shapefilePath, srid, srcPath, destPath):
    command = "gdalwarp --config GDAL_CACHEMAX 500 -wm 500 -overwrite -co TILED=YES -co COMPRESS=JPEG \
            -co JPEG_QUALITY=75 -co PHOTOMETRIC=RGB -co ALPHA=NO -co INTERLEAVE=BAND -cutline %s \
            -crop_to_cutline -t_srs epsg:%s %s %s"%(shapefilePath,srid,srcPath,destPath)
    return command

def addOverviews(targetPath, overviewLevels):
    command = "gdaladdo --config GDAL_CACHEMAX 500 -r average %s %s"%(targetPath,overviewLevels)
    return command 

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

    """ method: __runStableGeoreferencing__
    
        @param - georefObject {Georeferenzierungsprozess} - ORM object which encapsulte the corresponding database record
        @param - messtischblatt {Messtischblatt} - ORM object for messtischblatt table
        @param - tmpDir {String} - path to working director
        @param - destPath {String} - complete path to the georeference result
        
        This function produce the georeference result. """
    def __runStableGeoreferencing__(self, georefObject, messtischblatt, tmpDir, destPath):    
        try:
            # create a shapefile which represents the boundingbox of the messtischblatt and is latery used for clipping
            shpPath = messtischblatt.BoundingBoxObj.asShapefile(os.path.join(tmpDir,"shape"))
            gcps = createGCPs(georefObject.clipparameter, messtischblatt.BoundingBoxObj.getCornerPointsAsList(), messtischblatt.zoomify_height)
            georeference_result_file = georeference(messtischblatt.original_path, destPath, tmpDir, gcps, DATABASE_SRID, DATABASE_SRID, 'polynom', self.logger, shpPath)        

            # add overviews
            if self.__executeCommands__("gdaladdo --config GDAL_CACHEMAX 500 -r average %s %s"%(georeference_result_file,GEOREFERENCE_OVERVIEW_LEVELS)):
                return destPath
            else:
                raise GeoreferenceProcessRunningError('Something went wrong while trying to process a georefercing process')
        except:
            self.logger.error('Something went wrong while trying to process a georefercing process')
            raise
        
    """ method: __runFastGeoreferencing__
    
        @param - georefObject {Georeferenzierungsprozess} - ORM object which encapsulte the corresponding database record
        @param - tmpDir {String} - path to working director
        @param - destPath {String} - complete path to the georeference result
        
        This function produce the georeference result. """
    def __runFastGeoreferencing__(self, georefObject, messtischblatt, tmpDir, destPath):    
        try:                           
            gcps = createGCPs(georefObject.clipparameter, messtischblatt.BoundingBoxObj.getCornerPointsAsList(), messtischblatt.zoomify_height)
            return georeference(messtischblatt.original_path, destPath, tmpDir, gcps, srid_database, srid_database, 'polynom', self.logger)
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
                clipparameter = clipParams, timestamp = timestamp, isvalide = isvalide, typevalidierung = 'user', refzoomify = refzoomify)
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






      
