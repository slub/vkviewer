'''
Created on Jan 15, 2014

@author: mendt
'''
import unittest, logging, requests, shutil, tempfile
import logging
import requests
from settings import sqlalchemy_engine, templates, gn_settings
from src.models.Meta import initializeDb
from src.csw.CswTransactionBinding import gn_auth_logout, gn_auth_login, gn_transaction_delete, gn_transaction_insert
from src.csw.InsertMetadata import createTemporaryCopy, getMetadataForMesstischblatt, updateMetadata


class TestCswTransactionBinding(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        logging.basicConfig(level=logging.DEBUG)
        cls.logger = logging.getLogger('sqlalchemy.engine')
        cls.dbSession = initializeDb(sqlalchemy_engine)
        

    def testGnAuthLogin(self):
        response = gn_auth_login(gn_settings['gn_username'], gn_settings['gn_password'], self.logger)
        self.assertTrue(isinstance(response, requests.Session), 'Function: gn_auth_login - Failed because response is not a session object')
        self.assertTrue('JSESSIONID' in requests.utils.dict_from_cookiejar(response.cookies), 
                        'Function: gn_auth_login - Failed because response session object has no "JSESSIONID cookies.')
        
    def testGnAuthLogin_failed(self):
        response = gn_auth_login(gn_settings['gn_username'], 'test', self.logger)
        self.assertFalse(response, 'Function: gn_auth_login - Failed because of not expected error behavior.')

    def testGnAuthLogout(self):
        session = requests.Session()
        response = gn_auth_logout(session, self.logger)
        self.assertTrue(response, 'Function: gn_auth_logout - Failed because response is not true.')

    @unittest.skip('testGnTransactionInsert')          
    def testGnTransactionInsert(self):
        try:
            tmpDirectory = tempfile.mkdtemp('', 'tmp_', templates['tmp_dir'])
            mdFile = createTemporaryCopy(templates['child'], tmpDirectory)
            metadata = getMetadataForMesstischblatt(71051490, self.dbSession, self.logger)
            updateMetadata(mdFile, metadata, self.logger)

            response = gn_transaction_insert(mdFile,gn_settings['gn_username'], gn_settings['gn_password'], self.logger)
            self.assertIsNotNone(response, 'Function gn_transaction_insert - Failed because response is None.')
            self.assertTrue(isinstance(response, unicode), 'Function gn_transaction_insert - Failed because response is not a unicode.')
            self.assertTrue('<csw:totalInserted>1</csw:totalInserted>' in response, 
                            'Function gn_transaction_insert - Failed because no record insert.')
    
            print 'Test response for function - gn_transaction_insert'
            print '=================================================='
            print response
    
        except:
            raise
        finally:
            shutil.rmtree(tmpDirectory)
            gn_transaction_delete(metadata['identifier'], gn_settings['gn_username'], gn_settings['gn_password'], self.logger)


    #@unittest.skip('testSendInsertRequest')            
    def testGnTransactionDelete(self):
        response = gn_transaction_delete('df_dk_0010001_0192', gn_settings['gn_username'], gn_settings['gn_password'], self.logger)
        self.assertIsNotNone(response, 'Function gn_transaction_delete - Failed because response is None.')
        self.assertTrue(isinstance(response, unicode), 'Function gn_transaction_delete - Failed because response is not a unicode.')
        
        print 'Test response for function - gn_transaction_delete'
        print '=================================================='
        print response

if __name__ == "__main__":
    #import sys;sys.argv = ['', 'Test.testName']
    unittest.main()