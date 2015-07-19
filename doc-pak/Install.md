# Install instruction for the vkviewer application

Actual the vkviewer project contains two parts. On part is the portal application. The portal application is mainly based on the <a href="http://www.pylonsproject.org/">python pyramid webframework </a> and uses a <a href="http://www.postgresql.org/">PostgreSQL / PostGIS</a> database as database backend. The portal application contains `python` and `javascript` code for searching, displaying and georeferencing historic plane survey sheets. Next to the portal application the georeference directory contains a georeferencedaemon. This daemon has it own setting files and could be run on a seperate system. It main task is to update the different data backends of the spatial data infrastructure. Especially to push changes on the georeference data to the services.

## Installation of the vkviewer portal application (debian)

### Package Dependencies

	* postgresql-9.1 (>9.1) / postgis (1.5)
	* libgdal1  (1.9) / libgdal1-dev / python-gdal 
	* python-mapscript
	* python-dev
	* cgi-mapserver
	* imagemagick

### Creating of python virtual environment

For creating the virtual envrionment the tool `virtualenv` (could be install through python-virtualenv) is used. Frist we create the virtual environment.

	virtualenv --no-site-packages python_env

Than we install pyramid together with the needed python libraries.

	./python_env/bin/easy_install pyramid pyramid_mako SQLAlchemy==0.8.3 psycopg2 WebHelpers pyramid_tm waitress Babel lingua PIL requests lockfile python-daemon

If you get an error-message when starting the application like: from zope.sqlalchemy import ZopeTransactionExtension ImportError: No module named sqlalchemy
You have to install the following library:

	./python_env/bin/pip install zope.sqlalchemy

After that we manually add the gdal and mapscript bindings from the system wide installation.

    ln -s /usr/lib/python2.7/dist-packages/gdal* ./python_env/lib/python2.7/site-packages/ 
	ln -s /usr/lib/python2.7/dist-packages/MapScript-6.0.1.egg-info ./python_env/lib/python2.7/site-packages/ 
	ln -s /usr/lib/python2.7/dist-packages/GDAL-1.9.0.egg-info ./python_env/lib/python2.7/site-packages/
	ln -s /usr/lib/python2.7/dist-packages/mapscript.py* ./python_env/lib/python2.7/site-packages/ 
	ln -s /usr/lib/python2.7/dist-packages/_mapscript.so ./python_env/lib/python2.7/site-packages/ 
	ln -s /usr/lib/python2.7/dist-packages/osgeo/ ./python_env/lib/python2.7/site-packages/ 

`Make sure you have added a projection entry for the epsg:900913 to your local proj library. In case of debian add the following entry to /usr/share/proj/epsg`

	<900913> +proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +wktext +over no_defs

### Installation of the application 

First you have to clone the application from GitHub.

	§ git clone https://github.com/slub/vkviewer.git

The vkviewer application right now hosts two main parts. One part is the pure web application. The other is a directory of scripts for updating the data backend. Both parts are griping some configuration parameter from the `vkviewer/settings.py`. So before running the application this file has to be configured properbly. 

Open the `vkviewer/settings.py.template` and save it as `settings.py`.
Edit the parameters DBCONFIG and DBCONFIG_PARAMS (replace user, password, host, port and vkdb with your own database configuration).

The Parameter `sql.alchemy` in `development.ini.template` has to be configured like the parameter `DBCONFIG` and saved as `development.ini`.

Before the application or the scripts could be used the application has to be install, so further dependencies could be download and installed. 

	./python_env/bin/python setup.py install (for production)
	./python_env/bin/python setup.py develop (for development)

### Running the application

To run the application from the terminal:

	./python_env/bin/pserve development.ini

### Database setup

The following instructions describe how to set up a database on PostgreSQL. There are a number of front-end tools available for connecting to, and working with, the PostgreSQL database. Among the most popular are `psql`, a command-line tool for querying the database, and the free and open source graphical tool `pgAdmin`.

The default superuser for Postgresql is called postgres. At first you need to create an admin-login:

	sudo -u postgres psql
	\password postgres
	Insert your password: ******
	To quit the environment: \q 

Create a database-user and database with the following commands or with the graphical user interface "pgAdmin3":

	sudo -u postgres createuser -P -d username
	sudo -u postgres createdb -0 username dbname

Connecting to the PostgreSQL database with pgAdmin3:
To access your database using pgAdmin3, you have to add a new server connection manually with pgAdmin3. `Click File ‣ Add Server` and complete the New Server Registation dialog box to register a new server. Ensure the Host is set to `localhost` and Port is `5432` (unless you have configured PostgreSQL for a different port).

	Name: Postgresql-9.1
	Host: localhost
	Port: 5432	
	Username: username
	Passwort: ******

