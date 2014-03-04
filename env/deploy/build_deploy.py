'''
Created on Mar 4, 2014

@author: mendt
'''
import sys, os, subprocess, logging, argparse, shutil
import tempfile

ROOT_PATH = os.path.abspath('.')
sys.path.insert(0, ROOT_PATH)

""" Name of the file and also of the logger """
NAME = 'build_deploy.py'

""" Deploy settings file """
SETTINGS_FILE = ('settings.py', 'vkviewer/settings.py')

""" Source & target directory """ 
SRC_DIR = '../vkviewer/'
TARGET_DIR = './vkviewer/'

""" Files which should be replaced """
REPLACE_CSS = ('vkviewer/static/css/styles.min.css','vkviewer/static/css/styles.css')
REPLACE_JS = [
    ('vkviewer/static/js/Vkviewer.min.js','vkviewer/static/js/Vkviewer.js'),
    ('vkviewer/static/js/Vkviewer-ol3.min.js','vkviewer/static/js/Vkviewer-ol3.js')
]
""" Unnecessary files (relativ paths to vkviewer)"""
DEL_FILES = [
    'vkviewer/settings.py.template',
    'vkviewer/static/css/closure.md',
    'vkviewer/static/css/styles.all.css',
    'vkviewer/static/css/styles.debug.css',
    'vkviewer/static/css/styles.min.css',
    'vkviewer/static/js/build.py',
    'vkviewer/static/js/closure.md',
    'vkviewer/static/js/compiler.jar',
    'vkviewer/static/js/Vkviewer.debug.js',
    'vkviewer/static/js/Vkviewer-closure.debug.js',
    'vkviewer/static/js/Vkviewer.min.js',
    'vkviewer/static/js/Vkviewer-ol3.debug.js',
    'vkviewer/static/js/Vkviewer-ol3-closure.debug.js',
    'vkviewer/static/js/Vkviewer-ol3.min.js',
    'vkviewer/static/js/Initialize.Configuration.js',
    'vkviewer/static/lib/closure.md',
    'vkviewer/static/lib/ol-whitespace.js',
    'vkviewer/static/lib/ol-all.js'
]

DEL_DIR = [
    'vkviewer/static/test',
    'vkviewer/static/dev',
    'vkviewer/static/js/build',
    'vkviewer/static/js/controller',
    'vkviewer/static/js/layer',
    'vkviewer/static/js/ol3',
    'vkviewer/static/js/styles',
    'vkviewer/static/js/tools',
    'vkviewer/static/js/utils',
    'vkviewer/static/lib/closure-library',
    'vkviewer/static/lib/debug'
]

def placeCompiledFiles(logger):
    logger.info('Start placing the compiled files ...')
    
    # place compiled css files
    if os.path.exists(os.path.join(ROOT_PATH, REPLACE_CSS[0])):
        shutil.copyfile(os.path.join(ROOT_PATH, REPLACE_CSS[0]), os.path.join(ROOT_PATH, REPLACE_CSS[1]))
    
    # replace js files
    for tuple in REPLACE_JS:
        if os.path.exists(os.path.join(ROOT_PATH, tuple[0])):
            shutil.copyfile(os.path.join(ROOT_PATH, tuple[0]), os.path.join(ROOT_PATH, tuple[1]))
            
    # replace settings
    if os.path.exists(os.path.join(ROOT_PATH, SETTINGS_FILE[0])):
        shutil.copyfile(os.path.join(ROOT_PATH, SETTINGS_FILE[0]), os.path.join(ROOT_PATH, SETTINGS_FILE[1]))    
        
    logger.info('Files replaced.')
        
def clearDirectory(logger):
    logger.info('Clearing directory from unnecessary files ...')
    
    # remove single files
    for file in DEL_FILES:
        file_path = os.path.join(ROOT_PATH,file)
        if os.path.exists(file_path):
            os.remove(file_path)
        
    # remove diretory
    for dir in DEL_DIR:
        dir_path = os.path.join(ROOT_PATH, dir)
        if os.path.exists(dir):
            shutil.rmtree(dir_path)
            
    logger.info('Unnecessary files removed.')
def createDeployVersion(logger):
    """ This function create's a deploying version of the vkviewer directory """
    logger.info('Start creating a vkviewer version for deploying ...')
    
    # remove old directory and copy actual directory
    if os.path.exists(TARGET_DIR):
        logger.info('Remove old vkviewer deploying directory ...')
        shutil.rmtree(TARGET_DIR)
    shutil.copytree(SRC_DIR, TARGET_DIR)
    
    placeCompiledFiles(logger)
    clearDirectory(logger)
    
    logger.info('Finish creating deploying version.')
        
if __name__ == '__main__':
    logging.basicConfig()
    logger = logging.getLogger(NAME)
    logger.setLevel(logging.INFO)
    createDeployVersion(logger)