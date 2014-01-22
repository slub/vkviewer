/* 
 * Load Vkviewer Files:
 * 
 * The code in this file is based on code taken from OpenLayers.
 *
 * Copyright (c) 2006-2007 MetaCarta, Inc., published under the Clear BSD
 * license.  See http://svn.openlayers.org/trunk/openlayers/license.txt for the
 * full text of the license.
 */
 (function() {

	 /**
	   * The relative path of this script.
	   */
	 var scriptName = "Vkviewer.js";
	 
	 /**
     * Function returning the path of this script.
     */
    var getScriptLocation = function() {

        var scriptLocation = "";
        // If we load other scripts right before GeoExt using the same
        // mechanism to add script resources dynamically (e.g. OpenLayers), 
        // document.getElementsByTagName will not find the GeoExt script tag
        // in FF2. Using document.documentElement.getElementsByTagName instead
        // works around this issue.
        var scripts = document.documentElement.getElementsByTagName('script');
        for(var i=0, len=scripts.length; i<len; i++) {
            var src = scripts[i].getAttribute('src');
            if(src) {
                var index = src.lastIndexOf(scriptName); 
                // set path length for src up to a query string
                var pathLength = src.lastIndexOf('?');
                if(pathLength < 0) {
                    pathLength = src.length;
                }
                // is it found, at the end of the URL?
                if((index > -1) && (index + scriptName.length == pathLength)) {
                    scriptLocation = src.slice(0, pathLength - scriptName.length);
                    break;
                }
            }
        }
        return scriptLocation;
    };

    var jsfiles = new Array(
    		"Initialize.Configuration.js",
    		"utils/Namespace.js",
    		"utils/Utils.js",
    		"utils/Class.js",
    		"utils/Filter.js",
    		"utils/Validation.js",
    		"utils/Georef.js",
    		"utils/AppLoader.js",
    		"styles/FeatureLayerStyles.js",
    		"controller/Mediator.js",
    		"controller/MapController.js",
    		"controller/TimeFeatureControls.js",
    		"controller/SidebarController.js",
    		"controller/MapSearchController.js",
    		"controller/GeoreferenceController.js",
    		"layer/GeoreferencerSearchLayer.js",
    		"layer/TimeFeatureLayer.js",
    		"layer/Vk2Layer.js",
    		"layer/TimeSearchLayer.js",
    		"layer/HoverLayer.js",
    		"tools/Gazetteersearch.js",
    		"tools/GeoreferencerChooser.js",
    		"tools/Georeferencer.js",
    		"tools/MapSearch.js",
    		"tools/SearchTable.js",
    		"tools/SpatialSearch.js",
    		"tools/Layerbar.js",
    		"tools/Sidebar.js",
    		"tools/ReportError.js",
    		"Initialize.js"
    );
    
    var len = jsfiles.length;
    var allScriptTags = new Array(len);
    var host = getScriptLocation();  
    for (var i=0; i<len; i++) {
    	allScriptTags[i] = "<script src='" + host + jsfiles[i] +"'></script>"; 
    }
    document.write(allScriptTags.join(""));
})();






