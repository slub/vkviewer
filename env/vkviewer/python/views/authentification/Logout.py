from pyramid.view import view_config
from pyramid.httpexceptions import HTTPFound
from pyramid.security import forget

@view_config(route_name='auth', match_param='action=out')
def logout(request):
    headers = forget(request)
    return HTTPFound(location = request.route_url('home',_query={'welcomepage':'off'}),
                     headers = headers)