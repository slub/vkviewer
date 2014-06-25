'''
Created on Jan 15, 2014

@author: mendt
'''
import xml.etree.ElementTree as ET
from vkviewer.python.scripts.csw.Namespaces import Namespaces

transaction_delete_identifier = "<?xml version=\"1.0\" encoding=\"UTF-8\"?> \
<csw:Transaction service=\"CSW\" version=\"2.0.2\" xmlns:csw=\"http://www.opengis.net/cat/csw/2.0.2\" xmlns:ogc=\"http://www.opengis.net/ogc\" \
    xmlns:apiso=\"http://www.opengis.net/cat/csw/apiso/1.0\"> \
    <csw:Delete> \
        <csw:Constraint version=\"1.0.0\"> \
            <ogc:Filter> \
                <ogc:PropertyIsLike singleChar=\"_\" escape=\"/\"> \
                    <ogc:PropertyName>apiso:identifier</ogc:PropertyName> \
                    <ogc:Literal>%s</ogc:Literal> \
                </ogc:PropertyIsLike> \
            </ogc:Filter> \
        </csw:Constraint> \
    </csw:Delete> \
</csw:Transaction>"

transaction_insert = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\
<csw:Transaction service=\"CSW\" version=\"2.0.2\" xmlns:csw=\"http://www.opengis.net/cat/csw/2.0.2\">\
    <csw:Insert></csw:Insert>\
</csw:Transaction>"

def build_transaction_insertRequest(metadataFile, logger):
    try:
        logger.debug('Start creating a insert request for the file %s'%metadataFile)
        # Helper method which define the prefix of the namespaces
        for key in Namespaces:
            ET.register_namespace(key, Namespaces[key].strip('}').strip('{'))
        
        # parse the insert request
        insertRequest = ET.fromstring(transaction_insert)
        appendElement = insertRequest.find(Namespaces['csw']+'Insert')
        
        # parse metadata document for messtischblatt and append it request file
        metadataTree = ET.parse(metadataFile)
        appendElement.append(metadataTree.getroot())       
        return ET.tostring(insertRequest, method='xml')
    except:
        logger.error('Problems while creating a insert request for the file %s'%file)
        raise        