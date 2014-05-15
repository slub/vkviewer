#!/usr/bin/env python


"""This is a blind proxy that we use to get around browser
restrictions that prevent the Javascript from loading pages not on the
same server as the Javascript.  This has several problems: it's less
efficient, it might break some sites, and it's a security risk because
people can use this proxy to browse the web and possibly do bad stuff
with it.  It only loads pages via http and https, but it can load any
content type. It supports GET and POST requests.

Based on the example from trac.osgeo.org/openlayers/browser/trunk/openlayers/examples/proxy.cgi
and modified by Jacob Mendt to used the script within the pyramid framework
@TODO - correct error messages"""

import urllib2
import json
import cgi
import sys, os

from pyramid.response import Response

# Designed to prevent Open Proxy type stuff.

allowedHosts = ['www.openlayers.org', 'openlayers.org', 'slub-dresden.de/',
                'www.openstreetmap.org','194.95.145.43','194.95.145.42','localhost', '139.30.111.16',
                'kartenforum.slub-dresden.de', 'localhost:8080', 'http://139.30.132.26:8091','194.95.144.96:8080',
                'eiger.auf.uni-rostock.de','127.0.0.1:8080']

def proxy_post(request):
    method = request.environ["REQUEST_METHOD"]

    qs = request.environ["QUERY_STRING"]
    d = cgi.parse_qs(qs)
    if d.has_key("url"):
        url = d["url"][0]
    else:
        url = "http://slub-dresden.de/startseite/"
    
    try:
        host = url.split("/")[2]
        if allowedHosts and not host in allowedHosts:
            print "Status: 502 Bad Gateway"
            print "Content-Type: text/plain"
            print
            print "This proxy does not allow you to access that location (%s)." % (host,)
            print
            print request.environ
      
        elif url.startswith("http://") or url.startswith("https://"):
        
            if method == "POST":
                length = int(request.environ["CONTENT_LENGTH"])
                headers = {"Content-Type": request.environ["CONTENT_TYPE"]}
                #body = sys.stdin.read(length)
                r = urllib2.Request(url, request.body, headers)
                y = urllib2.urlopen(r)
            else:
                get_url = url
                d.pop("url", None)
                for key in d:
                    get_url += '&' + key + '=' + d[key][0]
                  
                if "AUTH_TYPE" in request.environ:
                    opener = urllib2.build_opener()
                    opener.addheaders.append(('Cookie','auth_tkt='+request.cookies['auth_tkt']))
                    y = opener.open(get_url)
                else:
                    y = urllib2.urlopen(get_url)
            
            # print content type header
            i = y.info()
            if i.has_key("Content-Type"):
#                 data = y.read()
#                 print json.load(data)
                response = Response(body=y.read(),content_type=i["Content-Type"])
                #response.headerlist[('Content-Type',i["Content-Type"])]
                #print "Content-Type: %s" % (i["Content-Type"])
            else:
                response = Response(body=y.read(),content_type='text/plain')
                #response.headerlist[('Content-Type','text/plain')]
                #print "Content-Type: text/plain"
            #print
            
            #print y.read()
            
            y.close()
            return response
        else:
            print "Content-Type: text/plain"
            print
            print "Illegal request."
    
    except Exception, E:
        print "Status: 500 Unexpected Error"
        print "Content-Type: text/plain"
        print 
        print "Some unexpected error occurred. Error text was:", E
