'''
Created on Oct 15, 2013

@author: mendt
'''
from pyramid.response import Response
from pyramid.view import view_config
from pyramid.httpexceptions import HTTPNotFound, HTTPFound,HTTPBadRequest
from pyramid.security import remember, forget

# further tools
import logging
import os
import json

# own import stuff
from vkviewer.python.models.messtischblatt import getZoomifyCollectionForBlattnr
from vkviewer import log
from ..georef.georeferenceprocess import parsePixelCoordinates
from ..georef.georeferenceprocess import createGeoreferenceProcess
from ..georef.utils import getUniqueId
from ..georef.mapfile import createMapfile


# global parameter
tmp_dir = '/home/mendt/Documents/tmp/georef'
src_mapfilepath = "/home/mendt/Documents/tmp/georef/templates/dynamic_template.map"
dest_mapfilefolder = "/home/mendt/Documents/tmp/georef/tmp"
mapfileInitParameter = {"METADATA":{
        "wms_srs":"epsg:900913 epsg:3857 epsg:4314 epsg:31468 epsg:4326 epsg:25833 epsg:2398",
        "wms_onlineresource":"http://localhost/cgi-bin/mapserv?",
        "wms_enable_request":"*","wms_titel":"Temporary Messtischblatt WMS",
        "wms_contactorganization":"Saxon State and University Library Dresden (SLUB)",
        "wms_contactperson":"Jacob Mendt", "wms_contactelectronicmailaddress":"Jacob.Mendt@slub-dresden.de",
        "wms_abstract":"This WMS provides the original Messtischblaetter without an spatial coordinate system."}}

""" generic class for the georeference process """
class AbstractGeoreference(object):
    
    def __init__(self, request):
        self.request = request
    
    """ method: __parseQueryParameter__    
        This method parse the query parameter from the request and adds them as attributes to the
        class object. Further it validates the parameters. """
    def __parseQueryParameter__(self):
        # get parameter values
        for key in self.request.params:
            self.__setAttribute__(key)
        return True

    
    """ method: __setAttribute__    
        This method adds the request parameter as attributes to the object. """
    def __setAttribute__(self, name):
        # parse the value from the request
        value = self.request.params[name]
        
        # check if the value is None
        if value == None:
            message = "Missing input value for query parameter %s"%name
            log.error(message)
            raise HTTPBadRequest(message)
        
        # set attribute
        setattr(self, name, value)
        return True   
    
""" View for handling the georeference process in case of a validation action.
    A validation actions means that the view computes dynamically a georeference 
    result for the given request parameter and send them back to the client via 
    indirect link on a wms """
class GeoreferenceValidate(AbstractGeoreference):
    
    def __init__(self, request):
       AbstractGeoreference.__init__(self, request)
    
    """ method: __call__        
        @param - mtbid {Integer} - id of a messtischblatt
        @param - userid {String} - id of a user 
        @param - points {Double:Double;...} - 4 pixel points coordinates which are reference to the original 
                                              messtischblatt file """
    @view_config(route_name='georeferencer', renderer='string', permission='view', match_param='action=validate')
    def __call__(self):
        log.info("Start processing georeference validation result.")
        
        # parse query parameter and check if they are valide
        self.__parseQueryParameter__()
        self.__validateQueryParameter__()
        
        try:
            # initialize georef process
            dbsession = self.request.db()

            georeferenceProcess = createGeoreferenceProcess(self.mtbid, dbsession, tmp_dir, log)
            # create validation result and get destination path and georeference id
            validationResultPath = os.path.join(dest_mapfilefolder,georeferenceProcess.messtischblatt.dateiname+"::"+str(getUniqueId())+".tif")
            georefId, destPath = georeferenceProcess.fastGeoreference(self.userid,self.points,validationResultPath)
            # create mapfile for georeference result
            wms_url = createMapfile(georeferenceProcess.messtischblatt.dateiname, destPath, 
                                    src_mapfilepath, dest_mapfilefolder, mapfileInitParameter)  
            response = {'wms_url':wms_url,'layer_id':georeferenceProcess.messtischblatt.dateiname,'georefid':georefId}
            return json.dumps(response, ensure_ascii=False, encoding='utf-8') 
        except:
            raise  

    """ method: __validateQueryParameter__
        This method checks if the input query parameter are valide """
    def __validateQueryParameter__(self):
        valMtbId = valPoints = valUserId = False
        
        # check if mtbid is valide
        if (self.mtbid != None):
            if isinstance(int(self.mtbid), int) and len(str(self.mtbid)) == 8:
                valMtbId = True
                
        # check if points are valide
        if (self.points != None):
            try: 
                if parsePixelCoordinates(self.points):
                    valPoints = True
            except:
                pass
            
        # check if user id is valide
        if (self.userid != None):
            stg = str(self.userid)
            if "SELECT" not in stg or ";" not in stg or "DROP" not in stg or "select" not in stg or "drop" not in stg:
                valUserId = True
                
        # create response
        if valMtbId and valPoints and valUserId:
            log.info("MtbId: %s, UserId: %s, Points: %s - are valide"%(self.mtbid,self.userid,self.points))
            return True
        else:
            message = "The input query parameter for the georeference validation are not valide."
            log.error(message)
            raise HTTPBadRequest(message)     

        
