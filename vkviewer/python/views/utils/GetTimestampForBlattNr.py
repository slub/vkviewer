from pyramid.view import view_config
from pyramid.httpexceptions import HTTPInternalServerError
from sqlalchemy.exc import DBAPIError

from vkviewer import log
from vkviewer.python.utils.exceptions import GENERAL_ERROR_MESSAGE
from vkviewer.python.models.messtischblatt.VBlattschnittMtb import VBlattschnittMtb

""" Returns a json document which contains a timestamps string and a occurence value for
    a given blattnr.
    @param - blattnr -
    
    @return - timestamps - List of timestamps seperated by a comma
    @return - occurence - how many timestamps are occure for this blattnr"""
@view_config(route_name='gettimestamps', renderer='json', permission='view')
def getTimestamps_forBlattnr(request):
    try:
        dbsession = request.db
        results = VBlattschnittMtb.allForBlattnr(request.GET.get('blattnr'), dbsession)
        occurence = 0
        timestamps = ''
        for refGridMtb in results:
            occurence += 1
            timestamps += '%s,'%refGridMtb.time 
        return {'occurence':occurence,'timestamps':timestamps}
    except DBAPIError as e:
        log.error(e)
        raise HTTPInternalServerError(GENERAL_ERROR_MESSAGE)