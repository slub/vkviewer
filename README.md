# Portal Virtuelles Kartenforum 2.0 

<a href="http://kartenforum.slub-dresden.de/vkviewer"><img src="http://kartenforum.slub-dresden.de/vkviewer/static/images/welcome_logo.png" align="left" hspace="10" vspace="6"></a>

Das Portal **Virtuelles Kartenforum 2.0** entsteht im Rahmen des DFG geförderten Projektes "Virtuelles Kartenforum 2.0 - Eine Service-orientierte virtuelle Forschungsumgebung in der Deutschen Fotothek". 

Dieses GIT Repository beinhaltet dabei den Code für die Portal-Anwendung bzw. das WebGIS des Virtuellen Kartenforums 2.0.

Dependencies
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
	~/path/to/env/bin/easy_install pyramid pyramid_mako SQLAlchemy psycopg2 WebHelpers pyramid_tm waitress Babel lingua numpy PIL
   - Add site-packages to the virtual environment \n
        ln -s /usr/lib/python2.7/dist-packages/gdal* ~/path/to/env/lib/python2.7/site-packages/ \n
	ln -s /usr/lib/python2.7/dist-packages/MapScript-6.0.1.egg-info ~/path/to/env/lib/python2.7/site-packages/ \n
	ln -s /usr/lib/python2.7/dist-packages/GDAL-1.9.0.egg-info ~/path/to/env/lib/python2.7/site-packages/ \n
	ln -s /usr/lib/python2.7/dist-packages/mapscript.py* ~/path/to/env/lib/python2.7/site-packages/ \n
	ln -s /usr/lib/python2.7/dist-packages/_mapscript.so ~/path/to/env/lib/python2.7/site-packages/ \n
	ln -s /usr/lib/python2.7/dist-packages/osgeo/ ~/path/to/env/lib/python2.7/site-packages/ \n

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

1.) Build system 

The build systems uses the google closure compiler. It is run and configured using plovr and python script. The python scripts is in the folder deploy. It is run with the source directory, which should generally be the vkviewer directory where the templates, python and static files are placed and a target directory name. It is run via:

	python deploy/build_deploy.py vkviewer/ build/   (This command was run from the parent project folder)

The result is deployment ready version of the vkviewer files. Only the settings.py has to be replaced and the basic_page.mako has to modified for using the builded javascript.

For building minimized javascript files the closure compiler is used in a simple optimization mode. For advanced mode some further modifications have to be done to the source code. In the following you find a further explanation.

1.1.) Build system for javascript

The javascript is mainly based on the google closure library, jquery, jquery-ui and ol3. As a build and dependency system it uses the google closure builder.

## Building and using the deps files

The `src/vkviewer-deps.js` is build with the help of the **depswriter.py**. It uses the `goog.require` and `goog.provide` commands for building a dependency tree. By using `goog.require` it is than possible to automatically loads the dependency code which is assoicated with the wanted javascript files. The `src/vkviewer-deps.js` is build by running the following command in the `static` folder.

	python lib/closure-library/closure/bin/build/depswriter.py --root_with_prefix="src ../../../../src/" > src/vkviewer-deps.js

The prefix is therefor associated with the **base.js** file from the google closure library.

## Building the javascript library with the closure compiler

The closure compiler supports basically three different compilation modes `(WHITESPACE/SIMPLE/ADVANCED)`. The advanced mode does a drastically reducing of the code size by a aggressive renaming policy and deleting of unused code. Right now the code is not tested in advanced mode so only a `SIMPLE` Optimization is possible. In the future also the use of the `ADVANCED` mode is planned. 

### Simple compilation
	python lib/closure-library/closure/bin/build/closurebuilder.py --root=lib/closure-library/ --root=src/ --namespace="vk2.utils.AppLoader" --output_mode=compiled --compiler_jar=lib/closure-library/closure/bin/compiler.jar --compiler_flags="--generate_exports" --compiler_flags="--externs" --compiler_flags="lib/ol.js" --compiler_flags="--externs" --compiler_flags="lib/jquery.min.js" --compiler_flags="--externs" --compiler_flags="lib/jquery-ui-1.10.4.custom.min.js" --compiler_flags="--language_in" --compiler_flags="ECMASCRIPT5" --compiler_flags="--debug" --compiler_flags="false" > build/vkviewer-simple.js

### Advanced compilation with exports, externs, property map (with closure/jquery/jqueryui for debugging)

Right now the advance mode is not used. For this further work has been done. It is planned to test the usage of plovr for that task. 

	python lib/closure-library/closure/bin/build/closurebuilder.py --root=lib/closure-library/ --root=src/ --namespace="vk2.utils.AppLoader" --output_mode=compiled --compiler_jar=lib/closure-library/closure/bin/compiler.jar --compiler_flags="--compilation_level=ADVANCED_OPTIMIZATIONS" --compiler_flags="--generate_exports" --compiler_flags="--externs" --compiler_flags="lib/ol-whitespace.js" --compiler_flags="--externs" --compiler_flags="lib/jquery.min.js" --compiler_flags="--externs" --compiler_flags="lib/jquery-ui-1.10.4.custom.min.js" --compiler_flags="--create_name_map_files" --compiler_flags="--debug" --compiler_flags="--formatting=PRETTY_PRINT" --compiler_flags="--warning_level=VERBOSE" --compiler_flags="--language_in" --compiler_flags="ECMASCRIPT5" > build/vkviewer-min.js

## Building a minimize CSS files

For bulding a minimize css files the command line tool cat and the closure-stylesheets.jar is used. As first all css files are moved into a single file. After that they are minimize through using the closure-stylesheets.jar. In the future this task should be also integrated into a manually build script.

	cat css/vk2/vkviewer.css css/vk2/override-ol3.css css/vk2/override-jquery.css css/vk2/override-bootstrap.css css/vk2/template/template_pages.css css/vk2/template/main_page.css css/vk2/template/header.css css/vk2/template/georeference.css css/vk2/template/profile_map.css css/vk2/template/footer.css css/vk2/template/login_screen.css css/vk2/module/mapsearch.css css/vk2/module/spatialtemporalsearch.css css/vk2/module/layermanagement.css css/vk2/tool/gazetteersearch.css css/vk2/tool/timeslider.css css/vk2/tool/opacityslider.css css/vk2/utils/modal.css > build/styles-all.css

	java -jar lib/closure-library/closure-stylesheets.jar build/styles-all.css > ./styles-min.css

## Building a minimize JS files with Plovr

When using plovr the vkviewer-min.json in the vkviewer/static/build folder is used. It contains the configuration options for the build process. For more information see http://code.google.com/p/plovr/

	java -jar build/plovr-81ed862.jar build build/vkviewer-simple.json

After building the minimified javascript / css version make sure your mako files are definied correctly. Then you can build a deployment version with the build_deploy.py in the deploy directory

