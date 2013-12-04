/**
 * Function:  initVkViewer
 * This method is first called by the application and loads the tools and html content.
 * 
 * @param mapContainer - {String} DOM id of the div which should serve as a map container.
 * @return {Boolean}
 */
var initVkViewer = function(mapContainer){
	
    // init the mainMap object
	VK2.Utils.setGenericOpenLayersPropertys("vkviewer/proxy/?url=");
    var map = VK2.Utils.loadBaseMap(mapContainer,initConfiguration.mapOptions);
    
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
	
	// links footer
	VK2.Utils.initializeFancyboxForClass('vk2FooterLinks');
	
	// welcome page
	if (document.getElementById("vk2WelcomePage")){
		$("#vk2WelcomePage").fancybox({
			'type': 'iframe'
		}).click();
	}
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
		var layersearch = VK2.Tools.ToolLoader.getTool_LayerSearch('vk2layersearch', toolOptions['vk2layersearch'], 
				map, MapController);

	
	// try to initialize a layerbar
	if (checkIfToolContainerIsInit(toolOptions['vk2layermanagement']['container']))
		var layermanagement = VK2.Tools.ToolLoader.getTool_LayerManagement('vk2layermanagement', toolOptions['vk2layermanagement'], 
				map, VK2.Controller.TimeFeatureControls, MapController);
	
	// add Gazetteer
	if (checkIfToolContainerIsInit(toolOptions['vk2gazetteer']['container']))
		VK2.Tools.addGazetteer(toolOptions['vk2gazetteer']['container'], map);
	
	// add Georeferencer
	if (checkIfToolContainerIsInit(toolOptions['vk2georeferencer']['container']))
		VK2.Utils.Georef.addChooseGeoreferencerMtb(document.getElementById('vk2GeorefHandle'),map)
	
	// initialize MapController
	MapController.initialize(map,{
		'vk2layermanagement': layermanagement,
		'vk2layersearch': layersearch,
		'vk2timefeaturecontrols': VK2.Controller.TimeFeatureControls

	})
}

