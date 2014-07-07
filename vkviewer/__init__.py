# -*- coding: utf-8 -*-
import os, sys, logging

# set path for finding correct project scripts and modules
sys.path.insert(0,os.path.dirname(__file__))
sys.path.append(os.path.join(os.path.dirname(__file__), "python"))

from wsgiref.simple_server import make_server
from pyramid.config import Configurator
from pyramid.session import UnencryptedCookieSessionFactoryConfig
from pyramid.response import Response
from pyramid.view import view_config

# imports for the authentication and authorization policies
from pyramid.authentication import AuthTktAuthenticationPolicy
from pyramid.authorization import ACLAuthorizationPolicy
from pyramid.security import (remember, forget, )

# import database stuff
from sqlalchemy import create_engine, engine_from_config
from sqlalchemy.orm import sessionmaker, scoped_session
from zope.sqlalchemy import ZopeTransactionExtension


# import of own python classes
from settings import dbconfig, routePrefix, secret_key
from vkviewer.python.utils.logger import createLogger
from vkviewer.python.security import EntryFactory, groupfinder
from vkviewer.python.proxy import proxy_post
from vkviewer.python.models.Meta import initialize_sql, Base
from vkviewer.python.i18n import custom_locale_negotiator
#from python.models.meta import DBSession, Base, initialize_sql

# load logger
log = createLogger('vkviewer', logging.DEBUG)

# base path
here = os.path.dirname(os.path.abspath(__file__))

def loadLogger(debug=True):
    """ This function initialize the logger for the application.
        
        Arguments:
            debug {Boolean} """
    if debug:
        log = createLogger('vkviewer', logging.DEBUG)
    else:
        log = logging.getLogger(__name__)
    
def addRoutes(config):
    # add routes
    config.add_static_view(routePrefix+'/static', 'vkviewer:static/', cache_max_age=3600)
    config.add_route('proxy', routePrefix+'/proxy/')
    config.add_route('home', routePrefix + '/')
    config.add_route('home1', routePrefix)
    config.add_route('home_login', routePrefix+'/auth')
    config.add_route('set_locales', routePrefix+'/locales')
    
    # route for authentification
    config.add_route('auth', routePrefix+'/sign/{action}')
    
    # for simple get requests for client feedback
    config.add_route('gettimestamps',routePrefix+'/gettimestamps')
    config.add_route('gettimestampsforid',routePrefix+'/gettimestampsforid')

    # routes for the georeference process
    config.add_route('choose_map_georef',routePrefix+'/choosegeoref')
    config.add_route('georeference_page', routePrefix+'/georeference')
    config.add_route('georeference', routePrefix+'/georeference/{action}')
    config.add_route('report', routePrefix+'/report/{action}')
    
    # georeferencer evaluation
    config.add_route('georeference_evaluation', routePrefix+'/admin/{action}')
    
    # footer routes
    config.add_route('contact', routePrefix+'/contact')
    config.add_route('project', routePrefix+'/project')
    config.add_route('impressum', routePrefix+'/impressum')
    config.add_route('faq', routePrefix+'/faq')
    config.add_route('faq_loggedIn', routePrefix+'/faq/loggedin')
    
    # further faqs
    config.add_route('faq_georef_start', routePrefix+'/faq/georef/start')
    config.add_route('faq_georef_validate', routePrefix+'/faq/georef/validate')
    
    # welcome page
    config.add_route('welcome', routePrefix+'/welcome')
    config.add_route('set_visitor_cookie', routePrefix+'/welcomeoff')

    # change & reset pw
    config.add_route('change_pw', routePrefix+'/change/pw/{action}')
    
    # profile pages
    config.add_route('users_profile_georef', routePrefix+'/profile/georef')
    config.add_route('mtb_profile', routePrefix+'/profile/mtb')
    config.add_route('map_profile', routePrefix+'/profile/map')
    
    # error pages
    config.add_route('error_page', routePrefix+'/error')
    
    # permalink page
    config.add_route('permalink', routePrefix+'/permalink')
    
    # test pages
    config.add_route('development_page', routePrefix+'/development')

def db(request):
    return request.registry.dbmaker()   
    
def loadDB(config, settings, debug=False):
    if debug:
        engine = create_engine(dbconfig, encoding='utf8', echo=True)
    else:
        engine = engine_from_config(settings, prefix='sqlalchemy.')
    config.registry.dbmaker = scoped_session(sessionmaker(bind=engine,extension=ZopeTransactionExtension()))
    config.add_request_method(db, reify=True)   
    
    initialize_sql(engine)
    config.scan('python.models')

def setLocalizationOptions(config):
    config.add_translation_dirs('vkviewer:locale')
    config.add_subscriber('vkviewer.python.i18n.add_renderer_globals',
                      'pyramid.events.BeforeRender')
    config.add_subscriber('vkviewer.python.i18n.add_localizer',
                      'pyramid.events.NewRequest')
    config.set_locale_negotiator(custom_locale_negotiator)

def getAuthenticationPolicy():
    authPolicy = AuthTktAuthenticationPolicy(secret_key, callback=groupfinder)
    return authPolicy

def createWsgiApp(global_config, debug=False, **settings):
    
    # first of all load the loggers
    loadLogger(debug)
    
    if debug:
        settings = {}
        settings['reload_all'] = True
        settings['debug_all'] = True
    
    # configuration settings
    settings['mako.directories'] = os.path.join(here, 'templates')
    
    #  configuration setup
    log.info('Loading Configurator with ACLAuthenticationPolicy ...')
    authentication_policy = getAuthenticationPolicy()
    authorization_policy = ACLAuthorizationPolicy()   
    config = Configurator(settings=settings, authentication_policy=authentication_policy,
        authorization_policy=authorization_policy, root_factory=EntryFactory)
    
    # add requiries
    log.info('Include pyramid_mako and pyramid_tm ...')
    config.include('pyramid_mako')
    config.include('pyramid_tm')
    
    # configuration of the database
    if debug:
        log.info('Loading database settings in debug state ...')
        loadDB(config, settings, True)
    else:
        log.info('Loading database settings in production state ...')
        loadDB(config, settings)

    # configuration of internationalization
    log.info('Load internationalization settings ...')
    setLocalizationOptions(config)
    
    # add routes
    log.info('Initialize routes ...')
    addRoutes(config)
    
    # add views to routes
    log.info('Add proxy route and looking for views (route endpoints) ...')
    config.add_view(proxy_post, route_name='proxy')
    config.scan('python.views')
    
    log.info('Vkviewer application is initialize.')
    return config.make_wsgi_app()


def main(global_config, **settings):
    return createWsgiApp(global_config, debug=False, **settings)

if __name__ == '__main__':
    app = createWsgiApp(None, debug=True)
    server = make_server('0.0.0.0', 8080, app)
    server.serve_forever()