### Database Dump

A text-file generated by `pg_dump`, `pg_dumpall` or any other tools that generate compatible back-up-files, are intended to be read in by the `psql` program.
An example-command to restore a dump: `psql -f /path/to/your/dbdump.dump dbname` or in pgAdmin3 with a right-click on your Database and then on `Restore...`.

### Configure the settings for the Upload module

To store the uploaded maps on your server, the absolute paths needs to be adapted (e.g. `UPLOAD_DIR`, `UPLOAD_THUMBS_SMALL_DIR` or `UPLOAD_ZOOMIFY_DIR`).
It is important to ensure the same path names of the parameters `UPLOAD_DIR` and `UPLOAD_ZOOMIFY_DIR`, to run the CreateZoomifyTiles-Script fluently and without errors. 

The parameters `UPLOAD_SERVICE_URL_ZOOMIFY`, `UPLOAD_SERVICE_URL_THUMBS_MID` and `UPLOAD_SERVICE_URL_THUMBS_SMALL` should be adapted to your server configuration and should be made available via a web server (e.g. Apache2). 

Enable CORS (Cross Origin Resource Sharing) for Apache2:

The uploaded maps should be accessible through a `localhost` address from the browser, as they are outside the Apache Server `Document Root`. You keep the original file in the `UPLOAD_DIR` path while still being able to access it through the localhost address in the browser.

If you have not yet installed Apache, this can be done with the terminal command: `apt-get install apache2`
To start the web server: `service apache2 start`

First, run the following to make sure mod_headers is enabled.

	a2enmod headers

A symbolic link is created through terminal with the following command: 

	ln -s path/to/UPLOAD_DIR path/destination/symlink

Next, you need to edit your default site configuration. Assuming `/var/www` is your DocumentRoot for your default virtual host, you should find your default virtual host configuration file (probably `/etc/apache2/sites-enabled/000-default`).

	vim /etc/apache2/sites-enabled/000-default 

To add the CORS authorization to the header using Apache, simply add the following line inside either the <Directory>, <Location>, <Files> or <VirtualHost> sections (e.g. under the tag for the default directory (/var/www)) of your server config: 

	Header set Access-Control-Allow-Origin "*"

Finally reload/restart Apache.

	service apache2 reload


### Install or Update your backend language dictionary

The backend language dictionary is based on **Babel** and **Lingua**. The language files are found in `vkviewer/locale`. To update the dictionary run the following commands.

As first search for new dictionary tokens in your files.

	./python_env/bin/python setup.py extract_messages

Than update your catalog.

	./python_env/bin/python setup.py update_catalog

Now you can update your dictionaries files (**.po**) in the local directory.

	vim vkviewer/locale/de/LC_MESSAGES/vkviewer.po

At the end compile your dictionaries.
	
	./python_env/bin/python setup.py compile_catalog


##' Run vkviewer as a WSGI application over apache.

It is possible to run the vkviewer as WSGI application with the apache server. For this mod_wsgi for apache has to be installed. Also you have to first install your application with `setup.py install`.

As first you have generate a `pyramid.wsgi` file in the root folder of you application (default: vkviewer). This pyramid scripts should look basicly like this.

```
import sys, site, os

site.addsitedir('~/vkviewer/python_env/lib/python2.7/site-packages')

sys.path.append('~/vkviewer/python_env')
os.environ['PYTHON_EGG_CACHE'] = '~/vkviewer/python_env/dist'

from pyramid.paster import get_app, setup_logging
ini_path = '~/vkviewer/production.ini'
setup_logging(ini_path)
application = get_app(ini_path, 'main')
```

Add than to your virtualhost configuration (default is: `/etc/apache2/sites-available/default`) the following lines.

```
# Use only 1 Python sub-interpreter. Multiple sub-interpreters
WSGIApplicationGroup %{GLOBAL}
WSGIPassAuthorization On
WSGIDaemonProcess pyramid user=www-data group=www-data threads=4 \
	python-path=/usr/lib/python2.7/site-packages
WSGIScriptAlias /vkviewer ~/vkviewer/pyramid.wsgi

<Directory ~/vkviewer>
	WSGIProcessGroup pyramid
	Order allow,deny
	Allow from all
</Directory>
```

The `python-path` reference to your python interpreter and the `WSGIScriptAlias` defines your server endpoint and your pyramid.wsgi file. For more information see the [pyramid docs](http://docs.pylonsproject.org/projects/pyramid/en/1.0-branch/tutorials/modwsgi/index.html).

##' Install mail client

For supporting the sending of contact requests by automatic sending a mail to administrator address install and configure the exim4 email client.

	apt-get install exim4
	dpkg-reconfigure exim4-config (configure mail client)
