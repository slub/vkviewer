'''
Created on Jul 7, 2014

@author: mendt
'''
import argparse, logging, uuid, shutil, os
from vkviewer.settings import TEMPLATE_FILES, GN_SETTINGS
from vkviewer.python.utils.logger import createLogger
from vkviewer.python.models.Meta import initializeDb
from vkviewer.python.utils.exceptions import WrongParameterException
from vkviewer.python.models.messtischblatt.Messtischblatt import Messtischblatt
from vkviewer.python.scripts.csw.InsertMetadata import insertMetadata
from vkviewer.python.scripts.csw.ServiceMetadataBinding import createServiceDescription
from vkviewer.python.scripts.csw.CswTransactionBinding import gn_transaction_insert

# Database parameter for messtischblatt db
PARAMS_DATABASE = {
    'host': 'localhost',
    'user':'postgres',
    'password':'postgres',
    'db':'messtischblattdb',    
}

""" Functions """
def loadDbSession(): 
    logger.info('Initialize new database connection ...')
    sqlalchemy_enginge = 'postgresql+psycopg2://%(user)s:%(password)s@%(host)s:5432/%(db)s'%(PARAMS_DATABASE)
    try:
        return initializeDb(sqlalchemy_enginge)
    except:
        logger.error('Could not initialize database. Plase check your database settings parameter.')
        raise WrongParameterException('Could not initialize database. Plase check your database settings parameter.')
    
def pushCompleteData(target_dir, dbSession, logger):
    logger.info('Start creating service and parent metadata file ...')
    serviceMetadataFile = createServiceDescription(TEMPLATE_FILES['service'], target_dir, dbSession, logger)
    parentMetadataFile = os.path.join( target_dir, str(uuid.uuid4()) + '.xml')
    shutil.copyfile(TEMPLATE_FILES['parent'], parentMetadataFile)
    logger.info('Insert service and parent metdata file ...')
    gn_transaction_insert(serviceMetadataFile, GN_SETTINGS['gn_username'], GN_SETTINGS['gn_password'], logger)
    gn_transaction_insert(parentMetadataFile, GN_SETTINGS['gn_username'], GN_SETTINGS['gn_password'], logger)
    
    logger.info('Start pushing single metadata records to the geonetwork instance ...')
    messtischblaetter = Messtischblatt.all(dbSession)
    logger.debug('Start appending new messtischblatt resources')
    for messtischblatt in messtischblaetter:
        if messtischblatt.isttransformiert:
            logger.debug('Push metadata record for messtischblatt %s to cataloge service ...'%messtischblatt.id)
            insertMetadata(id=messtischblatt.id,db=dbSession,logger=logger)
        
if __name__ == '__main__':
    script_name = 'CswBinding.py'
    parser = argparse.ArgumentParser(description = 'This scripts allows the pushing and deleting of metadata records through the csw transaction interface.', 
            prog = 'Script %s'%script_name)
    
    # parse command line
    parser = argparse.ArgumentParser(description='Parse the key/value pairs from the command line!')
    parser.add_argument('--log_file', help='define a log file')
    parser.add_argument('--metadata_id', help='Id of the metadata record')
    parser.add_argument('--target_dir',type=str, default='/tmp',help='Directory where the files should be placed')
    parser.add_argument('--method', type=str, help='What method should be run (add or delete)')
    parser.add_argument('--host', help='host for messtischblattdb')
    parser.add_argument('--user', help='user for messtischblattdb')
    parser.add_argument('--password', help='password for messtischblattdb')
    parser.add_argument('--db', help='db name for messtischblattdb')
    
    arguments = parser.parse_args()
    
        # create logger
    if arguments.log_file:
        formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
        sqlalchemy_logger = createLogger('sqlalchemy.engine', logging.DEBUG, logFile=''.join(arguments.log_file), formatter=formatter)     
        logger = createLogger('%s'%script_name, logging.DEBUG, logFile=''.join(arguments.log_file), formatter=formatter)
    else: 
        sqlalchemy_logger = createLogger('sqlalchemy.engine', logging.WARN)
        logger = createLogger('%s'%script_name, logging.DEBUG)   

    # parse parameter parameters
    if arguments.host:
        PARAMS_DATABASE['host'] = arguments.host
    if arguments.user:
        PARAMS_DATABASE['user'] = arguments.user
    if arguments.password:
        PARAMS_DATABASE['password'] = arguments.password
    if arguments.db:
        PARAMS_DATABASE['db'] = arguments.db
    
    if arguments.method:
        METHOD = arguments.method
    else: 
        METHOD = ''
        
    if arguments.target_dir:
        TARGET_DIR = arguments.target_dir
        
    if arguments.metadata_id:
        METADATA_ID = arguments.metadata_id
    else:
        METADATA_ID = ''
        
    logging.basicConfig(level=logging.DEBUG)
    dbSession = loadDbSession()
    if METHOD == '' and METADATA_ID == '':
        pushCompleteData(TARGET_DIR, dbSession, logger)
    