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
		       new ol.control.Attribution(),
		       new ol.control.ZoomToExtent({
		   			extent: result_settings['extent']
		   	   })
		  ]
	});
	
	if (this._settings.hasOwnProperty('extent'))
		this._map.getView().fitExtent(this._settings['extent'], this._map.getSize());

};

/**
 * @param {string} wms_url Url to the web mapping service which publish the validation file
 * @param {string} layer_id
 * @param {Array.<number>} clip_extent
 */
vk2.georeference.ResultViewer.prototype.displayValidationMap = function(wms_url, layer_id, clip_extent){
	
	// remove old layer
	if (goog.isDef(this._validationLayer)){
		this._map.removeLayer(this._validationLayer); 
	};
	
	/**
	 * @type {ol.source.TileWMS}
	 * @private
	 */
	this._validationLayer = new ol.layer.Tile({
			source: new ol.source.TileWMS({
				url: wms_url,
				params: {
					'LAYERS':layer_id,
					'VERSION': '1.1.1'
				},
				projection: 'EPSG:900913'
			})
	});

	this._map.addLayer(this._validationLayer); 
	
	// zoom to extent by parsing getcapabilites request from wms
	this._map.getView().fitExtent(clip_extent, this._map.getSize());
	
	//map.addControl(new VK2.Control.ClipControl(VK2.Utils.getPolygonFromExtent(clip_polygon),validation_layer));

	// load layerspy tool for validation map
//	map.addControl(
//		new VK2.Control.LayerSpy({
//			'spyLayer':new ol.layer.Tile({
//				source: new ol.source.OSM(),
//			}),
//			'radius': 50
//		})
//	);
};

/**
 * @returns {ol.Map}
 */
vk2.georeference.ResultViewer.prototype.getMap = function(){
	return this._map;
};