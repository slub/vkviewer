'''
Created on Jan 27, 2014

@author: mendt
'''
import unittest
from vkviewer.python.utils.mail import sendMailSMTP, sendMailCommandLine

class SendMailTest(unittest.TestCase):

    @unittest.skip('testSendMail')
    def testSendMailSMTP(self):
        response = sendMailSMTP('jaco6666666mendarsr@web.de', 'Test mail', 'This email is send for testing purpose')
        print 'Function testSendMail - response = %s '%response
        self.assertTrue(response, 'Function testSendMail - Failed because response is not True.')
        
    @unittest.skip('testSendMailCommandLine')
    def testSendMailCommandLine(self):
        response = sendMailCommandLine('jacobmendt@googlemail.com', 'Test mail', 'This email is send for testing purpose')
        print 'Function testSendMailCommandLine - response = %s '%response
        self.assertTrue(response, 'Function testSendMailCommandLine - Failed because response is not True.')    

if __name__ == "__main__":
    #import sys;sys.argv = ['', 'Test.testName']
    unittest.main()