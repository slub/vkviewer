'''
Created on Jan 16, 2014

@author: mendt
'''
import unittest
import xml.etree.ElementTree as ET
from src.csw.Namespaces import Namespaces
from src.csw.ServiceMetadataBinding import appendCoupledResource

class TestServiceMetadataBinding(unittest.TestCase):

    @classmethod
    def setUpClass(cls):    
        # Helper method which define the prefix of the namespaces   
        for key in Namespaces:
            ET.register_namespace(key, Namespaces[key].strip('}').strip('{'))
        
    def testAppendCoupledResource(self):
        rootElement = ET.Element(Namespaces['srv']+'SV_ServiceIdentification')
        response = appendCoupledResource(rootElement, '111111', 'Test Titel')
        
        self.assertIsNotNone(response, 'Function appendCoupledResource - Response is None, but not none was expected.')
        
        # check if operationName is correctly set
        searchHierarchy = [Namespaces['srv']+'coupledResource',
                           Namespaces['srv']+'SV_CoupledResource',
                           Namespaces['srv']+'operationName',
                           Namespaces['gco']+'CharacterString']
        operationName = response.find('/'.join(searchHierarchy))
        self.assertEqual(operationName.text, 'Test Titel', 'Function appendCoupledResource - Value of <srv:operationName> is not like expected.')
        
        # check if identifier is correctly set
        searchHierarchy = [Namespaces['srv']+'coupledResource',
                           Namespaces['srv']+'SV_CoupledResource',
                           Namespaces['srv']+'identifier',
                           Namespaces['gco']+'CharacterString']
        identifier = response.find('/'.join(searchHierarchy))
        self.assertEqual(identifier.text, '111111', 'Function appendCoupledResource - Value of <srv:identifier> is not like expected.')
        
        # check if operatesOn is correctly set
        operatesOn = response.find(Namespaces['srv']+'operatesOn')
        self.assertEqual(operatesOn.attrib['uuidref'], '111111', 'Function appendCoupledResource - Attribute Value of <srv:operatesOn> is not like expected.')


if __name__ == "__main__":
    #import sys;sys.argv = ['', 'Test.testAppendCoupledResource']
    unittest.main()