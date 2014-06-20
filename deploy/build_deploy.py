'''
Created on Mar 4, 2014

@author: mendt
@todo Deploy new settings file
'''
import sys, os, subprocess, logging, argparse, shutil
import tempfile

ROOT_PATH = os.path.abspath('.')
sys.path.insert(0, ROOT_PATH)

""" Name of the file and also of the logger """
NAME = 'build_deploy.py'

""" Deploy settings file """
#SETTINGS_FILE = ('settings.py', 'vkviewer/settings.py')

""" Source & target directory """ 
SRC_DIR = '../vkviewer/'
TARGET_DIR = './vkviewer/'

""" CSS files """
CSS_FILES = [
     'css/vk2/vkviewer.css',
     'css/vk2/override-ol3.css',
     'css/vk2/override-jquery.css',
     'css/vk2/override-bootstrap.css',
     'css/vk2/template/template_pages.css'
     'css/vk2/template/main_page.css'
     'css/vk2/template/header.css',
     'css/vk2/template/georeference.css'
     'css/vk2/template/profile_map.css',
     'css/vk2/template/footer.css',
     'css/vk2/template/login_screen.css',
     'css/vk2/template/welcome.css',
     'css/vk2/module/mapsearch.css',
     'css/vk2/module/spatialtemporalsearch.css',
     'css/vk2/module/layermanagement.css',
     'css/vk2/tool/gazetteersearch.css',
     'css/vk2/tool/timeslider.css',
     'css/vk2/tool/timeslider.css',
     'css/vk2/tool/opacityslider.css',
     'css/vk2/utils/modal.css'        
]

""" Unnecessary files (relativ paths to vkviewer)"""
DEL_FILES = [
    'settings.py.template',
    'static/readme.md'
]

DEL_DIR = [
    'static/test',
    'static/build',
    'static/lib/closure-library',
    'static/lib/debug'
]

""" script path for building the js files """
BUILD_SCRIPT_CMD = '../bin/python ../vkviewer/static/js/build.py'
def buildFiles(logger, targetDir):
    """ In progress """
    logger.info('Building the compiled css and js files ...')
    
    # command build a minimize js file
    jsBuildDir = os.path.join(targetDir, 'static/build')
    jsBuildToolPath = os.path.join(jsBuildDir, 'plovr-81ed862.jar')
    jsBuildToolConfig = os.path.join(jsBuildDir, 'vkviewer-min.json')
    jsBuildCmd = 'java -jar %s build %s'%(jsBuildToolPath, jsBuildToolConfig)
    subprocess.call(jsBuildCmd, shell=True)
    jsMinimizeSrc = os.path.join(jsBuildDir, 'vkviewer-min.js')
    jsMinimizeTarget = os.path.join(targetDir, 'static/vkviewer-min.js')
    shutil.copyfile(jsMinimizeSrc, jsMinimizeTarget)
    logger.info('Build minimize javascript file.')
    
    # command building a minimize css file
    catCssCmd = 'cat '
    baseDir = os.path.join(targetDir, 'static')
    cssAllFilePath = os.path.join(baseDir, 'build/styles-all.css')
    for file in CSS_FILES:
        catCssCmd += os.path.join(baseDir, file) + ' '
    catCssCmd += '> '+cssAllFilePath
    print catCssCmd
    subprocess.call(catCssCmd, shell=True)
    
    closureStylesheetsJarPath = os.path.join(baseDir, 'lib/closure-library/closure-stylesheets.jar')
    minimizeCssFilePath = os.path.join(targetDir, 'static/styles-min.css')
    minimizeCssCmd = 'java -jar %s %s > %s'%(closureStylesheetsJarPath, cssAllFilePath, minimizeCssFilePath)
    subprocess.call(minimizeCssCmd, shell=True)
    
    styleCssFilePath = os.path.join(targetDir, 'static/css/styles.css')
    shutil.copyfile(minimizeCssFilePath, styleCssFilePath)
    logger.info('Build minimize css file.')
          
def deleteUnnecessaryFiles(logger, targetDir):
    logger.info('Clearing directory from unnecessary files ...')
    
    # remove single files
    for file in DEL_FILES:
        file_path = os.path.join(targetDir,file)
        if os.path.exists(file_path):
            os.remove(file_path)
        
    # remove diretory
    for dir in DEL_DIR:
        dir_path = os.path.join(targetDir, dir)
        if os.path.exists(dir):
            shutil.rmtree(dir_path)
            
    logger.info('Unnecessary files removed.')
def createDeployVersion(logger, sourceDir, targetDir):
    """ This function create's a deploying version of the vkviewer directory """
    logger.info('Start creating a vkviewer version for deploying ...')
    
    # build sourceDir and targetDir paths
    sourcePath = os.path.join(ROOT_PATH, sourceDir)
    targetPath = os.path.join(os.path.join(ROOT_PATH, targetDir), sourceDir)
    
    # copying source files to targetPath
    logger.info('Copying files from %s to %s'%(sourcePath, targetPath))
    if os.path.exists(targetPath) and not targetPath == sourcePath:
        logger.info('Remove old vkviewer deploying directory ...')
        shutil.rmtree(targetPath)
    shutil.copytree(sourcePath, targetPath)
    
    buildFiles(logger, targetPath)
    deleteUnnecessaryFiles(logger, targetPath)
    
    logger.info('Finish creating deploying version.')
        
if __name__ == '__main__':
    parser = argparse.ArgumentParser(description = 'Start building a deployment version of vkviewer', prog = 'Script build_deploy.py')
    parser.add_argument('sourceDir', metavar='sourceDir', type=str, help='Directory where the build dir should be placed')
    parser.add_argument('targetDir', metavar='targetDir', type=str, help='Directory where the source files are placed')    
    arguments = parser.parse_args()
      
    # init logger  
    logging.basicConfig()
    logger = logging.getLogger(NAME)
    logger.setLevel(logging.INFO)
    
    createDeployVersion(logger, arguments.sourceDir, arguments.targetDir)