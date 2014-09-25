'''
Created on Sep 23, 2014

@author: mendt
'''
import logging
import time
from daemon import runner
from vkviewer.python.utils.logger import createLogger, getLoggerFileHandler
from georeference.settings import DAEMON_SETTINGS, LOGGER_NAME, LOGGER_FILE, LOGGER_LEVEL, LOGGER_FORMATTER
from georeference.georeferenceupdate import do


# Initialize the logger
handler = getLoggerFileHandler(LOGGER_FILE, LOGGER_FORMATTER)
logger = createLogger(name = LOGGER_NAME, level = LOGGER_LEVEL, handler = handler)
    
class GeoreferenceDaemonApp():
    
    def __init__(self):
        self.stdin_path = DAEMON_SETTINGS['stdin']
        self.stdout_path = DAEMON_SETTINGS['stdout']
        self.stderr_path = DAEMON_SETTINGS['stderr']
        self.pidfile_path = DAEMON_SETTINGS['pidfile_path']
        self.pidfile_timeout = DAEMON_SETTINGS['pidfile_timeout']
        
    def run(self):
        while True:
            logger.info('Run program ...')
            do(logger)
            time.sleep(5)
            logger.info('End program ...')

# Initialize DaemonRunner
daemon_runner = runner.DaemonRunner(GeoreferenceDaemonApp())

#This ensures that the logger file handle does not get closed during daemonization
daemon_runner.daemon_context.files_preserve=[handler.stream]
daemon_runner.do_action()
