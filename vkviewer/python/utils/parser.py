'''
Created on May 23, 2014

@author: mendt
'''
import gdal
from vkviewer.python.models.messtischblatt.Messtischblatt import Messtischblatt
from vkviewer.python.models.messtischblatt.Passpoint import Passpoint

def parseGcps(georeference):
    gcps = []
    for i in range(0,len(georeference)):
        gcps.append(gdal.GCP(georeference[i]['target'][0], georeference[i]['target'][1], 0, georeference[i]['source'][0],georeference[i]['source'][1]))
    return gcps

def getJsonDictPasspointsForMapObject(messtischblattid, dbsession):
    defaultDict = {'source':'pixel','target':'EPSG:4314','gcps':[]}
    passpoints = Passpoint.allForObjectId(messtischblattid, dbsession)
    for passpoint in passpoints:
        defaultDict['gcps'].append({'source':passpoint.unrefpoint,'target':passpoint.refpointAsArray})
    return defaultDict