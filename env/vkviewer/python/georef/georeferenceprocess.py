'''
Created on May 30, 2013

@author: mendt
'''
from ..models.messtischblatt import Messtischblatt, Georeferenzierungsprozess
from ..georef.georeferenceexceptions import GeoreferenceParameterError, GeoreferenceProcessRunningError
from ..georef.geometry import createBBoxFromPostGISString
from ..georef.utils import getTimestampAsPGStr, runCommand
from ..georef.georeferenceutils import getGCPsAsString, addGCPToTiff, georeferenceTiff, getGCPs

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

""" function: createGeoreferenceProcess
    
    @param - mtbid {Integer} - messtischblatt id
    @param - dbSession {SQLAlchemy.Object} - session object for database queries
    @param - tmp_dir {String} - path to tmp folder
    @param - logger {Logger.Object} - 
    
    This function create's a georeference process """
def createGeoreferenceProcess(mtbid, dbSession, tmp_dir = None, logger = None):       
        # get messtischblatt information from database and 
        # create a messtischblatt object from the response
        try:
            messtischblatt = dbSession.query(Messtischblatt).filter(Messtischblatt.id == mtbid).first()
        except IndexError:
            logger.error("Error while creating georeference process!")
            raise GeoreferenceParameterError("MesstischblattId %s is not valide!"%mtbid)
        except Exception:
            logger.error("Error while creating georeference process!")
            raise GeoreferenceParameterError("Error while creating messtischblatt object for id %s!"%mtbid)
                  
        # create georeference process and returns it
        return GeoreferenceProcess(messtischblatt, dbSession, tmp_dir, logger);
    
