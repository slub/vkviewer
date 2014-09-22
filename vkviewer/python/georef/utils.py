'''
Created on May 31, 2013

@author: mendt
'''
import uuid
import sys
import subprocess 

from os import *
from datetime import datetime
from osgeo import gdal

def runCommand(command):
    try:
        subprocess.check_call(command, shell=True)
    except:
        print >> sys.stderr,"Unexpected error:", sys.exc_info()[0]
        raise Exception("Error while running subprocess via commandline!")
    return True

def copyFile(sourceFile, targetPath):
    """
    Function should create a backup file.
    
    @param sourceFile: complete path to the source file
    @param targetFile: complete path to the target file
    
    @return: path to the backup file
    """
    command = "cp %s %s"%(str(sourceFile),str(targetPath))
    if (runCommand(command)):
        return targetPath
    else:
        return None

def backupFile(sourceFile, backupFolder):
    """
    Function should create a backup file.
    
    @param sourceFile: complete path to the source file
    @param backupFolder: complete path to the backup folder
    
    @return: path to the backup file
    """
    def _copyFile_(srcPath, targetPath):
        command = "cp %s %s"%(str(srcPath),str(targetPath))
        return command
    
    backupPath = path.join(backupFolder, getTimestampAsStr()+":"+path.basename(sourceFile))
    if runCommand(_copyFile_(sourceFile,backupPath)):
        return backupPath
    else:
        return None

def getTimestampAsPGStr():
    time = datetime.now()
    timestamp = "%s-%s-%s %s:%s:%s"%(time.year, time.month, time.day,
                                        time.hour, time.minute, time.second)
    return timestamp

def getTimestampAsStr():
    time = datetime.now()
    timestamp = "%s_%s_%s_%s_%s_%2.6f"%(time.year, time.month, time.day,
                                        time.hour, time.minute, time.second)
    return timestamp

def getTimestampAsNumber():
    tmp_datetime = datetime.now()
    timestamp = "%s%s%s%s%s%s"%(tmp_datetime.year, tmp_datetime.month, tmp_datetime.day,
                                        tmp_datetime.hour, tmp_datetime.minute, tmp_datetime.second)
    return int(timestamp)

def getUniqueId():
    return uuid.uuid4()

def getDirContent(directory):
    """
    Functions lists the content of a directory in two different list. One list contains the files and
    the other the directorys. Both are returns in an dictionary with the keys "dirs" and "files"
    
    @param directory: directory for which the content should be listed
    
    @return: Dictionary with keys "dirs" and "files"
    """
    
    dirContent = listdir(directory)
    files = {}
    dirs = []
    for content in dirContent:
        contentPath = path.join(directory, content)
        if path.isfile(contentPath):
            files[content] = contentPath
        elif path.isdir(contentPath):
            dirs.append(contentPath)
    return {"dirs":dirs,"files":files}

def getPathsToFiles(parentDirectory, listFiles, responseDictList = None):
    """
    Functions search a directory structure for a some given files and saves them in list with dictionarys, 
    where the dictionary contains the keys "name" and "path"
    
    @param parentDirectory: directory path where the search should started
    @param listFiles: list of files which contains the names of the files
    @param responseDictList: could be none if not create and has the same structure like responseList
    
    @return responseList: list which contains a dictionary with the keys "name" and "path".
                If there is no the path for a given "name" the value for "path" is False.
    """
    # checks if a responseDictionary is given if not it creates one
    if responseDictList == None:
        responseDictList = []
    
    parentDirContent = getDirContent(parentDirectory)
    
    for file in parentDirContent["files"]:
        if file in listFiles:
            responseDictList.append({"name":file,"path":path.join(parentDirectory, file)})
        
    if len(parentDirContent["dirs"]) >= 1:
        for directory in parentDirContent["dirs"]:
            print(directory)
            getPathsToFiles(directory, listFiles, responseDictList)
    
    return responseDictList

def getImageSize(filePath):
    """
    Functions looks for the image size of an given path
    @param {string} filePath
    @return {Dictionary}
    """
    datafile = gdal.Open(filePath)
    if datafile:
        return {'x':datafile.RasterXSize,'y':datafile.RasterYSize}
    return None
    