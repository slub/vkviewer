goog.provide('vk2.tool.DynamicMapVisualization');

goog.require('goog.Timer');

/**
 * @param {Element=} opt_feedbackEl
 * @constructor
 */
vk2.tool.DynamicMapVisualization = function(opt_feedbackEl){
	
	if (goog.DEBUG){
		console.log('Initialize vk2.tool.DynamicMapVisualization ...');		
	};
	
	/**
	 * @type {Element}
	 * @private
	 */
	this.feedbackEl_ = goog.isDef(opt_feedbackEl) ? opt_feedbackEl : undefined;
	
	/**
	 * @type {boolean}
	 * @private
	 */
	this.active_ = false;
};

/**
 * @param {Object} sortedLayers
 * 		{number} key
 * 		{Array.<vk2.layer.HistoricMap>} value
 * @private
 */
vk2.tool.DynamicMapVisualization.prototype.setLayersToInitialState_ = function(sortedLayers){
	for (key in sortedLayers){
		if (sortedLayers.hasOwnProperty(key)){
			var layersArr = sortedLayers[key];
			
			// now set visible to true and opacity to zero
			for (var i = 0; i < layersArr.length; i++){
				layersArr[i].setOpacity(0);
				layersArr[i].setVisible(true);
			};
		};
	};
};

/**
 * @param {Object} sortedLayers
 * 		{number} key
 * 		{Array.<vk2.layer.HistoricMap>} value
 * @private
 */
vk2.tool.DynamicMapVisualization.prototype.startAnimation_ = function(sortedLayers){
	this.setLayersToInitialState_(sortedLayers);

	var delay = 500;
	
	var animationJobObj = {
		start: function(sortedLayers, delay, context){
			if (!context.active_)
				return;
			
			if (goog.DEBUG)
				console.log(sortedLayers);
			
			var startkey;
			for (startkey in sortedLayers) break;
			
			var layers = goog.isDef(sortedLayers[startkey]) ? sortedLayers[startkey] : [];
			delete sortedLayers[startkey];
			for (var i = 0; i < layers.length; i++){
				if (i == 0){
					var success_callback = goog.bind(this.start, this, sortedLayers, delay, context)
					goog.Timer.callOnce(goog.partial(context.startFadeInAnimation, layers[i], success_callback) , delay, context);
				};
				goog.Timer.callOnce(goog.partial(context.startFadeInAnimation, layers[i]) , delay, context);				
			};
			
			// update user feedback
			context.updateFeedback_(startkey);			
		}
	};
	
	animationJobObj.start(sortedLayers, delay, this);
};

/**
 * @param {Array.<vk2.layer.HistoricMap>} layer
 * @param {ol.Map} map
 * @return {Object} 
 * 		{number} key
 * 		{Array.<vk2.layer.HistoricMap>} value
 * @private
 */
vk2.tool.DynamicMapVisualization.prototype.sortLayers_ = function(layers, map){
	// sort array
	var sortedLayers = layers.sort(function(a, b){
		if (a.getTime() > b.getTime()){
			return 1;
		};
		if (a.getTime() < b.getTime()){
			return -1;
		};
		// a must be equal to b
		return 0;
	});
	
	// now update the sorting of the layer for the map
	for (var i = 0; i < sortedLayers.length; i++){
		map.removeLayer(sortedLayers[i]);
		map.addLayer(sortedLayers[i]);
	};
	
	// group the timestamps
	var responseObj = {};
	for (var i = 0; i < sortedLayers.length; i++){
		if (sortedLayers[i].getTime() in responseObj){
			responseObj[sortedLayers[i].getTime()].push(sortedLayers[i]);
		} else {
			responseObj[sortedLayers[i].getTime()] = [sortedLayers[i]];
		};
	};
	return responseObj;
};

/**
 * @param {vk2.layer.HistoricMap} layer
 * @param {Function} opt_success_callback
 */
vk2.tool.DynamicMapVisualization.prototype.startFadeInAnimation = function(layer, opt_success_callback){
	var steps = 0.1;
	var delay = 500;
	
	var animationJobObj = {
		incrementalFadeIn: function(layer, steps, delay, opt_success_callback, context){
			if (!context.active_)
				return;
			
			if (goog.DEBUG){
				console.log('Incremental FadeIn Function called!');
			};
			
			var newOpacity = layer.getOpacity() + steps;
			if (newOpacity >= 1){
				if (goog.DEBUG) {
					console.log('Animation successful.');
				}
				
				if (goog.isDef(opt_success_callback)){
					opt_success_callback();
				};					
			} else {
				if (goog.DEBUG){
					console.log('Set opacity to ' + newOpacity);
				};
				
				layer.setOpacity(newOpacity);
				goog.Timer.callOnce(goog.partial(this.incrementalFadeIn, layer, steps, delay, opt_success_callback, context), delay, this);
			};
		},
		start: function(layer, steps, delay, opt_success_callback, context){
			layer.setOpacity(0);
			layer.setVisible(true);
			
			goog.Timer.callOnce(goog.partial(this.incrementalFadeIn, layer, steps, delay, opt_success_callback, context), delay, this);
		}
	};
	
	animationJobObj.start(layer, steps, delay, opt_success_callback, this);
};

/**
 * @param {Array.<vk2.layer.HistoricMap>} layers
 * @param {ol.Map} map
 */
vk2.tool.DynamicMapVisualization.prototype.startTimerseriesAnimation = function(layers, map){
	if (!this.active_) {
		// important for allowing to run the animation
		this.active_ = true;
		
		// bring the layers in the correct order
		var sortedLayers = this.sortLayers_(layers, map);
		
		if (goog.DEBUG)
			console.log(sortedLayers);
		
		this.startAnimation_(sortedLayers);
	} else {
		if (goog.DEBUG)
			console.log('Dynamic timeseries visualization is already running ...');
	}

};

/**
 *
 */
vk2.tool.DynamicMapVisualization.prototype.stopTimerseriesAnimation = function(){
	if (goog.DEBUG)
		console.log("Stop time series animation");
	
	this.active_ = false;
	this.updateFeedback_();	
};

/**
 * @param {string=} opt_feedbackMsg
 * @private
 */
vk2.tool.DynamicMapVisualization.prototype.updateFeedback_ = function(opt_feedbackMsg){
	if (goog.isDef(this.feedbackEl_)){
		if (goog.isDef(opt_feedbackMsg)){
			this.feedbackEl_.innerHTML = opt_feedbackMsg;
			return;
		};
		this.feedbackEl_.innerHTML = '';	
	};
};