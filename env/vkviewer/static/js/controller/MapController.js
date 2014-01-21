/**
 * Module: VK2.Controller.MapController
 *
 * This module handles all events which are attached to the main map object. It uses the mediator pattern.
 * Also it controls all VK2.Tools which are connected to the main map object. It is necessary for this controls
 * to implement the methods activate/deactivate for giving the MapController the possibility to activate and 
 * deactivate the tools. Other tools which are not implement this methods are not compatible with this module.
 */
VK2.Controller.MapController = (function(){
	
	/*
	 * attribute: _map
	 * {OpenLayers.Map}
	 */
	var _map = null;
	
	/* 
	 * attribute: _basicControlls
	 * {Array}
	 */
	var _basicControls = [new OpenLayers.Control.Navigation()];                   
	
	/*
	 * attribute: _mapEventsListeners
	 * {Object}
	 */
	var _mapEventsListeners = {
			
			// event which publish a map moveend event
			'moveend': function(){
				var data = {
						centerPoint: this.getCenter(),
						extent: this.getExtent(),
						zoom: this.getZoom()
				}
				VK2.Controller.MapController.publish('mapmove', data);
			}
	};
	
	/*
	 * attribute: _subscriptions
	 * {Object}
	 */
	var _subscriptions = {
			'addtimelayer': function(data){
				var vk2LayerObj = new VK2.Layer.Vk2Layer(data);
				VK2.Controller.MapController.addTimeLayer(vk2LayerObj);
			},
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
			VK2.Controller.MapController.subscribe(key, _subscriptions[key])
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
			console.log('VK2.Controller.MapController can not identifier the Vk2LayerManagement tool!');
		}
		
	}
	
	var _deactivateVk2Tools = function(){
		for (var i = 0; i < _vk2Tools.length; i++){
			_vk2Tools[i].deactivate(_map);
		}
	};
	
	var _activateTimeFeatureControl = function(){
		_deactivateVk2Tools();
		_vk2Tools['vk2timefeaturecontrols'].activate(_map)
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
		activateTimeFeatureControl: _activateTimeFeatureControl,
	};
}());

// install Mediator pattern to VK2.Controller.MapController
Mediator.installTo(VK2.Controller.MapController);