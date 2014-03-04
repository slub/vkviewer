goog.provide('VK2.Layer.TimeFeatureLayer');

/**
 * This class interworks with the VK2.Layer.Vk2Layer object.
 * @param {OpenLayers.Layer.WMS} timeLayer
 * @param {OpenLayers.Protocol.WFS} wfsProtcol
 * @constructor
 */
VK2.Layer.TimeFeatureLayer = function(timeLayer, wfsProtocol){
	 	
	/**
	 * Represents the feature informationen which are associated to the parent TimeLayer
	 * @type {OpenLayers.Layer.Vector}
	 * @private
	 */
	this._timeFtLayer = null;
	
	/**
	 * @type {OpenLayers.Protocol.WFS}
	 * @private
	 */
	this._wfsProtocol = wfsProtocol;
	
	/**
	 * TimeLayer to whom this class is associated.
	 * @type {OpenLayer.Layer}
	 * @private
	 */
	this._timeLayer = timeLayer;
	
	/**
	 * Actual timestamp which is represented by this TimeFeatureLayer
	 * @type {string}
	 * @private
	 */
	this._actualTimestamp = null;
	
	/**
	 * @type {OpenLayers.Strategy.Refresh}
	 * @private
	 */
	this._refresh = null;

        
    /**
     * Contains the different events for coupling the behavior from the TimeFeatureLayer to the
     * parent layer.
     * @type {Object}
     * @private
     */
    this._eventsOnParentLayer = {
    	
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
    		if (goog.isDef(this.timeFtLayer)){
    			var timeFtLayer = this.timeFtLayer.getLayer();
    			timeFtLayer.map.removeLayer(timeFtLayer);
    			VK2.Controller.TimeFeatureControls.removeLayerFromControls(timeFtLayer);
    		}
    	}
    	
    };

    /**
     * This attribute is importing for ensuring the correct hover behavior. This means
     * that in case of fast events in a row old hovers should be deactivate. 
     * @type {Array}
     * @private
     */
    this.lastSelectedFeatures = [];
    
	this._initializeParentLayerEvents();
};

/**
 * @param {OpenLayers.Map} map
 * @private
 */
VK2.Layer.TimeFeatureLayer.prototype._initializeTimeLayer = function(map){
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
};
    
/**
 * This methods uses events to couple the wfs/vector layer to the corresponding wms layer behavior
 * @private
 */
VK2.Layer.TimeFeatureLayer.prototype._initializeParentLayerEvents = function(){
	for (var key in this._eventsOnParentLayer){
		this._timeLayer.events.register(key, this._timeLayer, this._eventsOnParentLayer[key]);
	}
};
	
/**
 * @private
 */
VK2.Layer.TimeFeatureLayer.prototype._updateFilter = function(){
	this._timeFtLayer.filter = new OpenLayers.Filter.Comparison({
        type: OpenLayers.Filter.Comparison.EQUAL_TO,
        property: "time",
        value: this._actualTimestamp
	});
	this.refresh();
},
    

    
/**
 * @public
 * @return {OpenLayers.Layer}
 */
VK2.Layer.TimeFeatureLayer.prototype.getLayer = function(){
	return this._timeFtLayer;
};
    
/**
 * @public
 */
VK2.Layer.TimeFeatureLayer.prototype.updateFeatures = function(){
	if (this._timeLayer.params.TIME != this._timeFtLayer._actualTimestamp){
		this._actualTimestamp = this._timeLayer.params.TIME;
		this._updateFilter();
	}
};
    
/**
 * @param {Boolean} display
 * @public
 */
VK2.Layer.TimeFeatureLayer.prototype.setVisibility = function(display){
	if (this._timeFtLayer)
		this._timeFtLayer.setVisibility(display);
};

/**
 * @public
 */
VK2.Layer.TimeFeatureLayer.prototype.refresh = function(){
	if (this._timeFtLayer){
		this._refresh.refresh();
		this._timeFtLayer.redraw();
	}
};