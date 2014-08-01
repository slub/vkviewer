from pyramid.view import view_config

""" this view checks if the login is registered in the database and gets the vorname/nachname and 
    sends it back to client """
@view_config(route_name='auth', match_param='action=getscreen', renderer='loginScreen.mako', http_cache=0)
def getLoginScreen(request):
    return {}
