'''
Created on Jul 7, 2014

@author: mendt
'''
import argparse, logging, os, subprocess
from subprocess import CalledProcessError
from vkviewer.python.utils.logger import createLogger

def executeCmd(cmd,logger):
    try:
        subprocess.check_call(cmd, shell = True)
    except CalledProcessError as e:
        logger.error('CalledProcessError while trying to run command %s ...'%cmd)
        pass
    except:
        raise
    
def compressFile(source_path, target_path, logger, delete=False):
    logger.info('Compress file to %s ...'%target_path)
    compress_cmd = 'gdal_translate --config GDAL_CACHEMAX 500 -co "TILED=YES" -co COMPRESS=JPEG -co JPEG_QUALITY=80 -co PHOTOMETRIC=RGB -co ALPHA=YES -co INTERLEAVE=BAND %s %s'%(source_path, target_path)
    executeCmd(compress_cmd, logger)
    
    if delete and os.path.exists(source_path):
        logger.info('Delete source file ...')
        delete_cmd = 'rm %s'%source_path
        executeCmd(delete_cmd, logger)
        
if __name__ == '__main__':
    parser = argparse.ArgumentParser(description = 'This scripts processes minimified TIFFs (jpeg compression) for a given folder \
        of TIFFs.', prog = 'Script ProcessMinimifiedTiffs.py')
    
    # parse command line
    parser = argparse.ArgumentParser(description='Parse the key/value pairs from the command line!')
    parser.add_argument('--log_file', help='define a log file')
    parser.add_argument('--source_dir', default='/tmp', help='define directory for the source TIFFs (default: /tmp')
    parser.add_argument('--target_dir', default='/tmp', help='define directory where the target TIFFs should be placed (default: /tmp'),
    parser.add_argument('--delete_old', default=False, help='delete old files (default: False')
    arguments = parser.parse_args()
    
    # create logger
    if arguments.log_file:
        formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')   
        logger = createLogger('ProcessMinifiedTiffs', logging.DEBUG, logFile=''.join(arguments.log_file), formatter=formatter)
    else: 
        logger = createLogger('ProcessMinifiedTiffs', logging.DEBUG)   

    # parse parameter parameters
    if arguments.source_dir:
        source_dir = arguments.source_dir
    if arguments.target_dir:
        target_dir = arguments.target_dir
        
    if arguments.delete_old:
        delete_old = arguments.delete_old
    else:
        delete_old = False
   

    logger.info('Start processing minified TIFFs ...')
    files = os.listdir(source_dir)
    counter = 0
    for file in files:
        counter += 1
        source_path = os.path.join(source_dir, file)
        target_path = os.path.join(target_dir, file)
        logger.info('%s: %s'%(counter, source_path))
        compressFile(source_path, target_path, logger, delete_old)
    logger.info('Finishing process minified TIFFs')