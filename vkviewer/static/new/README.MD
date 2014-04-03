# Commands for closure tools

#
# depswriter
#
python ../lib/closure-library/closure/bin/build/depswriter.py --root_with_prefix="src ../../../../new/src/" > deps.js

#
# closurebuilder
#

# Simple compilation
python ../lib/closure-library/closure/bin/build/closurebuilder.py --root=../lib/closure-library/ --root=src/ --namespace="VK2.Utils.AppLoader" --output_mode=compiled --compiler_jar=../lib/closure-library/closure/bin/compiler.jar --compiler_flags="--generate_exports" --compiler_flags="--externs" --compiler_flags="../lib/ol.js" --compiler_flags="--externs" --compiler_flags="../lib/jquery.min.js" --compiler_flags="--externs" --compiler_flags="../lib/jquery-ui-1.10.4.custom.min.js" > src/vkviewer-compiled.js

# Advanced compilation
python ../lib/closure-library/closure/bin/build/closurebuilder.py --root=../lib/closure-library/ --root=src/ --namespace="VK2.Utils.AppLoader" --output_mode=compiled --compiler_jar=../lib/closure-library/closure/bin/compiler.jar --compiler_flags="--compilation_level=ADVANCED_OPTIMIZATIONS" > src/vkviewer-compiled.min.js

# Advanced compilation with exports
python ../lib/closure-library/closure/bin/build/closurebuilder.py --root=../lib/closure-library/ --root=src/ --namespace="VK2.Utils.AppLoader" --output_mode=compiled --compiler_jar=../lib/closure-library/closure/bin/compiler.jar --compiler_flags="--compilation_level=ADVANCED_OPTIMIZATIONS" --compiler_flags="--generate_exports" > src/vkviewer-compiled.min.js

# Advanced compilation with exports, externs
python ../lib/closure-library/closure/bin/build/closurebuilder.py --root=../lib/closure-library/ --root=src/ --namespace="VK2.Utils.AppLoader" --output_mode=compiled --compiler_jar=../lib/closure-library/closure/bin/compiler.jar --compiler_flags="--compilation_level=ADVANCED_OPTIMIZATIONS" --compiler_flags="--generate_exports" --compiler_flags="--externs" --compiler_flags="../lib/ol.js" > src/vkviewer-compiled.min.js

python ../lib/closure-library/closure/bin/build/closurebuilder.py --root=../lib/closure-library/ --root=src/ --namespace="VK2.Utils.AppLoader" --output_mode=compiled --compiler_jar=../lib/closure-library/closure/bin/compiler.jar --compiler_flags="--compilation_level=ADVANCED_OPTIMIZATIONS" --compiler_flags="--generate_exports" --compiler_flags="--externs" --compiler_flags="../lib/ol-whitespace.js" --compiler_flags="--externs" --compiler_flags="../lib/jquery.min.js" --compiler_flags="--externs" --compiler_flags="../lib/jquery-ui-1.10.4.custom.min.js" --compiler_flags="--create_name_map_files" > src/vkviewer-compiled.min.js

# Advanced compilation with exports, externs, property map
python ../lib/closure-library/closure/bin/build/closurebuilder.py --root=../lib/closure-library/ --root=src/ --namespace="VK2.Utils.AppLoader" --output_mode=compiled --compiler_jar=../lib/closure-library/closure/bin/compiler.jar --compiler_flags="--compilation_level=ADVANCED_OPTIMIZATIONS" --compiler_flags="--generate_exports" --compiler_flags="--externs" --compiler_flags="../lib/ol-whitespace.js" --compiler_flags="--create_name_map_files" --compiler_flags="--warning_level VERBOSE" > src/vkviewer-compiled.min.js

# Advanced compilation with exports, externs, property map (with closure/jquery/jqueryui
python ../lib/closure-library/closure/bin/build/closurebuilder.py --root=../lib/closure-library/ --root=src/ --namespace="VK2.Utils.AppLoader" --output_mode=compiled --compiler_jar=../lib/closure-library/closure/bin/compiler.jar --compiler_flags="--compilation_level=ADVANCED_OPTIMIZATIONS" --compiler_flags="--generate_exports" --compiler_flags="--externs" --compiler_flags="../lib/ol.js" --compiler_flags="--externs" --compiler_flags="../lib/jquery.min.js" --compiler_flags="--externs" --compiler_flags="../lib/jquery-ui-1.10.4.custom.min.js" --compiler_flags="--create_name_map_files" > src/vkviewer-compiled.min.js

# Advanced compilation with exports, externs, property map (with closure/jquery/jqueryui for debugging
python ../lib/closure-library/closure/bin/build/closurebuilder.py --root=../lib/closure-library/ --root=src/ --namespace="VK2.Utils.AppLoader" --output_mode=compiled --compiler_jar=../lib/closure-library/closure/bin/compiler.jar --compiler_flags="--compilation_level=ADVANCED_OPTIMIZATIONS" --compiler_flags="--generate_exports" --compiler_flags="--externs" --compiler_flags="../lib/ol-whitespace.js" --compiler_flags="--externs" --compiler_flags="../lib/jquery.min.js" --compiler_flags="--externs" --compiler_flags="../lib/jquery-ui-1.10.4.custom.min.js" --compiler_flags="--create_name_map_files" --compiler_flags="--debug" --compiler_flags="--formatting=PRETTY_PRINT" --compiler_flags="--warning_level=VERBOSE" > src/vkviewer-compiled.min.js

