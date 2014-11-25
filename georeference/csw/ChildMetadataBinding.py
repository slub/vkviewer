'''
Created on Jan 9, 2014

@author: mendt
'''
import xml.etree.ElementTree as ET
import copy
from georeference.csw.Namespaces import Namespaces
from georeference.settings import TEMPLATE_OGC_SERVICE_LINK 
 
def appendElements(elements, parentElement):
    """ 
    @param {list} elements
    @param {ET.Element} parentElement
    @return {ET.Element}
    """    
    for elString in elements:
        elem = ET.Element(elString)
        parentElement.append(elem)
        elements.remove(elString)
        if len(elements) > 0:
            elem = appendElements(elements, elem)    
        return elem
    
class ChildMetadataBinding(object):
    '''
    This class encapsulate the functions which are bind to a metadata template document for a messtischblatt. 
    Especially that are the update functions for the different metadata elements.
    '''

    def __init__(self, srcFile, logger):
        self.__registerNamespaces__()       
        self.srcFile = srcFile
        self.tree = ET.parse(srcFile)
        self.root = self.tree.getroot()
        self.logger = logger
    
    def __getCharacterStringElement__(self, element):
        return element.find(self.ns['gco']+'CharacterString')

    def __getChildElement__(self, parentElementId, childElementId):
        for parentElement in self.root.iter(parentElementId):
            for element in parentElement.iter(childElementId):
                return element
            
    def __registerNamespaces__(self):
        # inits the namespace
        self.ns = Namespaces
        # Helper method which define the prefix of the namespaces
        for key in self.ns:
            ET.register_namespace(key, self.ns[key].strip('}').strip('{'))
            
    def __changeSingleElement__(self, value, path):
        valueElement = self.root.find(path)
        valueElement.text = value
        return True
    
    def tostring(self):
        return ET.tostring(self.root, encoding='utf8', method='xml')
    
    def saveFile(self, destFile):
        self.tree.write(destFile, encoding="utf-8", xml_declaration=True)
        return destFile
    
    def updateAbstract(self, value):
        try:
            self.logger.debug('Update <gmd:abstract> with value %s.'%value)
            xmlHierarchy = [self.ns['gmd']+'identificationInfo', 
                             self.ns['gmd']+'MD_DataIdentification',
                             self.ns['gmd']+'abstract',
                             self.ns['gco']+'CharacterString']
            self.__changeSingleElement__(value, '/'.join(xmlHierarchy))     
            return True      
        except:
            self.logger.error('Problems while updating the <gmd:abstract> with value %s.'%value)
            raise

    def updateBoundingBox(self, westBoundLongitude, eastBoundLongitude, southBoundLatitude, northBoundLatitude):
        try:
            self.logger.debug('Update <gmd:EX_TemporalExtent> with westBoundLongitude %s, eastBoundLongitude %s, southBoundLatitude %s and northBoundLatitude %s.'%(
                westBoundLongitude, eastBoundLongitude, southBoundLatitude, northBoundLatitude))
            xmlHierarchy = [self.ns['gmd']+'identificationInfo', 
                             self.ns['gmd']+'MD_DataIdentification',
                             self.ns['gmd']+'extent',
                             self.ns['gmd']+'EX_Extent',
                             self.ns['gmd']+'geographicElement',
                             self.ns['gmd']+'EX_GeographicBoundingBox']            
            # set westBoundLongitude
            westBoundLonHierarchy = copy.deepcopy(xmlHierarchy)
            westBoundLonHierarchy.extend([self.ns['gmd']+'westBoundLongitude',
                                          self.ns['gco']+'Decimal'])
            self.__changeSingleElement__(westBoundLongitude,'/'.join(westBoundLonHierarchy))
                
            # set eastBoundLongitutde
            eastBoundLonHierarchy = copy.deepcopy(xmlHierarchy)
            eastBoundLonHierarchy.extend([self.ns['gmd']+'eastBoundLongitude',
                                          self.ns['gco']+'Decimal'])
            self.__changeSingleElement__(eastBoundLongitude,'/'.join(eastBoundLonHierarchy))
            
            # set southBoundLatitude
            southBoundLatHierarchy = copy.deepcopy(xmlHierarchy)
            southBoundLatHierarchy.extend([self.ns['gmd']+'southBoundLatitude',
                                          self.ns['gco']+'Decimal'])
            self.__changeSingleElement__(southBoundLatitude,'/'.join(southBoundLatHierarchy))            
                
            # set northBoundLatitude
            northBoundLatHierarchy = copy.deepcopy(xmlHierarchy)
            northBoundLatHierarchy.extend([self.ns['gmd']+'northBoundLatitude',
                                          self.ns['gco']+'Decimal'])
            self.__changeSingleElement__(northBoundLatitude,'/'.join(northBoundLatHierarchy))   
                
            return True
        except:  
            self.logger.error('Problems while updating the <gmd:EX_TemporalExtent> with westBoundLongitude %s, eastBoundLongitude %s, southBoundLatitude %s and northBoundLatitude %s.'%(
                westBoundLongitude, eastBoundLongitude, southBoundLatitude, northBoundLatitude))
            raise     
                    
    def updateDateStamp(self, value):
        try:
            self.logger.debug('Update <gmd:dateStamp> with value %s.'%value)
            xmlHierarchy = [self.ns['gmd']+'dateStamp', 
                             self.ns['gco']+'Date']
            self.__changeSingleElement__(value, '/'.join(xmlHierarchy))
            return True      
        except:
            self.logger.error('Problems while updating the <gmd:dateStamp> with value %s.'%value)
            raise

    def updateGraphicOverview(self, links):
        try: 
            self.logger.debug('Update <gmd:graphicOverview')
            xmlHierarchy = [
                self.ns['gmd']+'identificationInfo', 
                self.ns['gmd']+'MD_DataIdentification',
                self.ns['gmd']+'graphicOverview',
                self.ns['gmd']+'MD_BrowseGraphic',
                self.ns['gmd']+'fileName', 
                self.ns['gco']+'CharacterString'
            ]
            rootElements = self.root.findall('/'.join(xmlHierarchy))
            
            # update graphic overviews
            loopSize = len(links)
            if len(rootElements) is loopSize:
                for i in range(0, loopSize):
                    rootElements[i].text = links[i]
    
            return True
        except:
            self.logger.error('Problems while updating the <gmd:MD_DigitalTransferOptions> with params %s.'%links)
            raise  
    def updateHierarchyLevelName(self, value):
        try:
            self.logger.debug('Update <gmd:hierarchyLevelName> with value %s.'%value)
            xmlHierarchy = [self.ns['gmd']+'hierarchyLevelName', 
                             self.ns['gco']+'CharacterString']
            self.__changeSingleElement__(value, '/'.join(xmlHierarchy))
            return True      
        except:
            self.logger.error('Problems while updating the <gmd:hierarchyLevelName> with value %s.'%value)
            raise
        
    def updateId(self, value):
        try:
            self.logger.debug('Update <gmd:fileIdentifier> with value %s.'%value)
            xmlHierarchy = [self.ns['gmd']+'fileIdentifier', 
                             self.ns['gco']+'CharacterString']
            self.__changeSingleElement__(str(value), '/'.join(xmlHierarchy))
            return True
        except:
            self.logger.error('Problems while updating the <gmd:fileIdentifier> with value %s.'%value)
            raise
        
    def updateIdCode(self, value):
        try:
            self.logger.debug('Update <gmd:fileIdentifier> with value %s.'%value)
            xmlHierarchy = [self.ns['gmd']+'identificationInfo', 
                             self.ns['gmd']+'MD_DataIdentification',
                             self.ns['gmd']+'citation',
                             self.ns['gmd']+'CI_Citation',
                             self.ns['gmd']+'identifier',
                             self.ns['gmd']+'MD_Identifier',
                             self.ns['gmd']+'code',
                             self.ns['gco']+'CharacterString']
            self.__changeSingleElement__(str(value), '/'.join(xmlHierarchy))
            return True
        except:
            self.logger.error('Problems while updating the <gmd:fileIdentifier> with value %s.'%value)
            raise
        
    def updateTitle(self, value):
        try:
            self.logger.debug('Update <gmd:title> with value %s.'%value)
            xmlHierarchy = [self.ns['gmd']+'identificationInfo', 
                             self.ns['gmd']+'MD_DataIdentification',
                             self.ns['gmd']+'citation',
                             self.ns['gmd']+'CI_Citation',
                             self.ns['gmd']+'title',
                             self.ns['gco']+'CharacterString']
            self.__changeSingleElement__(value, '/'.join(xmlHierarchy))            
            return True
        except:
            self.logger.error('Problems while updating the <gmd:title> with value %s.'%value)
            raise    
        
    def updateReferenceDate(self, value):
        try:
            self.logger.debug('Update <gmd:CI_Date> with value %s.'%value)
            xmlHierarchy = [self.ns['gmd']+'identificationInfo', 
                             self.ns['gmd']+'MD_DataIdentification',
                             self.ns['gmd']+'citation',
                             self.ns['gmd']+'CI_Citation',
                             self.ns['gmd']+'date',
                             self.ns['gmd']+'CI_Date',
                             self.ns['gmd']+'date',
                             self.ns['gco']+'Date']
            self.__changeSingleElement__(value, '/'.join(xmlHierarchy))    
            return True      
        except:
            self.logger.error('Problems while updating the <gmd:CI_Date> with value %s.'%value)
            raise   
    
    def updateReferenceTime(self, startValue, endValue):
        try:
            self.logger.debug('Update <gmd:extent> with startValue %s and endValue %s.'%(startValue, endValue))
            xmlHierarchy = [self.ns['gmd']+'identificationInfo', 
                             self.ns['gmd']+'MD_DataIdentification',
                             self.ns['gmd']+'extent',
                             self.ns['gmd']+'EX_Extent',
                             self.ns['gmd']+'temporalElement',
                             self.ns['gmd']+'EX_TemporalExtent',
                             self.ns['gmd']+'extent',
                             self.ns['gml']+'TimePeriod'
            ]            
            
            # because of multiple children of <gmd:EX_Extent> this methode has to be modified.
            rootElement = self.root.findall('/'.join(xmlHierarchy))[0]

            #set start
            beginPeriodHierarchy = [
                self.ns['gml']+'begin',
                self.ns['gml']+'TimeInstant',
                self.ns['gml']+'timePosition'
            ]
            
            startPositionEl = rootElement.find('/'.join(beginPeriodHierarchy))
            if startPositionEl is not None:
                print 'Set start value ...'
                startPositionEl.text = startValue
                
            # set end
            endPeriodHierarchy = [
                self.ns['gml']+'end',
                self.ns['gml']+'TimeInstant',
                self.ns['gml']+'timePosition'
            ]
                
            endPositionEl = rootElement.find('/'.join(endPeriodHierarchy))
            if endPositionEl is not None:
                print 'Set end value ...'
                endPositionEl.text = endValue
                
            return True
        except:  
            self.logger.error('Problems while updating the <gmd:extent> with startValue %s and endValue %s.'%(startValue, endValue))    
            raise      
        
    def updateOnlineResource(self, data):
        try:
            self.logger.debug('Update online resources as <gmd:MD_DigitalTransferOptions>')
            
            # search parent element
            xmlSearchHierarchy = [
                self.ns['gmd']+'distributionInfo', 
                self.ns['gmd']+'MD_Distribution',
                self.ns['gmd']+'transferOptions'
            ]
            rootElement = self.root.find('/'.join(xmlSearchHierarchy))
            
            for dict in data:
                # now append online resources
                xmlOnlineResourceHierarchy = [
                    self.ns['gmd']+'MD_DigitalTransferOptions',
                    self.ns['gmd']+'onLine',
                    self.ns['gmd']+'CI_OnlineResource'
                ]
                onlineResourceElem = appendElements(xmlOnlineResourceHierarchy, rootElement)
                
                # now create and append the elements
                linkageRes = ET.Element(self.ns['gmd']+'linkage')
                urlRes = ET.Element(self.ns['gmd']+'URL')
                urlRes.text = dict['url']
                linkageRes.append(urlRes)
                onlineResourceElem.append(linkageRes)
                
                protocolRes = ET.Element(self.ns['gmd']+'protocol')
                charRes = ET.Element(self.ns['gco']+'CharacterString')
                charRes.text = dict['protocol']
                protocolRes.append(charRes)
                onlineResourceElem.append(protocolRes)

                nameRes = ET.Element(self.ns['gmd']+'name')
                charRes = ET.Element(self.ns['gco']+'CharacterString')
                charRes.text = dict['name']
                nameRes.append(charRes)
                onlineResourceElem.append(nameRes)
                
                # if description than insert it
                if 'description' in dict:
                    descriptionRes = ET.Element(self.ns['gmd']+'description')
                    charRes = ET.Element(self.ns['gco']+'CharacterString')
                    charRes.text = dict['description']
                    descriptionRes.append(charRes)
                    onlineResourceElem.append(descriptionRes)

            return True
        except:
            self.logger.error('Problems while updating the <gmd:MD_DigitalTransferOptions> with values %s.'%data)
            raise                    
            