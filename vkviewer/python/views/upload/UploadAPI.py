import os
import cgi
import uuid
import datetime
from pyramid.response import Response
from pyramid.view import view_config
from pyramid.httpexceptions import HTTPNotFound, HTTPBadRequest, HTTPFound
from pyramid.security import remember
from sqlalchemy import func
from sqlalchemy.exc import DBAPIError
# from werkzeug import secure_filename
from vkviewer.settings import ALLOWED_EXTENSIONS, UPLOAD_DIR
from vkviewer.python.models.messtischblatt.Uploads import Uploads
from vkviewer.python.models.messtischblatt.Map import Map
from vkviewer.python.models.messtischblatt.Metadata import Metadata
from vkviewer.python.models.messtischblatt.Users import Users
from vkviewer.python.models.messtischblatt.Geometry import Geometry
# from vkviewer.python.utils import saveImage
from vkviewer.python.georef.utils import getTimestampAsPGStr
from vkviewer.python.georef.geometry import BoundingBox
from vkviewer.python.utils.exceptions import NotFoundException
from vkviewer.python.utils.exceptions import MissingQueryParameterError, WrongParameterException, GENERAL_ERROR_MESSAGE
from vkviewer.python.tools import checkIsUser
from vkviewer import log
import json
import transaction

ERROR_MSG = "Please check the syntax of your request parameters or contact the administrator."        

# check Dateiendung
def allowed_file(filename):
    response = '.' in filename and \
           filename.rsplit('.', 1)[1] in ALLOWED_EXTENSIONS
    return response

""" 
    @TODO Return a json reponse instead of an redirect
"""
@view_config(route_name='upload', renderer='string', permission='moderator', match_param='action=push', request_method='POST')
def store_image(request):
    try:
        log.debug('Receive a upload request.')
        username = checkIsUser(request)
        user = Users.by_username(username, request.db)

        # ``filename`` contains the name of the file in string format.
        filename = request.POST['file'].filename
        
        # check if image allowed extensions
        if allowed_file(filename):
        # ``input_file`` contains the actual file data which needs to be
        # stored somewhere.
    
            input_file = request.POST['file'].file
    
        # Note that we are generating our own filename instead of trusting
        # the incoming filename since that might result in insecure paths.
        # Please note that in a real application you would not use /tmp,
        # and if you write to an untrusted location you will need to do
        # some extra work to prevent symlink attacks.
    
            file_path = os.path.join(UPLOAD_DIR, '%s.jpeg' % uuid.uuid4()) # os.path.join fuegt die uebergebenen Pfadangaben zu einem einzigen Pfad zusammen, indem sie verkettet werden
    
        # We first write to a temporary file to prevent incomplete files from
        # being used.
    
            temp_file_path = file_path + '~'
            output_file = open(temp_file_path, 'wb') 
            
        # um eine Datei zu lesen oder schreiben open(filename[,mode]) w- write, b-binaerDaten
    
        # Finally write the data to a temporary file
            input_file.seek(0)
            while True:
                data = input_file.read()
                if not data:
                    break
                output_file.write(data)
    
        # If your data is really critical you may want to force it to disk first
        # using output_file.flush(); os.fsync(output_file.fileno())
    
            output_file.close()
    
        # Now that we know the file has been fully saved to disk move it into place.
    
            os.rename(temp_file_path, file_path)
            
        # BoundingBox
            if 'minlon' in request.params:
                lowX = request.params['minlon']
            if 'minlat' in request.params:
                lowY = request.params['minlat']        
            if 'maxlon' in request.params:
                highX = request.params['maxlon']
            if 'maxlat' in request.params:
                highY = request.params['maxlat']
            if 'epsg' in request.params:
                epsg = request.params['epsg']
            
            # newbbox = BoundingBox(lowX, lowY, highX, highY, epsg)
            # bbox = newbbox.getCornerPointsAsList()
            uploadedMap = Map(apsdateiname = filename, originalimage = file_path, istaktiv = False, isttransformiert = False)
            request.db.add(uploadedMap)
            request.db.flush()
            Map.updateGeometry(uploadedMap.id, "POLYGON((%s %s, %s %s, %s %s, %s %s, %s %s))"%(lowX, lowY, lowX, highY, highX, highY, highX, lowY, lowX, lowY), request.db)        
            request.db.flush()
        
        # read upload request
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

        # check if the input parameters are valide
        log.debug('Validate the query parameters ...')
        if not title or not titleshort or not imagelicence or not imageowner:
            raise Exception('Missing query parameter ...')
        if len(title) <= 3:
            raise Exception('Title is to short.')
            
        # create metadata obj 
        newMetadata = Metadata(mapid = uploadedMap.id, title = title, titleshort = titleshort, serientitle = serientitle, description = description,
                                         timepublish = "%s-01-01 00:00:00"%(timepublish), imagelicence = imagelicence, imageowner = imageowner, scale = scale)
        # add metadata obj to database
        request.db.add(newMetadata)
        
        # create uplaodObject
        uploads = Uploads(userid = user.id, time = getTimestampAsPGStr(), mapid = uploadedMap.id)
        request.db.add(uploads)
          
        target_url = request.route_url('upload-profile')
        return HTTPFound(location = target_url)       
    except NotFoundException as e:
        log.error(e)
        # raise HTTPNotFound(ERROR_MSG)
        ERR_MSG = GENERAL_ERROR_MESSAGE + "We're sorry, but something went wrong. Please be sure that your file respects the upload conditions."
        return HTTPNotFound(ERR_MSG, content_type='text/plain', status_int=500)
    except DBAPIError:
        raise
        log.error('Problems while trying to register report uploadprocess in database')
        return HTTPBadRequest(GENERAL_ERROR_MESSAGE, content_type='text/plain', status_int=500)
    except Exception:
        log.error('Unknown error while trying to process an upload request ...')
        return HTTPBadRequest(GENERAL_ERROR_MESSAGE, content_type='text/plain', status_int=500)
    except Exception as e:
        log.error(e)
        raise HTTPBadRequest(ERROR_MSG)



