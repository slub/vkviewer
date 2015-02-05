'''
Created on Dec 4, 2013

@author: mendt
'''
import unittest
import json
import os
import transaction
 
from pyramid import testing
from vkviewer.python.views.GetFooterPages import faq_mainPage

class ViewGetFooterPage_Faq(unittest.TestCase):
    
    def setUp(self):     
#         here = os.path.dirname(os.path.abspath(__file__))
#         makoTemplatePath = os.path.join(here, '../../../templates')
#         self.config = testing.setUp(settings={'mako.directories':makoTemplatePath})   
#         self.config.include('pyramid_mako')
        self.config = testing.setUp()
         
    def tearDown(self):
        testing.tearDown()    
        
    def testFaqPage_giveBackMainPage(self):
        request = testing.DummyRequest();
        result = faq_mainPage(request)
        print "testFaqPage_giveBackMainPage - result: %s"%result
        self.assertTrue(isinstance(result, dict))
    
    
def test_suite():
    suite = unittest.TestSuite()
    loader = unittest.TestLoader()
     
    suite.addTests(loader.loadTestsFromTestCase(ViewGetFooterPage_Faq))
    return suite
 
if __name__ == '__main__':
    unittest.TextTestRunner(verbosity=2).run(test_suite())
    