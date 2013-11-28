/**
 * Function: setGenericOpenLayersPropertys
 * 
 * @return {Boolean}
 */
var setGenericOpenLayersPropertys = function(){
    // this is important for trying to reload tiles from wms if he pings out
    OpenLayers.IMAGE_RELOAD_ATTEMPTS = 5;
    // this is the url of the proxy host
    OpenLayers.ProxyHost = VK2.Utils.getHost("vkviewer/proxy/?url=");
}

/**
 * Function:  initVkViewer
 * This method is first called by the application and loads the tools and html content.
 * 
 * @param mapContainer - {String} DOM id of the div which should serve as a map container.
 * @return {Boolean}
 */
var initVkViewer = function(mapContainer){
	
    // init the mainMap object
	setGenericOpenLayersPropertys();
    var map = new initializeBaseMap(mapContainer,initConfiguration.mapOptions);
    
    // add different behaviour like events to the map
    addEvents();
    
    // add different tools to the mainMap (layersearch/layerbar/gazetteerSearch)
    addTools(map);
    
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
	
	$('.vk2FooterLinks').each(function(){
		$(this).fancybox({
			'type': 'iframe'
		});
	})
};

/**
 * Function: addTools
 * Checks if the specific div container is available and if true initialize connect tool. 
 * Important for this function is that a MapController (Module-Pattern) is available. This
 * method use the jquery plugin tabSlider.
 * 
 * @param map - {OpenLayers.Map}
 * @return {Boolean}
 */
var addTools = function(map){
	
	var toolOptions = {
			vk2layersearch: {
				container: 'vk2LayersearchPanel', // in case of tabSlider this is the panel
				handle: 'vk2LayersearchHandle'
			},
			vk2layermanagement: {
				container: 'vk2LayerbarPanel', // in case of tabSlider this is the panel
				handle: 'vk2LayerbarHandle'
			},
			vk2gazetteer: {
				container: 'vk2GazetteerSearchInput'
			},
			vk2georeferencer: {
				container: 'vk2GeorefPanel', // in case of tabSlider this is the panel
				handle: 'vk2GeorefHandle'
			}
	};
	
	/*
	 * Function: checkIfToolContainerIsInit
	 * Checks if the DOM container for tool is initialize
	 * 
	 * @param containerId - {String} id of DOM element which serve as a container
	 * @return {Boolean}
	 */
	var checkIfToolContainerIsInit = function(containerId){
		if (document.getElementById(containerId)){
			return true;
		} else {
			return false;
		}
	}
	
	var layersearch = null;
	var layermanagement = null;
	//var eventFtLayer = new VK2.Layer.EventFeatureLayer();

	// try to initialize a layersearch
	if (checkIfToolContainerIsInit(toolOptions['vk2layersearch']['container']))
		var layersearch = getTool_LayerSearch('vk2layersearch', toolOptions['vk2layersearch'], 
				map, MapController);

	
	// try to initialize a layerbar
	if (checkIfToolContainerIsInit(toolOptions['vk2layermanagement']['container']))
		var layermanagement = getTool_LayerManagement('vk2layermanagement', toolOptions['vk2layermanagement'], 
				map, VK2.Controller.TimeFeatureControls, MapController);
	
	// add Gazetteer
	if (checkIfToolContainerIsInit(toolOptions['vk2gazetteer']['container']))
	    addGazetteer(toolOptions['vk2gazetteer']['container'], map);
	
	// add Georeferencer
	if (checkIfToolContainerIsInit(toolOptions['vk2georeferencer']['container']))
		addGeoreferencer(document.getElementById('vk2GeorefHandle'),map)
	
	// initialize MapController
	MapController.initialize(map,{
		'vk2layermanagement': layermanagement,
		'vk2layersearch': layersearch,
		'vk2timefeaturecontrols': VK2.Controller.TimeFeatureControls

	})
}

/**
 * Function: getTool_LayerSearch
 * 
 * @param key - {String} Key/id of the element
 * @param options - {Object} Object which contains a value for the key 'container' and 'handle'
 * @þaram map - {OpenLayers.Map}
 * @param controller - {Module} 
 * @return {VK2LayerSearch}
 */
