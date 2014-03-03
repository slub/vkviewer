Code based on OpenLayers 2.13
=============================

# Deprecated, from now on please use the build skript. 

#
# only dependency
#
../lib/closure-library/closure/bin/calcdeps.py -i Initialize.Configuration.js -i utils/Namespace.js -i utils/Utils.js -i utils/Class.js -i utils/Filter.js -i utils/Validation.js -i utils/AppLoader.js -i utils/Login.js -i utils/Settings.js -i styles/FeatureLayerStyles.js -i controller/Mediator.js -i controller/MapController.js -i controller/TimeFeatureControls.js -i controller/SidebarController.js -i controller/MapSearchController.js -i layer/GeoreferencerSearchLayer.js -i layer/TimeFeatureLayer.js -i layer/Vk2Layer.js -i layer/MapSearchLayer.js -i layer/HoverLayer.js -i tools/Gazetteersearch.js -i tools/GeoreferencerChooser.js -i tools/Layerbar.js -i tools/Sidebar.js -i tools/MapSearch.js -i tools/SearchTable.js -i tools/SpatialSearch.js -p ../lib/closure-library -p ./ -o deps > Vkviewer-deps.js

#
# compiled
#
../lib/closure-library/closure/bin/calcdeps.py -i Initialize.Configuration.js -i utils/Namespace.js -i utils/Utils.js -i utils/Class.js -i utils/Filter.js -i utils/Validation.js -i utils/AppLoader.js -i utils/Login.js -i utils/Settings.js -i styles/FeatureLayerStyles.js -i controller/Mediator.js -i controller/MapController.js -i controller/TimeFeatureControls.js -i controller/SidebarController.js -i controller/MapSearchController.js -i layer/GeoreferencerSearchLayer.js -i layer/TimeFeatureLayer.js -i layer/Vk2Layer.js -i layer/MapSearchLayer.js -i layer/HoverLayer.js -i tools/Gazetteersearch.js -i tools/GeoreferencerChooser.js -i tools/Layerbar.js -i tools/Sidebar.js -i tools/MapSearch.js -i tools/SearchTable.js -i tools/SpatialSearch.js -p ../lib/closure-library -p ./ -o compiled -c compiler.jar -f --compilation_level=SIMPLE_OPTIMIZATIONS -f --language_in=ECMASCRIPT5 > Vkviewer.min.js

## minizime js based on ol3
../lib/closure-library/closure/bin/calcdeps.py -i utils/Settings.js -i utils/Utils.js -i ol3/controls/LayerSpy.js -i ol3/controls/RotateNorth.js -i ol3/events/EventType.js -i ol3/events/ParsedCswRecordEvent.js -i ol3/requests/CSW_GetRecordById.js -i ol3/requests/Georeferencer.js -i ol3/tools/Georeferencer.js -i ol3/tools/ReportError.js -i ol3/tools/MetadataVisualizer.js -i ol3/tools/MesstischblattViewer.js -p ../lib/closure-library -p ./ -o compiled -c compiler.jar -f --compilation_level=SIMPLE_OPTIMIZATIONS -f --language_in=ECMASCRIPT5 > Vkviewer-ol3.min.js





