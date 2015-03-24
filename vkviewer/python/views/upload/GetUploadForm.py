'''
:Date: Created on 30.09.2014

:Authors: Leisen
'''
from pyramid.view import view_config
from pyramid.response import Response


@view_config(route_name='upload', renderer='upload-form.mako', permission='moderator', match_param='action=form')
def getUploadForm(request):
    """This function returns the Upload-form template."""
    return {}