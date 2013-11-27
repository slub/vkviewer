# for complete deploying description see
http://docs.pylonsproject.org/projects/pyramid/en/1.0-branch/tutorials/modwsgi/index.html

# Test-Request
http://localhost:8080/vkviewer/georef/validate?mtbid=71055607&userid=jm&points=759.28125%3A7893.9375%2C7549.7109375%3A7868.90625%2C7526.4921875%3A1401.40625%2C743.0078125%3A1421.21875
http://localhost:8080/vkviewer/georef/confirm?mtbid=71055607&georefid=1484
http://localhost:8080/vkviewer/georef/confirm?mtbid=71055607&userid=jm&points=759.28125%3A7893.9375%2C7549.7109375%3A7868.90625%2C7526.4921875%3A1401.40625%2C743.0078125%3A1421.21875



Update Internationalization dictionary 
======================================

bin/python setup.py extract_messages
bin/python setup.py update_catalog
bin/python setup.py compile_catalog

Deployment on server 
====================

1.) Apache configuration (/etc/apache2/sites-available/default)    

# Use only 1 Python sub-interpreter. Multiple sub-interpreters
WSGIApplicationGroup %{GLOBAL}
WSGIPassAuthorization On
WSGIDaemonProcess pyramid user=www-data group=www-data threads=4 \
   	python-path=/usr/lib/python2.7/site-packages
WSGIScriptAlias /vkviewer ~/repo/vk2-project/vkviewer/pyramid.wsgi

<Directory ~/repo/vk2-project/vkviewer>
	WSGIProcessGroup pyramid
	Order allow,deny
	Allow from all
</Directory>

2.) Set up pyramid.wsgi
3.) Install app
../bin/python setup.py install
