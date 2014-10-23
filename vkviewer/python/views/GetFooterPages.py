from pyramid.view import view_config

@view_config(route_name='impressum', renderer='menu-impressum.mako', permission='view',http_cache=0)
def impressum_page(request):
    return {}


@view_config(route_name='project', renderer='menu-project.mako', permission='view',http_cache=0)
def partner_page(request):
    return {}

@view_config(route_name='contact', renderer='menu-contact.mako', permission='view',http_cache=0)
def kontakt_page(request):
    return {}

@view_config(route_name='faq', renderer='menu-faq.mako', permission='view',http_cache=0)
def faq_mainPage(request):
    return {}