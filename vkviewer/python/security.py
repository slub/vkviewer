from pyramid.security import Allow, Everyone, Authenticated, ALL_PERMISSIONS
from vkviewer.python.models.messtischblatt.Users import Users

class EntryFactory(object):
    __acl__ = [(Allow, Everyone, 'view'),
               (Allow, Authenticated, 'edit'), 
               (Allow, 'g:moderator', 'moderator'),
               (Allow, 'g:admin', ALL_PERMISSIONS) ]

    def __init__(self, request):
        pass
    
def groupfinder(userid, request):
    user = Users.by_username(userid, request.db)
    if user:
        return ['g:%s' % g for g in str(user.groups).split(',')]
