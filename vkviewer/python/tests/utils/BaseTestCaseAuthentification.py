import transaction
from pyramid import testing
from vkviewer.python.tests.utils.BaseTestCase import BaseTestCase
from vkviewer.python.models.messtischblatt.Users import Users

login = 'test_pyramid'
password = 'test_pyramid'
email = 'test@pyramid.de'
vorname = 'vor_test'
nachname = 'nach_test'

class BaseTestCaseAuthentification(BaseTestCase):
    
    @classmethod
    def setUpClass(cls):     
        BaseTestCase.setUpClass()
        cls.dbsession = cls.Session()
        cls.createTestUser()
    
    @classmethod
    def tearDownClass(cls):     
        cls.dbsession.delete(cls.user)
        transaction.commit()
        
    @classmethod
    def createTestUser(cls):
        newUser = Users(login=login, password=password, email=email, vorname=vorname, nachname=nachname)
        cls.dbsession.add(newUser)
        cls.user = newUser    
        
    def getUser(self, dbsession):
        user = Users.by_username(login, dbsession)
        return user    
        
    def getRequestWithAuthentification(self, params):
        self.config.testing_securitypolicy(userid = login, permissive = False)
        request = self.getRequestWithDb(testing.DummyRequest(params=params, post=params))
        request.context = testing.DummyResource()
        return request


