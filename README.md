vk2-project
===========

Installation
============

1.1) Setup the virtual environment

   - At first set up the virtualenvironment 
	virtualenv --no-site-packages env
   - Install pyramid into the virtualenv
	~/path/to/env/bin/easy_install pyramid
   - Next install different librarys for the virtualenv
	~/path/to/env/bin/easy_install pyramid pyramid_mako SQLAlchemy psycopg2 WebHelpers pyramid_tm waitress Babel lingua
   - Add side packages to the virtual environment
        ln -s /usr/lib/python2.7/dist-packages/gdal* ~/path/to/env/lib/python2.7/site-packages/
	ln -s /usr/lib/python2.7/dist-packages/MapScript-6.0.1.egg-info ~/path/to/env/lib/python2.7/site-packages/
	ln -s /usr/lib/python2.7/dist-packages/GDAL-1.9.0.egg-info ~/path/to/env/lib/python2.7/site-packages/
	ln -s /usr/lib/python2.7/dist-packages/mapscript.py* ~/path/to/env/lib/python2.7/site-packages/
	ln -s /usr/lib/python2.7/dist-packages/_mapscript.so ~/path/to/env/lib/python2.7/site-packages/

1.2) Install vkviewer pyramid project
	cd ~/path/to/env/bin/python setup.py develop (or production)

1.3) Install Internationalization of pyramid project
	cd ~/path/to/env/bin/python setup.py extract_messages
	cd ~/path/to/env/bin/python setup.py update_catalog
	cd ~/path/to/env/bin/python setup.py compile_catalog

1.4) Run application
	cd ~/path/to/env/bin/pserve development.ini --reload

TODO
====

- New Design of Login. Orientation on the SLUB Login with pure Login in the FancyJQuery Style
- New OpenClose of the Layerbar and LayerSearch
     
Have a look
===========

http://codebomber.com/jquery/slidepanel/#credits
http://www.jqeasy.com/jquery-slide-panel-plugin/demo/

TIPS
====

PYRAMID_RELOAD_TEMPLATES=1 bin/pserve development.ini --reload 
