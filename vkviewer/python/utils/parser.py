'''
Created on May 23, 2014

@author: mendt
'''
import gdal

from vkviewer.python.utils.validation import validateId
from vkviewer.python.models.messtischblatt.Map import Map
from vkviewer.python.georef.georeferenceexceptions import GeoreferenceParameterError

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
    
def parseMapObjForId(request_data, name, dbsession):
    """ This functions parses a map objectid from an objectid """
    if name in request_data:
        validateId(request_data[name])         
        # @deprecated     
        # do mapping for support of new name schema
        mapObj = Map.by_id(int(request_data[name]), dbsession)
        if mapObj is None:
            raise GeoreferenceParameterError('Missing or wrong objectid parameter.')           
        else:
            return mapObj
    raise GeoreferenceParameterError('Missing or wrong objectid parameter.')  