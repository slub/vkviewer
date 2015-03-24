'''
The MIT License (MIT)

Copyright: (c) 2014 Jacob Mendt 

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

:Date: Created on Feb 24, 2014

:Authors: jacmendt
:requires:
    imagemagick, gdal
'''
import subprocess, math, tempfile, shutil, sys, os, copy, logging, argparse, gdal, locale
from gdalconst import GA_ReadOnly

# set path of the project directory for finding the correct modules
BASE_PATH = os.path.dirname(os.path.realpath(__file__))
BASE_PATH_PARENT = os.path.abspath(os.path.join(BASE_PATH, os.pardir))
sys.path.insert(0, BASE_PATH)
sys.path.append(BASE_PATH_PARENT)

def getImageSize(imageFile):
    """
    Functions looks for the image size of an given path.
    
    :param imageFile: the file Path  
    :type imageFile: String
    :rtype: Dictionary
    """
    datafile = gdal.Open(imageFile.encode(locale.getpreferredencoding(),'ignore'), GA_ReadOnly) #encode return an encoded version of the string
    if datafile:
        return {'x':float(datafile.RasterXSize), 'y':float(datafile.RasterYSize)}
    return None
     
def calculateTierSize(imageWidth, imageHeight, tileSize=256):
    """The function calculate the number of tiles per tier
    
    :type imageWidth: Float
    :type imageHeight: Float
    :type tileSize: Integer
    :param tileSize: Default is 256 pixel   
    :rtype: Array 
    """
    tierSizeInTiles = []
    while (imageWidth > tileSize or imageHeight > tileSize):
        tileWidth = imageWidth / tileSize
        tileHeight = imageHeight / tileSize
        tierSizeInTiles.append([math.ceil(tileWidth), math.ceil(tileHeight)])
        tileSize += tileSize
    tierSizeInTiles.append([1.0, 1.0])      
    return tierSizeInTiles
    
def calculateTileCountUpToTier(tierSizeInTiles):
    """The function caclulate the tileCount up to the top tier
    
    :type tierSizeInTiles: Array
    :return: tileCountUpToTier
    :rtype: Array
    """
    tileCountUpToTier = [0]
    tmp_tierSizeInTiles = copy.copy(tierSizeInTiles)
    tmp_tierSizeInTiles.reverse()
    for i in range(1, len(tmp_tierSizeInTiles)):
        value = tmp_tierSizeInTiles[i - 1][0] * tmp_tierSizeInTiles[i - 1][1] + tileCountUpToTier[i - 1]
        tileCountUpToTier.append(value)
    return tileCountUpToTier

def sortTileToTileGroups(tierSizeInTiles, tileCountUpToTier, tileDir, targetPath):
    """Create the commands for sorting the tile to tile groups.
    
    :type tileDir: String
    :type tierSizeInTiles: List
    :type targetPath: String
    :type tileCountUpToTier: List
    :rtype: Dictionary 
    """
    template_command_copy = "cp %s %s"
    
    commands = []
    tierSizeInTiles = copy.copy(tierSizeInTiles)
    tierSizeInTiles.reverse()
    tileGroupeDirs = []
    for zoomLevel in range(0, len(tierSizeInTiles)):
        for x in range(0, int(tierSizeInTiles[zoomLevel][0])):
            for y in range(0, int(tierSizeInTiles[zoomLevel][1])):
                tileIndex = x + y * tierSizeInTiles[zoomLevel][0] + tileCountUpToTier[zoomLevel]
                tileGroupIndex = int(math.floor(tileIndex / 256))
                
                # check if the tileGroupIndex is already register. If not do it
                tileGroupeDir = os.path.join(targetPath, 'TileGroup%s' % tileGroupIndex) 
                if not tileGroupeDir in tileGroupeDirs:
                    tileGroupeDirs.append(tileGroupeDir)
                    
                # print "TileGroup: %s, ZoomLevel: %s, X: %s, Y: %s"%(tileGroupIndex,zoomLevel,x,y)   
                   
                source_path = os.path.join(tileDir, '%s-%s-%s.jpg' % (zoomLevel, x, y))
                target_path = os.path.join(tileGroupeDir, '%s-%s-%s.jpg' % (zoomLevel, x, y))
                command = template_command_copy % (source_path, target_path)
                commands.append(command)                

    return {'commands':commands, 'tilegroups':tileGroupeDirs}

