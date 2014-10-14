#!/usr/bin/env python
# -*- coding: utf-8 -*-
'''
Created on Jan 9, 2014

@author: mendt
'''
import logging, shutil, sys, tempfile, uuid, os
from datetime import datetime
from vkviewer.python.models.messtischblatt.Map import Map
from vkviewer.python.models.messtischblatt.Metadata import Metadata
from vkviewer.python.utils.idgenerator import createOAI
from vkviewer.python.georef.utils import getImageSize
from georeference.settings import TEMPLATE_FILES, GN_SETTINGS, DATABASE_SRID, TEMPLATE_OGC_SERVICE_LINK, DBCONFIG_PARAMS, PERMALINK_RESOLVER
from georeference.csw.ChildMetadataBinding import ChildMetadataBinding
from georeference.csw.CswTransactionBinding import gn_transaction_insert
from georeference.utils.tools import loadDbSession

def insertMetadata(id, db, logger):
    logger.debug('Start inserting metadata')
    try:
        tmpDirectory = tempfile.mkdtemp('', 'tmp_', TEMPLATE_FILES['tmp_dir'])
        mdFile = createTemporaryCopy(TEMPLATE_FILES['child'], tmpDirectory)
        metadata = getMetadataForMapObj(id, db, logger)
        updateMetadata(mdFile, metadata, logger)   
        response = gn_transaction_insert(mdFile,GN_SETTINGS['gn_username'], GN_SETTINGS['gn_password'], logger)
        if '<csw:totalInserted>1</csw:totalInserted>' in response:
            return response
        else:
            logger.error('Problems while inserting metadata for messtischblatt id %s'%id)
            
            print "RESPONSE"
            print "========"
            print response
            
            return False
    except:
        raise
    finally:
        shutil.rmtree(tmpDirectory)

def createTemporaryCopy(srcFile, destDir, ending='xml'):
    try:
        destFile = os.path.join(destDir, str(uuid.uuid4()) + '.' + ending)
        shutil.copyfile(srcFile, destFile)
        return destFile
    except:
        raise

def getOnlineResourceData(mapObj, metadataObj, time, bboxObj, oai):    
    image_size = getImageSize(mapObj.georefimage)
    
    onlineResList = [
        {
            'url':TEMPLATE_OGC_SERVICE_LINK['wms_template']%({
                'westBoundLongitude':str(bboxObj.llc.x),
                'southBoundLatitude':str(bboxObj.llc.y),
                'eastBoundLongitude':str(bboxObj.urc.x),
                'northBoundLatitude':str(bboxObj.urc.y),
                'srid':DATABASE_SRID,
                'time':time,
                'width':256,
                'height':256
            }),
            'protocol':'OGC:WMS-1.1.1-http-get-map',
            'name':'WEB MAP SERVICE (WMS)'
        },{
            'url':PERMALINK_RESOLVER+oai,
            'protocol':'HTTP',
            'name':'Permalink-VK2'
        }, {
            'url':metadataObj.apspermalink,
            'protocol':'HTTP',
            'name':'Permalink-Fotothek'
        }
    ]
    
    if time <= 1900:
        onlineResList.append({
            'url':TEMPLATE_OGC_SERVICE_LINK['wcs_template']%({
                'westBoundLongitude':str(bboxObj.llc.x),
                'southBoundLatitude':str(bboxObj.llc.y),
                'eastBoundLongitude':str(bboxObj.urc.x),
                'northBoundLatitude':str(bboxObj.urc.y),
                'srid':DATABASE_SRID,
                'time':time,
                'width':str(image_size['x']),
                'height':str(image_size['y'])
            }),
            'protocol':'OGC:WCS-1.0.0-http-get-coverage',
            'name':'WEB COVERAGE SERVICE (WCS)'
        })  
    return onlineResList
         