'''def upload_file(request):
        if request.method == 'POST':
            input_file = request.params['file']
            if input_file and allowed_file(input_file.filename):
                filename = input_file.filename
                input_file.save(os.path.join('E:\workspace', filename))'''


'''def pushUploadData(request):
    try:
        log.info('Receive a upload request.')
        # userid = checkIsUser(request)
        # user = Users.by_username(userid, request.db)
        if request.method == 'POST':
            # log into database
            dbsession = request.db
            # create uplaodObject
            # uploads = Uploads(userid = user.login, time = getTimestampAsPGStr())
            # dbsession.add(uploads)
               
            # request image
            input_file = request.params['file']
            filename = input_file.filename
            # check if image allowed extensions
            allowed = allowed_file(filename)
        if allowed:
            # filename = secure_filename(filename)
    
            # parse path
            originalimagepath = os.path.join('E:\workspace', filename) # os.path.join fuegt die uebergebenen Pfadangaben zu einem einzigen Pfad zusammen, indem sie verkettet werden
            # output_file = open(originalimagepath, 'wb')
            # save image
            data = input_file.read()
            output_file = open(originalimagepath, 'wb')
            output_file.write(data)
            # path = saveImage(dateipfad)
            # create map object
            # uploadedMap = Map(apsfilename = filename, originalimage = originalimagepath)
            # add map object to db
            dbsession.add(Map)
            

            # dbsession.add(uploads)
            # request.db.flush()
            dbsession.flush()
            # mapid = mapObj.id
            
    
    # 

            # read upload request
        try:
            log.info('Receive get upload push request.')
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

            # check if the input parameters are valide
            log.debug('Validate the query parameters ...')
            if not title or not titleshort or not imagelicence or not imageowner:
                raise Exception('Missing query parameter ...')
            if len(title) <= 3:
                raise Exception('Title is to short.')
            
            # create metadata obj 
            uploadMetadata = Metadata(title = title, titleshort = titleshort, serientitle = serientitle, description = description,
                                         timepublish = timepublish, imagelicence = imagelicence, imageowner = imageowner, scale = scale)
            # add metadata obj to database
            dbsession.add(uploadMetadata)
            
            # request.db.commit()
            # create response (json, mako)
   
    
        
            # log.debug('Save uploads in the database ...')
            return {'url':'push'}
        except NotFoundException as e:
            log.error(e)
            raise HTTPNotFound(ERROR_MSG)
    except Exception as e:
        log.error(e)
        raise HTTPBadRequest(ERROR_MSG)'''
 
    
# def save_uploadedImage(request):
#     if request.method == 'POST':
#         input_file = request.params['file']
#         filename = input_file.filename
#         allowed = allowed_file(filename)
#         if allowed:
#             newfilename = secure_filename(filename)
#             # mapobject = Mapfile(filename=filename, user=userid)
#         
#             # os.path.join fuegt die uebergebenen Pfadangaben zu einem einzigen Pfad zusammen, indem sie verkettet werden
#             file_path = input_file(os.path.join('E:\workspace', newfilename), 'wb')
#             
#             temp_file_path = file_path + '~'
#             output_file = open(file_path, 'wb')
#             imagedata = read(output_file)
#             output_file.write(imagedata)
#             #   data = input_file.read(2<<16) 
#             #   if not data:
#             #       break
#             #    output_file.write(data)
#             
#             #output_file.close()
#             os.rename(temp_file_path, file_path)
#     
#         return Response('ok')

