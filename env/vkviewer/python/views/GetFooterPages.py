from pyramid.view import view_config
from pyramid.renderers import render_to_response

@view_config(route_name='impressum', renderer='impressum.mako', permission='view',http_cache=0)
def impressum_page(request):
    return {}


@view_config(route_name='partner', renderer='partner.mako', permission='view',http_cache=0)
def partner_page(request):
    return {}

@view_config(route_name='contact', renderer='contact.mako', permission='view',http_cache=0)
def kontakt_page(request):
    return {}


""""
FAQ Pages
"""
@view_config(route_name='faq', renderer='faqMainPage.mako', permission='view',http_cache=0)
def faq_mainPage(request):
    return {}

@view_config(route_name='faq_georef_start', renderer='faqGeorefStart.mako', permission='view',http_cache=0)
def faq_georefStartPage(request):
    return {}

@view_config(route_name='faq_georef_validate', renderer='faqGeorefValidate.mako', permission='view',http_cache=0)
def faq_georefValidationPage(request):
    return {}