""" View for handling the georeference process in case of a confirmation action.
    A confirmation actions means that the view confirm the results of a already 
    registered georeference process or register a georeference process without
    validation """
class GeoreferenceConfirm(AbstractGeoreference):
    
    def __init__(self, request):
       AbstractGeoreference.__init__(self, request)
    
    """ method: __call__        
        @param - mtbid {Integer} - id of a messtischblatt
        @param - userid {String} - id of a user 
        @param - points {Double:Double;...} - 4 pixel points coordinates which are reference to the original 
                                              messtischblatt file """
    @view_config(route_name='georeferencer', renderer='string', permission='view', match_param='action=confirm')
    def __call__(self):
        log.info("Start processing georeference confirmation request.")
        
        # parse query parameter and check if they are valide
        self.__parseQueryParameter__()
        self.__validateQueryParameter__()
        
        try:
            # initialize georef process
            dbsession = self.request.db()
            georeferenceProcess = createGeoreferenceProcess(self.mtbid, dbsession, tmp_dir, log)
            
            if hasattr(self, 'georefid'):
                # confirm the georeference process
                georefid = georeferenceProcess.confirmGeoreferenceProcess(georefid=self.georefid,
                    isvalide=True,typeValidation='user')
                response = {'georefid':georefid,'message':'Change validation status for georeference process!'}
                return json.dumps(response, ensure_ascii=False, encoding='utf-8')
            elif not hasattr(self, 'georefid'):
                # register georef process
                georefid = georeferenceProcess.confirmGeoreferenceProcess(userid=self.userid,
                     clipParams=self.points,isvalide=False,typeValidation='disabled')
                response = {'georefid':georefid,'message':'Georeference parameter saved!'}
                return json.dumps(response, ensure_ascii=False, encoding='utf-8')
            else: 
                # error handling
                log.error("Error while processing georeference confirmation request!")
                raise
        except:
            raise  

    """ method: __validateQueryParameter__
        This method checks if the input query parameter are valide """
    def __validateQueryParameter__(self):
        valMtbId = valPoints = valUserId = valGeorefId = False
        
        # check if mtbid is valide
        if (self.mtbid != None):
            if isinstance(int(self.mtbid), int) and len(str(self.mtbid)) == 8:
                valMtbId = True
        
        # now check the parameter in case georefid is set or not                
        if hasattr(self, 'georefid'):
            # check if georefid is valide
            if isinstance(int(self.georefid), int):
                valGeorefId = True
                
            # create response   
            if valMtbId and valGeorefId:
                log.info("MtbId: %s, GeorefId: %s - are valide"%(self.mtbid,self.georefid))
                return True
        elif not hasattr(self, 'georefid'):
            # check if points are valide
            if (self.points != None):
                try: 
                    if parsePixelCoordinates(self.points):
                        valPoints = True
                except:
                    pass
            
            # check if user id is valide
            if (self.userid != None):
                stg = str(self.userid)
                if "SELECT" not in stg or ";" not in stg or "DROP" not in stg or "select" not in stg or "drop" not in stg:
                    valUserId = True
                
            # create response
            if valMtbId and valPoints and valUserId:
                log.info("MtbId: %s, UserId: %s, Points: %s - are valide"%(self.mtbid,self.userid,self.points))
                return True
        
        # else return badrequest
        message = "The input query parameter for the georeference validation are not valide."
        log.error(message)
        raise HTTPBadRequest(message)  
    
""" Returns a json document which contains the wms url, layername, mtbid and the titel of 
    the mtb for a given blattnr """
@view_config(route_name='choose_map_georef', renderer='chooseGeorefMtb.mako', permission='view',http_cache=0)
def getPage_chooseGeorefMtb(request):
    log.info('Call view getPage_chooseGeorefMtb.')
    if 'blattnr' in request.params:
        paginator = getZoomifyCollectionForBlattnr(request, request.GET.get('blattnr'), request.db)
        return {'paginator':paginator} 
    else: 
        return {}
         
        
