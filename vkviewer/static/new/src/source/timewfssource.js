goog.provide('VK2.Source.TimeWfs');

goog.require('goog.net.XhrIo');
goog.require('VK2.Request.WFS');

/**
 * @param {Object} settings
 * @constructor
 * @extends {ol.source.ServerVector}
 */
VK2.Source.TimeWfs = function(settings){

	/**
	 * @type {number}
	 * @private
	 */
	this._time = goog.isDef(settings['time']) ? settings['time'] : '';
	
	settings['format'] = goog.isDef(settings['format']) ? settings['format'] : 
		new ol.format.WFS(VK2.Settings.WFS_PARSER_CONFIG);
	
	settings['loader'] = goog.isDef(settings['loader']) ? settings['loader'] :
		function(extent, resolution, projection) {		
			var url = VK2.Settings.PROXY_URL+VK2.Settings.WFS_URL;
			goog.net.XhrIo.send(url, goog.bind(function(e){
				var xhr = /** @type {goog.net.XhrIo} */ (e.target);
		    	var data = xhr.getResponseXml() ? xhr.getResponseXml() : xhr.getResponseText();
		    	xhr.dispose();
		    	this.addFeatures(this.readFeatures(data));
			}, this), "POST", VK2.Request.WFS.getFeatureRequest(extent, this.getTime()), {'Content-Type':'application/xml;charset=UTF-8'});
	};
	
	settings['projection'] = goog.isDef(settings['projection']) ? settings['projection'] : 'EPSG:900913'; 

	goog.base(this, settings);
};
goog.inherits(VK2.Source.TimeWfs, ol.source.ServerVector);

/**
 * @return {number}
 */
VK2.Source.TimeWfs.prototype.getTime = function(){
	return this._time;
};

/**
 * @param {number} time
 */
VK2.Source.TimeWfs.prototype.setTime = function(time){
	this._time = time;
	//this.dispatchChangeEvent();
};