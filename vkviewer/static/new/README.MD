# Commands for closure tools

#
# depswriter
#
python ../lib/closure-library/closure/bin/build/depswriter.py --root_with_prefix="src ../../../../new/src/" > deps.js

#
# closurebuilder
#

# Simple compilation
python ../lib/closure-library/closure/bin/build/closurebuilder.py --root=../lib/closure-library/ --root=src/ --namespace="VK2.Utils.AppLoader" --output_mode=compiled --compiler_jar=../lib/closure-library/closure/bin/compiler.jar > src/vkviewer-compiled.js

# Advanced compilation
python ../lib/closure-library/closure/bin/build/closurebuilder.py --root=../lib/closure-library/ --root=src/ --namespace="VK2.Utils.AppLoader" --output_mode=compiled --compiler_jar=../lib/closure-library/closure/bin/compiler.jar --compiler_flags="--compilation_level=ADVANCED_OPTIMIZATIONS" > src/vkviewer-compiled.min.js

# Advanced compilation with exports
python ../lib/closure-library/closure/bin/build/closurebuilder.py --root=../lib/closure-library/ --root=src/ --namespace="VK2.Utils.AppLoader" --output_mode=compiled --compiler_jar=../lib/closure-library/closure/bin/compiler.jar --compiler_flags="--compilation_level=ADVANCED_OPTIMIZATIONS" --compiler_flags="--generate_exports" > src/vkviewer-compiled.min.js

# Advanced compilation with exports, externs
python ../lib/closure-library/closure/bin/build/closurebuilder.py --root=../lib/closure-library/ --root=src/ --namespace="VK2.Utils.AppLoader" --output_mode=compiled --compiler_jar=../lib/closure-library/closure/bin/compiler.jar --compiler_flags="--compilation_level=ADVANCED_OPTIMIZATIONS" --compiler_flags="--generate_exports" --compiler_flags="--externs" --compiler_flags="../lib/ol.js" > src/vkviewer-compiled.min.js

# Advanced compilation with exports, externs, property map
python ../lib/closure-library/closure/bin/build/closurebuilder.py --root=../lib/closure-library/ --root=src/ --namespace="VK2.Utils.AppLoader" --output_mode=compiled --compiler_jar=../lib/closure-library/closure/bin/compiler.jar --compiler_flags="--compilation_level=ADVANCED_OPTIMIZATIONS" --compiler_flags="--generate_exports" --compiler_flags="--externs" --compiler_flags="../lib/ol.js" --compiler_flags="--property_map_output_file" > src/vkviewer-compiled.min.js
