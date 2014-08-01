'''
Created on Jan 15, 2014

@author: mendt
'''
import requests
from vkviewer.settings import GN_SETTINGS
from vkviewer.python.scripts.csw.TransactionRequests import transaction_delete_identifier, build_transaction_insertRequest


def gn_auth_login(username, password, logger):
    try:
        logger.debug('Start authentication for user %s.'%username)
        
        url_in = GN_SETTINGS['gn_baseURL'] + GN_SETTINGS['gn_loginURI']
        session = requests.Session()
        params = {"username": username, "password": password} 
        response = session.post(url_in, data=params)
        response_url = response.url # for testing if response is a an authenficate user
        if response.status_code == 200 and not 'failure=true' in response_url:
            logger.debug('Authentication for user %s successful.'%username)
            return session
        else:
            if response.status_code == 200:
                logger.warn('Authentication for user %s failed. Please check login information.'%username)
                return False
            else: 
                logger.warn('Authentication for user %s failed. Please check login service urls'%username)
                return False                
    except: 
        logger.error('Error while trying to authenticate the geonetwork user: %s'%username)
        raise

def gn_auth_logout(session, logger):
    try:
        logger.debug('Logout.')
        url_out = GN_SETTINGS['gn_baseURL'] + GN_SETTINGS['gn_logoutURI']
        response = session.get(url_out)
        if response.status_code == 200:
            return True
        else:
            print 'headers', response.headers
            print 'cookies', requests.utils.dict_from_cookiejar(session.cookies)
            print 'html',  response.text
            return False
    except: 
        logger.error('Error while trying to logout.')
        raise
    
def gn_transaction_delete(identifier, username, password, logger):
    try:
        logger.debug('Start deleting record with id %s from CSW instance.'%identifier)
        url_transaction = GN_SETTINGS['gn_baseURL'] + GN_SETTINGS['gn_cswTransactionURI']
        session = gn_auth_login(username, password, logger)
        xml_request = transaction_delete_identifier%identifier
        response = session.post(url_transaction, data=xml_request, headers={'Content-Type':'application/xml'})
        if response.status_code == 200:
            logger.debug('Delete process finished.')
            return response.text
        else:
            print 'headers', response.headers
            print 'cookies', requests.utils.dict_from_cookiejar(session.cookies)
            print 'html',  response.text
            return False
    except:
        logger.error('Error while trying to delete a record with the id %s.'%identifier)
        raise    
    finally:
        gn_auth_logout(session, logger) 
    
def gn_transaction_insert(metadataFile, username, password, logger):   
    try:
        logger.debug('Start inserting a metadata record in the CSW instance.')
        url_transaction = GN_SETTINGS['gn_baseURL'] + GN_SETTINGS['gn_cswTransactionURI']
        session = gn_auth_login(username, password, logger)
        
        xml_request = build_transaction_insertRequest(metadataFile, logger)
        print 'INSERT REQUETS'
        print '=============='
        print xml_request
        
        response = session.post(url_transaction, data=xml_request, headers={'Content-Type':'application/xml'})
        if response.status_code == 200:
            logger.debug('Insert process finished.')
            return response.text
        else:
            print 'headers', response.headers
            print 'cookies', requests.utils.dict_from_cookiejar(session.cookies)
            print 'html',  response.text
            return False
    except:
        logger.error('Error while trying to insert a record.')
        raise  
    finally:
        gn_auth_logout(session, logger)