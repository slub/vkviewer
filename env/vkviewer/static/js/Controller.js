/**
 * Module: MapController
 * 
 * @param: mapObj {OpenLayers.Map}
 * This module handles all events which are attached to the map object. As first the initialize function 
 * has to be called! The module has to be initialize with a map object.
 */
var MapController = (function(){
	
	/*
	 * attribute: _map
	 * {OpenLayers.Map}
	 */
	var _map = null;
	
	/* 
	 * attribute: _basicControlls
	 * {Array}
	 */
	var _basicControls = [new OpenLayers.Control.Navigation(), new OpenLayers.Control.PanZoomBar()];                   
	
	/*
	 * attribute: _mapEventsListeners
	 * {Object}
	 */
	var _mapEventsListeners = {
			// event which restricted the zoom
			'zoomend': function(){
				var x = this.getZoom();
				if( x < 5) {
					this.setCenter(this.getCenter(), 5);
				} else if (x > 17) {
					this.setCenter(this.getCenter(), 17);
	            }				
			},
			
			// event which publish a map moveend event
			'moveend': function(){
				var data = {
						centerPoint: this.getCenter(),
						extent: this.getExtent(),
						zoom: this.getZoom()
				}
				MapController.publish('mapmove', data);
			}
	};
	
	/*
	 * attribute: _subscriptions
	 * {Object}
	 */
	var _subscriptions = {
			'addtimelayer': function(data){
				var vk2LayerObj = createVk2LayerObject(data);
				MapController.addTimeLayer(vk2LayerObj);
			},
			
			'mapmove': function(data){
				if ('vk2layersearch' in _vk2Tools) {
					_vk2Tools['vk2layersearch'].updateFeatureStore();
				}
			}
	};
	
	/*
	 * attribute: _vk2Tools
	 * {Object}
	 */
	var _vk2Tools = {};
	
	/**
	 * method: _updateSubscriptions
	 */
	var _updateSubscriptions = function(){
		for (var key in _subscriptions){
			MapController.subscribe(key, _subscriptions[key])
		}
	}
	
	/**
	 * method: _updateMapEvents
	 * 
	 * Update events on the map object
	 */
	var _updateMapEvents = function(){
		for (var key in _mapEventsListeners){
			_map.events.register(key, _map, _mapEventsListeners[key]);
		}
		return true;
	};
	
	/**
	 * method: _deleteControls
	 * 
	 * Delete controls from map object.
	 */
	var _deleteControls = function(){
		// remove basic controls
		for (var i = 0; i < _basicControls.length; i++){
			_map.removeControl(_basicControls[i]);
		}
		return true;
	};
	
	/**
	 * method: _updateControls
	 * 
	 * Update controls of map object.
	 */
	var _updateControls = function(){
		// at first delete old controls
		
		// than add basic controls
		for (var i = 0; i < _basicControls.length; i++){
			_map.addControl(_basicControls[i]);
		}
		return true;
	};
	
	/**
	 * method: _addTimeLayer
	 */
	var _addTimeLayer = function(vk2LayerObj){
		if ('vk2layermanagement' in _vk2Tools){
			_vk2Tools['vk2layermanagement'].addLayer(vk2LayerObj);
		} else {
			console.log('MapController can not identifier the Vk2LayerManagement tool!');
		}
		
	}
	
	/**
	 * method: _activateVk2Tool
	 * 
	 * callback which is called in case of an activate event of a vk2tool 
	 */
	var _activateVk2Tool = function(vk2ToolKey){
		if (vk2ToolKey == 'vk2layersearch'){
			_vk2Tools['vk2layersearch'].activate(_map);
			_vk2Tools['eventfeaturelayer'].deactivate(_map);
		};
		
//		// generic approach
//		// get vk2tools at list and return false if no vk2tools are registered
//		if (vk2ToolKey in _vk2Tools){
//			var vk2Tool = _vk2Tools[vk2ToolKey];
//			vk2Tool.activate();
//		} else {
//			return false;
//		}
	};

	/**
	 * method: _deactivateVk2Tool
	 * 
	 * callback which is called in case of an deactivate event of a vk2tool 
	 */
	var _deactivateVk2Tool = function(vk2ToolKey){
		if (vk2ToolKey == 'vk2layersearch'){
			_vk2Tools['vk2layersearch'].deactivate(_map);
			_vk2Tools['eventfeaturelayer'].activate(_map);
		};		
//		// generic approach
//		// get vk2tools at list and return false if no vk2tools are registered
//		if (vk2ToolKey in _vk2Tools){
//			var vk2Tool = _vk2Tools[vk2ToolKey];
//			vk2Tool.deactivate();
//		} else {
//			return false;
//		}
	};
	
	return{
		initialize: function(mapObj, vk2Tools){
			_map = mapObj;
			for (var key in vk2Tools){
				_vk2Tools[key] = vk2Tools[key]
			};
			
			_updateControls(); 
			_updateMapEvents();
			_updateSubscriptions();
		},
		getMap: function(){return _map},
		setMap: function(mapObj){ _map = mapObj;},
		addTimeLayer: _addTimeLayer,
		activateVk2Tool: _activateVk2Tool,
		deactivateVk2Tool: _deactivateVk2Tool,
	};
}());

/**
 * Module: Mediator
 * 
 * This module implement the mediator pattern. It should manage the different control events registered 
 * on the OpenLayers.Map object by the different sidebar tools.
 */
var Mediator = (function(){
	
	var subscribe = function(channel, fn){
		console.log("Channel "+channel+" subscribed!");
		
		// if channel not initialize do it
		if (!Mediator.channels[channel]) Mediator.channels[channel] = [];
		
		// add new subscribe token to channel
		Mediator.channels[channel].push({ context: this, callback: fn });
		return this;		
	};
	
	var publish = function(channel){
		console.log("Channel "+channel+" published!");
		
		if(!Mediator.channels[channel]) return false;
		var args = Array.prototype.slice.call(arguments, 1);
		for (var i = 0, l = Mediator.channels[channel].length; i < l; i++){
			var subscription = Mediator.channels[channel][i];
			subscription.callback.apply(subscription.context, args);
		}
		return this;
	};
	
	
	
	return {
		channels: {},
		publish: publish,
		subscribe: subscribe,
		// the installTo function is for doing pub/sub via a third party mediator
		installTo: function(obj){
			obj.subscribe = subscribe;
			obj.publish = publish;
		}
	}
}());

// install Mediator pattern to MapController
Mediator.installTo(MapController);