var getTool_LayerSearch = function(key, options, map, controller){	
	// init the sidebarpanel for the layersearch
	initializeTabSlider(key, options.container, options.handle, controller);
	
	// init the layersearch and register it at the mainMap object
	return new VK2.Tools.LayerSearch(document.getElementById(options.container),map,
			initConfiguration.timeParameter,controller)
}

/**
 * Function: getTool_LayerManagement
 * 
 * @param key - {String} Key/id of the element
 * @param options - {Object} Object which contains a value for the key 'container' and 'handle'
 * @þaram map - {OpenLayers.Map}
 * @þaram eventFtLayer - {EventFeatureLayer}
 * @param controller - {Module} 
 * @return 
 */
var getTool_LayerManagement = function(key, options, map, eventFtLayer, controller){	
	// init the sidebarpanel for the layermanagement
	initializeTabSlider(key, options.container, options.handle, controller);
	
	// init the layerbar 
	var options = {
			map: map,
			div: document.getElementById(options.container),
			id: 'layerbar_1',
			vk2featurelayer: eventFtLayer
	}
	return new VK2.Tools.LayerManagement(options);
}

/**
 * Function: initializeTabSlider
 * 
 * @param key - {String} Key/id of the element
 * @param panel - {String} id of panel/div DOM element
 * @param handle - {String} id and class of the handle/a DOM element
 * @param controller - {Module} 
 * @return {Boolean}
 */
var initializeTabSlider = function(key, panel, handle, controller){
	$('#'+panel).tabSlideOut({
	    tabHandle: '.'+handle,  
	    pathToTabImage: $('#'+handle).attr('data-open'),       
	    pathToTabImageClose: $('#'+handle).attr('data-close'),
	    imageHeight: '40px',                               
	    imageWidth: '40px',     
	    tabLocation: 'right', 
	    speed: 300,           
	    action: 'click',     
	    topPos: '50px',      
	    fixedPosition: false,
	    activateCallback: controller.activateVk2Tool,
	    deactivateCallback: controller.deactivateVk2Tool,
	    toolKey: key
	});	
	
	return true;
}

/**
 * Function: initializeBaseMap
 * This functions initialize the main OpenLayers.Map object and adds some base layer to it!
 *
 * @param mapContainer {DOMElement}
 * @param mapConfiguration {Object} OpenLayers.Map.Configuration
 * @return {OpenLayers.Map}
 */
var initializeBaseMap = function(mapContainer, mapConfiguration){
         // init the map object 
         var map = new OpenLayers.Map(mapContainer, mapConfiguration);
        
         // loads the base layers
		 //openstreetmap mapnik
         var mapnik = new OpenLayers.Layer.OSM("Mapnik");

//       var mapnik = new OpenLayers.Layer.XYZ("Mapnik",
//    		   ["http://a.tile.openstreetmap.org/${z}/${x}/${y}.png",
//    		    "http://b.tile.openstreetmap.org/${z}/${x}/${y}.png",
//    		    "http://c.tile.openstreetmap.org/${z}/${x}/${y}.png"],
//    		    {
//		    	 resolutions: [1222.9924523925781,611.4962261962891,305.74811309814453,152.87405654907226,76.43702827453613,
//		                   38.218514137268066,19.109257068634033,9.554628534317017,4.777314267158508,2.388657133579254,1.194328566789627
//		         ],
////    	   		 zoomOfSet: 10,
//		    	 serverResolutions : [156543.03390625,78271.516953125,39135.7584765625,19567.87923828125,9783.939619140625,
//		    	                   2445.9849047851562,1222.9924523925781,611.4962261962891,305.74811309814453,152.87405654907226,76.43702827453613,
//		    	                   38.218514137268066,19.109257068634033,9.554628534317017,4.777314267158508,2.388657133579254,1.194328566789627,
//		    	                   ,0.5971642833948135
//		    	 ]
//    		    }
//       );
		    
		 // add the base layers to the map
		 map.addLayers([mapnik]); 
		         
         // zoom to startExtent 
         map.zoomToExtent(mapConfiguration.startExtent);
		 //map.setCenter(new OpenLayers.LonLat(-9208448.7478114,13344939.50767), 2);
         return map;
         
}