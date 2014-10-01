from pyramid.view import view_config

from vkviewer import log



@view_config(route_name='georeference_page', renderer='georeference.mako', permission='edit',http_cache=0)
def getGeoreferencePage(request):
    log.info('Call view getGeoreferencePage.')
    if 'id' in request.params:
        return {'objectid':request.params['id']}
