import os
import uuid
from pyramid.view import view_config
from pyramid.httpexceptions import HTTPBadRequest, HTTPInternalServerError, HTTPFound
from sqlalchemy.exc import DBAPIError

from vkviewer import log 
from vkviewer.settings import ALLOWED_EXTENSIONS, UPLOAD_DIR, UPLOAD_THUMBS_SMALL_DIR, UPLOAD_THUMBS_MID_DIR, \
    UPLOAD_ZOOMIFY_DIR, UPLOAD_SERVICE_URL_ZOOMIFY, UPLOAD_SERVICE_URL_THUMBS_SMALL, UPLOAD_SERVICE_URL_THUMBS_MID
from vkviewer.python.models.messtischblatt.Uploads import Uploads
from vkviewer.python.models.messtischblatt.Map import Map
from vkviewer.python.models.messtischblatt.Metadata import Metadata
from vkviewer.python.models.messtischblatt.Users import Users
from vkviewer.python.georef.utils import getTimestampAsPGStr
from vkviewer.python.utils.imagetool import createSmallThumbnail, createMidThumbnail
from vkviewer.python.utils.exceptions import NotFoundException
from vkviewer.python.utils.exceptions import MissingQueryParameterError, WrongParameterException, GENERAL_ERROR_MESSAGE
from vkviewer.python.tools import checkIsUser
from vkviewer.python.script.CreateZoomifyTiles import processZoomifyTiles


""" 
    @TODO Return a json reponse instead of an redirect
    @TODO check if correct metadata is send at the beginning / validation
"""
@view_config(route_name='upload', renderer='string', permission='moderator', match_param='action=push', request_method='POST')
def store_image(request):
    try:
        log.debug('Receive a upload request.')
        username = checkIsUser(request)
        user = Users.by_username(username, request.db)

        # check if need metadata is send
        log.debug('Check if mandatory metadata is send ...')
        params = request.params
        if not 'title' in params or not 'titleshort' in params or \
                not 'imagelicence' in params or not 'imageowner' in params:
            raise MissingQueryParameterError('Missing query parameter ...')
        
        # register upload process in database
        log.debug('Register upload process to database ...')
        uploadObj = Uploads(userid = user.id, time = getTimestampAsPGStr(), params = '%s'%request.params)
        request.db.add(uploadObj)
        
        log.debug('Create and add mapObj ...')
        mapObj = Map(istaktiv = False, isttransformiert = False, maptype = 'A', hasgeorefparams = 0)
        request.db.add(mapObj)
        request.db.flush()
        
        # check if image allowed extensions
        # ``filename`` contains the name of the file in string format.
        log.debug('Create filename for persistent saving ...')
        filename = request.POST['file'].filename
        if not allowed_file(filename):
            raise WrongParameterException('Format of the image is not supported through the upload API.')
            
        
        # ``input_file`` contains the actual file data which needs to be
        # stored somewhere.
        inputFile = request.POST['file'].file
    
        # Note that we are generating our own filename instead of trusting
        # the incoming filename since that might result in insecure paths.
        # Please note that in a real application you would not use /tmp,
        # and if you write to an untrusted location you will need to do
        # some extra work to prevent symlink attacks.    
        newFilename = '%s.%s' % ('df_dk_%s'%mapObj.id, filename.rsplit('.', 1)[1])
        filePath = os.path.join(UPLOAD_DIR, newFilename)
    
        # save file to disk
        log.debug('Save file to datastore ...')
        saveFile(inputFile, filePath)
        
        # process thumbnails
        log.debug('Create thumbnails ...')
        thumbSmall = createSmallThumbnail(filePath, UPLOAD_THUMBS_SMALL_DIR)
        thumbMid = createMidThumbnail(filePath, UPLOAD_THUMBS_MID_DIR)   
        log.debug('Create zoomify tiles')    
        zoomifyTiles = processZoomifyTiles(filePath, UPLOAD_ZOOMIFY_DIR, log)
        
        # parse boundinbBox
        pgBoundingBoxStr = parseBoundingBoxFromRequest(request.params)
            
        # add geometry to map object and update other attributes
        # work around --> should be replaced through adding the geomtry on initial adding
        log.debug('Update mapObj and create metadataObj ...')
        mapObj.apsdateiname = newFilename
        mapObj.originalimage = filePath
        Map.updateGeometry(mapObj.id, pgBoundingBoxStr, request.db)        
        request.db.flush()
        
        # parse and create metadataObj
        if 'title' in request.params:
            title = request.params['title']
        if 'titleshort' in request.params:
            titleshort = request.params['titleshort']    
        if 'serientitle' in request.params:
            serientitle = request.params['serientitle'] 
        if 'description' in request.params:
            description = request.params['description']  
        if 'timepublish' in request.params:
            timepublish = request.params['timepublish']                         
        if 'imagelicence' in request.params:
            imagelicence = request.params['imagelicence']
        if 'scale' in request.params:
            scale = request.params['scale']
        if 'imageowner' in request.params:
            imageowner = request.params['imageowner']
           
        # create metadata obj 
        # the creating of the paths are right now quite verbose
        imagezoomify = UPLOAD_SERVICE_URL_ZOOMIFY + os.path.basename(filePath).split('.')[0] + '/ImageProperties.xml' 
        thumbssmall = UPLOAD_SERVICE_URL_THUMBS_SMALL + os.path.basename(thumbSmall)
        thumbsmid = UPLOAD_SERVICE_URL_THUMBS_MID + os.path.basename(thumbMid)
        metadataObj = Metadata(mapid = mapObj.id, title = title, titleshort = titleshort, 
                serientitle = serientitle, description = description, timepublish = "%s-01-01 00:00:00"%(timepublish), 
                imagelicence = imagelicence, imageowner = imageowner, scale = scale,
                imagezoomify = imagezoomify,
                thumbssmall = thumbssmall,
                thumbsmid = thumbsmid)
        request.db.add(metadataObj)
        
        # update uploadObj and create response
        uploadObj.mapid = mapObj.id
        
        log.debug('Create response ...')
        target_url = request.route_url('upload-profile')
        return HTTPFound(location = target_url)  
    
    # Exception handling     
    except NotFoundException as e:
        log.exception(e)
        ERR_MSG = GENERAL_ERROR_MESSAGE + "We're sorry, but something went wrong. Please be sure that your file respects the upload conditions."
        return HTTPBadRequest(ERR_MSG)
    except DBAPIError as e:
        log.error('Database error within a upload process')
        log.exception(e)
        return HTTPInternalServerError(GENERAL_ERROR_MESSAGE)
    except MissingQueryParameterError or WrongParameterException as e:
        log.exception(e)
        raise HTTPBadRequest(GENERAL_ERROR_MESSAGE)
    except Exception as e:
        log.exception(e)
        raise HTTPInternalServerError(GENERAL_ERROR_MESSAGE)

   
