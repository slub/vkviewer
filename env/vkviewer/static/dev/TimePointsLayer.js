VK2.Layer.TimePointsLayer = (function(){
	
	var _settings = {
			layer: new OpenLayers.Layer.Vector(OpenLayers.Util.createUniqueID("TimePointsLayer_"),{
				'displayInLayerSwitcher': false
			}),
			refLayer: [], 
			polygonFeatures: {},
			map: null,
			eventListeners: {
				
			},
			controls: []
	}

	var _addPoint = function(feature){
		var blattnr = feature.attributes.blattnr;
		if (blattnr in _settings.polygonFeatures){
			_settings.polygonFeatures[blattnr].timestamps.push(feature.attributes.time);
		} else {
			var point = _computePointGeometry(feature.geometry);
			var pointFeature = new OpenLayers.Feature.Vector(point,null,null);
			pointFeature.blattnr = blattnr;
			_settings.layer.addFeatures([pointFeature]);
			
			_settings.polygonFeatures[blattnr] = {
					geom: pointFeature,
					timestamps: [feature.attributes.time]
			}			
		}
	};
	
	var _loadControls = function(){
		var selectControl =	new OpenLayers.Control.SelectFeature(_settings.layer,{
	            clickout: true,
	            hover: true,
	            onSelect: function(feature){
	            	var timestamps = _settings.polygonFeatures[feature.blattnr].timestamps;
	            	console.log('Possible timestamps: '+timestamps.join());
	            }
	    });
		_settings.map.addControl(selectControl);
		selectControl.activate();
	};
	
	var _updateSettings = function(settings){
		for (var key in settings){
			_settings[key] = settings[key];
		}		
	};
	
	var _initialize = function(){   	
		_settings.map.addLayer(_settings.layer);
		//_loadEvents();
		_loadControls();
	};
	
	var _computePointGeometry = function(polygonGeom){
		var yPosition = polygonGeom.bounds.top - (polygonGeom.bounds.top - polygonGeom.bounds.bottom) * 0.1;
		var xPosition = polygonGeom.bounds.right - (polygonGeom.bounds.right - polygonGeom.bounds.left) * 0.1;
		return new OpenLayers.Geometry.Point(xPosition, yPosition);
	};
	
	var _registerFeatureLayer = function(layer){
		_settings.refLayer.push[layer];
    	// connect TimePointLayer to a FeatureLayer
		layer.events.register('featureadded', _settings.refLayer, function(event){
			_addPoint(event.feature); 		
    	})
	};
	
	return {
		initialize: function(settings){
			_updateSettings(settings);
			_initialize();			
		},
		addPoint: function(feature){              
			_addPoint(feature);
		},
		registerLayer: function(layer){
			_registerFeatureLayer(layer);
		}
	}
	
}());