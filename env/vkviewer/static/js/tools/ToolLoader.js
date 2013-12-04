VK2.Tools.ToolLoader = {
		
		/**
		 * Function: initializeTabSlider
		 * 
		 * @param key - {String} Key/id of the element
		 * @param panel - {String} id of panel/div DOM element
		 * @param handle - {String} id and class of the handle/a DOM element
		 * @param controller - {Module} 
		 * @return {Boolean}
		 */
		initializeTabSlider: function(key, panel, handle, controller){
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
		},
		
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
		getTool_LayerManagement: function(key, options, map, eventFtLayer, controller){	
			// init the sidebarpanel for the layermanagement
			VK2.Tools.ToolLoader.initializeTabSlider(key, options.container, options.handle, controller);
			
			// init the layerbar 
			var options = {
					map: map,
					div: document.getElementById(options.container),
					id: 'layerbar_1',
					vk2featurelayer: eventFtLayer
			}
			return new VK2.Tools.LayerManagement(options);
		},
		
		/**
		 * Function: getTool_LayerSearch
		 * 
		 * @param key - {String} Key/id of the element
		 * @param options - {Object} Object which contains a value for the key 'container' and 'handle'
		 * @þaram map - {OpenLayers.Map}
		 * @param controller - {Module} 
		 * @return {VK2LayerSearch}
		 */
		getTool_LayerSearch: function(key, options, map, controller){	
			// init the sidebarpanel for the layersearch
			VK2.Tools.ToolLoader.initializeTabSlider(key, options.container, options.handle, controller);
			
			// init the layersearch and register it at the mainMap object
			return new VK2.Tools.LayerSearch(document.getElementById(options.container),map,
					initConfiguration.timeParameter,controller)
		},
}