def allowed_file(filename):
    """ Checks if the ending of an image file is within an allowed set of extensions.
    
    @param String: filename
    @return Boolean
    """
    if '.' in filename and filename.rsplit('.', 1)[1] in ALLOWED_EXTENSIONS:
        return True
    return False

def parseBoundingBoxFromRequest(params):
    """ Parse the boundingbox parameter from the request and returns then in the form of an 
        POSTGIS geometry string.
        
    @param webob.multidict.NestedMultiDict: params
    @return String 
    """ 
    if 'minlon' in params:
        lowX = params['minlon']
    if 'minlat' in params:
        lowY = params['minlat']        
    if 'maxlon' in params:
        highX = params['maxlon']
    if 'maxlat' in params:
        highY = params['maxlat']
    if 'epsg' in params:
        epsg = params['epsg']
    return "POLYGON((%s %s, %s %s, %s %s, %s %s, %s %s))"%(lowX, lowY, lowX, highY, highX, highY, highX, lowY, lowX, lowY)

def saveFile(inputFile, filePath):
    """ Method saves a given file to disk 
    
    @param cgi.FieldStorage: inputFile
    @param String: filePath Path to which the file should be wrote
    """
    # We first write to a temporary file to prevent incomplete files from
    # being used.
    temp_file_path = filePath + '~'
    # um eine Datei zu lesen oder schreiben open(filename[,mode]) w- write, b-binaerDaten
    output_file = open(temp_file_path, 'wb') 
    
    # Finally write the data to a temporary file
    inputFile.seek(0)
    while True:
        data = inputFile.read()
        if not data:
            break
        output_file.write(data)
        
    # If your data is really critical you may want to force it to disk first
    # using output_file.flush(); os.fsync(output_file.fileno())  
    output_file.close()
        
    # Now that we know the file has been fully saved to disk move it into place.
    os.rename(temp_file_path, filePath)
