VK2.Controller.TimeFeatureControls = (function(){
	
	/**
	 * Attribute: _isActive
	 * {Boolean}
	 */
	var _isActive = false;
	
	/**
	 * Attribute: _registerdLayer
	 * Layers which are associated to the TimeFeatureControls
	 * {Array}
	 */
	var _registeredLayer = [];
	
	/**
	 * Attribute: _controls
	 * Array of OpenLayers.Control elements
	 * {Array}
	 */
	var _controls = [];
	
	/**
	 * Attribute: _lastSelectedFeatures
	 * Array of the _lastSelectedFeatures from the hover event
	 * {Array}
	 */
	var _lastSelectedFeatures = [];

	/**
	 * Method: _loadControls
	 */
    var _loadControls = function(){
    	_controls = [];
    	
//        var hoverFeatureEvent = new OpenLayers.Control.SelectFeature(_registeredLayer,{
//        	highlightOnly: true,
//        	hover: true,
//        	overFeature: $.proxy(function(feature) {
//        		$.ajax({
//        			url: VK2.Utils.getHost('/vkviewer/gettimestamps'),
//        			type: 'GET',
//        			data: {
//        				'blattnr': feature.data.blattnr
//        			},
//        			success: $.proxy(function( data ){  
//        				// parse response
//        				jsonObj = $.parseJSON(data)
//        				// change styling of selected feature
//        				_changeHoverFeature(feature, jsonObj.occurence);
//		
//        				// add timestamps to feature 
//        				feature.timestamps = jsonObj.timestamps;
//        			}, this)
//        		});
//        	}, this),
//        	outFeature: $.proxy(function(feature) {
//        		_changeHoverFeature();
//
//        		// remove timestamps from feature 
//        		feature.timestamps = '';
//        	},this)
//        });
//        _controls.push(hoverFeatureEvent);
        
        var clickFeatureEvent = new OpenLayers.Control.SelectFeature(_registeredLayer,{
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
     * Method: _redrawHoverFeature
     * @param {OpenLayers.Vector.Feature}
     * @param {Object}
     */
    var _redrawHoverFeature = function(feature, style){
    	feature.style = style;
    	if (feature.layer)
    		feature.layer.redraw();
    };
    
    /**
     * Method: _changeHoverFeature
     * The method handles the hover behavior for highlighted feature
     *
     * @param feature - {OpenLayers.Vectore.Feature} 
     * @param occurence - {Integer} - occurence of messtischblätter for this blattnr
     */
    var _changeHoverFeature = function(feature, occurence){
    	// clear old styles
    	if (_lastSelectedFeatures.length != 0){
    		for (var i=0; i <_lastSelectedFeatures.length; i++) {
    			selectedFeature = _lastSelectedFeatures[i];
    			_redrawHoverFeature(selectedFeature, VK2.Styles.FeatureLayerStyles._defaultStyle);
    		}
    		_lastSelectedFeatures = [];
    	}
    	
    	if (typeof feature != 'undefined'){
    		// change styling of selected feature
            var style = VK2.Styles.FeatureLayerStyles._tmpStyle;
            style.label = occurence.toString();
            _redrawHoverFeature(feature, style);
            	
            _lastSelectedFeatures.push(feature);   		
    	}
    };
    
    /**
     * Method: _updateControls
     */
    var _updateControls = function(){
    	if (_isActive){
	    	for (var i = 0; i < _controls.length; i++){
	    		_controls[i].setLayer(_registeredLayer);
	    	}
    	}
    }
    
    return {
    	addLayerToControls: function(layer){
    		_registeredLayer.push(layer);
    		_updateControls();
    	},
    	removeLayerFromControls: function(layer){
    		var index = _registeredLayer.indexOf(layer);
    		_registeredLayer.splice(index, 1);
    		_updateControls();
    	},
    	
    	activate: function(map){   		
    		_loadControls();
    		
    		for (var i = 0; i < _controls.length; i++){
    			map.addControl(_controls[i]);
    			_controls[i].activate();
    			
                // this two rows are important for allowing click and drag the main map 
                // on a selection
                VK2.Utils.fixControlConflictsOnOLMap(_controls[i]);
    		}
    		
    		_isActive = true;
    		
    	},
    	
    	deactivate: function(map){
    		for (var i = 0; i < _controls.length; i++){
    			_controls[i].deactivate();
    			map.removeControl(_controls[i])
    		}
    		_isActive = false;
    	}
    }
	
}());