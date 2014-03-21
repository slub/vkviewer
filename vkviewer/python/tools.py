import string, random
from pyramid.security import unauthenticated_userid
from vkviewer import log
from vkviewer.python.models.messtischblatt.Users import Users

def checkIsUser(request):
    userid = unauthenticated_userid(request)
    log.info('Checked userid is %s'%userid)
    if Users.by_username(userid, request.db):
        # this should return None if the user doesn't exist
        return userid
    else:
        return False
    
def getCookie(request, cookieName):
    cookiesDict = request.cookies
    if cookieName in cookiesDict:
        return cookiesDict[cookieName]
    else:
        return ''
    
def generateRandomString(size):
    lst = [random.choice(string.ascii_letters + string.digits) for n in xrange(size)]
    str = ''.join(lst)
    return str
