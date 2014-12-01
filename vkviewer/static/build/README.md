Build instruction for Javascript files
======================================

This folders contains the configuration and extern files for building a ol-vkviewer.js version and a compressed file based on the google closure compiler advanced mode of the vkviewer-min.js.

## Build a ol3 version

First fetch the actual GitHub repository from ol3. Than go in the root folder of the directory. There you should ran the following command:

	node tasks/build.js ~/path/to/your/vkviewer/static/build/ol-vkviewer.json ~/path/to/your/vkviewer/static/lib/ol-vkviewer.js

If you run this command the first time, maybe you have to do `npm install` first for fetching the necessary ol3 dependencies via nodejs package management. See also <a href="https://github.com/openlayers/ol3/tree/master/tasks">here</a>.

## Build a vkviewer-min.js version

For building a minimize version of the vkviewer javascript code, the project uses the closure compiler together with the plovr tool. Plovr allows to store the compiler settings in a configuration file. Also the `extern` folder contains the necessary extern files for using the compiler in advanced mode.

To build a version of vkviewer-min.js run the following command from the `static` folder.

	java -jar build/plovr-81ed862.jar build build/vkviewer-advanced.json

or 

	java -jar build/plovr-81ed862.jar build --create_source_map ./vkviewer-min.map.js build/vkviewer-advanced-debug.json

Further information about plovr and the closure compiler could be found here <a href="http://plovr.com/options.html">[1]</a>, <a href="https://developers.google.com/closure/compiler/docs/api-tutorial3">[2]</a>, <a href="https://developers.google.com/closure/compiler/docs/js-for-compiler">[3]</a> or <a href="https://code.google.com/p/closure-compiler/wiki/Warnings">[4]</a>. 
