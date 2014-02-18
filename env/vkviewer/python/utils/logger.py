'''
Created on Feb 17, 2014

@author: mendt
'''
import logging

def createLogger(name, level, logFile=None, formatter=None):
    """ Creates a logger 
    
    Args:
        name (string): name of the logger
        level: log level
        logFile (String): path to logfile 
        formatter: 
    Returns:
        logger
    """
    logging.basicConfig()
    logger = logging.getLogger(name)
    logger.setLevel(level)
    
    if logFile and formatter:
        logHandler = logging.FileHandler(logFile)
        logHandler.setFormatter(formatter)
        logger.addHandler(logHandler)
        
    return logger