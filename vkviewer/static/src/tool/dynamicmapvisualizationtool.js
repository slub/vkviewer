goog.provide('vk2.tool.DynamicMapVisualization');

goog.require('goog.Timer');

/**
 * @constructor
 */
vk2.tool.DynamicMapVisualization = function(){
	
	if (goog.DEBUG){
		console.log('Initialize vk2.tool.DynamicMapVisualization ...');		
	};
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
			if (goog.isDef(startkey)){
				console.log('The actual timestamp is ' + startkey);
			};
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
		incrementalFadeIn: function(layer, steps, delay, opt_success_callback){
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
				goog.Timer.callOnce(goog.partial(this.incrementalFadeIn, layer, steps, delay, opt_success_callback), delay, this);
			};
		},
		start: function(layer, steps, delay, opt_success_callback){
			layer.setOpacity(0);
			layer.setVisible(true);
			
			goog.Timer.callOnce(goog.partial(this.incrementalFadeIn, layer, steps, delay, opt_success_callback), delay, this);
		}
	};
	
	animationJobObj.start(layer, steps, delay, opt_success_callback);
};

/**
 * @param {Array.<vk2.layer.HistoricMap>} layers
 * @param {ol.Map} map
 */
vk2.tool.DynamicMapVisualization.prototype.startTimerseriesAnimation = function(layers, map){
	var sortedLayers = this.sortLayers_(layers, map);
	
	if (goog.DEBUG)
		console.log(sortedLayers);
	
	this.startAnimation_(sortedLayers);
};