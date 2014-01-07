## javascript files
java -jar compiler.jar --js Initialize.Configuration.js utils/Namespace.js utils/Utils.js utils/Class.js utils/Filter.js utils/Validation.js utils/Georef.js utils/AppLoader.js utils/Login.js  styles/FeatureLayerStyles.js controller/Mediator.js controller/MapController.js controller/TimeFeatureControls.js controller/SidebarController.js controller/GeoreferenceController.js layer/GeoreferencerSearchLayer.js layer/TimeFeatureLayer.js layer/Vk2Layer.js tools/Gazetteersearch.js tools/GeoreferencerChooser.js tools/Georeferencer.js tools/Layersearch.js tools/Layerbar.js tools/Sidebar.js tools/LoadingScreen.js Initialize.js --language_in=ECMASCRIPT5 --js_output_file vkviewer.min.js

## css files
java -jar ../js/compiler.jar --js styles.css vk2/override-ol.css vk2/override-jquery.css vk2/override-bootstrap.css vk2/tools/Header.css vk2/tools/Layerbar.css vk2/tools/Layersearch.css vk2/tools/Gazetteersearch.css vk2/tools/Georeferencer.css vk2/tools/Sidebar.css --language_in=ECMASCRIPT5 --js_output_file vkviewer.min.css

## minizime js all
