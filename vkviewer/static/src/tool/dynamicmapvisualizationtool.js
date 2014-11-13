goog.provide('vk2.tool.DynamicMapVisualization');

goog.require('goog.Timer');
goog.require('goog.dom.classes');

/**
 * @param {Element=} opt_parentEl
 * @param {Element=} opt_feedbackEl
 * @constructor
 */
vk2.tool.DynamicMapVisualization = function(opt_parentEl, opt_feedbackEl){
	
	if (goog.DEBUG){
		console.log('Initialize vk2.tool.DynamicMapVisualization ...');		
	};
	
	/**
	 * @type {Element|undefined}
	 * @private
	 */
	this.feedbackEl_ = goog.isDef(opt_feedbackEl) ? opt_feedbackEl : undefined;
	
	/**
	 * @type {Element|undefined}
	 * @private
	 */
	this.parentEl_ = goog.isDef(opt_parentEl) ? opt_parentEl : undefined;
	
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
	for (var key in sortedLayers){
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
			
			// call the fadein animation together with the creating of the callback
			var success_callback = goog.bind(this.start, this, sortedLayers, delay, context)
			goog.Timer.callOnce(goog.partial(context.startFadeInAnimation, layers, success_callback) , delay, context);
	
			
			// update user feedback
			context.updateFeedback_(startkey);			
			
			if (!goog.isDef(startkey)){
				console.log('Visualization finished ....');
							
				context.active_ = false;
				if (goog.isDef(context.parentEl_))
					goog.dom.classes.remove(context.parentEl_, 'play');
			};				
		}
	};
	
	animationJobObj.start(sortedLayers, delay, this);
};

/**
 * @param {Array.<vk2.layer.HistoricMap>} layers
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
 * @param {Array.<vk2.layer.HistoricMap>} layers
 * @param {Function} opt_success_callback
 */
vk2.tool.DynamicMapVisualization.prototype.startFadeInAnimation = function(layers, opt_success_callback){
	var steps = 0.1;
	var delay = 500;
	
	var animationJobObj = {
		incrementalFadeIn: function(layers, steps, delay, opt_success_callback, context){
			if (!context.active_)
				return;
			
			if (goog.DEBUG){
				console.log('Incremental FadeIn Function called!');
			};
			
			var newOpacity = layers[0].getOpacity() + steps;
			// use 1.05 as break value for catching inaccuracies in caculating like 1.000001
			if (newOpacity <= 1.05){
				if (goog.DEBUG){
					console.log('Set opacity to ' + newOpacity);
				};
				
				// increment the opacity
				for (var i = 0; i < layers.length; i++){
					layers[i].setOpacity(newOpacity);			
				};			
				goog.Timer.callOnce(goog.partial(this.incrementalFadeIn, layers, steps, delay, opt_success_callback, context), delay, this);
			} else {
				if (goog.DEBUG) {
					console.log('Animation successful.');
				}
				
				if (goog.isDef(opt_success_callback)){
					opt_success_callback();
				};					
			};
		},
		start: function(layers, steps, delay, opt_success_callback, context){
			for (var i = 0; i < layers.length; i++){
				layers[i].setOpacity(0);
				layers[i].setVisible(true);				
			};			
			
			goog.Timer.callOnce(goog.partial(this.incrementalFadeIn, layers, steps, delay, opt_success_callback, context), delay, this);
		}
	};
	
	animationJobObj.start(layers, steps, delay, opt_success_callback, this);
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
		
		// append class to parentEl
		if (goog.isDef(this.parentEl_) && !goog.dom.classes.has(this.parentEl_, 'play'))
			goog.dom.classes.add(this.parentEl_, 'play');
		
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
	
	if (goog.isDef(this.parentEl_))
		goog.dom.classes.remove(this.parentEl_, 'play');
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