def getMetadataForMapObj(id, db, logger):
    try:
        logger.debug('Start collection metadata information')
        mapObj = Map.by_id(id, db)
        metadataObj = Metadata.by_id(id, db)
        # metadata_core = MdCore.by_id(mapObj.apsobjectid, db)
        bbox_4326 = Map.getBoundingBoxObjWithEpsg(id, db, 4326)
        
        # create metadata record id 
        oai = createOAI(mapObj.id)

        bbox_srid =  Map.getBoundingBoxObjWithEpsg(mapObj.id, db, DATABASE_SRID)
        onlineResList = getOnlineResourceData(mapObj, metadataObj, metadataObj.timepublish.year, bbox_srid, oai)
        
        logger.debug('Metadata collection finish. Creating response')
        metadata = {
                    'westBoundLongitude':str(bbox_4326.llc.x),
                    'eastBoundLongitude':str(bbox_4326.urc.x),
                    'southBoundLatitude':str(bbox_4326.llc.y),
                    'northBoundLatitude':str(bbox_4326.urc.y),
                    'identifier':oai,
                    'dateStamp': datetime.now().strftime('%Y-%m-%d'),
                    'title': metadataObj.title,
                    'cite_date': str(metadataObj.timepublish.year),
                    'abstract': metadataObj.description,
                    'temporalExtent_begin': '%s-01-01'%metadataObj.timepublish.year,
                    'temporalExtent_end': '%s-12-31'%metadataObj.timepublish.year,
                    'hierarchylevel': 'Messtischblatt' if mapObj.maptype == 'M' else 'Äquidistantenkarte', 
                    'overviews': [
                        'http://fotothek.slub-dresden.de/thumbs/df/dk/0010000/%s.jpg'%mapObj.apsdateiname
                    ],
                    'wms_params': {
                        'westBoundLongitude':str(bbox_srid.llc.x),
                        'southBoundLatitude':str(bbox_srid.llc.y),
                        'eastBoundLongitude':str(bbox_srid.urc.x),
                        'northBoundLatitude':str(bbox_srid.urc.y),
                        'srid':DATABASE_SRID,
                        'time':metadataObj.timepublish.year,
                        'width':256,
                        'height':256
                    },
                    'onlineresource':onlineResList
        }
        return metadata
    except:
        logger.error('Problems while trying to collect the metadata for the messtischblatt with id %s'%id)
        raise

def updateMetadata(file, metadata, logger):
    try:
        logger.debug('Start updating the metadata in the xml file %s'%file)
        mdEditor = ChildMetadataBinding(file, logger)
        mdEditor.updateId(metadata['identifier'])
        mdEditor.updateTitle(metadata['title'])
        mdEditor.updateAbstract(metadata['abstract'])
        mdEditor.updateHierarchyLevelName(metadata['hierarchylevel'])
        mdEditor.updateBoundingBox(metadata['westBoundLongitude'], metadata['eastBoundLongitude'], 
                                   metadata['southBoundLatitude'], metadata['northBoundLatitude'])
        mdEditor.updateDateStamp(metadata['dateStamp'])
        mdEditor.updateReferenceTime(metadata['temporalExtent_begin'], metadata['temporalExtent_end'])
        mdEditor.updateReferenceDate(metadata['cite_date'])
        mdEditor.updateGraphicOverview(metadata['overviews'])
        mdEditor.updateIdCode(metadata['identifier'])
        mdEditor.updateOnlineResource(metadata['onlineresource'])
        
        print '============================'
        print mdEditor.tostring()
        print '============================'
        
        mdEditor.saveFile(file)
        return True
    except:
        logger.error('Problems while updating the metadata for the xml file %s'%file)
        raise




if __name__ == '__main__':
    logging.basicConfig(level=logging.DEBUG)
    logger = logging.getLogger('sqlalchemy.engine')
    dbSession = loadDbSession(DBCONFIG_PARAMS, logger) 
    # get all messtischblätter
    maps = Map.all(dbSession)
    for map in maps:
        if map.isttransformiert:
            #response = gn_transaction_delete(messtischblatt.dateiname, gn_settings['gn_username'], gn_settings['gn_password'], logger)
            response = insertMetadata(id=map.id,db=dbSession,logger=logger)
            print "Response - delete record"
            print "========================"
            print response
            