""" Class encapsulated a georeference process for one mtb """    
class GeoreferenceProcess(object):

    
    def __init__(self, mtb, dbSession, tmp_dir = None, logger = None):
        self.srid = 4314
        self.messtischblatt = mtb;
        self.boundingbox = createBBoxFromPostGISString(self.messtischblatt.boundingbox, self.srid)
        self.dbSession = dbSession;
        if tmp_dir == None:
            self.tmp_dir = ''
        else:
            self.tmp_dir = tmp_dir;
            
        if logger != None:
            self.logger = logger
        else:
            self.logger = None
    
    """ method: __getGCP__
    
        @param - clipParams {Integer:Integer;...} - String list of points which are representing the georeference parameter
        @param - type {String} - give gcps back as string or as object
        @return - {List} - list of gcps
        
        this method create gcps as string for using in gdal commands or as a simple list of tuple """
    def __getGCP__(self, clipParams, type=None):
        if type == 'string':
            # parse the pixelcoordinates, match them to the correct geographic corner and create
            # ground control points
            parsedLatLonCoords = parsePixelCoordinates(clipParams)       
            gcps =  getGCPsAsString(parsedLatLonCoords, self.messtischblatt.archivpfad_vk2,
                                self.boundingbox.getCornerPointsAsList())
            return gcps
        else:
            # parse the pixelcoordinates, match them to the correct geographic corner and create
            # ground control points
            parsedLatLonCoords = parsePixelCoordinates(clipParams)       
            gcps =  getGCPs(parsedLatLonCoords, self.messtischblatt.archivpfad_vk2,
                                self.boundingbox.getCornerPointsAsList())
            return gcps
    
    """ method: __runGeoreferencing__
    
        @param - clipParams {Integer:Integer;...} - String list of points which are representing the georeference parameter
        @param - tmpDir {String} - path to working director
        @param - destPath {String} - complete path to the georeference result
        @param - type {String} - if 'fast' a fast algorithmus (slimer commands) are run
        
        This function produce the georeference result. """
    def __runGeoreferencing__(self, clipParams, tmpDir, destPath, type=None):
        # create a shapefile which represents the boundingbox of the messtischblatt and is latery used for clipping
        shpPath = self.boundingbox.asShapefile(os.path.join(tmpDir,"shape"))
        
        # get gcps
        gcps = self.__getGCP__(clipParams, 'string')
        
        # gather commands for georeference process
        commands = []
        if type == 'fast':
            # command for adding the ground control points to the tif
            pathAddingGcps = os.path.join(tmpDir,"gcpTiff.tif")
            commands.append(addGCPToTiff(gcps,self.srid,self.messtischblatt.archivpfad_vk2,
                                         pathAddingGcps))
            commands.append(georeferenceTiff(shpPath,self.srid,pathAddingGcps,destPath,'fast'))
        
        # run commands as subprocess
        for command in commands:
            print(command)
            self.logger.info("Running commands: %s"%command)
            runCommand(command)
        return destPath
    
    """ method: fastGeoreference
        
        @param - userid {String}
        @param - clipParams {Integer:Integer;...} - String list of points which are representing the georeference parameter
        @param - destPath {String} - complete path to the georeference result 
        @return - georefid {Integer} - id of georeference process in the database
        @return - destPath {String} - Path to the result of the georeference process
        
        This method does a fast computation of georeference result. """
    def fastGeoreference(self, userid, clipParams, destPath):
        try:
            # create tempory directory 
            tmpDir = tempfile.mkdtemp("", "tmp_", self.tmp_dir) # create dir
            # register georeference process in the database and get a georeference id
            georefid = self.registerGeoreferenceProcess(userid=userid, clipParams=clipParams,
                isvalide=False,typeValidation='waiting')
            
            # produce georeference result
            destPath = self.__runGeoreferencing__(clipParams, tmpDir, destPath, type='fast')
            
            # commit database changes
            self.logger.info("Georeferencering successfully!")
            self.dbSession.commit()
            return georefid, destPath
        except:
            message = "Error while processing a fast georeference result!"
            self.logger.error(message)
            raise 
        finally:
            try:
                # delete tmp_dir
                shutil.rmtree(tmpDir) 

            except OSError, e:
                # code 2 - no such file or directory
                if e.errno != 2:
                    raise
    
    """ method: registerGeoreferenceProcess
    
        @param - userid {String}
        @param - clipParams {Integer:Integer;...} - String list of points which are representing the georeference parameter
        @param - isvalide {Boolean} - is true if the clipParams are checked for validation
        @param - typeValidation {String} - could be 'waiting' or 'confirm' or 'disabled'
        @return - georefid {Integer} - georeference process id from database
        
        @TODO - refactor to using orm mapper. Problem with the serials
        This method register the georeference process in the database. """
    def registerGeoreferenceProcess(self, userid=None, clipParams=None, isvalide=False, typeValidation='none'):
        # get timestamp
        timestamp = getTimestampAsPGStr()
        # build query for inserting inserting
        query_regGeorefProc = "INSERT INTO georeferenzierungsprozess(messtischblattid, nutzerid, clipparameter_pure,\
                 timestamp, isvalide, typevalidierung) VALUES (:mtbid, :userid, :clip_params, :timestamp, \
                 :isvalide, :type);"
        values_regGeorefProc = {'mtbid':self.messtischblatt.id,'userid':userid,'clip_params':clipParams,
                                'timestamp':timestamp,'isvalide':isvalide,'type':typeValidation}
        self.dbSession.execute(query_regGeorefProc, values_regGeorefProc)
        self.dbSession.flush()
        
        # for getting the georef id
        query_getGeorefProcNr = "SELECT id FROM georeferenzierungsprozess WHERE timestamp = :timestamp \
                                     AND messtischblattid = :mtbid;"
        values_getGeorefProcNr = {'timestamp':timestamp,'mtbid':self.messtischblatt.id}
        return self.dbSession.execute(query_getGeorefProcNr,values_getGeorefProcNr).fetchone()[0]
    
    """ method: confirmGeoreferenceProcess
    
        @param - userid {String}
        @param - clipParams {Integer:Integer;...} - String list of points which are representing the georeference parameter
        @param - isvalide {Boolean} - is true if the clipParams are checked for validation
        @param - typeValidation {String} - could be 'waiting' or 'confirm' or 'disabled'
        @param - georefid {Integer}
        @return - georefid {Integer} - georeference process id from database
        
        @TODO - refactor to using orm mapper. Problem with the serials
        
        This method confirms a given georeference process or register a georeference process confirmed. """       
    def confirmGeoreferenceProcess(self, userid=None, clipParams=None, isvalide=False, typeValidation='none', georefid=None):
        # in this case a georeference process has to be registered and also the gcp have to be write 
        # into the database
        if userid and clipParams and typeValidation:
            # register process
            georefid = self.registerGeoreferenceProcess(userid, clipParams, isvalide, typeValidation)
            self.logger.info("Georeference process with id %s registered!"%georefid)
            
            # register passpunkte
            # get georef data from database and parse them
            georefProc = Georeferenzierungsprozess.by_id(georefid)
            self.updatePasspunkte(georefProc)
            self.dbSession.commit()
            self.logger.info("Ground control points for georeference process with id %s registered!"%georefid)
            return georefid
        elif georefid and typeValidation:
            # get georef data from database and parse them
            georefProc = Georeferenzierungsprozess.by_id(georefid)
            
            # change valdation status of georeference process in database
            georefProc.isvalide = isvalide
            georefProc.typevalidierung = typeValidation
            self.dbSession.flush()
            self.logger.info("Change validation status of georeference process with id %s!"%georefid)
            
            # register passpunkte
            self.updatePasspunkte(georefProc)
            self.dbSession.commit()
            self.logger.info("Ground control points for georeference process with id %s registered!"%georefid)
            return georefid            
    
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

            


      
