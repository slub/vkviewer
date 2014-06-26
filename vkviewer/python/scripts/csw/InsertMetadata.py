#!/usr/bin/env python
# -*- coding: utf-8 -*-
'''
Created on Jan 9, 2014

@author: mendt
'''
import logging, shutil, sys, tempfile, uuid, os
from datetime import datetime
from vkviewer.settings import DBCONFIG, TEMPLATE_FILES, GN_SETTINGS, DATABASE_SRID, TEMPLATE_OGC_SERVICE_LINK
from vkviewer.python.scripts.csw.ChildMetadataBinding import ChildMetadataBinding
from vkviewer.python.scripts.csw.CswTransactionBinding import gn_transaction_insert, gn_transaction_delete
from vkviewer.python.models.Meta import initializeDb
from vkviewer.python.models.messtischblatt.Messtischblatt import Messtischblatt
from vkviewer.python.models.messtischblatt.MdZeit import MdZeit
from vkviewer.python.models.messtischblatt.MdCore import MdCore
from vkviewer.python.models.messtischblatt.MdDatensatz import MdDatensatz

def insertMetadata(id, db, logger):
    logger.debug('Start inserting metadata')
    try:
        tmpDirectory = tempfile.mkdtemp('', 'tmp_', TEMPLATE_FILES['tmp_dir'])
        mdFile = createTemporaryCopy(TEMPLATE_FILES['child'], tmpDirectory)
        metadata = getMetadataForMesstischblatt(id, db, logger)
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
    
def getMetadataForMesstischblatt(id, db, logger):
    try:
        logger.debug('Start collection metadata information')
        mtb = Messtischblatt.by_id(id, db)
        metadata_core = MdCore.by_id(id, db)
        metadata_time = MdZeit.by_id(id, db)
        metadata_dataset = MdDatensatz.by_ObjectId(id, db)
        
        logger.debug('Metadata collection finish. Creating response')
        metadata = {
                    'westBoundLongitude':str(mtb.BoundingBoxObj.llc.x),
                    'eastBoundLongitude':str(mtb.BoundingBoxObj.urc.x),
                    'southBoundLatitude':str(mtb.BoundingBoxObj.llc.y),
                    'northBoundLatitude':str(mtb.BoundingBoxObj.urc.y),
                    'identifier':mtb.id,
                    'dateStamp': datetime.now().strftime('%Y-%m-%d'),
                    'title': metadata_core.titel,
                    'cite_date': str(metadata_time.datierung),
                    'abstract': metadata_core.beschreibung,
                    'temporalExtent_begin': '%s-01-01'%metadata_time.datierung,
                    'temporalExtent_end': '%s-12-31'%metadata_time.datierung,
                    'permalink': metadata_dataset.permalink, 
                    'hierarchylevel': 'Messtischblatt' if mtb.mdtype == 'M' else 'Aequidistantenkarte', 
                    'overviews': [
                        'http://fotothek.slub-dresden.de/thumbs/df/dk/0010000/%s.jpg'%mtb.dateiname,
                        TEMPLATE_OGC_SERVICE_LINK['wms_template']%({
                            'westBoundLongitude':str(mtb.BoundingBoxObj.llc.x),
                            'southBoundLatitude':str(mtb.BoundingBoxObj.llc.y),
                            'eastBoundLongitude':str(mtb.BoundingBoxObj.urc.x),
                            'northBoundLatitude':str(mtb.BoundingBoxObj.urc.y),
                            'srid':DATABASE_SRID,
                            'time':metadata_time.datierung,
                            'width':256,
                            'height':256
                        }),
                        'http://fotothek.slub-dresden.de/mids/df/dk/0010000/%s.jpg'%mtb.dateiname 
                    ],
                    'wms_params': {
                        'westBoundLongitude':str(mtb.BoundingBoxObj.llc.x),
                        'southBoundLatitude':str(mtb.BoundingBoxObj.llc.y),
                        'eastBoundLongitude':str(mtb.BoundingBoxObj.urc.x),
                        'northBoundLatitude':str(mtb.BoundingBoxObj.urc.y),
                        'srid':DATABASE_SRID,
                        'time':metadata_time.datierung,
                        'width':256,
                        'height':256
                    },
                    'onlineresource':[
                        {
                            'url':'http://kartenforum.slub-dresden.de/vkviewer/permalink?objectid=%s'%mtb.id,
                            'protocol':'HTTP',
                            'name':'Permalink'
                        },
                        {
                            'url':TEMPLATE_OGC_SERVICE_LINK['wms_template']%({
                                'westBoundLongitude':str(mtb.BoundingBoxObj.llc.x),
                                'southBoundLatitude':str(mtb.BoundingBoxObj.llc.y),
                                'eastBoundLongitude':str(mtb.BoundingBoxObj.urc.x),
                                'northBoundLatitude':str(mtb.BoundingBoxObj.urc.y),
                                'srid':DATABASE_SRID,
                                'time':metadata_time.datierung,
                                'width':256,
                                'height':256
                            }),
                            'protocol':'OGC:WMS-1.1.1-http-get-map',
                            'name':'WEB MAP SERVICE (WMS)'
                        },
                        {
                            'url':metadata_dataset.permalink,
                            'protocol':'HTTP',
                            'name':'Permalink'
                        }                        
                    ]
        }
        return metadata
    except:
        logger.error('Problems while trying to collect the metadata for the messtischblatt with id %s'%id)
        raise

def updateMetadata(file, metadata, logger):
    try:
        logger.debug('Start updating the metadata in the xml file %s'%file)
        mdEditor = ChildMetadataBinding(file, logger)
        mdEditor.updateId('vk20-md-%s'%metadata['identifier'])
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
    dbSession = initializeDb(DBCONFIG)
    logger = logging.getLogger('sqlalchemy.engine')
    
    # get all messtischblätter
    messtischblaetter = Messtischblatt.all(dbSession)
    for messtischblatt in messtischblaetter:
        if messtischblatt.isttransformiert:
            #response = gn_transaction_delete(messtischblatt.dateiname, gn_settings['gn_username'], gn_settings['gn_password'], logger)
            response = insertMetadata(id=messtischblatt.id,db=dbSession,logger=logger)
            print "Response - delete record"
            print "========================"
            print response
            