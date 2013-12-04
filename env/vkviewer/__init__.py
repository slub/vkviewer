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
from settings import dbconfig
from python.security import EntryFactory
from python.proxy import proxy_post
from python.models.Meta import initialize_sql, Base
from python.i18n import custom_locale_negotiator
#from python.models.meta import DBSession, Base, initialize_sql

# load logger
logging.basicConfig()
log = logging.getLogger(__file__)

here = os.path.dirname(os.path.abspath(__file__))

def addRoutes(config):
    routePrefix = 'vkviewer'
    # add routes
    config.add_static_view(routePrefix+'/static', 'vkviewer:static/', cache_max_age=0)
    config.add_route('proxy', routePrefix+'/proxy/')
    config.add_route('home', routePrefix, factory='python.security.EntryFactory')
    config.add_route('home_login', routePrefix+'/auth', factory='python.security.EntryFactory')
#    config.add_route('georef', routePrefix+'/georef', factory='python.security.EntryFactory')
    config.add_route('set_locales', 'locales', factory='python.security.EntryFactory')
    
    # route for authentification
    config.add_route('auth', routePrefix+'/sign/{action}')
    
    # for feedback to events on the main page
    config.add_route('gettimestamps',routePrefix+'/gettimestamps', factory='python.security.EntryFactory')

    # routes for the georeference process
    config.add_route('choose_map_georef',routePrefix+'/choosegeoref', factory='python.security.EntryFactory')
    config.add_route('georeferencer', routePrefix+'/georef/{action}', factory='python.security.EntryFactory')
    config.add_route('georeference_start', routePrefix+'/georeference/start', factory='python.security.EntryFactory')
    config.add_route('georeference_validate', routePrefix+'/georeference/validate', factory='python.security.EntryFactory')
    
    # footer routes
    config.add_route('faq', routePrefix+'/faq', factory='python.security.EntryFactory')
    config.add_route('contact', routePrefix+'/contact', factory='python.security.EntryFactory')
    config.add_route('partner', routePrefix+'/partner', factory='python.security.EntryFactory')
    config.add_route('impressum', routePrefix+'/impressum', factory='python.security.EntryFactory')
    
    # welcome page
    config.add_route('welcome', routePrefix+'/welcome', factory='python.security.EntryFactory')
    config.add_route('set_visitor_cookie', routePrefix+'/welcomeoff', factory='python.security.EntryFactory')


def db(request):
    return request.registry.dbmaker()   
    
def loadDB(config, settings, debug=False):
    print "Load Database"
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
           
def main(global_config, **settings):
    # configuration settings
    settings['mako.directories'] = os.path.join(here, 'templates')
    settings['reload_all'] = True
    settings['debug_all'] = True
    
    
    #  configuration setup
    authentication_policy = AuthTktAuthenticationPolicy('somesecret')
    authorization_policy = ACLAuthorizationPolicy()
    config = Configurator(settings=settings,
                      authentication_policy=authentication_policy,
                      authorization_policy=authorization_policy)
    
    # add requiries
    config.include('pyramid_mako')
    config.include('pyramid_tm')
    
    # configuration of the database
    loadDB(config, settings)

    print "Load database"
    # configuration of internationalization
    setLocalizationOptions(config)
    print "Load localization"
    # add routes
    addRoutes(config)
    
    print ""
    
    # add views to routes
    config.add_view(proxy_post, route_name='proxy')
    config.scan('python.views')
    
    print "Loading done!"
    #config.scan('python.views.georeference')
    
    return config.make_wsgi_app()


if __name__ == '__main__':
    # configuration settings
    settings = {}
    settings['mako.directories'] = os.path.join(here, 'templates')
    settings['reload_all'] = True
    settings['debug_all'] = True
 
     # session factory
    #session_factory = UnencryptedCookieSessionFactoryConfig('itsaseekreet')
    
    #  configuration setup
    authentication_policy = AuthTktAuthenticationPolicy('somesecret')
    authorization_policy = ACLAuthorizationPolicy()
    config = Configurator(settings=settings,
                      authentication_policy=authentication_policy,
                      authorization_policy=authorization_policy
                      )
    
    # add requiries
    config.include('pyramid_mako')
    config.include('pyramid_tm')
    
    # configuration of the database
    loadDB(config, settings, True)
    
    # configuration of internationalization
    setLocalizationOptions(config)
    
    # add Routes
    addRoutes(config)
    
    # add views to routes
    config.add_view(proxy_post, route_name='proxy')
    config.scan('python.views')
    #config.scan('python.views.georeference')
    
    app = config.make_wsgi_app()
    server = make_server('0.0.0.0', 8080, app)
    server.serve_forever()
