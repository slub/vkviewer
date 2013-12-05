from pyramid.security import unauthenticated_userid
from vkviewer import log

def checkIsUser(request):
    userid = unauthenticated_userid(request)
    log.info('Checked userid is %s'%userid)
    if userid is not None:
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

