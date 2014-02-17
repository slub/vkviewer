goog.provide('VK2.Tools.MesstischblattViewer');

goog.require('goog.object');
goog.require('goog.dom');

/**
 * @param {string} map_container_id
 * @param {object} mtb_prop Should contain zoomify url, width and height
 * @constructor
 */
VK2.Tools.MesstischblattViewer = function(map_container_id, mtb_prop){
		
	/**
	 * @type {Object}
	 * @private
	 */
	this._mtbProps = {
		'width': 0,
		'height': 0,
		'zoomify_url': '',
		'extent': [1409871.625,6603406.5,1428422.75,6621075],
		'projection': 'EPSG:900913',
		'crossOrigin': 'anonymous',
		'full_screen': true,
		'zoomToMaxExtent': true,
		'layerSpy': true,
		'time': '',
		'minResolution': 0,
		'opacity_slider': 'opacity-slider',
		'maxResolution': 76.43702827453613
	}; 
	goog.object.extend(this._mtbProps, mtb_prop);
	
	/**
	 * @type {ol.layer.Vector}
	 * @private
	 */
	this._borderLayer = this._createBorderLayer(this._mtbProps.extent)


	
	/**
	 * @type {ol.layer.Tile}
	 * @private
	 */
	this._baseLayer = new ol.layer.Tile({
		source: new ol.source.OSM(),
        minResolution: this._mtbProps.minResolution,
        maxResolution: this._mtbProps.maxResolution
	});
	
	/**
	 * @type {ol.source.TileWMS}
	 * @private
	 */
	this._mtbLayer = new ol.layer.Tile({
			source: new ol.source.TileWMS({
				url: 'http://194.95.145.43/mapcache',
				params: {
					'LAYERS':'messtischblaetter',
					'TIME':this._mtbProps.time,
					'VERSION': '1.1.1'
				}, 
				projection: this._mtbProps.projection,
				extent: this._mtbProps.extent
			}),
	        maxResolution: this._mtbProps.maxResolution
	});
	
	/**
	 * @type {ol.Map}
	 * @private
	 */
	this._map = new ol.Map({
	  layers: [ this._baseLayer,this._mtbLayer, this._borderLayer ],
	  interactions: ol.interaction.defaults().extend([
	      new ol.interaction.DragRotateAndZoom()
	  ]),
	  renderer: 'canvas',
	  target: map_container_id,
	  view: new ol.View2D({
		projection: this._mtbProps.projection,
        minResolution: this._mtbProps.minResolution*2,
        maxResolution: this._mtbProps.maxResolution/2,
        extent: this._mtbProps.extent
	  }),
	  controls: [
	      new ol.control.Attribution(),
	      new ol.control.Zoom(),
	      new ol3.control.RotateNorth()
	  ]
	});
	
	this._map.getView().fitExtent(this._mtbProps.extent, this._map.getSize())
	
	this._loadControls();
};

/**
 * @private
 */
VK2.Tools.MesstischblattViewer.prototype._loadControls = function(){
	
	// adds a display in fullscreen button to the map
	if (this._mtbProps.full_screen){
		this._map.addControl(new ol.control.FullScreen());
	};
	
	// adds a zoomToMaxExtent button to the map
	if (this._mtbProps.zoomToMaxExtent){
		this._map.addControl(new ol.control.ZoomToExtent({
				extent: this._mtbProps.extent
		}));
	}
	
	
	if (this._mtbProps.layerSpy){
		this._map.addControl(
			new ol3.control.LayerSpy({
				'spyLayer':new ol.layer.Tile({
					attribution: undefined,
					source: new ol.source.OSM(),
			        minResolution: this._mtbProps.minResolution,
			        maxResolution: this._mtbProps.maxResolution
				})
			})	 
		)
	};
		
	if (this._mtbProps.opacity_slider && goog.isDef(goog.dom.getElement(this._mtbProps.opacity_slider))){
		var opacitySliderEl = goog.dom.getElement(this._mtbProps.opacity_slider);
		var this_ = this;
		var opacitySlider = $(opacitySliderEl).slider({
	        min: 0,
	        max: 100,
	        value: 100,
	        animate: 'slow',
	        orientation: 'horizontal',
	        step: 1,
	        // the next three events are managing the tooltip
	        start: function(event, ui){
	        	$(this.parentElement).find('.tooltip').fadeIn('fast');
	        },
	        slide: function(event, ui){
	        	var tooltip = $(this.parentElement).find('.tooltip');
				tooltip.find('.tooltip-inner').html('Transparency '+ui.value);
				this_._mtbLayer.setOpacity(ui.value/100);
	        },
	        stop: function(event, ui){
	        	$(this.parentElement).find('.tooltip').fadeOut('fast');
	        }
	    });
	}

} 

/**
 * @private
 * @param {array} boundingbox
 * @return {ol.layer.Vector}
 */
VK2.Tools.MesstischblattViewer.prototype._createBorderLayer = function(boundingbox){
	var styleArray = [new ol.style.Style({
		  stroke: new ol.style.Stroke({
		    color: '#000000',
		    width: 3
		  })
	})];
	
	var source = new ol.source.Vector({
		'features':[
		    new ol.Feature(new ol.geom.Polygon([[
		         [boundingbox[0],boundingbox[1]],
		         [boundingbox[0],boundingbox[3]],
		         [boundingbox[2],boundingbox[3]],
		         [boundingbox[2],boundingbox[1]]
		    ]]))
		 ]
	});

	return new ol.layer.Vector({
	  source: source,
	  styleFunction: function(feature, resolution) {
	    return styleArray;
	  }
	});
}

/**
 * @public
 * @debug
 * @return {ol.Map}
 */
VK2.Tools.MesstischblattViewer.prototype.getMap = function(){
	return this._map;
}

