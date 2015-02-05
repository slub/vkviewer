# -*- coding: utf-8 -*-
from pyramid.view import view_config

# database imports
from vkviewer import log

@view_config(route_name='evaluation-georeference', renderer='evaluation-georeference.mako', permission='moderator', match_param='action=evaluation')
def getEvaluationPage(request):
    log.info('Request - Get evaluation page.')
    return {}
