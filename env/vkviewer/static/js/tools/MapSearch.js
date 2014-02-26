/**
 * @fileoverview FeatureRecord is a record class which does the binding between the vector data source and the SearchTable
 * @author jacobmendt@googlemail.de (Jacob Mendt)
 */
goog.provide('VK2.Tools.MapSearch');
goog.require('VK2.Layer.HoverLayer');


/**
 * @param {Object} map OpenLayers.Map object
 * @param {number} maxRes Maximum resolution for displaying the feature layer
 * @param {Array.<number>} timestamps Array which contains the min and max timestamps
 * @param {string} feedBackContainer Id of the container where the feature loading feedback should be displayed
 * @constructor
 */
VK2.Tools.MapSearch = function(map, maxRes, timestamps, feedBackContainer, container){
	
	/**
	 * @type {Object}
	 * @private
	 */
	this._map = map;
	
	/**
	 * @type {Object}
	 * @private
	 */
	this._feedBackEl = document.getElementById(feedBackContainer);
		
	/**
	 * @type {Object}
	 * @private 
	 */
	this._hoverLayer = new VK2.Layer.HoverLayer();
	
	/**
	 * @type {Object}
	 * @private
	 */
	this._ftLayer = new VK2.Layer.MapSearchLayer(timestamps, maxRes, this._map)
	
	
	/**
	 * @type {Object}
	 * @private
	 */
	this._controller = new VK2.Controller.MapSearchController(this._map, this._ftLayer, this._hoverLayer)
	
	/**
	 * @type {Object}
	 * @private
	 */
	this._table = new VK2.Tools.SearchTable(container, [{'id':'time', 'title':VK2.Utils.get_I18n_String('timestamp')},{'id':'titel', 'title':VK2.Utils.get_I18n_String('titel')}], this._controller);
	// register table object in controller
	this._controller.registerSearchTable(this._table);
}

/**
 * @param {Event} event
 * @param {Array} timestamps
 * @public
 */
VK2.Tools.MapSearch.prototype.updateTimestamp = function(event, timestamps){
	this._ftLayer.timestamps = timestamps;
	this._ftLayer.refreshLayer();
}

VK2.Tools.MapSearch.prototype.activate = function(){
	
	if (this._map.getLayerIndex(this._ftLayer) == -1){
		// add layers to map object
		this._map.addLayer(this._hoverLayer);
		this._map.addLayer(this._ftLayer);
		
		// add event behavior 
		this._controller.registerFeatureLayerBehavior(this._feedBackEl);
	}
	
	this._ftLayer.setVisibility(true);
	this._ftLayer.refreshLayer();
	this._hoverLayer.setVisibility(true);
	//this._controller.unregisterFeatureLayerBehavior();
}

VK2.Tools.MapSearch.prototype.deactivate = function(){
	this._ftLayer.setVisibility(false);
	this._hoverLayer.setVisibility(false);
	this._table.refreshData({});
}