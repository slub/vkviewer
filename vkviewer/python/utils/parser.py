'''
Created on May 23, 2014

@author: mendt
'''
import gdal
from vkviewer.python.models.messtischblatt.Messtischblatt import Messtischblatt

def parseGcps(georeference):
    gcps = []
    for i in range(0,len(georeference)):
        gcps.append(gdal.GCP(georeference[i]['target'][0], georeference[i]['target'][1], 0, georeference[i]['source'][0],georeference[i]['source'][1]))
    return gcps

def convertUnicodeDictToUtf(input):
    if isinstance(input, dict):
        return {convertUnicodeDictToUtf(key): convertUnicodeDictToUtf(value) for key, value in input.iteritems()}
    elif isinstance(input, list):
        return [convertUnicodeDictToUtf(element) for element in input]
    elif isinstance(input, unicode):
        return input.encode('utf-8')
    else:
        return input