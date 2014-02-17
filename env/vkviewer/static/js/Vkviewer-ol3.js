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
	 var scriptName = "Vkviewer-ol3.js";
	 
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
    		"utils/Settings.js",
    		"utils/Utils.js",
    		"ol3/events/EventType.js",
    		"ol3/events/ParsedCswRecordEvent.js",
    		"ol3/controls/LayerSpy.js",
    		"ol3/controls/RotateNorth.js",
    		"ol3/tools/Georeferencer.js",
    		"ol3/tools/ReportError.js",
    		"ol3/tools/MesstischblattViewer.js",
    		"ol3/tools/MetadataVisualizer.js",
    		"ol3/requests/Georeferencer.js",
    		"ol3/requests/CSW_GetRecordById.js"
    );
    
    var len = jsfiles.length;
    var allScriptTags = new Array(len);
    var host = getScriptLocation();  
    for (var i=0; i<len; i++) {
    	allScriptTags[i] = "<script src='" + host + jsfiles[i] +"'></script>"; 
    }
    document.write(allScriptTags.join(""));
})();






