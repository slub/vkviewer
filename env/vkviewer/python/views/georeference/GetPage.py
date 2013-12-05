from pyramid.view import view_config

# own import stuff
from vkviewer.python.models.messtischblatt.Utils import getZoomifyCollectionForBlattnr
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
    
""" Return a page for georeferencing a mtb 
    
    @TODO write test so that this site is only called with edit permissions
"""
@view_config(route_name='georeference_start', renderer='georeferenceStart.mako', permission='edit',http_cache=0)
def getPage_GeoreferenceStart(request):
    log.info('Call view getPage_GeoreferenceStart.')
    return {'faq_url': request.route_url('faq_georef_start')}


@view_config(route_name='georeference_validate', renderer='georeferenceValidate.mako', permission='edit',http_cache=0)
def getPage_GeoreferenceValidate(request):
    log.info('Call view getPage_GeoreferenceStart.')
    return {'faq_url': request.route_url('faq_georef_validate')}