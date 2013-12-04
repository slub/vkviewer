from pyramid.view import view_config
from vkviewer.python.models.messtischblatt.Users import Users
from vkviewer.python.models.messtischblatt.Utils import getCountOfGeorefMesstischblaetter
from vkviewer import log

@view_config(route_name='welcome', renderer='welcome.mako', permission='view',http_cache=0)
def get_welcome_page(request):  
    log.info('Call view get_welcome_page.')
    dbsession = request.db
    # get occurrence of georeferenced messtischblaetter
    occurrenceGeorefMtbs = getCountOfGeorefMesstischblaetter(dbsession)
    try:
        # get paginator for user ranking list
        paginator = Users.get_paginator(request, dbsession)
        return {'paginator':paginator,'occurrence_mtbs':occurrenceGeorefMtbs}
    except Exception:
        log.debug('Error while creating paginator for user georeference ranking')
        log.debug(Exception)
        return {'occurrence_mtbs':occurrenceGeorefMtbs}