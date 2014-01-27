'''
Created on Jan 27, 2014

@author: mendt
'''
import unittest
from vkviewer.python.utils.mail import sendMail

class SendMailTest(unittest.TestCase):

    @unittest.skip('testSendMail')
    def testSendMail(self):
        response = sendMail('jaco6666666mendarsr@web.de', 'Test mail', 'This email is send for testing purpose')
        print 'Function testSendMail - response = %s '%response
        self.assertTrue(response, 'Function testSendMail - Failed because response is not True.')

if __name__ == "__main__":
    #import sys;sys.argv = ['', 'Test.testName']
    unittest.main()