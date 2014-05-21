goog.provide('vk2.georeference.ResultViewer');

goog.require('ol.source.OSM');
goog.require('ol.layer.Tile');
goog.require('ol.Map');
goog.require('ol.control.Attribution');
goog.require('ol.control.FullScreen');
goog.require('ol.control.Zoom');
goog.require('ol.View2D');
goog.require('ol.interaction.DragZoom');

/**
 * @param {string} map_container
 * @param {Object} result_settings
 * @constructor
 */
vk2.georeference.ResultViewer = function(map_container, result_settings){
	
	/**
	 * @type {Object}
	 * @private
	 */
	this._settings = goog.isDef(result_settings) ? result_settings : {
		'extent': [640161.933,5958026.134,3585834.8011505,7847377.4901306]
	};
	
	/**
	 * @type {ol.layer.Tile}
	 * @private
	 */
	this._baseLayer = new ol.layer.Tile({
		source: new ol.source.OSM()
	});
	
	/**
	 * @type {ol.Map}
	 * @private
	 */
	this._map = new ol.Map({
		  layers: [ this._baseLayer ],
		  interactions: ol.interaction.defaults().extend([
		      new ol.interaction.DragZoom()
		  ]),
		  renderer: 'canvas',
		  target: map_container,
		  view: new ol.View2D({
			  	projection: 'EPSG:900913',
			    center: [0, 0],
			    zoom: 2
		  }),
		  controls: [
		       new ol.control.FullScreen(),
		       new ol.control.Zoom(),
		       new ol.control.Attribution()  
		  ]
	});
	
	if (this._settings.hasOwnProperty('extent'))
		this._map.getView().fitExtent(this._settings['extent'], this._map.getSize());
};

/**
 * @returns {ol.Map}
 */
vk2.georeference.ResultViewer.prototype.getMap = function(){
	return this._map;
};