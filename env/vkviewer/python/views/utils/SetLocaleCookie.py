from pyramid.response import Response
from pyramid.view import view_config
from pyramid.httpexceptions import HTTPFound
from vkviewer.python.i18n import LOCALES
from vkviewer import log

""" This is called for checking the localization of the application and sets the correct locales """
@view_config(route_name='set_locales')
def set_locale_cookie(request):
    if request.GET['language']:
        language = request.GET['language']
        log.info('Dispatch change locales request for language %s'%language)
        if not language in LOCALES:
            language = request.registry.settings.default_locale_name
        response = Response()
        response.set_cookie('_LOCALE_', value=language, max_age=31536000)
        target_url = request.route_url('home', _query={'welcomepage':'off'})
    return HTTPFound(location = target_url, headers = response.headers)
