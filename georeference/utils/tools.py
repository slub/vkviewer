'''
Created on Oct 7, 2014

@author: mendt
'''
from vkviewer.python.utils.exceptions import WrongParameterException
from vkviewer.python.models.Meta import initializeDb

def loadDbSession(database_params, logger): 
    logger.info('Initialize new sqlalchelmy database connection ...')
    sqlalchemy_enginge = 'postgresql+psycopg2://%(user)s:%(password)s@%(host)s:5432/%(db)s'%(database_params)
    try:
        return initializeDb(sqlalchemy_enginge)
    except:
        logger.error('Could not initialize database. Plase check your database settings parameter.')
        raise WrongParameterException('Could not initialize database. Plase check your database settings parameter.')