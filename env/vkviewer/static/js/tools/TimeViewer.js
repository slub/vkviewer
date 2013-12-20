/**
 * Module: TimeWmsModule
 * This function encapsulate the actual JS Code which handles the the dynamic time visualization.
 */
var TimeWmsModule = function(settings){
	
	/**
	 * Attribute: _settings
	 * {Object} - Basic settings
	 */
	var _settings = {
			wms_url: 'http://194.95.145.43/mapcache',
			layer: 'messtischblaetter',
			start_time: 1908,
			end_time: 1914,
			map: null
	};
	
	/**
	 * Attribute: _speedOptionsVisu
	 * {Options} - contains 3 different dict object for controlling the speed of the visualisation.
	 * layer means the timeout time for changing time layer and fadeIn the time for the timeout 
	 * of the opacity change. 		
	 */
	var _speedOptionsVisu = {
			slow: {
				layer: 6000,
				fadeIn: 550,
			},
			normal: {
				layer: 4000,
				fadeIn: 330
			},
			fast: {
				layer: 2000,
				fadeIn: 160
			}
	};
	
	/**
	 * Attribute: _timer
	 * {Object}
	 */
	var _timer = null;
	
	/** 
	 * Attribute: _task
	 * {Object}
	 */
	var _task = null;
	
	// update settings on initialize
	for (var key in settings){
		_settings[key] = settings[key];
	};
	
	/**
	 * Method: _getTimeLayer
	 * 
	 * @param timestamp - {Integer} Timestamp for which a time layer based on the initialization options 
	 * 						should be loaded!
	 * @return {OpenLayers.Layer.WMS}
	 */
	var _getTimeLayer = function(timestamp){
  	  var params = initConfiguration.timeParameter;
	  params.time = timestamp;
	  params.extent = _settings.map.getExtent();
	  params.labeled = true;
	  var timeLayer = new VK2.Layer.Vk2Layer(initConfiguration.timeParameter);
      return timeLayer;
	}
	
	/**
	 * Method: _removeTimeLayers
	 * 
	 * @param layers {Array[OpenLayers.Layer]}
	 * @return {Boolean} 
	 */
	var _removeTimeLayers = function(layers){
		for (var i = 0; i < layers.length; i++){
			_settings.map.removeLayer(layers[i]);
		}
		return true;
	};
	
	/**
	 * Method: _createLoadingScreen
	 * 
	 * @return {Function} callback for changing update status
	 */
	var _createLoadingScreen = function(){
		var loadingScreen = document.createElement('div');
		loadingScreen.innerHTML = 'Bitten warten Sie. Ihr raumzeitliche Reise wird vorbereitet.';
		loadingScreen.id = 'loadingScreen';
		loadingScreen.className = 'loadingScreen';
		
		// append container for loading status
		loadingScreen.appendChild(document.createElement('br'));
		var loadingStatusContainer = document.createElement('span');
		loadingStatusContainer.id = 'loadingStatus';
		loadingStatusContainer.innerHTML = '0 % geladen.'
		loadingScreen.appendChild(loadingStatusContainer);
		
		document.body.appendChild(loadingScreen);
		
		// create callback and give him back
		var callback = function(status){
			if (status < 100){
				loadingStatusContainer.innerHTML = status + " % geladen.";
			} else {
				document.body.removeChild(loadingScreen);
			}
		}
		return callback;
	};
	
	/**
	 * Method: _loadLayers
	 * This method loads all layers for the dynamic visualisation in advance
	 * 
	 * @param start_time {Integer}
	 * @param end_time {Integer}
	 * @return {Array[OpenLayers.Layer]}
	 */
	var _loadLayers = function(start_time, end_time){
		
		// create loading screen
		var loadingScreenCallback = _createLoadingScreen();
	
		// initialize layers but not load them from remote
		var layersArr = [];
		for (var time = start_time; time <= end_time; time++){
			var layer = _getTimeLayer(time);
			layersArr.push(layer);
		}
		
		/*
		 * This method is build recursive so that the layers are loaded incremental to map and
		 * the loading status is smoothly updated!
		 */
		var _maxLayerIndex = layersArr.length - 1;
		var loadLayer = function(index){
			layersArr[index].events.register('loadend', layer, function(){
				// calculate loading status
				loadingScreenCallback(Math.round(( index / _maxLayerIndex) * 100));
				
				// if 
				if (index == _maxLayerIndex){
					_runTaskRunner(_task);
				} else {
					loadLayer(index + 1);
				}
			});
			_settings.map.addLayer(layersArr[index]);
		}
		// start the recursive loading
		loadLayer(0);

		return layersArr;
	};
	
	/**
	 * Method: _runTaskRuner
	 * 
	 * @param task {Object}
	 * @return {Boolean}
	 */
	var _runTaskRunner = function(task){
		// initialize a timer object
		if (!_timer) _timer = getTaskRunner()
		
		// start task if it is not running
		if (!task.running){
			_timer.start(task);
			task.running = true;
			return task;
		} else {
			console.log('Task is already running');
		}
	};
	
	/**
	 * Method: _stopTaskRuner
	 * 
	 * @param task {Object}
	 * @return {Boolean}
	 */
	var _stopTaskRunner = function(task){
		// initialize a timer object
		if (!_timer){
			console.log('No Taskrunner is initialize!');
			return false;
		}
		
		// stop task if it is not running
		if (task.running){
			_timer.stop(task);
			task.running = false;
			return task;
		} else {
			console.log('Task is already stopped');
		}
	};
	
	var _resetTaskRunner = function(){
		if (_timer && _task){
			_timer.stopAll();
			_removeTimeLayers(_task.layers);
			_task = null;
			_timer = null;
			return true;
		} else {
			return false;
		}
	}
	/**
	 * method: _slideInLayer
	 * 
	 * @param - layer {OpenLayers.Layer.WMS} - Slides in a layer by increment the opacity of the layer.
	 * @param - fadeInTime {Integer}
	 */
	var _slideInLayer = function(layer, fadeInTime){
		
		// check if the layer is visible
		if (!layer.getVisibility()) throw "Visibility of Layer is false!";
			
		var taskRunner = getTaskRunner();
		var task = {
				run: function(){
					if (this.opacity <= 1){
						this.opacity += 0.125;
						layer.setOpacity(this.opacity);
						console.log("Opacity: "+this.opacity);
					} else {
						taskRunner.stop(task);
					}
				}, 
				interval: fadeInTime,
				running: true,
				opacity: -0.125
		}
		
		taskRunner.start(task)
		return task;
	}
	
	/**
	 * Method: _createDynamicVisualizationTask
	 * 
	 * @param layers - {Array} array which should be loaded
	 * @param onStep - {Function} callback which is run for every time step
	 * @param onEnd - {Function} callback which is run for at the end
	 * @param speedConf - {String} slow/normal/fast
	 * 
	 * This methods create a task for the dynamic visualization of layers for a taskrunner. 
	 */
	var _createDynamicVisualizationTask = function(layers, onStep, onEnd, speedConf){	
		_task = {
				run: function(){
					if (this.counter < this.layers.length){
						// initialize layer and add him to map
						var layer = this.layers[this.counter];
						
						// call callback and slide in the time layer
						onStep(layer.params.TIME, layer);
						_slideInLayer(layer, _speedOptionsVisu[speedConf]['fadeIn']);
						
						// increment counter
						this.counter++;
						return true;
					} else {
						_stopTaskRunner(_task);
						onEnd();
					}
				},
				interval: _speedOptionsVisu[speedConf]['layer'],
				counter: 0,
				running: false,
				layers: layers
		};
			
		return _task;
	};
	
	return {
		getStartTime: function(){
			return _settings.start_time;
		},
		
		getEndTime: function(){
			return _settings.end_time;
		},
		
		/**
		 * method: getTimer
		 * 
		 * @param onStep - {Function} is mandatory for initializing the timer
		 * @param onEnd - {Function} is mandatory for initializing the timer
		 * @param start_time - {Integer}
		 * @param end_time - {Integer}
		 * @param speedConf - {String} slow/normal/fast
		 */
		run: function(onStep, onEnd, start_time, end_time, speedConf){
			if (!_task && !_timer){
				// initialize and start visualisation
				var layers = _loadLayers(start_time, end_time);
				return _createDynamicVisualizationTask(layers, onStep, onEnd, speedConf)
			} else if (_task && _task.running){
				// visualization is already running
				console.log('Dynamic visualisation is already running!');
				return _task;
			} else if (_task && !_task.running){
				// visualization is paused and start again
				return _runTaskRunner(_task);
			}
		},
		
		pause: function(){
			if (!_task){
				console.log('No dynamic visualisation is registered!');
				return false;
			} else if ( _timer && _task && _task.running ) {
				return _stopTaskRunner(_task);
			} else if ( _task && !_task.running ){
				console.log('Process of dynamic visualisation is already paused!');
				return true;
			}
		},
		
		stop: function(){
			return _resetTaskRunner(_task);
		}
	}
}






