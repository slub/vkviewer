'''
Created on Jan 16, 2014

@author: mendt
'''
import logging, shutil, uuid, os
import xml.etree.ElementTree as ET
from georeference.settings import TEMPLATE_FILES, DBCONFIG_PARAMS, TMP_DIR, GN_SETTINGS
from georeference.utils.tools import loadDbSession 
from georeference.csw.Namespaces import Namespaces
from georeference.csw.CswTransactionBinding import gn_transaction_insert
from vkviewer.python.utils.idgenerator import createOAI
from vkviewer.python.models.messtischblatt.Metadata import Metadata
from vkviewer.python.models.messtischblatt.Map import Map

def createServiceDescription(template_path, target_dir, db, logger, wcs = False):
    logger.debug('Start creating service description')
    
    # create tempory copy
    mdServiceFile = os.path.join( target_dir, str(uuid.uuid4()) + '.xml')
    shutil.copyfile(template_path, mdServiceFile)

    # Helper method which define the prefix of the namespaces
    for key in Namespaces:
        ET.register_namespace(key, Namespaces[key].strip('}').strip('{'))
        
    # parse xml template file
    xmlTree = ET.parse(mdServiceFile)
    xmlElementRoot = xmlTree.getroot()
    
    # search xml element srv:SV_ServiceIdentification
    searchHierarchy = [Namespaces['gmd']+'identificationInfo', Namespaces['srv']+'SV_ServiceIdentification']
    xmlElementServiceId = xmlElementRoot.find('/'.join(searchHierarchy))
        
    # get all messtischblaetter
    maps = Map.all(db)
    logger.debug('Start appending new messtischblatt resources')
    for mapObj in maps:
        if mapObj.isttransformiert:
            metadataObj = Metadata.by_id(mapObj.id, db)
            
            if wcs:
                if metadataObj.timepublish.year <= 1900:
                    oai = createOAI(mapObj.id)
                    appendCoupledResource(rootElement = xmlElementServiceId, resourceId = oai, resourceTitle = metadataObj.title)
            else: 
                oai = createOAI(mapObj.id)
                appendCoupledResource(rootElement = xmlElementServiceId, resourceId = oai, resourceTitle = metadataObj.title)
        

    logger.debug('Save modified file in %s.'%mdServiceFile)        
    
#     print 'Service document'
#     print '================'
#     print ET.tostring(xmlElementRoot, encoding='utf-8', method='xml')
    
    xmlTree.write(mdServiceFile, encoding="utf-8", xml_declaration=True)
    return mdServiceFile
            
    
   
def appendCoupledResource(rootElement, resourceId, resourceTitle):
    # at first create srv:coupledResource
    coupledResource = ET.Element(Namespaces['srv']+'coupledResource')
    sv_coupledresource = ET.Element(Namespaces['srv']+'SV_CoupledResource')
    
    operationName = ET.Element(Namespaces['srv']+'operationName')
    operationNameVale = ET.Element(Namespaces['gco']+'CharacterString')
    operationNameVale.text = resourceTitle
    
    identifier = ET.Element(Namespaces['srv']+'identifier')
    identifierValue = ET.Element(Namespaces['gco']+'CharacterString')
    identifierValue.text = resourceId
        
    operationName.append(operationNameVale)
    identifier.append(identifierValue)
    sv_coupledresource.append(operationName)
    sv_coupledresource.append(identifier)
    coupledResource.append(sv_coupledresource)
    rootElement.append(coupledResource)
    
    # at last create and append srv:operatesOn
    operatesOn = ET.Element(Namespaces['srv']+'operatesOn', attrib = {'uuidref':resourceId})
    rootElement.append(operatesOn)   
    return rootElement

if __name__ == '__main__':
    logging.basicConfig(level=logging.DEBUG)
    logger = logging.getLogger('sqlalchemy.engine')
    dbSession = loadDbSession(DBCONFIG_PARAMS, logger)      
    
    # create service document for wms& wcs
    wmsServiceResponse = createServiceDescription(TEMPLATE_FILES['service-wms'], TMP_DIR, dbSession, logger)
    wcsServiceResponse = createServiceDescription(TEMPLATE_FILES['service-wcs'], TMP_DIR, dbSession, logger, True)
    
    print 'Insert wms service file %s ...'%wmsServiceResponse
    gn_transaction_insert(wmsServiceResponse, GN_SETTINGS['gn_username'], GN_SETTINGS['gn_password'], logger)
    
    print 'Insert wcs service file %s ...'%wcsServiceResponse
    gn_transaction_insert(wcsServiceResponse, GN_SETTINGS['gn_username'], GN_SETTINGS['gn_password'], logger)