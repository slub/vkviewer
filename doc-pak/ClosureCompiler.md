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

	cat css/vk2/vkviewer.css css/vk2/override-ol3.css css/vk2/override-jquery.css css/vk2/override-bootstrap.css css/vk2/template/template_pages.css css/vk2/template/welcome.css css/vk2/template/main_page.css css/vk2/template/header.css css/vk2/template/georeference.css css/vk2/template/profile_map.css css/vk2/template/footer.css css/vk2/template/login_screen.css css/vk2/module/mapsearch.css css/vk2/module/spatialtemporalsearch.css css/vk2/module/layermanagement.css css/vk2/tool/gazetteersearch.css css/vk2/tool/timeslider.css css/vk2/tool/opacityslider.css css/vk2/utils/modal.css > build/styles-all.css

	java -jar lib/closure-library/closure-stylesheets.jar build/styles-all.css > ./styles-min.css

## Building a minimize JS files with Plovr

When using plovr the vkviewer-min.json in the vkviewer/static/build folder is used. It contains the configuration options for the build process. For more information see http://code.google.com/p/plovr/

	java -jar build/plovr-81ed862.jar build build/vkviewer-simple.json

	java -jar build/plovr-81ed862.jar build --create_source_map ./vkviewer-min.map.js build/vkviewer-advanced-debug.json


After building the minimified javascript / css version make sure your mako files are definied correctly. Then you can build a deployment version with the build_deploy.py in the deploy directory

