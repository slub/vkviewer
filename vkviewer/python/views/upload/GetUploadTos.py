'''
Created on 30.09.2014

@author: Leisen
'''
from pyramid.view import view_config
from pyramid.response import Response


@view_config(route_name='upload-tos', renderer='upload-tos.mako', permission='moderator')
def getUploadForm(request):
    return {}