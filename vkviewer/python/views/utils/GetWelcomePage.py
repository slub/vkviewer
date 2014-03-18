from pyramid.view import view_config
from vkviewer.python.models.messtischblatt.Users import Users
from vkviewer.python.models.messtischblatt.Utils import getCountOfGeorefMesstischblaetter, getCountOfPublishedMesstischblaetter
from vkviewer import log

@view_config(route_name='welcome', renderer='welcome.mako', permission='view',http_cache=0)
def getWelcomePage(request):  
    log.info('Call view get_welcome_page.')
    try:
        dbsession = request.db
        # get occurrence of georeferenced messtischblaetter
        occurrenceGeorefMtbs = int(getCountOfGeorefMesstischblaetter(dbsession))
        possibleMtbs = int(getCountOfPublishedMesstischblaetter(dbsession))
        georefRelation = int((float(occurrenceGeorefMtbs) / float(possibleMtbs)) * 100) 
        # get paginator for user ranking list
        paginator = Users.get_paginator(request, dbsession)
        return {'paginator':paginator,'occurrence_mtbs':occurrenceGeorefMtbs, 'possible_mtbs': possibleMtbs, 'georef_rel': georefRelation}
    except Exception:
        log.debug('Error while creating paginator for user georeference ranking')
        log.debug(Exception)
        return {}