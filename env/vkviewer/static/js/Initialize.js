/**
 * Function:  initVkViewer
 * This method is first called by the application and loads the tools and html content.
 * 
 * @param mapContainer - {String} DOM id of the div which should serve as a map container.
 * @return {Boolean}
 */
var initVkViewerSlim = function(mapContainer){
	
    // init the mainMap object
	VK2.Utils.setGenericOpenLayersPropertys("vkviewer/proxy/?url=");
    var map = VK2.Utils.loadBaseMap(mapContainer,initConfiguration.mapOptions, initConfiguration.mapnikOptions);
    
    // add different behaviour like events to the map
    addEvents();
    
    // add different tools to the mainMap (layersearch/layerbar/gazetteerSearch/sidebar)
    var appLoader = new VK2.Utils.AppLoader({
    	map: map,
    	mapController: VK2.Controller.MapController,
    	timeParameter: initConfiguration.timeParameter
    });
    appLoader.loadSlimApp();
    
    return true;
};

var initVkViewerFat = function(mapContainer){
	
    // init the mainMap object
	VK2.Utils.setGenericOpenLayersPropertys("vkviewer/proxy/?url=");
    var map = VK2.Utils.loadBaseMap(mapContainer,initConfiguration.mapOptions, initConfiguration.mapnikOptions);
    
    // add different behaviour like events to the map
    addEvents();
    
    // add different tools to the mainMap (layersearch/layerbar/gazetteerSearch/sidebar)
    var appLoader = new VK2.Utils.AppLoader({
    	map: map,
    	mapController: VK2.Controller.MapController,
    	timeParameter: initConfiguration.timeParameter
    });
    appLoader.loadFatApp();
    
    return true;
};

/**
 * Function: addEvents
 * Add events to the main map
 */
var addEvents = function(){
	
	// add login event
	if (document.getElementById("vk2UserToolsLogin")){
		$("#vk2UserToolsLogin").fancybox({
			'width': '350px',
			'height': '100%',
			'type': 'iframe'
		});
	}
	
	// links footer
	VK2.Utils.initializeFancyboxForClass('vk2FooterLinks');
	
	// welcome page
	if (document.getElementById("vk2WelcomePage")){
		$("#vk2WelcomePage").fancybox({
			'type': 'iframe'
		}).click();
	}
};

