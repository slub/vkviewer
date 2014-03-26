goog.provide('VK2.Tools.ZoomifyViewer');

goog.require('goog.dom');
goog.require('goog.dom.xml');
goog.require('goog.events');
goog.require('goog.net.XhrIo');

/**
 * @constructor
 * @param {string} map_div
 * @param {string} zoomify_url
 * @param {number} zoomify_width
 * @param {number} zoomify_height
 */
VK2.Tools.ZoomifyViewer = function(map_div, zoomify_url, zoomify_width, zoomify_height){
	
	/**
	 * @type {Element}
	 * @private
	 */
	this._parentElement = goog.dom.getElement(map_div);
	
	/**
	 * @type {string}
	 * @private
	 */
	this._mapContainer = map_div;
	
	/**
	 * @type {string}
	 * @private 
	 */
	this._zoomifyServerPath = zoomify_url

	this._loadZoomifyMap(zoomify_url, zoomify_width, zoomify_height);
};



/**
 * @param {string} zoomify_url
 * @param {number} width
 * @param {number} height
 * @private
 */
VK2.Tools.ZoomifyViewer.prototype._loadZoomifyMap = function(zoomify_url, width, height){
	
	var imgCenter = [width / 2, - height / 2];
	var extent = [0, 0, width, height];

	if (goog.isDef(this._zoomifyLayer) && goog.isDef(this._map)){
		this._map.removeLayer(this._zoomifyLayer);
		this._zoomifyLayer = new ol.layer.Tile({
	    	source: new ol.source.Zoomify({
				  url: zoomify_url,
				  size: [width, height]
			})
	    });
		this._map.addLayer(this._zoomifyLayer);
	} else {
	
		// Maps always need a projection, but Zoomify layers are not geo-referenced, and
		// are only measured in pixels.  So, we create a fake projection that the map
		// can use to properly display the layer.
		var proj = new ol.proj.Projection({
			code: 'ZOOMIFY',
			units: 'pixels',
			extent: extent
		});
	
		/**
		 * @type {ol.layer.Tile}
		 * @private
		 */
		this._zoomifyLayer = new ol.layer.Tile({
	    	source: new ol.source.Zoomify({
				  url: zoomify_url,
				  size: [width, height]
			})
	    });
		
		/**
		 * @type {ol.Map}
		 * @private
		 */
		this._map = new ol.Map({
			layers: [ this._zoomifyLayer ],
			interactions: ol.interaction.defaults().extend([
		        new ol.interaction.DragZoom()
			]),
			controls: [
			    new ol.control.FullScreen(),
			    new ol.control.Zoom()
			],
			renderer: 'canvas',
			target: this._mapContainer,
			view: new ol.View2D({
			   	projection: proj,
			   	center: imgCenter,
			    //adjust initial and max zoom level here
				zoom: 1,
				maxZoom: 9
			})
		});
	}
}

/**
 * @deprecated
 * @param {string} zoomifyUrl
 * @private
 */
VK2.Tools.ZoomifyViewer.prototype._loadZoomifyLayer = function(zoomifyUrl){
	
	// build url
	var url = '/vkviewer/proxy/?url='+ zoomifyUrl + '/ImageProperties.xml'
	
	// create request object
	var xhr = new goog.net.XhrIo();
	
	// add listener to request object
	goog.events.listenOnce(xhr, 'success', function(e){
		var xhr = /** @type {goog.net.XhrIo} */ (e.target);
		var xml = xhr.getResponseXml().childNodes[0];
		this._loadZoomifyMap(zoomifyUrl + '/', xml.getAttribute('WIDTH'), xml.getAttribute('HEIGHT'))
		xhr.dispose();
		
	}, false, this);
	
	goog.events.listenOnce(xhr, 'error', function(e){
		var xhr = /** @type {goog.net.XhrIo} */ (e.target);
		if (goog.isDef(error_callback))
			error_callback(e);
	}, false, this);
	
	// send request
	xhr.send(url);	
};

/**
 * @public
 * @return {ol.Map}
 */
VK2.Tools.ZoomifyViewer.prototype.getMap = function(){
	return this._map;
}