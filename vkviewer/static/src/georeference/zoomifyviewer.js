goog.provide('vk2.georeference.ZoomifyViewer');

//goog.require('ol.proj.Projection');
//goog.require('ol.source.Zoomify');
//goog.require('ol.layer.Tile');
//goog.require('ol.Map');
//goog.require('ol.control.FullScreen');
//goog.require('ol.control.Zoom');
//goog.require('ol.View2D');
//goog.require('ol.interaction.DragZoom');


/**
 * @param {string} map_container
 * @param {Object} zoomify_settings
 * @constructor
 */
vk2.georeference.ZoomifyViewer = function(map_container, zoomify_settings){
	
		/**
		 * @type {number}
		 * @private
		 */
		this._height = zoomify_settings['height'];
		
		/**
		 * @type {number}
		 * @private
		 */
		this._width = zoomify_settings['width'];
		
		var imgCenter = [zoomify_settings['width'] / 2, - zoomify_settings['height'] / 2];
		var extent = [0, 0, zoomify_settings['width'], zoomify_settings['height']];
		
		// Maps always need a projection, but Zoomify layers are not geo-referenced, and
		// are only measured in pixels.  So, we create a fake projection that the map
		// can use to properly display the layer.
		var proj = new ol.proj.Projection({
			code: 'ZOOMIFY',
			units: 'pixels',
			extent: extent
		});
		
		/**
		 * @type {ol.source.Zoomify}
		 * @private
		 */
		this._zoomifySource = new ol.source.Zoomify({
			  url: zoomify_settings['url'],
			  size: [zoomify_settings['width'], zoomify_settings['height']]
		});
		
		/**
		 * @type {ol.Map}
		 * @private
		 */
		this._map = new ol.Map({
			layers: [
			    new ol.layer.Tile({
			    	source: this._zoomifySource
			    })
			],
			interactions: ol.interaction.defaults().extend([
	            new ol.interaction.DragZoom()
	        ]),
	        controls: [
		   	    new ol.control.FullScreen(),
			    new ol.control.Zoom()
		    ],
		    renderer: 'canvas',
		    target: map_container,
		    view: new ol.View2D({
			    projection: proj,
			    center: imgCenter,
			    //adjust initial and max zoom level here
				zoom: 2,
				maxZoom: 9
		    })
		});
		
		// add zoom to extent control
		this._map.addControl(new ol.control.ZoomToExtent({
			extent: this._map.getView().getView2D().calculateExtent(this._map.getSize())
		}));
};

/**
 * @returns {ol.Map}
 */
vk2.georeference.ZoomifyViewer.prototype.getMap = function(){
	return this._map;
};

/**
 * @returns {ol.source.Zoomify}
 */
vk2.georeference.ZoomifyViewer.prototype.getZoomifySource = function(){
	return this._zoomifySource;
};

/**
 * @returns {number}
 */
vk2.georeference.ZoomifyViewer.prototype.getHeight = function(){
	return parseInt(this._height);
};

/**
 * @returns {number}
 */
vk2.georeference.ZoomifyViewer.prototype.getWidth = function(){
	return parseInt(this._width);
};