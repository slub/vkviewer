import unittest
from ViewGeoreferenceValidateTest import ViewGeoreferenceValidateTest
from ViewGeoreferenceConfirmTest import ViewGeoreferenceConfirmTest_Short, ViewGeoreferenceConfirmTest_Long
from GetPageTest import ViewGetPage_chooseGeorefMtbTests

def test_suite():
    suite = unittest.TestSuite()
    loader = unittest.TestLoader()
    suite.addTests(loader.loadTestsFromTestCase(ViewGetPage_chooseGeorefMtbTests))
    suite.addTests(loader.loadTestsFromTestCase(ViewGeoreferenceValidateTest))
    suite.addTests(loader.loadTestsFromTestCase(ViewGeoreferenceConfirmTest_Short))
    suite.addTests(loader.loadTestsFromTestCase(ViewGeoreferenceConfirmTest_Long))
    return suite

if __name__ == '__main__':
    unittest.TextTestRunner(verbosity=2).run(suite())