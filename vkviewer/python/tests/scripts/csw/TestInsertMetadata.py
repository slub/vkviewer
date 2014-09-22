'''
Created on Jan 9, 2014

@author: mendt
'''    
import unittest, logging, tempfile, shutil, os
from vkviewer.settings import DBCONFIG, TEMPLATE_FILES, GN_SETTINGS
from vkviewer.python.models.Meta import initializeDb
from vkviewer.python.scripts.csw.InsertMetadata import insertMetadata, createTemporaryCopy, getMetadataForMesstischblatt, updateMetadata
from vkviewer.python.scripts.csw.CswTransactionBinding import gn_transaction_delete

class TestInsertMetadata(unittest.TestCase):
    
    @classmethod
    def setUpClass(cls):
        logging.basicConfig(level=logging.DEBUG)
        cls.logger = logging.getLogger('sqlalchemy.engine')
        cls.dbSession = initializeDb(DBCONFIG)
    
    @unittest.skip('testInsertMetadata')    
    def testInsertMetadata(self):
        gn_transaction_delete('df_dk_0010001_0192', GN_SETTINGS['gn_username'], GN_SETTINGS['gn_password'], self.logger)
        response = insertMetadata(id=71051490,db=self.dbSession,logger=self.logger)
        self.assertIsNotNone(response, "InsertMetadata should pass, but fails.")
        gn_transaction_delete('df_dk_0010001_0192', GN_SETTINGS['gn_username'], GN_SETTINGS['gn_password'], self.logger)
      
    @unittest.skip('testInsertMetadata_1')   
    def testInsertMetadata_1(self):
        gn_transaction_delete('df_dk_0010001_1116', GN_SETTINGS['gn_username'], GN_SETTINGS['gn_password'], self.logger)
        response = insertMetadata(id=71051613,db=self.dbSession,logger=self.logger)
        self.assertIsNotNone(response, "InsertMetadata should pass, but fails.")
        gn_transaction_delete('df_dk_0010001_1116', GN_SETTINGS['gn_username'], GN_SETTINGS['gn_password'], self.logger)

    @unittest.skip('testInsertMetadata_1')  
    def testInsertMetadata_forUmlaute(self):
        gn_transaction_delete('df_dk_0010001_1116', GN_SETTINGS['gn_username'], GN_SETTINGS['gn_password'], self.logger)
        response = insertMetadata(id=71055037,db=self.dbSession,logger=self.logger)
        self.assertIsNotNone(response, "testInsertMetadata_forUmlaute should pass, but fails.")
        gn_transaction_delete('df_dk_0010001_1116', GN_SETTINGS['gn_username'], GN_SETTINGS['gn_password'], self.logger)
    
    #@unittest.skip('testCreateTemporaryCopy')          
    def testCreateTemporaryCopy(self):
        try:
            tmpDirectory = tempfile.mkdtemp('', 'tmp_', TEMPLATE_FILES['tmp_dir'])
            mdFile = createTemporaryCopy(TEMPLATE_FILES['child'], tmpDirectory, 'xml')
            self.assertTrue(isinstance(mdFile,str), 'Function: testCreateTemporaryCopy - failed because response is not a string.')
            self.assertTrue(os.path.isfile(mdFile), 'Function: testCreateTemporaryCopy - failed because response is not a existing file')
        except:
            raise
        finally:
            shutil.rmtree(tmpDirectory)
    
    #@unittest.skip('testGetMetadataForMesstischblatt')   
    def testGetMetadataForMesstischblatt(self):
        response = getMetadataForMesstischblatt(id=71051490,db=self.dbSession,logger=self.logger)
        self.assertIsNotNone(response, 'Function: testGetMetadataFormesstischblatt - failed because response is none.')
        
    def testCreateUpdateMetadataFile(self):
        try:
            tmpDirectory = tempfile.mkdtemp('', 'tmp_', TEMPLATE_FILES['tmp_dir'])
            mdFile = createTemporaryCopy(TEMPLATE_FILES['child'], tmpDirectory, 'xml')
            metadata = getMetadataForMesstischblatt(id=71051490,db=self.dbSession,logger=self.logger)
            updateMetadata(mdFile, metadata, self.logger)   
            self.assertTrue(isinstance(mdFile,str), 'Function: testCreateTemporaryCopy - failed because response is not a string.')
            self.assertTrue(os.path.isfile(mdFile), 'Function: testCreateTemporaryCopy - failed because response is not a existing file')
        except:
            raise
     
def test_suite():
    suite = unittest.TestSuite()
    loader = unittest.TestLoader()
    
    print '=============='
    print '=============='
    print 'Run test suite'
    
    suite.addTests(loader.loadTestsFromTestCase(TestInsertMetadata))
    return suite

if __name__ == '__main__':
    unittest.TextTestRunner(verbosity=2).run(test_suite())