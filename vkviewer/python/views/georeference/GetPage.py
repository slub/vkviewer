from pyramid.view import view_config

from vkviewer import log
from vkviewer.python.models.messtischblatt.Georeferenzierungsprozess import Georeferenzierungsprozess


@view_config(route_name='georeference-page', renderer='georeference-page.mako', permission='edit',http_cache=0)
def getGeoreferencePage(request):
    log.info('Call view getGeoreferencePage.')
    if 'id' in request.params:
        return {'objectid':request.params['id']}
    elif 'georeferenceid' in request.params:
        georefProcess = Georeferenzierungsprozess.by_id(request.params['georeferenceid'], request.db)
        return {'objectid':georefProcess.mapid}