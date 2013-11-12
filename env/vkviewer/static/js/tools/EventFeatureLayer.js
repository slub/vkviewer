var EventFeatureLayer = function(){
    /*
     * @type Key/Value pair which contains a key (layer.id_time) and the features
     * which are associated with this key;
     */
    var _timeLayersFeatures= {} 
    
    /*
     * attribute: _controls
     * @param {Array}
     * 
     * Contains to OpenLayers.Control.SelectFeature handlers. One handlings a click event on
     * a feature and the other a hover event
     */
    var _controls= [];
    
    /*
     * attribute: _map
     * {OpenLayer.Map}
     */
    var _map= null;
    
    /*
     * different styles for the feature elements in case of hover events
     */
    var _defaultStyle = {
    		fillColor: "#ee9900",
    		fillOpacity: "0",
    };
    var _defaultStyleMap = new OpenLayers.StyleMap({
    	fillColor: "#ee9900",
    	fillOpacity: "0",
    });
    var _tmpStyle = {
    		fillColor: "#FF5500",
    		fillOpacity: "0.4",
    		strokeColor: "#FF0000",
    		labelAlign: "cc", 
    		fontColor: "#000000", 
    		fontOpacity: 1, 
    		fontFamily: "Arial",
    		fontSize: 16, 
    		fontWeight: "600"
    };
    
    /*
     * attribute: _lastSelectedFeatures
     * {Array}
     * 
     * This attribute is importing for ensuring the correct hover behavior. This means
     * that in case of fast events in a row old hovers should be deactivate. 
     */
    var _lastSelectedFeatures = [];
    
    var _createKey = function(id, time){
        var key = id+"_"+time;
        return key;
    };
        
    var _getTimeFeatureLayer = function(map){
    	if (map) return map.getLayersByName('TimeFeatureLayer')[0]
    	else return _map.getLayersByName('TimeFeatureLayer')[0]
    };
    
    var _registerFeatures = function(features, map){
    	var timeFtLayer = _getTimeFeatureLayer(map);
        if(!timeFtLayer){
        	timeFtLayer = new OpenLayers.Layer.Vector("TimeFeatureLayer",{
                'displayInLayerSwitcher': false,
                styleMap: _defaultStyleMap,
                strategies: [
                    new OpenLayers.Strategy.Refresh({force: true, active: true})
                ]
            });
        	timeFtLayer.addFeatures(features);
            map.addLayer(timeFtLayer);
        } else  {
        	timeFtLayer.addFeatures(features);
        }
    };
    
    var _unregisterFeatures = function(features, map){
    	var timeFtLayer = _getTimeFeatureLayer(map);
        if(timeFtLayer){
        	timeFtLayer.removeFeatures(features);
            return true;
        } else {
            console.log("No feature layer founded!");
            return false;
        }
    };
    
    /**
     * method: _loadControls
     * 
     * @param: vectorLayer {OpenLayers.Layer.Vector}
     * 
     * This method initialize the events which are connected with the _timeLayer {OpenLayer.Layer.Vector}
     */
    var _loadControls = function(vectorLayer){
        var hoverFeatureEvent = new OpenLayers.Control.SelectFeature(vectorLayer,{
        	highlightOnly: true,
        	hover: true,
        	overFeature: $.proxy(function(feature, vectorLayer) {
        		$.ajax({
        			url: getHost('/vkviewer/gettimestamps'),
        			type: 'GET',
        			data: {
        				'blattnr': feature.data.blattnr
        			},
        			success: $.proxy(function( data ){   
        				// parse response
        				jsonObj = $.parseJSON(data)
        				// change styling of selected feature
        				_changeHoverFeature(feature, jsonObj.occurence);
		
        				// add timestamps to feature 
        				feature.timestamps = jsonObj.timestamps;
        			}, this)
        		});
        	}, this),
        	outFeature: $.proxy(function(feature) {
        		_changeHoverFeature();

        		// remove timestamps from feature 
        		feature.timestamps = '';
        	},this)
        });
        _controls.push(hoverFeatureEvent);
        
        var clickFeatureEvent = new OpenLayers.Control.SelectFeature(vectorLayer,{
            clickout: true,
            onSelect: $.proxy(function(feature){
                // extract data from feature
                var permalink = feature.data.permalink;
                var originalPicLink = feature.data.original;
                // display data in fancybox
                $.fancybox.open([
                    { 
                        href: originalPicLink,
                        title: '<a href="' + originalPicLink + '">Download Karte</a>      '
                                +' <a href="' + permalink + '">Gehe zu Kartenforum</a>'
                    }
                ]);
                
                // unselect the feature (!important for making the feature clickable again)
                _controls[0].unselect(feature);
            }, this)
        });
        _controls.push(clickFeatureEvent);
    };
    
    /**
     * method: _registerFeatureEvents
     * 
     * @param - map {OpenLayers.Map}
     * @param - vectorLayer {OpenLayers.Layer.Vector}
     */
    var _registerFeatureEvents = function(map, vectorLayer){
    	if (vectorLayer && _controls.length == 0){
    		// initialize the controls
    		_map = map;
    		_loadControls(vectorLayer);
    		
    		// add them to map and activate them
        	for (var i = 0; i < _controls.length; i++){
                map.addControl(_controls[i]);
                _controls[i].activate();
                
                // this two rows are important for allowing click and drag the main map 
                // on a selection
                fixControlConflictsOnOLMap(_controls[i]);
        	}
        	return true;
    	};
    	return false;
    };
    
    /**
     * method: _unregisterFeatureEvents
     * 
     * @param - vectorLayer {OpenLayers.Layer.Vector}
     * @param - map {OpenLayers.Map}
     */
    var _unregisterFeatureEvents = function(map, vectorLayer){
    	if (vectorLayer && _controls.length == 2){
	    	for (var i = 0; i < _controls.length; i++){
	    		_controls[i].deactivate();
	    		map.removeControl(_controls[i]);
	    	}
	    	_controls = [];
	    	return true;
    	}
    	return false;
    };   
    
    /**
     * method: _changeHoverFeature
     * 
     * @param - feature {OpenLayers.Vectore.Feature} 
     * @param - occurence {Integer} - occurence of messtischblätter for this blattnr
     * 
     * The method handles the hover behavior for highlighted feature
     */
    var _changeHoverFeature = function(feature, occurence){
    	// clear old styles
    	if (_lastSelectedFeatures.length != 0){
    		for (var i=0; i <_lastSelectedFeatures.length; i++) {
    			selectedFeature = _lastSelectedFeatures[i];
    			selectedFeature.style = _defaultStyle;
    		}
    		_lastSelectedFeatures = [];
    	}
    	
    	if (typeof feature != 'undefined'){
    		// change styling of selected feature
            var style = _tmpStyle;
            style.label = occurence.toString();
            feature.style = style;
            	
            _lastSelectedFeatures.push(feature);   		
    	}
    	
    	// redraw layer
        _getTimeFeatureLayer().redraw();
    };
    
    return {
    	/**
    	 * method: addFeaturesFromTimeLayer
    	 * Adds the vector features which are connected to a time layer to 
    	 * a OpenLayer.Layer.Vector object and adds the events to it
    	 * 
    	 * @param layer - {Vk2Layer}
    	 * @param map - {OpenLayers.Map}
    	 * @return {Boolean}
    	 */
	    addFeaturesFromTimeLayer: function(layer, map){
	        // check if it the layerElement has a reference to a vectorlayer
	        // and  a time parameter
	        var time = null;
	        if(layer.wfsLayer && layer.params.TIME){
	            time = layer.params.TIME;
	        } else {
	            return false;
	        }
	        
	        // if old value is registered and differs from the new value
	        // remove old features
	        if(layer.oldTime != time ){
	            var tmpKey = _createKey(layer.id,layer.oldTime);
	            if (_timeLayersFeatures[tmpKey]){
	                var toRemovedFeatures = _timeLayersFeatures[tmpKey];
	                _unregisterFeatures(toRemovedFeatures, map);
	                delete _timeLayersFeatures[tmpKey];
	            }
	        };
	        
	        // check if this layer with this parameters is already registered 
	        //  create key
	        var key = _createKey(layer.id,time);
	        if(!_timeLayersFeatures[key]){
	        	layer.wfsLayer.protocol.read({
	                filter: new OpenLayers.Filter.Comparison({
	                     type: OpenLayers.Filter.Comparison.EQUAL_TO,
	                     property: "time",
	                     value: time
	                }),
	                callback: $.proxy(function(response){
	                    if(response.features.length > 0){
	                        _timeLayersFeatures[key] = response.features;
	                        _registerFeatures(_timeLayersFeatures[key], map);
	                    } else {
	                        console.log('Whoops, no features returned!');
	                    }
	                }, this)
	            });
	        };
	        return true;
	    },
	    
    	/**
    	 * method: removeFeaturesFromTimeLayer
    	 * removes the vector features which are connected to a time layer to 
    	 * a OpenLayer.Layer.Vector object and adds the events to it
    	 * 
    	 * @param layer - {Vk2Layer}
    	 * @param map - {OpenLayers.Map}
    	 * @return {Boolean}
    	 */
	    removeFeaturesFromTimeLayer: function(layer, map){
	        var time = layer.params.TIME;
	        var key = _createKey(layer.id,time);
	        if (_timeLayersFeatures[key]){
	            var toRemovedFeatures = _timeLayersFeatures[key];
	            _unregisterFeatures(toRemovedFeatures, map);
	            delete _timeLayersFeatures[key];
	            return true;
	        }
	    },
	    
	    activate: function(map){
	    	var timeFtLayer = _getTimeFeatureLayer(map);
	    	return _registerFeatureEvents(map, timeFtLayer);	
	    },
	    
	    deactivate: function(map){
	    	var timeFtLayer = _getTimeFeatureLayer(map);
	    	return _unregisterFeatureEvents(map, timeFtLayer);	
	    }
    }
};