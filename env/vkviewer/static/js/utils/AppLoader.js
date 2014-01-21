VK2.Utils.AppLoader = VK2.Class({

	_settings: {
		vk2LayersearchPanel: 'vk2LayersearchPanel',
		vk2LayersearchControl: 'vk2LayersearchControl',
		vk2LayerbarPanel: 'vk2LayerbarPanel', 
		vk2LayerbarControl: 'vk2LayerbarControl',
		vk2Gazetteer: 'vk2GazetteerSearchInput',
		vk2GeorefChooser: 'vk2GeorefPanel',
		vk2GeorefChooserControl: 'vk2GeorefControl',
		vk2Sidebar: 'vk2SBPanel',
		map: null,
		mapController: null,
		timeParameter: initConfiguration.timeParameter,
		georeference_grid: initConfiguration.georeference_grid,
		slimToolPanels: ['vk2LayersearchPanel', 'vk2LayerbarPanel']
	},
	
	_sidebar: null,
	
	/**
	 * Function: checkIfToolContainerIsInit
	 * Checks if the DOM container for tool is initialize
	 * 
	 * @param containerId - {String} id of DOM element which serve as a container
	 * @return {Boolean}
	 */
	_checkIfToolContainerIsInit: function(containerId){
		if (document.getElementById(containerId)){
			return true;
		} else {
			return false;
		}
	},
	
	_initializeMapController: function(layersearch, layermanagement){
		VK2.Controller.MapController.initialize(this._settings.map,{
			'vk2layermanagement': layermanagement,
			'vk2layersearch': layersearch,
			'vk2timefeaturecontrols': VK2.Controller.TimeFeatureControls
		})		
	},
	
	_loadToolGazeetter: function(){
		if (this._checkIfToolContainerIsInit(this._settings.vk2Gazetteer))
			VK2.Tools.addGazetteer(this._settings.vk2Gazetteer, this._settings.map)
	},
	
	_loadToolGeoreferencerChooser: function(){
		var georeferencerChooser = new VK2.Tools.GeoreferencerChooser({
			wmsLayer: this._settings.georeference_grid.wms,
			requestWfs:  this._settings.georeference_grid.wfs,
			map: this._settings.map
		});
		this._sidebar.appendSlimControl(this._settings.vk2GeorefChooserControl, georeferencerChooser);		
		
		// check if the georeference is active
		var urlParams = VK2.Utils.getAllUrlParams();
		if ('georef' in urlParams){
			if (urlParams['georef'] == 'on')
				$('#'+this._settings.vk2GeorefChooserControl).click();
		}		
	},
	
	_loadToolLayerbar: function(){
		var options = {
				map: this._settings.map,
				div: document.getElementById(this._settings.vk2LayerbarPanel),
				id: 'layerbar_1',
				vk2featurelayer: VK2.Controller.TimeFeatureControls
		};
		var layerbar = new VK2.Tools.Layerbar(options);
		this._sidebar.appendControl(this._settings.vk2LayerbarControl, 
				this._settings.vk2LayerbarPanel, layerbar);
		return layerbar;
	},
	
	_loadToolLayersearch: function(){
		//var layersearch = new VK2.Tools.Layersearch(document.getElementById(this._settings.vk2LayersearchPanel),
		//		this._settings.map, this._settings.timeParameter, this._settings.mapController)
		var layersearch = new VK2.Tools.SpatialSearch(document.getElementById(this._settings.vk2LayersearchPanel), 
				this._settings.map, this._settings.mapController);
		this._sidebar.appendControl(this._settings.vk2LayersearchControl, 
				this._settings.vk2LayersearchPanel, layersearch);	
		return layersearch;
	},
	
	_loadToolSidebar: function(toolPanels){
		if (this._checkIfToolContainerIsInit(this._settings.vk2Sidebar))
			this._sidebar = new VK2.Tools.Sidebar({}, this._settings.mapController, toolPanels);			
	},
	
	_updateSettings: function(settings){
		for (var key in settings){
			this._settings[key] = settings[key];
		}		
	},
	
	initialize: function(settings){
		this._updateSettings(settings);	
	},
	
	loadFatApp: function(){
		this.loadSlimApp();
		this._loadToolGeoreferencerChooser();
	},
	
	loadSlimApp: function(){
		this._loadToolGazeetter();
		this._loadToolSidebar(this._settings.slimToolPanels);
		var layersearch = this._loadToolLayersearch();
		var layerbar = this._loadToolLayerbar();
		this._initializeMapController(layersearch, layerbar);
	}
});
