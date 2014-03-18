import unittest
from ViewGetWelcomePageTest import ViewGetWelcomePageTest

def test_suite():
    suite = unittest.TestSuite()
    loader = unittest.TestLoader()
    
    suite.addTests(loader.loadTestsFromTestCase(ViewGetWelcomePageTest))
    return suite

if __name__ == '__main__':
    unittest.TextTestRunner(verbosity=2).run(test_suite())