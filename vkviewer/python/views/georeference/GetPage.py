from pyramid.view import view_config

# own import stuff

from vkviewer.python.models.messtischblatt.Utils import getZoomifyCollectionForBlattnr
from vkviewer.python.models.messtischblatt.Messtischblatt import Messtischblatt
from vkviewer import log

""" Returns a page for choosing a messtischblatt for georeferencering """
@view_config(route_name='choose_map_georef', renderer='chooseGeorefMtb.mako', permission='view',http_cache=0)
def getPage_chooseGeorefMtb(request):
    log.info('Call view getPage_chooseGeorefMtb.')
    if 'blattnr' in request.params:
        paginator = getZoomifyCollectionForBlattnr(request, request.GET.get('blattnr'), request.db)
        return {'paginator':paginator} 
    else: 
        return {}

@view_config(route_name='georeference_page', renderer='georeference.mako', permission='edit',http_cache=0)
def getGeoreferencePage(request):
    log.info('Call view getGeoreferencePage.')
    if 'id' in request.params:
        return {'objectid':request.params['id']}
