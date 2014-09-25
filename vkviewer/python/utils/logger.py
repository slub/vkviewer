'''
Created on Feb 17, 2014

@author: mendt
'''
import logging

def createLogger(name, level, logFile=None, formatter=None, handler = None):
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
    elif handler:
        logger.addHandler(handler)
        
    return logger

def getLoggerFileHandler(file, formatter):
    """ Create a logger file handler
    
    @param {string} file
    @param {string} formatter 
    @return {logging.FileHandler} 
    """
    formatter = logging.Formatter(formatter)
    handler = logging.FileHandler(file)
    handler.setFormatter(formatter)
    return handler