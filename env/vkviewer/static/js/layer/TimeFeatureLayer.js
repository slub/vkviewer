/**
 * This class interworks with the VK2.Layer.Vk2Layer object.
 */
VK2.Layer.TimeFeatureLayer = VK2.Class({ 
	
	/**
	 * Attribute: _timeFtLayer
	 * Represents the feature informationen which are associated to the parent TimeLayer
	 * {OpenLayers.Layer.Vector}
	 */
	_timeFtLayer: null,
	
	/**
	 * Attribute: _wfsProtocol
	 * {OpenLayers.Protocol.WFS}
	 */
	_wfsProtocol: null,
	
	/**
	 * Attribute: _timeLayer
	 * TimeLayer to whom this class is associated.
	 * {OpenLayer.Layer}
	 */
	_timeLayer: null,
	
	/**
	 * Attribute: _actualTimestamp
	 * Actual timestamp which is represented by this TimeFeatureLayer
	 * {String}
	 */
	_actualTimestamp: null,
	
	/**
	 * Attribute: _refresh
	 * {OpenLayers.Strategy.Refresh}
	 */
	_refresh : null,

        
    /**
     * Attribute: _eventsOnParentLayer
     * Contains the different events for coupling the behavior from the TimeFeatureLayer to the
     * parent layer.
     * {Object}
     */
    _eventsOnParentLayer: {
    	
    	visibilitychanged: function(e){
    		if (this.getVisibility() && this.timeFtLayer !== 'undefined'){
    			this.timeFtLayer.setVisibility(true);
    			this.timeFtLayer.refresh();
    		} else if (!this.getVisibility() && this.timeFtLayer !== 'undefined') {
    			this.timeFtLayer.setVisibility(false);
    		} else {
    			console.log('No TimeFeatureLayer is registered!')
    		}
    	},
    	
    	added: function(e){
    		if (this.getVisibility() && this.timeFtLayer !== 'undefined'){
    			this.timeFtLayer._initializeTimeLayer(this.map);
    			VK2.Controller.TimeFeatureControls.addLayerToControls(this.timeFtLayer.getLayer());
    		}
    	},
    	
    	removed: function(e){
    		if (this.timeFtLayer !== 'undefined'){
    			this.map.removeLayer(this.timeFtLayer.getLayer());
    			VK2.Controller.TimeFeatureControls.removeLayerFromControls(this.timeFtLayer.getLayer());
    		}
    	}
    	
    },

    /**
     * Attribute: _lastSelectedFeatures
     * {Array}
     * 
     * This attribute is importing for ensuring the correct hover behavior. This means
     * that in case of fast events in a row old hovers should be deactivate. 
     */
    _lastSelectedFeatures: [],
    
    /**
     * Method: _initializeTimeLayer
     */
    _initializeTimeLayer: function(map){
    	this._actualTimestamp = this._timeLayer.params.TIME;
    	this._refresh = new OpenLayers.Strategy.Refresh({force: true, active: true});   
        
    	this._timeFtLayer = new OpenLayers.Layer.Vector(OpenLayers.Util.createUniqueID("TimeFeatureLayer_"),{
    		'displayInLayerSwitcher': false,
    		styleMap: VK2.Styles.FeatureLayerStyles._defaultStyleMap,
            strategies: [
                         new OpenLayers.Strategy.BBOX(),
                         this._refresh
            ],
            protocol: this._wfsProtocol,
    		filter: new OpenLayers.Filter.Comparison({
	          type: OpenLayers.Filter.Comparison.EQUAL_TO,
	          property: "time",
	          value: this._actualTimestamp
			})
    	}, {
				visibility: true
    	})    	
    	
    	map.addLayer(this._timeFtLayer);
    },
    
    /**
     * Method: _initializeParentLayerEvents
     * This methods uses events to couple the wfs/vector layer to the corresponding wms layer behavior
     */
	_initializeParentLayerEvents: function(){
		for (var key in this._eventsOnParentLayer){
			this._timeLayer.events.register(key, this._timeLayer, this._eventsOnParentLayer[key]);
		}
	},
	
	/**
	 * Method: _updateFilter
	 */
	_updateFilter: function(){
		this._timeFtLayer.filter = new OpenLayers.Filter.Comparison({
	        type: OpenLayers.Filter.Comparison.EQUAL_TO,
	        property: "time",
	        value: this._actualTimestamp
		});
		this.refresh();
	},
    
	/**
	 * Method: initialize
	 * 
	 * @param timeLayer - {OpenLayers.Layer.WMS}
	 * @param wfsProtcol - {OpenLayers.Protocol.WFS}
	 */
    initialize: function(timeLayer, wfsProtocol){
    	this._wfsProtocol = wfsProtocol;
    	this._timeLayer = timeLayer;
    	this._initializeParentLayerEvents();
    },
    
    /**
     * Method: getLayer
     */
    getLayer: function(){
    	return this._timeFtLayer;
    },
    
    /**
     * Method: updateFeatures
     */
    updateFeatures: function(){
    	if (this._timeLayer.params.TIME != this._timeFtLayer._actualTimestamp){
    		this._actualTimestamp = this._timeLayer.params.TIME;
    		this._updateFilter();
    	}
    },
        
    /**
     * Method: setVisibility
     * @param display {Boolean}
     */
    setVisibility: function(display){
    	if (this._timeFtLayer)
    		this._timeFtLayer.setVisibility(display);
    },
    
    /**
     * Method: refresh
     */
    refresh: function(){
    	if (this._timeFtLayer){
    		this._refresh.refresh();
    		this._timeFtLayer.redraw();
    	}
    }
});