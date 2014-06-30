goog.provide('vk2.layer.MapSearch');

goog.require('goog.net.XhrIo');
goog.require('goog.events');
goog.require('vk2.settings');
goog.require('vk2.utils.Styles');

/**
 * @param {Object} settings
 * @constructor
 * @extends {ol.layer.Vector}
 */
vk2.layer.MapSearch = function(settings){
	
	if (goog.DEBUG)
		console.log('Parser options: '+vk2.settings.WFS_PARSER_CONFIG['mtbows']);
	
	// create vector source
	var vectorSource = new ol.source.ServerVector({
		format: new ol.format.WFS(vk2.settings.WFS_PARSER_CONFIG['mtbows']),
		loader: function(extent, resolution, projection) {
			if (goog.DEBUG)
				console.log('Loader is called');
			
			var url = vk2.settings.PROXY_URL+vk2.settings.WFS_URL+'?SERVICE=WFS&' +
		    	'VERSION=1.1.0&REQUEST=getfeature&TYPENAME=Historische_Messtischblaetter_WFS&MAXFEATURES=10000&srsname='+settings.projection+'&' +
		    	'bbox=' + extent.join(',');
		    
		    var xhr = new goog.net.XhrIo();
		    
		    goog.events.listenOnce(xhr, 'success', function(e){
		    	if (goog.DEBUG){
		    		console.log('Receive features');
		    	};
		    	
		    	var xhr = /** @type {goog.net.XhrIo} */ (e.target);
		    	var data = xhr.getResponseXml() ? xhr.getResponseXml() : xhr.getResponseText();
		    	xhr.dispose();
		    	this.addFeatures(this.readFeatures(data));
		    }, false, this);

		    xhr.send(url);
		},
		projection: settings.projection,
		strategy: 	function(extent, resolution){
			if (resolution <= 611.4962261962891){
				return [extent];
			}
			return [];
		}
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
	settings.style = goog.isDef(settings.style) ? settings.style :goog.bind(function(feature, resolution){
		if (feature.get('time') >= this._timeArr.START && feature.get('time') <= this._timeArr.END){
			return [vk2.utils.Styles.MAP_SEARCH_FEATURE];
		} else { return undefined};
	}, this);
	
	// append/overwrite source to settings
	settings.source = vectorSource;
	
	//ol.layer.Vector.call(this, settings);
	ol.layer.Vector.call(this, settings);	
};
ol.inherits(vk2.layer.MapSearch, ol.layer.Vector);

/**
 * @return {Array.<ol.Feature>}
 */
vk2.layer.MapSearch.prototype.getFeatures = function(){
	return this.getSource().getFeatures();
};

/**
 * @param {string} blattnr
 * @return {Array.<ol.Feature>}
 */
vk2.layer.MapSearch.prototype.getFeatureForBlattnr = function(blattnr){
	var allFeatures = this.getSource().getFeatures();
	var returnArr = [];
	allFeatures.forEach(function(feature){
		if (feature.get('blattnr') === blattnr)
			returnArr.push(feature);
	});
	return returnArr;
};

/**
 * @return {Object}
 */
vk2.layer.MapSearch.prototype.getTimeFilter = function(){
	return this._timeArr;
};

/**
 * @param {ol.Extent} extent
 * @return {Array.<ol.Feature>}
 */
vk2.layer.MapSearch.prototype.getTimeFilteredFeatures = function(extent){
	
	//var allFeatures = this.getSource().getFeatures();
	var returnArr = [];
	this.getSource().forEachFeatureInExtent(extent, function(feature){
		if (feature.get('time') >= this._timeArr.START && feature.get('time') <= this._timeArr.END){
			returnArr.push(feature);
		}
	}, this);
	return returnArr;
};

/**
 * Refresh the layer after updating filter funtions.
 */
vk2.layer.MapSearch.prototype.refresh = function(){
	// for updating the view of the layer
	this.dispatchChangeEvent();
};

/**
 * @param {number=} opt_start_time
 * @param {number=} opt_end_time
 */
vk2.layer.MapSearch.prototype.setTimeFilter = function(opt_start_time, opt_end_time){
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
};