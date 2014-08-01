# Deployment instructions for the portal application

This document describe the workflow for building a portal application and install it on a server. 

## Build the client 

The client build system is based on the closure compiler tools and the plovr build tool, which encapsulate the closure compiler. The plovr tool uses among others the `vkviewer/static/build/exports.js` (describes the api/interface of the builded version) and the `vkviewer/static/build/vkviewer-simple.json`. Right now the build javascript version makes only use of the renaming of variables, the removing of debug statements and comments as well as the removing of whitespaces (simple optimization). For further reducing of the code size the project should be use the advanced_compilation mode, but for this further work is needed.

### `styles-min.css`

For bulding a minimize css files the command line tools `cat` and the `closure-stylesheets.jar` are used. As first all css files are moved into a single file (`vkviewer/static/build/styles-all.css`). After that the single file is minimize through using the `closure-stylesheets.jar`. In the future this task should be also integrated into a manually build script (all commands are run via command line with the directory `vkviewer/static` as root).

	cat css/vk2/vkviewer.css css/vk2/override-ol3.css css/vk2/override-jquery.css css/vk2/override-bootstrap.css css/vk2/template/template_pages.css css/vk2/template/main_page.css css/vk2/template/header.css css/vk2/template/georeference.css css/vk2/template/profile_map.css css/vk2/template/footer.css css/vk2/template/login_screen.css css/vk2/module/mapsearch.css css/vk2/module/spatialtemporalsearch.css css/vk2/module/layermanagement.css css/vk2/tool/gazetteersearch.css css/vk2/tool/timeslider.css css/vk2/tool/opacityslider.css css/vk2/utils/modal.css > build/styles-all.css

	java -jar lib/closure-library/closure-stylesheets.jar build/styles-all.css > ./styles-min.css

Right now there exist a problem with closure-stylesheets.jar because it shuffles the order of the css styles, which leads to wrong display. Because of this it is right now better to use the styles-all.css.

### `vkviewer-min.js`

When using plovr the vkviewer-min.json in the vkviewer/static/build folder is used. It contains the configuration options for the build process. For more information see [plovr configuration parameter](http://code.google.com/p/plovr/)

	java -jar build/plovr-81ed862.jar build build/vkviewer-simple.json

### Update `basic_page.mako`

All delivered HTML files inherits their basic structure from the `vkviewer/static/templates/basic_page.mako`. This structure makes it easy to manage the script and css files for all pages at a single point. For building the client for production remove the script and link tags under the `for development` comment and uncomment the script and link tags under the `for production` comment.

### Strip away unnecessary files

	vkviewer/settings.py.template
	vkviewer/python/test
	vkviewer/static/build
	vkviewer/static/lib/debug
	vkviewer/static/lib/closure-library
	vkviewer/static/test

## Deploy the client on the server

As first remove old backup files and create a backup from the actual installation

	rm -r vkviewer.backup
	cp -r vkviewer vkviewer.backup

Then remove old files

	rm -r vkviewer
	rm -r vkviewer.egg-info/
	rm -r lib/python2.7/site-packages/vkviewer-0.0-py2.7.egg/
	rm -r build/lib.linux-x86_64-2.7/vkviewer/

Copy new version in the directory

	cp ~/vkviewer ./

Update settings.py to server setup

	vim vkviewer/settings.py  
or
	cp -f vkviewer.backup/settings.py vkviewer/

Update production.ini for correct server configuration

 	vim production.ini

Build application

	bin/python setup.py install

Restart server
	
