'''
:Date: Created on Dec 8, 2014

:Authors: mendt
'''
import subprocess, sys, os
from os.path import basename

def createSmallThumbnail(sourcePath, targetDir):
    """ Creates a small thumbnail by using imagemagick via command line. 
    
    :type sourcePath: String 
    :param targetDir: String 
    :return: Path to target file
    :rtype: String
    """
    targetPath = os.path.join(targetDir, '%s.jpg'%basename(sourcePath).split('.')[0])
    command = "convert %s -resize 75x75 %s"%(sourcePath, targetPath)
    try:
        subprocess.check_call(command, shell=True)
        return targetPath 
    except:
        print >> sys.stderr,"Unexpected error:", sys.exc_info()[0]
        raise
    
def createMidThumbnail(sourcePath, targetDir):
    """ Creates a mid thumbnail by using imagemagick via command line. 
    
    :param sourcePath: String 
    :param targetDir: String
    :return: Path to target file
    :rtype: String
    """
    targetPath = os.path.join(targetDir, '%s.jpg'%basename(sourcePath).split('.')[0])
    command = "convert %s -resize 150x150 %s"%(sourcePath, targetPath)
    try:
        subprocess.check_call(command, shell=True)
        return targetPath 
    except:
        print >> sys.stderr,"Unexpected error:", sys.exc_info()[0]
        raise