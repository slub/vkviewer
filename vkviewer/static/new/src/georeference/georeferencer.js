goog.provide('vk2.georeference.Georeferencer');

goog.require('goog.dom');
goog.require('vk2.georeference.ToolBox');
goog.require('vk2.georeference.ZoomifyViewer');
goog.require('vk2.georeference.ResultViewer');
goog.require('vk2.georeference.MesstischblattGcp');

/**
 * @param {Object} settings
 * @constructor
 */
vk2.georeference.Georeferencer = function(settings){
	
	/**
	 * @type {Object}
	 * @private
	 */
	this._settings = settings;
	
	// load unreferenced layer 
	if (this._settings.hasOwnProperty('zoomify') && this._settings.hasOwnProperty('unreferenced_map'))
		this._zoomifyViewer = new vk2.georeference.ZoomifyViewer(this._settings['unreferenced_map'], this._settings['zoomify']);
	
	// load validation map
	if (this._settings.hasOwnProperty('referenced_map') && this._settings.hasOwnProperty('result'))
		this._resultViewer = new vk2.georeference.ResultViewer(this._settings['referenced_map'], this._settings['result']);
	
	if (goog.isDef(this._zoomifyViewer) && goog.isDef(this._resultViewer)){
		this._toolbox = new vk2.georeference.ToolBox(this._settings['unreferenced_map'], this._zoomifyViewer.getMap(), 
				this._resultViewer.getMap());
		this._loadMtbSpecificBehavior(this._toolbox.getFeatureSource(), this._resultViewer.getMap());
	};
};

/**
 * @param {ol.source.Vector} featureSource
 * @param {ol.Map} map
 * @private
 */
vk2.georeference.Georeferencer.prototype._loadMtbSpecificBehavior = function(featureSource, map){
	// parse gcps
	var gcpElements = goog.dom.getElementsByClass('hidden-gcps');
	var parsedGcps = [];
	for (var i = 0; i < gcpElements.length; i++){
		parsedGcps.push(JSON.parse(gcpElements[i].value));
	};
	
	// handling special case that only coordinates are delivered
	if (parsedGcps.length > 0 && parsedGcps[0]['pixel'] === ""){
		var coords = [];
		for (var i = 0; i < parsedGcps.length; i++){
			var parsed_coord = parsedGcps[i]['coords'].split(',');
			coords.push([parseFloat(parsed_coord[0]),parseFloat(parsed_coord[1])])
		};
		
		// append validationlayer
		var drawSource = new ol.source.Vector()
		map.addLayer(new ol.layer.Vector({
			  'source': drawSource,
			  'style': function(feature, resolution) {
				  return [vk2.utils.Styles.GEOREFERENCE_POINT];
			  }
		}));
		
		/**
		 * @type {vk2.georeference.MesstischblattGcp}
		 * @private
		 */
		this._messtischblattGcps = new vk2.georeference.MesstischblattGcp(featureSource, drawSource, coords);
	};
};