def createTiles(imgPath, tierSizeInTiles, tileCountUpToTier, imgWidth, imgHeight, targetDir, logger):
    """The function create via imagemagick a tile pyramid for the given image.
    
    :type imgPath: string
    :type tierSizeInTiles: List
    :type tileCountUpToTier: List
    :type imgWidth: Float
    :type imgHeight: Float
    :type targetDir: String
    :type logger: logging.Logger
    :rtype: String
    """
    try:
        logger.debug('Create temporary tiles directory ...')
        tmp_dir = tempfile.mkdtemp("", "tmp_", targetDir)  # create dir
        
        # sort tiles to group
        # create zoomify directory
        zoomify_dirName = os.path.basename(imgPath).split('.')[0]
        zoomify_dir = os.path.join(targetDir, zoomify_dirName)

        if os.path.exists(zoomify_dir):
            logger.debug('Remove old zoomify directory ...')
            shutil.rmtree(zoomify_dir) 
            
        # calculate different zoom levels for the img
        zoomLevels = []
        i = len(tierSizeInTiles)
        lastImgPath = imgPath
        logger.debug('Create resize images ...')
        while i > 0:
            resizePath = os.path.join(tmp_dir, 'zoom-%s.jpg' % i)
            command = '/usr/bin/convert "%s" -strip -resize 50%% -quality 75%% "%s"' % (lastImgPath, resizePath)
            if i == len(tierSizeInTiles):
                command = '/usr/bin/convert "%s" -strip -quality 75%% "%s"' % (lastImgPath, resizePath)
            logger.debug(command)
            subprocess.check_call(command, shell=True)
            zoomLevels.append(resizePath)
            lastImgPath = resizePath
            i -= 1
             
        # create the tiles
        zoomLevels.reverse()
        i = len(zoomLevels) - 1
        logger.debug('Create tiles ...')   
        while i >= 0:
            zoom_path = os.path.join(tmp_dir, "%s" % i)
            command = '/usr/bin/convert "%s" -crop 256x256 -set filename:tile "%%[fx:page.x/256]-%%[fx:page.y/256]" +repage +adjoin "%s-%%[filename:tile].jpg"' % (zoomLevels[i], zoom_path)
            logger.debug(command)
            subprocess.check_call(command, shell=True) 
            i -= 1

        os.makedirs(zoomify_dir)            
        sortTiled = sortTileToTileGroups(tierSizeInTiles, tileCountUpToTier, tmp_dir, zoomify_dir)
        # create tilegroup directorys
        logger.debug('Create target dir %s ...'%zoomify_dir)
        for tileGroup in sortTiled['tilegroups']:
            if not os.path.exists(tileGroup):
                os.makedirs(tileGroup)
                    
        # copy tiles in correct tilegroup directory
        logger.debug('Copy tiles to target dir ...')
        for command in sortTiled['commands']:
            subprocess.check_call(command, shell=True)
        
        # write properties file 
        logger.debug('Create zoomify properties files ...')
        xml_string = "<IMAGE_PROPERTIES WIDTH=\"%s\" HEIGHT=\"%s\" NUMTILES=\"%s\" NUMIMAGES=\"1\" VERSION=\"1.8\" TILESIZE=\"%s\" />" % (
                int(imgWidth), int(imgHeight), len(sortTiled['commands']), 256)
        imagePropertiesFile = open(os.path.join(zoomify_dir, 'ImageProperties.xml'), 'w')
        imagePropertiesFile.write(xml_string)
        imagePropertiesFile.close()
        return imagePropertiesFile       
        
    except:
        print >> sys.stderr, "Unexpected error:", sys.exc_info()[0]
        raise Exception("Error while running subprocess via commandline!")
    finally:
        try:
            # delete tmp_dir
            shutil.rmtree(tmp_dir)
        except OSError, e:
            # code 2 - no such file or directory
            if e.errno != 2:
                raise
            
def processZoomifyTiles(inputFile, outputDir, logger = None):
    """ Parent method for processing the zoomify tiles.
    
    :type inputFile: String 
    :type outputDir: String 
    :type logger: logging.Logger
    :param logger: Default is =None
    :return: Path to image properties files
    :rtype: String
    """
    if not logger:
        logging.basicConfig()
        logger = logging.getLogger('CreateZoomifyTiles')
        logger.setLevel(logging.DEBUG)
        
    logger.debug('Start processing zoomify tiles for image %s' % inputFile)
    size = getImageSize(inputFile)
    tierSizeInTiles = calculateTierSize(size['x'], size['y'])
    tileCountUpToTier = calculateTileCountUpToTier(tierSizeInTiles)
    targetDir = createTiles(inputFile, tierSizeInTiles, tileCountUpToTier, size['x'], size['y'], outputDir, logger)
    logger.debug('Finished calculating zoomify tiles for image %s' % inputFile) 
    return targetDir
    
if __name__ == '__main__':
    # example command: ../python_env/bin/python CreateZoomifyTiles.py --input_file /home/mendt/mtb_paths_exist.md --tif_dir /srv/vk/data_archiv/0010000
    # argument parser for giving parameters to the script
    parser = argparse.ArgumentParser(description='This scripts calculates zoomify tiles for a given image".', prog='Script CreateZoomifyTiles.py')
    parser.add_argument('inputFile', metavar='INPUT_FILE', type=str, help='Path variable to image file what should be computed.')
    parser.add_argument('outputDir', metavar='OUTPUT_DIR', type=str, default='/tmp', help='Directory where to safe new zoomify tiles')
    args = parser.parse_args()
   
    inputFile = args.inputFile if os.path.exists(args.inputFile) else None
    outputDir = args.outputDir if os.path.exists(args.outputDir) else None
    if inputFile is None or outputDir is None:
        raise Exception('Image or directory not found. Please check your script parameter.')
    
    processZoomifyTiles(inputFile, outputDir)
    

