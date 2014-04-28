goog.provide('VK2.Layer.MapSearch');

goog.require('goog.net.XhrIo');
goog.require('goog.events');
goog.require('VK2.Settings');
goog.require('VK2.Utils.Styles');

/**
 * @param {Object} settings
 * @constructor
 * @extends {ol.layer.Vector}
 */
VK2.Layer.MapSearch = function(settings){

	// create vector source
	var vectorSource = new ol.source.ServerVector({
		format: new ol.format.WFS(VK2.Settings.WFS_PARSER_CONFIG),
		loader: function(extent, resolution, projection) {
			if (goog.DEBUG)
				console.log('Loader is called');
			
			var url = VK2.Settings.PROXY_URL+VK2.Settings.WFS_URL+'?SERVICE=WFS&' +
		    	'VERSION=1.1.0&REQUEST=getfeature&TYPENAME=Historische_Messtischblaetter_WFS&MAXFEATURES=10000&srsname='+settings.projection+'&' +
		    	'bbox=' + extent.join(',');
		    
		    var xhr = new goog.net.XhrIo();
		    
		    goog.events.listenOnce(xhr, 'success', function(e){
		    	var xhr = /** @type {goog.net.XhrIo} */ (e.target);
		    	var data = xhr.getResponseXml() ? xhr.getResponseXml() : xhr.getResponseText();
		    	xhr.dispose();
		    	this.addFeatures(this.readFeatures(data));
		    }, false, this);

		    xhr.send(url);
		},
		projection: settings.projection
	});
	
	// define time array
	var start = goog.isDef(settings.start_time) ? settings.start_time : 1868;
	var end = goog.isDef(settings.end_time) ? settings.end_time : 1945;
	/**
	 * @enum {number}
	 * @private
	 */
	this._timeArr = {
			START: start,
			END: end
	};
	
	// append/overwrite style function of settings
	settings.style = goog.bind(function(feature, resolution){
		if (feature.get('time') >= this._timeArr.START && feature.get('time') <= this._timeArr.END){
			return [VK2.Utils.Styles.MAP_SEARCH_FEATURE];
		} else { return undefined};
	}, this);
	
	// append/overwrite source to settings
	settings.source = vectorSource;
	
	goog.base(this, settings);
};
goog.inherits(VK2.Layer.MapSearch, ol.layer.Vector);

/**
 * @param {number=} opt_start_time
 * @param {number=} opt_end_time
 */
VK2.Layer.MapSearch.prototype.setTimeFilter = function(opt_start_time, opt_end_time){
	// incase of a resetting
	var old_start = this._timeArr.START;
	
	if (goog.isDefAndNotNull(opt_start_time) && goog.isNumber(opt_start_time)){
		if (opt_start_time > this._timeArr.END)
			throw {'name':'WrongParameterExecption','message':'Start value shouldn\'t be higher than the end value.'}
		this._timeArr.START = opt_start_time;
	};
		
	if (goog.isDefAndNotNull(opt_end_time) && goog.isNumber(opt_end_time)){
		if (opt_end_time < this._timeArr.START){
			// reset start value and throw error
			this._timeArr.START = old_start;
			throw {'name':'WrongParameterExecption','message':'End value shouldn\'t be lower than the start value.'};
		};
		this._timeArr.END = opt_end_time;
	};
	
	// for updating the view of the layer
	this.dispatchChangeEvent();
};