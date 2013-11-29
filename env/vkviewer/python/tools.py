from pyramid.security import unauthenticated_userid

def checkIsUser(request):
    userid = unauthenticated_userid(request)
    if userid is not None:
        # this should return None if the user doesn't exist
        return True
    else:
        return False
    
def getCookie(request, cookieName):
    cookiesDict = request.cookies
    if cookieName in cookiesDict:
        return cookiesDict[cookieName]
    else:
        return ''
