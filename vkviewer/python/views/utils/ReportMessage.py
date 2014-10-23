from pyramid.view import view_config
from pyramid.httpexceptions import HTTPBadRequest,HTTPInternalServerError
from sqlalchemy.exc import DBAPIError

from vkviewer import log
from vkviewer.settings import admin_mail
from vkviewer.python.tools import checkIsUser
from vkviewer.python.models.messtischblatt.Fehlermeldung import Fehlermeldung
from vkviewer.python.georef.utils import getTimestampAsPGStr
from vkviewer.python.utils.mail import sendMailCommandLine
from vkviewer.python.utils.exceptions import MissingQueryParameterError, WrongParameterException, GENERAL_ERROR_MESSAGE


@view_config(route_name='report', renderer='json', permission='view', match_param='action=contact')     
def logContactRequest(request):
    try:
        log.info('Receive a contact message request.')
    
        # check if there is a userid from a registered user
        userid = checkIsUser(request)
        if not userid:
            userid = 'anonym'

        if 'reference' in request.params:
            reference = request.params['reference']
        if 'message' in request.params:
            message = request.params['message']
        if 'email' in request.params:
            email = request.params['email']

        # check if the input parameters are valide
        log.debug('Validate the query parameters ...')
        if not email or not reference or not message:
            raise MissingQueryParameterError('Missing query parameter ...')
        if len(message) <= 5:
            raise WrongParameterException('Message is to short. For a correct understanding of your matter please leave us a short explanation.')

        # log into database
        log.debug('Save contact message in the database ...')
        fehlermeldung = Fehlermeldung(email = email, referenz = reference, nutzerid = userid,
                    fehlerbeschreibung = message, timestamp = getTimestampAsPGStr())
        request.db.add(fehlermeldung)

        # sending an email
        log.debug('Instruct admin about new contact message ...');
        reportErrorMessageToAdmin(fehlermeldung, 'Request - Contact form', userid)
        
        log.debug('Create response message ...')
        return {'status':'confirmed'}
    except MissingQueryParameterError:
        log.error('Could not create correct error report because of missing query parameters.')
        raise HTTPBadRequest('Missing form parameters')
    except WrongParameterException as e:
        log.error(e.msg)
        raise HTTPBadRequest('Wrong form parameters')
    except DBAPIError:
        log.error('Problems while trying to register report error in database')
        raise HTTPInternalServerError(GENERAL_ERROR_MESSAGE)
    except Exception:
        log.error('Unknown error while trying to process a contact message request ...')
        raise HTTPInternalServerError(GENERAL_ERROR_MESSAGE)
    
def reportErrorMessageToAdmin(fehlermeldung, subject, userid):
    email_msg = '\nEs wurde folgende Benachrichtigung ueber das Portal VK2.0. gestellt.\n\nEmail: {email}\nLogin: {userid}\nReferenz: {referencer}\nNachricht: {message}\n'.format(
        email = str(fehlermeldung.email), userid = str(userid), referencer = str(fehlermeldung.referenz), message = str(fehlermeldung.fehlerbeschreibung))
    sendMailCommandLine(admin_mail, subject, email_msg)
    



