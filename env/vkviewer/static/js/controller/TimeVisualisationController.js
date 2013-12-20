VK2.Controller.TimeVisualisationController = VK2.Class({

	/**
	 * Attribute: _settings
	 * {Object} - Basic settings
	 */
	_settings: {
			vk2LayerParams: {
				// params for the wms
				wms: 'http://194.95.145.43/mapcache',
				layer: 'messtischblaetter',
				layer_name: 'Historische Messtischblätter',
				time: 1912,
				
				// params for the wfs
				wfs: 'http://194.95.145.43/cgi-bin/mtbows',
	            featureType: "Historische_Messtischblaetter_WFS",
	            featurePrefix: "ms",
	            featureNS: "http://mapserver.gis.umn.edu/mapserver",
	            geometryName: "boundingbox",
	            serviceVersion: "1.0.0",
	            maxFeatures: 10000,
	            srsName: "EPSG:900913",
	            
	            // generell
	            visibility: true	            	
			},
			start_time: 1908,
			end_time: 1912,
			map: null,
			layersArr: [],
			task: null,
			taskRunner: null,
			
			/*
			 * Attribute: _speedOptionsVisu
			 * {Options} - contains 3 different dict object for controlling the speed of the visualisation.
			 * layer means the timeout time for changing time layer and fadeIn the time for the timeout 
			 * of the opacity change. 		
			 */
			speedOptionsVisu: {
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
			}
	},
	
	_updateSettings: function(settings){
		for (var key in settings){
			this._settings[key] = settings[key];
		}		
	},
	
	/** 
	 * Method: _cacheLayers
	 * The method is build with recursive calls, so that the layers got loaded incremental for a smoothly update 
	 * of the loading status. For correct reference the used variables are again defined in the context of this function.
	 * 
	 * @param layersArr - {Array}
	 * @param loadingScreen - {VK2.Tools.LoadingScreen}
	 */
	_cacheLayers: function(layersArr, loadingScreen){
		/*
		 * This method is build recursive so that the layers are loaded incremental to map and
		 * the loading status is smoothly updated!
		 */
		var _maxLayerIndex = layersArr.length - 1;
		var objData = this._settings;
//		var map = this._settings.map;
//		var taskRunner = this._settings.taskRunner;
//		var obj = this;
		
		var loadLayer = function(index){
			layersArr[index].events.register('loadend', layersArr[index], function(){
				// calculate loading status
				var loadingStatus = Math.round(( index / _maxLayerIndex) * 100);
				loadingScreen.setStatus(loadingStatus);

				if (index == _maxLayerIndex){
					console.log('finish')
					loadingScreen.clearLoadingScreen();
					objData.taskRunner.runTask(objData.task);
				} else {
					loadLayer(index + 1);
				}
			});
			objData.map.addLayer(layersArr[index]);
		}
		
		// start the recursive loading
		loadLayer(0);
	},
	
	_createLayerObjects: function(){
		// initialize layers but not load them from remote
		this._settings.layersArr = [];
		for (var time = this._settings.start_time; time <= this._settings.end_time; time++){
	    	this._settings.vk2LayerParams.time = time;
	    	this._settings.vk2LayerParams.projection = this._settings.map.getProjectionObject(),
	    	this._settings.vk2LayerParams.maxExtent = this._settings.map.getExtent(),
	    	this._settings.extent = this._settings.map.getExtent();
			var layer = new VK2.Layer.Vk2Layer(initConfiguration.timeParameter);
			this._settings.layersArr.push(layer);
		}
	},
	
	/**
	 * Method: _loadLayers
	 * This method loads all layers for the dynamic visualisation in advance
	 */
	_loadLayers: function(){	
		// create loading screen
		var loadingScreen = new VK2.Tools.LoadingScreen();
		this._createLayerObjects();
		this._cacheLayers(this._settings.layersArr, loadingScreen)
	},
	
	initialize: function(settings){
		this._updateSettings(settings);	
	},
	
	getStartTime: function(){
		return _settings.start_time;
	},
	
	getEndTime: function(){
		return _settings.end_time;
	},
	
	run: function(){
		// no task is registered --> create one and start the runner
		if (!this._settings.task && !this._settings.taskRunner){
			this._settings.taskRunner = new VK2.Utils.TaskRunner();
			this._loadLayers();
			this._settings.task = VK2.Utils.Tasks.createDisplayLayerTask(
					this._settings.layersArr, 
					function(){
						console.log('One step done!');					
					},
					function(){
						console.log('Finished!!!!')
					},
					this._settings.speedOptionsVisu['normal'],
					this._settings.taskRunner
			)
		// one task is registered but paused --> start it again
		} else if (this._settings.task && !this._settings.task.running){
			this._settings.taskRunner.runTask(this._settings.task);
		} else {
			console.log('Task is already running or problems while creating task/taskrunner')
		}
		
	},
	
	pause: function(){
		if (this._settings.task && this._settings.taskRunner && this._settings.task.running){ 
			this._settings.taskRunner.stopTask(this._settings.task);
		} else if (this._settings.task && this._settings.taskRunner && !this._settings.task.running){ 
			console.log('Task is already paused!');
		} else if (!this._settings.task){
			console.log('No task is registered for dynamic visualisation!')
		}
	},
	
	stop: function(){
		if (this._settings.taskRunner){
			this._settings.taskRunner.resetTaskRunner();
		}
	}
		
});