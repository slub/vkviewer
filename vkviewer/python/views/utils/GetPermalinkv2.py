import traceback
from pyramid.view import view_config
from pyramid.httpexceptions import HTTPFound, HTTPBadRequest
from sqlalchemy.exc import DBAPIError

from vkviewer import log
from vkviewer.python.utils.exceptions import GENERAL_ERROR_MESSAGE
from vkviewer.python.views.utils.GetPermalink import createPermalink

@view_config(route_name='permalinkv2', renderer='string', permission='view')
def getPermalinkForObjectidv2(request):
    """ Contains a permalink url for the given objectid"""
    try:
        log.info('Receive get permalink request.')
        objectid = request.GET.get('objectid')
        permalink = createPermalink(request, objectid)            
        return HTTPFound(location=permalink)
    except DBAPIError:
        log.error(traceback.format_exc())
        raise HTTPBadRequest(GENERAL_ERROR_MESSAGE)