from pyramid.view import view_config

@view_config(route_name='impressum', renderer='impressum.mako', permission='view',http_cache=0)
def impressum_page(request):
    return {}

@view_config(route_name='faq', renderer='faq.mako', permission='view',http_cache=0)
def faq_page(request):
    return {}

@view_config(route_name='partner', renderer='partner.mako', permission='view',http_cache=0)
def partner_page(request):
    return {}

@view_config(route_name='contact', renderer='contact.mako', permission='view',http_cache=0)
def kontakt_page(request):
    return {}