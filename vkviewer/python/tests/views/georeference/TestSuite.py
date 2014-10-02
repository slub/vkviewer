import unittest
from vkviewer.python.tests.views.georeference.GeoreferenceConfirmTest import GeoreferenceConfirmTest
from vkviewer.python.tests.views.georeference.GeoreferenceChooseMapTest import GeoreferenceChooseMapTest
from vkviewer.python.tests.views.georeference.GeoreferenceGetProcessTest import GeoreferenceGetProcessTest
from vkviewer.python.tests.views.georeference.GeoreferenceUpdateTest import GeoreferenceUpdateTest
from vkviewer.python.tests.views.georeference.GeoreferenceValidationTest import GeoreferenceValidationTest
from vkviewer.python.tests.views.georeference.GetPageTest import GetPageTest

def test_suite():
    suite = unittest.TestSuite()
    loader = unittest.TestLoader()
    
    suite.addTests(loader.loadTestsFromTestCase(GetPageTest))
    suite.addTests(loader.loadTestsFromTestCase(GeoreferenceConfirmTest))
    suite.addTests(loader.loadTestsFromTestCase(GeoreferenceChooseMapTest))
    suite.addTests(loader.loadTestsFromTestCase(GeoreferenceGetProcessTest))
    suite.addTests(loader.loadTestsFromTestCase(GeoreferenceUpdateTest))
    suite.addTests(loader.loadTestsFromTestCase(GeoreferenceValidationTest))

    return suite

if __name__ == '__main__':
    unittest.TextTestRunner(verbosity=2).run(test_suite())