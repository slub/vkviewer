'''
Created on May 30, 2013

@author: mendt
'''
import shapefile

def getPRJwkt(epsg):
   """
   Grab an WKT version of an EPSG code
   usage getPRJwkt(4326)

   This makes use of links like http://spatialreference.org/ref/epsg/4326/prettywkt/
   """
   
   import urllib
   f=urllib.urlopen("http://spatialreference.org/ref/epsg/{0}/prettywkt/".format(epsg))
   return (f.read())

class Point:
    
    def __init__(self, x, y, crs=None):
        self.x = float(x);
        self.y = float(y);
        if (crs != None):
            self.crs = int(crs)
        else:
            self.crs = 0
    
    def __str__(self):
        return repr("Point X:%s Y:%s EPSG-Code:%s"%(str(self.x),str(self.y),str(self.crs)))
    
    def __hash__(self):
        prime = 31
        result = 1
        result = prime * result + self.crs
        result = prime * result + self.x
        result = prime * result + self.y
        return result
    
    def equals(self, object):
        if self == object:
            return True
        elif object == None:
            return False
        elif object.__hash__() == self.__hash__():
            return True
        else:
            return False
        
        
class BoundingBox:
    """    
    @note: llc = lowerleftcorner, ulc = upperleftcorner, urc = upperrightcorner, lrc = lowerrightcorner
    """

    def __init__(self, lowX, lowY, highX, highY, espg):
        self.epsg = int(espg);
        self.__initCornerPoints__(lowX, lowY, highX, highY)
        
    def __initCornerPoints__(self,lowX, lowY, highX, highY):
        self.llc = Point(lowX,lowY,self.epsg)
        self.ulc = Point(lowX,highY,self.epsg)
        self.urc = Point(highX,highY,self.epsg)
        self.lrc = Point(highX,lowY,self.epsg)      

    def __str__(self):
        return repr("Lower Left: %s %s, Upper Left: %s %s, Upper Right: %s %s, Lower Right: %s %s, EPSG-Code: %s"%(str(self.llc.x),
                    str(self.llc.y),str(self.ulc.x),str(self.ulc.y),str(self.urc.x),str(self.urc.y),
                    str(self.lrc.x),str(self.lrc.y),str(self.epsg)))
    
    def __hash__(self):
        prime = 31
        result = 1
        result = prime * result + self.epsg
        result = prime * result + self.llc.__hash__()
        result = prime * result + self.urc.__hash__()
        return result
    
    def equals(self, object):
        print(object)
        print(self)
        if self == object:
            return True
        elif object == None:
            return False
        elif object.__hash__() == self.__hash__():
            return True
        else:
            return False
                    
    def getCornerPointsAsList(self):
        return [(self.llc.x,self.llc.y),
                (self.ulc.x,self.ulc.y),
                (self.urc.x,self.urc.y),
                (self.lrc.x,self.lrc.y),]

    def getGdalExtentString(self):
        extent = str(self.ulc.x)+" "+str(self.ulc.y)+" "+\
            str(self.lrc.x)+" "+str(self.lrc.y)
        return extent
    
    def asShapefile(self, targetPath):
        """
        Export the boundingbox to a shapefile
        
        @param targetPath: target path of the shapefile
        
        @return: path to the shapefile (should be the targetPath)
        """
        # create the shapefile
        shpWriter = shapefile.Writer(shapefile.POLYGON)
        shpWriter.poly(parts=[[[self.llc.x,self.llc.y],[self.ulc.x,self.ulc.y],
                               [self.urc.x,self.urc.y],[self.lrc.x,self.lrc.y],
                               [self.llc.x,self.llc.y]]])
        shpWriter.field('epsg', 'C', '6')
        shpWriter.record(str(self.epsg))
        shpWriter.save(targetPath)
        
        # create the PRJ file
        prj = open("%s.prj"%targetPath, "w")
        epsg = getPRJwkt(self.epsg)
        prj.write(epsg)
        prj.close()
        
        return targetPath+".shp"
        
        
        
def createBBoxFromPostGISString(pgBBoxStr, epsg):
    """
    The methode supports so far only an postgis box2d result string.
    """
    stripGeomString = pgBBoxStr[str(pgBBoxStr).rfind("(")+1:str(pgBBoxStr).find(")")]
    points = stripGeomString.split(",")
    dictCornerPoints = {}
    i = 0
    for point in points:
        pointSplit = point.split(" ")
        if (i == 0):
            dictCornerPoints["llc"] = Point(float(pointSplit[0]),float(pointSplit[1]),epsg)
        elif (i == 1):
            dictCornerPoints["ulc"] = Point(float(pointSplit[0]),float(pointSplit[1]),epsg)
        elif (i == 2):
            dictCornerPoints["urc"] = Point(float(pointSplit[0]),float(pointSplit[1]),epsg)
        elif (i == 3):
            dictCornerPoints["lrc"] = Point(float(pointSplit[0]),float(pointSplit[1]),epsg)
        i += 1
    bbox = BoundingBox(dictCornerPoints["llc"].x,dictCornerPoints["llc"].y,dictCornerPoints["urc"].x,
                       dictCornerPoints["urc"].y,epsg)
    return bbox