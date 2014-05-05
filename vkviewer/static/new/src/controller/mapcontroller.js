goog.provide('VK2.Controller.MapController');

goog.require('goog.object');

/**
 * @param {Object} settings
 * @param {string} map_container
 * @constructor
 * @export
 */
VK2.Controller.MapController = function(settings, map_container){
		
	/**
	 * @type {Object}
	 * @private
	 */
	this._settings = {};
	goog.object.extend(this._settings, settings);
	
	this._loadBaseMap(map_container);
}

/**
 * @param {string} map_container
 * @private
 */
VK2.Controller.MapController.prototype._loadBaseMap = function(map_container){
	
	var styleArray = [new ol.style.Style({
		  stroke: new ol.style.Stroke({
		    color: '#000000',
		    width: 3
		  })
	})];
	
	/**
	 * @type {ol.Map}
	 * @private
	 */
	this._map = new ol.Map({
		layers: [
		   new ol.layer.Tile({
			   //source: new ol.source.OSM()
			   source: new ol.source.BingMaps({
				   key: 'ApU2pc7jDCWIlPogOWrr2FzQTj-1LyxAWKC6uSc26yuYv6gGxnQrXjAoeMmdngG_',
				   imagerySet: 'Road'
			   })
		   })
		],
		renderer: 'canvas',
		target: map_container,
		view: new ol.View2D({
			projection: 'EPSG:900913',
	        minResolution: 1.194328566789627,
	        maxResolution: 2445.9849047851562,
	        extent: [640161.933,5958026.134,3585834.8011505,7847377.4901306],
			center: [1528150, 6630500],
			zoom: 2
		})
	});
	
	this._addFeatureClickBehavior(this._map);
};

/**
 * @param {ol.Map}
 * @private
 */
VK2.Controller.MapController.prototype._addFeatureClickBehavior = function(map){
	map.on('click', function(evt){
		var features = [];
		map.forEachFeatureAtPixel(evt.pixel, function(feature, layer){
			features.push(feature);
		});
		console.log(features);
	});
};

/**
 * @returns {ol.Map}
 * @export
 */
VK2.Controller.MapController.prototype.getMap = function(){
	return this._map;
};