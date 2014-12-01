'''
Created on May 23, 2014

@author: mendt
'''
from vkviewer.python.georef.georeferenceexceptions import GeoreferenceParameterError

def validateId(id):
    errorMsg = "Object identifier is not valide."
    try:
        # check if mtbid is valide
        if (id != None):
            if isinstance(int(id), int):
                return True
            else:
                raise GeoreferenceParameterError(errorMsg)
    except:
        raise GeoreferenceParameterError(errorMsg)
    
def contains(list, filter):
    for x in list:
        if filter(x):
            return True
    return False



