(function() {
     var scriptName = "Vkviewer-ol3.debug.js";
     var getScriptLocation = function() {
         var scriptLocation = "";
         var scripts = document.documentElement.getElementsByTagName('script'); 
         for(var i=0, len=scripts.length; i<len; i++) { 
             var src = scripts[i].getAttribute('src'); 
             if(src) { 
                 var index = src.lastIndexOf(scriptName); 
                 var pathLength = src.lastIndexOf('?'); 
                 if(pathLength < 0) {
                     pathLength = src.length;
                 }
                 if((index > -1) && (index + scriptName.length == pathLength)) {
                     scriptLocation = src.slice(0, pathLength - scriptName.length);
                     break;
                 }
             }
         }
         return scriptLocation;
     };
     var jsfiles = new Array("Initialize.Configuration.js","utils/Namespace.js","utils/Utils.js","utils/Class.js","utils/Filter.js","utils/Validation.js","utils/AppLoader.js","utils/Login.js","utils/Settings.js","styles/FeatureLayerStyles.js","controller/Mediator.js","controller/MapController.js","controller/TimeFeatureControls.js","controller/SidebarController.js","controller/MapSearchController.js","layer/GeoreferencerSearchLayer.js","layer/TimeFeatureLayer.js","layer/Vk2Layer.js","layer/MapSearchLayer.js","layer/HoverLayer.js","tools/Gazetteersearch.js","tools/GeoreferencerChooser.js","tools/Layerbar.js","tools/Sidebar.js","tools/MapSearch.js","tools/SearchTable.js","tools/SpatialSearch.js","tools/MinimizeMesstischblattView.js");
     var len = jsfiles.length;
     var allScriptTags = new Array(len);
     var host = getScriptLocation();  
     for (var i=0; i<len; i++) {
         allScriptTags[i] = "<script src='" + host + jsfiles[i] +"'></script>";
     }
     document.write(allScriptTags.join(""));
 })();