## This folder contains custom builds of the used public javascript librarys. Till now there was no success building a custom build for extJs-3.4.1. So this is still the biggest library. Also OpenLayers is handled seperated
## because of initiale loading behavior for css styles
## 

## javascript files
java -jar compiler.jar --js jquery.min.js jquery-ui-1.10.4.custom.js jquery.fancybox.min.js GeoExt.custom.js bootstrap.min.js proj4js.js --language_in=ECMASCRIPT5 --js_output_file vkviewer-libarys.min.js

## after that manually copy ext-all and ext-base content into the libarys file at the beginn.

## TODO: Write python script for this task
cat jquery.min.js jquery-ui-1.10.4.custom.js jquery.fancybox.min.js jquery.tablesorter.min.js bootstrap.min.js proj4js.js > vkviewer-libarys.min.js
