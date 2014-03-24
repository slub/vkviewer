# Portal Virtuelles Kartenforum 2.0 

<a href="http://kartenforum.slub-dresden.de/vkviewer"><img src="http://kartenforum.slub-dresden.de/vkviewer/static/images/welcome_logo.png" align="left" hspace="10"></a>

Blabla 

vkviewer
===========

Dependences
===========

	- Postgresql 9.1 / PostGis 1.5
	- libgdal1  1.9 / libgdal1-dev / python-gdal 
	- python-mapscript

Installation
============

1.1) Setup the virtual environment

   - At first set up the virtualenvironment 
	virtualenv --no-site-packages env
   - Install pyramid into the virtualenv
	~/path/to/env/bin/easy_install pyramid
   - Next install different librarys for the virtualenv
	~/path/to/env/bin/easy_install pyramid pyramid_mako SQLAlchemy psycopg2 WebHelpers pyramid_tm waitress Babel lingua
   - Add site-packages to the virtual environment \n
        ln -s /usr/lib/python2.7/dist-packages/gdal* ~/path/to/env/lib/python2.7/site-packages/ \n
	ln -s /usr/lib/python2.7/dist-packages/MapScript-6.0.1.egg-info ~/path/to/env/lib/python2.7/site-packages/ \n
	ln -s /usr/lib/python2.7/dist-packages/GDAL-1.9.0.egg-info ~/path/to/env/lib/python2.7/site-packages/ \n
	ln -s /usr/lib/python2.7/dist-packages/mapscript.py* ~/path/to/env/lib/python2.7/site-packages/ \n
	ln -s /usr/lib/python2.7/dist-packages/_mapscript.so ~/path/to/env/lib/python2.7/site-packages/ \n

1.2) Install vkviewer pyramid project
	cd ~/path/to/env/bin/python setup.py develop (or production)

1.3) Install Internationalization of pyramid project
	cd ~/path/to/env/bin/python setup.py extract_messages
	cd ~/path/to/env/bin/python setup.py update_catalog
	cd ~/path/to/env/bin/python setup.py compile_catalog

1.4) Run application
	cd ~/path/to/env/bin/pserve development.ini --reload

1.5) For bcrpyt support 
	
	- System wide installation libffi-dev
		apt-get install libffi-dev
  	- Add side packages to the virtual environment
		ln -s /usr/lib/x86_64-linux-gnu/pkgconfig/libffi.pc ~/path/to/env/lib/python2.7/site-packages/
	- Install bcrypt
		bin/easy_install bcrypt

1.6) Install mail client

	- apt-get install exim4
	- dpkg-reconfigure exim4-config (configure mail client)

Deployment on apache server
===========================

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

Run Tests
=========

1.) Pyramid Tests
	
	~/path/to/env/bin/python setup.py test	## runs all tests
	~/path/to/env/bin/python setup.py test --test-module vkviewer.python.tests.views.utils.TestSuite ## runs specific TestSuite


Tips
====

PYRAMID_RELOAD_TEMPLATES=1 bin/pserve development.ini --reload 

Deploy on server (without update of the pyramid properties files)
=================================================================

1.) Create backup on server 

	cp -r ~/path/to/env/vkviewer ~/path/to/env/vkviewer.backup
	cp ~/path/to/env/vkviewer/settings.py ~/path/to/env/settings.py

2.) Remove old files from server

	rm -r ~/path/to/env/vkviewer

3.) Copy new files in right position

	cp -r ~/path/to/env/newvkviewer_app ~/path/to/env/vkviewer
	cp ~/path/to/env/settings.py ~/path/to/env/vkviewer/

4.) Build pyramid application

	~/path/to/env/bin/python setup.py install

5.) Restart apache2

	service apache2 restart


Help
====

1.) Build system javascript

The build system for javascript uses the closure compile from google. It is run via the python script 'build.py' in the js folder. It computes 6 files, from which are 3 referering to the js code which is connected to OpenLayers 2.13. and 3 are connected to the code to OpenLayers 3. In generally the HTML-/Mako-Pages should load the Vkviewer.js or Vkviewer-ol3.js. 
If you are developing replace this Vkviewer.js through the content of Vkviewer.debug.js or Vkviewer-closure.debug.js. The latter one also contains the needed code from the closure library. In case it is already loaded you should only use the Vkviewer.debug.js (equivalent for ol3). Both files only contain reference of the proper files in the file hierarchy.
For production you should choose the Vkviewer.min.js. This file contains a merge of all used files from the closure library and the Vkviewer javascript files. The code is compiled through the closure compiler with a simple optimisation. That meens it remove's the whitespaces and also replace some variable names.

- IMPORTANT: After renaming one of the 3 files to Vkviewer.js, please make sure that the scriptName within this file is equivalent to the file name. If not the loading script while not run.


