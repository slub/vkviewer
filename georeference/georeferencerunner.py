'''
Created on Sep 23, 2014

@author: mendt
'''
import time, os, logging, sys
from logging.handlers import TimedRotatingFileHandler
from daemon import runner 

BASE_PATH = os.path.dirname(os.path.realpath(__file__))
BASE_PATH_PARENT = os.path.abspath(os.path.join(BASE_PATH, os.pardir))
ROOT_PATH = os.path.abspath(os.path.join(os.path.abspath(os.path.join(BASE_PATH_PARENT, os.pardir)), os.pardir))
sys.path.insert(0, BASE_PATH)
sys.path.append(BASE_PATH_PARENT)
sys.path.append(ROOT_PATH)

from vkviewer.python.utils.logger import createLogger
from georeference.settings import DAEMON_SETTINGS, LOGGER_NAME, LOGGER_FILE, LOGGER_LEVEL, LOGGER_FORMATTER, DBCONFIG_PARAMS
from georeference.georeferenceupdate import lookForUpdateProcess
from georeference.utils.tools import loadDbSession

# Initialize the logger
if not os.path.exists(LOGGER_FILE):
    open(LOGGER_FILE, 'a').close()

formatter = logging.Formatter(LOGGER_FORMATTER)
handler = TimedRotatingFileHandler(LOGGER_FILE, when='d', interval=1, backupCount=14)
handler.setFormatter(formatter)
logger = createLogger(name = LOGGER_NAME, level = LOGGER_LEVEL, handler = handler)
    
class GeoreferenceDaemonApp():
    
    def __init__(self):
        self.stdin_path = DAEMON_SETTINGS['stdin']
        if not os.path.exists(self.stdin_path):
            open(self.stdin_path, 'a').close()
            
        self.stdout_path = DAEMON_SETTINGS['stdout']            
        self.stderr_path = DAEMON_SETTINGS['stderr']            
        self.pidfile_path = DAEMON_SETTINGS['pidfile_path']
        self.pidfile_timeout = DAEMON_SETTINGS['pidfile_timeout']
        
    def run(self):
        logger.info('Georeference update runner daemon is started!')
        while True:
            logger.info('Looking for pending georeference processes ...')
            dbsession = loadDbSession(DBCONFIG_PARAMS, logger)  
            lookForUpdateProcess(dbsession, logger, True)
            dbsession.commit()
            dbsession.close()
            
            logger.info('Go to sleep ...')
            time.sleep(DAEMON_SETTINGS['sleep_time'])


# Initialize DaemonRunner
daemon_runner = runner.DaemonRunner(GeoreferenceDaemonApp())

#This ensures that the logger file handle does not get closed during daemonization
daemon_runner.daemon_context.files_preserve=[handler.stream]
daemon_runner.do_action()

# try:
#     daemon_runner.do_action()
# except LockTimeout:
#     print "Error: couldn't aquire lock"
#     #you can exit here or try something else
