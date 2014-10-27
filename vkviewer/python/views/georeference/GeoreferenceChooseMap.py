'''
Created on Oct 1, 2014

@author: mendt
'''
import traceback
from pyramid.view import view_config
from pyramid.httpexceptions import HTTPBadRequest
from webhelpers.paginate import PageURL_WebOb, Page

from vkviewer import log
from vkviewer.settings import ADMIN_ADDR
from vkviewer.python.models.messtischblatt.Map import Map
from vkviewer.python.models.messtischblatt.Metadata import Metadata

ERROR_MSG = "Please check your request parameters or contact the administrator (%s)."%ADMIN_ADDR

""" Returns a page for choosing a messtischblatt for georeferencering """
@view_config(route_name='georeference-choose-map', renderer='georeference-choose-map.mako', permission='view',http_cache=0)
def chooseGeoreferenceMap(request):
    log.info('Call view getPage_chooseGeorefMtb.')
    if 'blattnr' in request.params:
        log.debug('Look for unreferenced messtischblaetter')
        
        # get response from database
        collection = []
        metadata = Metadata.all_byBlattnr(request.GET.get('blattnr'), request.db)
        for record in metadata:
            map = Map.by_id(record.mapid, request.db)
            if map.istaktiv and not map.isttransformiert and map.hasgeorefparams == 0:
                item = {'mapid':map.id,'title':record.title}
                collection.append(item)
    
        log.debug('Create paginator for collection - %s'%collection)
        page_url = PageURL_WebOb(request)
        return {'paginator': Page(collection, 1, url=page_url, items_per_page=10)}
    else: 
        log.error('Could not find a blattnr parameter value ...')
        log.error(traceback.format_exc())
        raise HTTPBadRequest(ERROR_MSG) 