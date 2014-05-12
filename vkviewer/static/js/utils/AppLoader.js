/**
 * @fileoverview This objects is load on page initialization and manages the loading process of the 
 * javascript tools and events
 * @author Jacob.Mendt@slub-dresden.de (Jacob Mendt)
 */

goog.provide('VK2.Utils.AppLoader')

goog.require('goog.dom');
goog.require('goog.net.cookies');

/**
 * @param {Object} settings Contains key/value pairs representing the settings
 * @param {Object} init_conf Initialise configuration object, which holds information over the mapping services, etc.
 * @constructor
 */
VK2.Utils.AppLoader = function(settings, init_conf){
	
	/**
	 * @type {Object}
	 * @private
	 */
	this._settings = {
		vk2LayersearchPanel: 'vk2LayersearchPanel',
		vk2LayersearchControl: 'vk2LayersearchControl',
		vk2LayerbarPanel: 'vk2LayerbarPanel', 
		vk2LayerbarControl: 'vk2LayerbarControl',
		vk2Gazetteer: 'vk2GazetteerSearchInput',
		vk2GeorefChooser: 'vk2GeorefPanel',
		vk2GeorefChooserControl: 'vk2GeorefControl',
		vk2Sidebar: 'vk2SBPanel',
		timeParameter: init_conf.timeParameter,
		georeference_grid: init_conf.georeference_grid,
		map_container: 'mapdiv',
		map: init_conf.mapOptions,
		mapnik: init_conf.mapnikOptions,
		toolPanels: ['vk2LayersearchPanel', 'vk2LayerbarPanel']
	};
	
	/**
	 * @type {Object}
	 * @private
	 */
	this._mapController = VK2.Controller.MapController;
	
	/**
	 * @type {Object}
	 * @private
	 */
	this._map = null;
	
	/**
	 * @type {Object}
	 * @private
	 */
	if (goog.dom.getElement(this._settings.vk2Sidebar)){
		this._sidebar = new VK2.Tools.Sidebar({}, this._settings.toolPanels, this._mapController);
	}
	
	// update settings
	for (var key in settings){
			this._settings[key] = settings[key];
	}
};

/**
 * @private
 */
VK2.Utils.AppLoader.prototype._loadMapController = function(layersearch, layermanagement){
	this._mapController = VK2.Controller.MapController.initialize(this._map,{
		'vk2layermanagement': layermanagement,
		'vk2layersearch': layersearch,
		'vk2timefeaturecontrols': VK2.Controller.TimeFeatureControls
	});	
}
	
/**
 * @private
 */
VK2.Utils.AppLoader.prototype._loadGazeettersearch = function(){
	if (goog.dom.getElement(this._settings.vk2Gazetteer))
		var Gazetteer = new VK2.Tools.Gazetteersearch(document.getElementById(this._settings.vk2Gazetteer), this._map);
};

/**
 * @private
 */
VK2.Utils.AppLoader.prototype._loadGeoreferencerChooser = function(){
	var georeferencerChooser = new VK2.Tools.GeoreferencerChooser({
		wmsLayer: this._settings.georeference_grid.wms,
		requestWfs:  this._settings.georeference_grid.wfs,
		map: this._map
	}, this._layerbar);
	this._sidebar.appendSlimControl(this._settings.vk2GeorefChooserControl, georeferencerChooser);		
		
	// check if the georeference is active
	if (VK2.Utils.getQueryParam('georef') == 'on'){
		goog.dom.getElement(this._settings.vk2GeorefChooserControl).click();
		this._map.setCenter(new OpenLayers.LonLat(1510110.8611321,6808180.3878471),0)
	};		
	
	if (VK2.Utils.getQueryParam('points'))
		VK2.Utils.showAchievedPoints(goog.dom.getElement('georefPointContainer'), VK2.Utils.getQueryParam('points'));;	
};

/**
 * @private
 */
VK2.Utils.AppLoader.prototype._loadLayerbar = function(){
	var options = {
		map: this._map,
		div: goog.dom.getElement(this._settings.vk2LayerbarPanel),
		id: 'layerbar_1',
		vk2featurelayer: VK2.Controller.TimeFeatureControls
	};
	var layerbar = new VK2.Tools.Layerbar(options);
	
	this._sidebar.appendControl(this._settings.vk2LayerbarControl, 
			this._settings.vk2LayerbarPanel, layerbar);
	return layerbar;
};
	
/**
 * @private
 */
VK2.Utils.AppLoader.prototype._loadSpatialSearch = function(){
	var spatialsearch = new VK2.Tools.SpatialSearch(goog.dom.getElement(this._settings.vk2LayersearchPanel), 
			this._map, this._mapController);
	this._sidebar.appendControl(this._settings.vk2LayersearchControl, 
			this._settings.vk2LayersearchPanel, spatialsearch);	
	return spatialsearch;
};

/**
 * @private
 */
VK2.Utils.AppLoader.prototype._loadVK2Tools = function(){
	
	this._loadGazeettersearch();
	
	/**
	 * @type {VK2.Tools.SpatialSearch}
	 * @private
	 */
	this._spatialsearch = this._loadSpatialSearch();
	
	/**
	 * @type {VK2.Tools.Layerbar}
	 * @private
	 */
	this._layerbar = this._loadLayerbar();
	
	this._loadMapController(this._spatialsearch, this._layerbar );
};

/**
 * @return {Object}
 * @private
 */
VK2.Utils.AppLoader.prototype._loadOLMap = function(){
    // init the mainMap object
	VK2.Utils.setGenericOpenLayersPropertys("vkviewer/proxy/?url=");
    this._map = VK2.Utils.loadBaseMap(this._settings.map_container,this._settings.map, this._settings.mapnik);
    return this._map;
};

/**
 * @private
 */
VK2.Utils.AppLoader.prototype._loadEventBehavior = function(){
		
	// links footer
	VK2.Utils.initializeFancyboxForClass('fancybox-open');
	
	// welcome page
	if (goog.dom.getElement("vk2WelcomePage")){
		$("#vk2WelcomePage").fancybox({
			'type': 'iframe',
			'padding' : 0,
			'wrapCSS': 'welcomeBox'
		}).click();
	}
};

/**
 * @private
 */
VK2.Utils.AppLoader.prototype._checkIfCookiesAreEnabble = function(){
	if (goog.net.cookies.isEnabled()){
		console.log('Cookies are enabled');
	} else {
		alert('This page needs cookies for correct behavior. So please activate them in your browser.');
	}
};

/**
 * @public
 */	
VK2.Utils.AppLoader.prototype.loadApplication = function(){
	this._checkIfCookiesAreEnabble();
	this._loadOLMap();
	this._loadEventBehavior();
	this._loadVK2Tools();
};

/**
 * @public
 */
VK2.Utils.AppLoader.prototype.loadApplicationWithGeoref = function(){
	this.loadApplication();
	this._loadGeoreferencerChooser();
};
