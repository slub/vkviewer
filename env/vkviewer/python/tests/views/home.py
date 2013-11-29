import unittest
import json
 
from pyramid import testing
from pyramid.config import Configurator
from ...views.home import set_visitor_cookie, get_index_page

 
class ViewSetVisitorCookieTests(unittest.TestCase):
     
    def setUp(self):     
        self.config = testing.setUp()        
         
    def tearDown(self):
        testing.tearDown()
    
    def testSetVisitorCookie_passend_off(self):
        params = {'welcomepage':'off'}
        request = testing.DummyRequest(params=params)
        result = set_visitor_cookie(request)
        cookieResult = result.headers['Set-Cookie']
        print "Test: testSetVisitorCookie_passend_off - cookie result: %s for params: %s"%(cookieResult, params)
        self.assertTrue('welcomepage=off' in cookieResult)
        self.assertTrue('Max-Age=31536000' in cookieResult)

    def testSetVisitorCookie_passend_on(self):
        params = {'welcomepage':'on'}
        request = testing.DummyRequest(params=params, cookies={'welcomepage':'off'})
        result = set_visitor_cookie(request)
        cookieResult = result.headers['Set-Cookie']
        print "Test: testSetVisitorCookie_passend_on - cookie result: %s for params: %s"%(cookieResult, params)
        self.assertTrue('welcomepage=on' in cookieResult)
        self.assertTrue('Max-Age=31536000' in cookieResult)
            
    def testSetVisitorCookie_fail_wrongParameter1(self):
        params = {'welcomepage':'offs'}
        request = testing.DummyRequest(params=params)
        result = set_visitor_cookie(request)
        print "Test: testSetVisitorCookie_fail_wrongParameter1 - http status: %s for params: %s"%(result.status, params) 
        self.assertEqual(result.status_code, 400)
        
    def testSetVisitorCookie_fail_wrongParameter2(self):
        params = {'welcomepage':''}
        request = testing.DummyRequest(params=params)
        result = set_visitor_cookie(request)
        print "Test: testSetVisitorCookie_fail_wrongParameter2 - http status: %s for params: %s"%(result.status, params) 
        self.assertEqual(result.status_code, 400)

    def testSetVisitorCookie_fail_missingParameter(self):
        request = testing.DummyRequest()
        result = set_visitor_cookie(request)
        print "Test: testSetVisitorCookie_fail_missingParameter - http status: %s for no params."%result.status 
        self.assertEqual(result.status_code, 400)

class ViewGetIndexPageTests(unittest.TestCase):
     
    def setUp(self):     
        self.config = testing.setUp()        
         
    def tearDown(self):
        testing.tearDown()
    
    def testGetIndexPage_withoutWelcomePage(self):
        params = {'welcomepage':'off'}
        request = testing.DummyRequest(params=params, cookies=params)
        result = get_index_page(request)  
        print "Test: testGetIndexPage_withoutWelcomePage - result: %s for params: %s"%(result, params)
        self.assertEqual(result,params)
        
    def testGetIndexPage_withWelcomePage_1(self):
        params = {'welcomepage':'on'}
        request = testing.DummyRequest(params=params, cookies=params)
        result = get_index_page(request)  
        print "Test: testGetIndexPage_withWelcomePage_1 - result: %s for params: %s"%(result, params)
        self.assertEqual(result,{})
        
    def testGetIndexPage_withWelcomePage_2(self):
        request = testing.DummyRequest()
        result = get_index_page(request)  
        print "Test: testGetIndexPage_withWelcomePage_2 - result: %s for no params."%result
        self.assertEqual(result,{})