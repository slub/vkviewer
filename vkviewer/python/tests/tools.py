import unittest
 
from pyramid import testing
from pyramid.config import Configurator
from vkviewer.python.tools import getCookie

 
class FunctionGetCookieTests(unittest.TestCase):
     
    def setUp(self):     
        self.config = testing.setUp()        
         
    def tearDown(self):
        testing.tearDown()

    def testGetCookie_pass_CookieBack(self):
        params = {'welcomepage':'on'}
        request = testing.DummyRequest(cookies=params)
        result = getCookie(request, 'welcomepage')
        print "Test: testGetCookie_pass_cookieback - cookie result: %s for params: %s"%(result, params)
        self.assertEqual(result,'on')

    
    def testGetCookie_pass_noCookieBack(self):
        request = testing.DummyRequest()
        result = getCookie(request, 'welcomepage')
        print "Test: testGetCookie_pass_noCookieBack - cookie result: %s for no params."%result
        self.assertEqual(result, '')
