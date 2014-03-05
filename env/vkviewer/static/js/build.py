'''
Created on Mar 3, 2014

@author: mendt
'''
import json, sys, os, subprocess, logging, argparse

ROOT_PATH = os.path.abspath('.')

""" Name of the file and also of the logger """
NAME = 'build.py'

""" relative paths to different input files """
PATHS = {
    'input_files':'build/Vkviewer.json'
}

""" Closure commands for computing different files """
COMMANDS = {
    'calcdeps': '../lib/closure-library/closure/bin/calcdeps.py -i %s -p ../lib/closure-library -p ./ -o list > %s',
    'compile': '../lib/closure-library/closure/bin/calcdeps.py -i %s -p ../lib/closure-library -p ./ -o compiled -c compiler.jar -f --compilation_level=SIMPLE_OPTIMIZATIONS -f --language_in=ECMASCRIPT5 > %s'
}

""" Names of the loading script """ 
FILE_NAME = {
    'ol2':'Vkviewer.debug.js',
    'ol2-closure':'Vkviewer-closure.debug.js',
    'ol2-min':'Vkviewer.min.js',
    'ol3':'Vkviewer-ol3.debug.js',
    'ol3-closure':'Vkviewer-ol3-closure.debug.js',
    'ol3-min':'Vkviewer-ol3.min.js',
} 


""" Template for loading js file """
TEMPLATE_JS = "(function() {\n \
    var scriptName = \"%s\";\n \
    var getScriptLocation = function() {\n \
        var scriptLocation = \"\";\n \
        var scripts = document.documentElement.getElementsByTagName('script'); \n \
        for(var i=0, len=scripts.length; i<len; i++) { \n \
            var src = scripts[i].getAttribute('src'); \n \
            if(src) { \n \
                var index = src.lastIndexOf(scriptName); \n \
                var pathLength = src.lastIndexOf('?'); \n \
                if(pathLength < 0) {\n \
                    pathLength = src.length;\n \
                }\n \
                if((index > -1) && (index + scriptName.length == pathLength)) {\n \
                    scriptLocation = src.slice(0, pathLength - scriptName.length);\n \
                    break;\n \
                }\n \
            }\n \
        }\n \
        return scriptLocation;\n \
    };\n \
    var jsfiles = new Array(%s);\n \
    var len = jsfiles.length;\n \
    var allScriptTags = new Array(len);\n \
    var host = getScriptLocation();  \n \
    for (var i=0; i<len; i++) {\n \
        allScriptTags[i] = \"<script src='\" + host + jsfiles[i] +\"'></script>\";\n \
    }\n \
    document.write(allScriptTags.join(\"\"));\n \
})();"

# set path of the project directory for finding the correct modules
parentPath = os.path.abspath('..')
sys.path.insert(0, parentPath)
sys.path.append(os.path.abspath('.'))

def parseInputFileList(key):
    json_data = open(os.path.join(ROOT_PATH, PATHS['input_files'])).read()
    data = json.loads(json_data)
    return data[key]

def writeToFile(fileName, data):
    output_file = open('./%s'%fileName, 'w')
    output_file.write(data)
    output_file.close()
    
def buildFiles(key, with_closure, logger):
    """ This function builds javascript and compiled javascript files for Vkviewer 
    
    Arguments:
        key {String}
        with_closure {Boolean}
        logger {LOGGER}
    """
    
    logger.info('Build javascript files for %s.'%key)
    logger.info('Parse input file list ...')
    inputFileList = parseInputFileList(key)    
    
    # process debug file
    logger.info('Build debug file without closure dependencies ...')
    loading_files = []
    for line in inputFileList:
        loading_files.append('"%s"'%line)
          
    filename = FILE_NAME[key]
    js_file = TEMPLATE_JS%(filename, ','.join(loading_files))
    writeToFile('./%s'%filename, js_file)
     
    # process debug file with closure dependencies   
    if with_closure:
        logger.info('Build debug file with closure dependencies ...')
        deps_string = ' -i '.join(inputFileList)
        subprocess.call(COMMANDS['calcdeps']%(deps_string,'./build/deps-list.md'), shell=True)
            
        # load all dependencies from file
        loading_files = []
        lines = [line.strip() for line in open('./build/deps-list.md','r')]
        for line in lines:
            loading_files.append('"%s"'%line)
          
        filename = FILE_NAME[key+'-closure']
        js_file = TEMPLATE_JS%(filename, ','.join(loading_files))
        writeToFile('./%s'%filename, js_file)

    # process compiled file
    logger.info('Build compile file ...')
    subprocess.call(COMMANDS['compile']%(deps_string,'./%s'%FILE_NAME[key+'-min']), shell=True)
           
    logger.info('Build finished!')
    

if __name__ == '__main__':
    logging.basicConfig()
    logger = logging.getLogger(NAME)
    logger.setLevel(logging.INFO)
    
    buildFiles('ol2', True, logger)
    buildFiles('ol3', True, logger)