'''
Created on Apr 14, 2014

@author: mendt
'''
import gdal, os, uuid, shapefile, sys, subprocess
from gdalconst import *

gdal.UseExceptions()

SRS_DICT_PROJ = {
    4314:'+proj=longlat +ellps=bessel +datum=potsdam +no_defs'
}

SRC_DICT_WKT = {
    4314:'GEOGCS[\"DHDN\",DATUM[\"Deutsches_Hauptdreiecksnetz\",SPHEROID[\"Bessel 1841\",6377397.155,299.1528128,AUTHORITY[\"EPSG\",\"7004\"]],TOWGS84[598.1,73.7,418.2,0.202,0.045,-2.455,6.7],AUTHORITY[\"EPSG\",\"6314\"]],PRIMEM[\"Greenwich\",0,AUTHORITY[\"EPSG\",\"8901\"]],UNIT[\"degree\",0.0174532925199433,AUTHORITY[\"EPSG\",\"9122\"]],AUTHORITY[\"EPSG\",\"4314\"]]'
}

def georeference(src_file, dest_file, tmp_dir, gcps, src_srs, dest_srs, algorithm, logger, clip_to_cropline = None):
    try:
        vrt_dataset = None
        dest_dataset = None
        shp_file = None
        
        logger.info('Run georeferencing of %s'%src_file)
        src_dataset = gdal.Open(src_file, GA_ReadOnly)
        vrt_file = os.path.join(tmp_dir, '%s.vrt'%uuid.uuid4())
        vrt_dataset = createVrt(src_dataset, vrt_file)
        logger.debug('Set source projection of the vrt ...')
        vrt_dataset.SetProjection(SRC_DICT_WKT[src_srs])
        logger.debug('Do geotransformation ...')
        dst_geotr = gdal.GCPsToGeoTransform(gcps)
        vrt_dataset.SetGeoTransform(dst_geotr)
        
        if clip_to_cropline:
            vrt_dataset = None
            logger.debug('Crop result to given boundingbox')
            dest_shp_file = os.path.join(tmp_dir, '%s'%uuid.uuid4())
            shp_file = createClipShapefile(clip_to_cropline, dest_shp_file, dest_srs)
            return clipRasterWithShapfile(vrt_file, dest_file, shp_file, logger)
        else:
            logger.debug('Create response without clipping ...')
            dest_dataset = src_dataset.GetDriver().CreateCopy(dest_file, vrt_dataset, 0)
            return dest_file
    except:
        pass
    finally:
        if vrt_dataset or vrt_file:
            del vrt_dataset
            os.remove(vrt_file)
        if dest_dataset:
            del dest_dataset
        if shp_file:
            os.remove('%s.shp'%dest_shp_file)
            os.remove('%s.dbf'%dest_shp_file)
            os.remove('%s.prj'%dest_shp_file)
            os.remove('%s.shx'%dest_shp_file)
            
def createVrt(gdal_src_dataset, dest_file):
    out_format = 'VRT'
    dst_driver = gdal.GetDriverByName(out_format)
    dst_dataset = dst_driver.CreateCopy(dest_file, gdal_src_dataset,0)
    return dst_dataset

def createClipShapefile(polygon_coords, dst_path, src_srs):
    # create the shapefile
    shpWriter = shapefile.Writer(shapefile.POLYGON)
    shpWriter.poly(parts=[polygon_coords])
    shpWriter.field('epsg', 'C', '6')
    shpWriter.record(str(src_srs))
    shpWriter.save(dst_path)
        
    # create the PRJ file
    prj = open("%s.prj"%dst_path, "w")
    epsg = SRC_DICT_WKT[src_srs]
    prj.write(epsg)
    prj.close()
        
    return '%s.shp'%dst_path

def clipRasterWithShapfile(src_raster, dest_raster, clip_shp, logger):
    try:
        logger.debug('Starting cliping raster %s'%src_raster)
        command = 'gdalwarp -overwrite --config GDAL_CACHEMAX 500 -wm 500 -cutline \'%s\' -crop_to_cutline %s %s'%(clip_shp, src_raster, dest_raster)
        subprocess.check_call(command, shell=True)
        return dest_raster
    except:
        logger.error("%s - Unexpected error while trying to clip the raster: %s - with command - %s"%(sys.stderr,sys.exc_info()[0],command))
        raise GeorefClipException("Error while running subprocess via commandline!")
    
def createGCPs(clip_params, georef_coords, img_height):
    try:
        # at first parse pixel coords
        pixels = []
        for point in clip_params.split(","):
            x, y = point.split(":")
            # recalculate the y coordinates because of different coordinates origin 
            pixels.append((round(float(x)),img_height - round(float(y))))
           
        # order the list
        xList = []
        yList = []
        for tuple in pixels:
            xList.append(tuple[0])
            yList.append(tuple[1])
        xList.sort() 
        yList.sort()              
        orderedList = [0, 0, 0, 0] 
        for tuple in pixels:
            if (tuple[0] == xList[0] or tuple[0] == xList[1]) and \
                (tuple[1] == yList[2] or tuple[1] == yList[3]):
                orderedList[0] = tuple
            elif (tuple[0] == xList[0] or tuple[0] == xList[1]) and \
                (tuple[1] == yList[0] or tuple[1] == yList[1]):
                orderedList[1] = tuple 
            elif (tuple[0] == xList[2] or tuple[0] == xList[3]) and \
                (tuple[1] == yList[0] or tuple[1] == yList[1]):
                orderedList[2] = tuple 
            elif (tuple[0] == xList[2] or tuple[0] == xList[3]) and \
                (tuple[1] == yList[2] or tuple[1] == yList[3]):
                orderedList[3] = tuple 
        
        # run the matching
        gcps = []
        for i in range(0,len(orderedList)):
            gcps.append(gdal.GCP(georef_coords[i][0], georef_coords[i][1], 0, orderedList[i][0],orderedList[i][1]))
        return gcps
    except:
        raise CreateGCPException('Error while trying to create the GCPs')
    
""" Exceptions """   
class GeorefClipException(Exception):
    def __init__(self, value):
       self.value = value       
    def __str__(self):
        return repr(self.value)    
    
class CreateGCPException(Exception):
    def __init__(self, value):
       self.value = value       
    def __str__(self):
        return repr(self.value)  

