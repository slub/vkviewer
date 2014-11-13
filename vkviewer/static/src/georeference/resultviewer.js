goog.provide('vk2.georeference.ResultViewer');

//goog.require('ol.source.OSM');
//goog.require('ol.layer.Tile');
//goog.require('ol.Map');
//goog.require('ol.control.Attribution');
//goog.require('ol.control.FullScreen');
//goog.require('ol.control.Zoom');
//goog.require('ol.View2D');
//goog.require('ol.interaction.DragZoom');
goog.require('vk2.utils');
goog.require('vk2.layer.Messtischblatt');
goog.require('vk2.control.LayerSpy');
goog.require('vk2.tool.OpacitySlider');

/**
 * @param {string} map_container
 * @param {Object=} opt_result_settings
 * @constructor
 */
vk2.georeference.ResultViewer = function(map_container, opt_result_settings){
	
	/**
	 * @type {Object}
	 * @private
	 */
	this._settings = goog.isDef(opt_result_settings) ? opt_result_settings : {
		'extent': [640161.933,5958026.134,3585834.8011505,7847377.4901306]
	};
	
	/**
	 * @type {ol.layer.Tile}
	 * @private
	 */
	this._baseLayer = new ol.layer.Tile({
		'source': new ol.source.OSM()
	});
	
	/**
	 * @type {ol.control.ZoomToExtent}
	 * @private
	 */
	this._controlZoomToExtent = new ol.control.ZoomToExtent({
			'extent': this._settings['extent']
	});
	
	/**
	 * @type {ol.Map}
	 * @private
	 */
	this._map = new ol.Map({
		  'layers': [ this._baseLayer ],
		  'interactions': ol.interaction.defaults().extend([
		      new ol.interaction.DragZoom()
		  ]),
		  'renderer': 'canvas',
		  'target': map_container,
		  'view': new ol.View({
			  	'projection': 'EPSG:900913',
			    'center': [0, 0],
			    'zoom': 2
		  }),
		  'controls': [
		       new ol.control.FullScreen(),
		       new ol.control.Zoom(),
		       new ol.control.Attribution(),
			   new vk2.control.LayerSpy({
					'spyLayer':new ol.layer.Tile({
						'attribution': undefined,
						'source': new ol.source.OSM()
					})
			   }),
		  ]
	});
	
	// zoom to map extent
	if (this._settings.hasOwnProperty('extent'))
		this._map.getView().fitExtent(this._settings['extent'], this._map['getSize']());
	
	// add zoom to extent control
	this._map.addControl(this._controlZoomToExtent);
};

/**
 * @param {string} wms_url Url to the web mapping service which publish the validation file
 * @param {string} layer_id
 * @param {Array.<number>} clip_extent
 */
vk2.georeference.ResultViewer.prototype.displayValidationMap = function(wms_url, layer_id, clip_extent){
	
	// remove old layer
	if (goog.isDef(this._validationLayer))
		this._map.removeLayer(this._validationLayer);
	
	// reset control zoomToExtent
	this._map.removeControl(this._controlZoomToExtent);
	this._controlZoomToExtent = new ol.control.ZoomToExtent({
			extent: clip_extent
	});
	this._map.addControl(this._controlZoomToExtent);
	
	/**
	 * @type {ol.layer.Tile}
	 * @private
	 */
	this._validationLayer = vk2.layer.Messtischblatt({
		'wms_url':wms_url, 
		'layerid':layer_id,
		'border':vk2.utils.getPolygonFromExtent(clip_extent),
		'extent':clip_extent
	}, this._map);
	
	this._map.addLayer(this._validationLayer); 
	
	// zoom to extent by parsing getcapabilites request from wms
	this._map.getView().fitExtent(clip_extent, this._map['getSize']());
	
	// remove old opactiy slider and add new one
	if (goog.dom.getElement('opacity-slider-container')){
		var opacitySliderEl = goog.dom.getElement('opacity-slider-container');
		opacitySliderEl.innerHTML = '';
		var opacitySlider = new vk2.tool.OpacitySlider(goog.dom.getElement('opacity-slider-container'), this._validationLayer, 'vertical')
	};	
};

/**
 * @returns {ol.Map}
 */
vk2.georeference.ResultViewer.prototype.getMap = function(){
	return this._map;
};