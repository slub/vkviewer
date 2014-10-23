from pyramid.view import view_config
from pyramid.httpexceptions import HTTPInternalServerError

from vkviewer import log
from vkviewer.python.utils.exceptions import GENERAL_ERROR_MESSAGE
from vkviewer.python.models.messtischblatt.Users import Users
from vkviewer.python.models.messtischblatt.Utils import getCountOfPublishedMaps, getCountOfGeorefMaps

@view_config(route_name='welcome', renderer='welcome.mako', permission='view',http_cache=0)
def getWelcomePage(request):  
    log.info('Call view get_welcome_page.')
    try:
        dbsession = request.db
        # get occurrence of georeferenced messtischblaetter
        occurrenceGeorefMtbs = int(getCountOfGeorefMaps(dbsession))
        possibleMtbs = int(getCountOfPublishedMaps(dbsession))
        georefRelation = int((float(occurrenceGeorefMtbs) / float(possibleMtbs)) * 100) 
        # get paginator for user ranking list
        paginator = Users.get_paginator(request, dbsession)
        return {'paginator':paginator,'occurrence_mtbs':occurrenceGeorefMtbs, 'possible_mtbs': possibleMtbs, 'georef_rel': georefRelation}
    except Exception:
        log.error('Error while creating paginator for user georeference ranking')
        log.error(Exception)
        raise HTTPInternalServerError(GENERAL_ERROR_MESSAGE)