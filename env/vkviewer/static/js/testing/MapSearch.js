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
VK2.Tools.MapSearch = function(map, maxRes, timestamps, feedBackContainer){
	
	/**
	 * @type {Object}
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
	this._ftLayer = new VK2.Layer.TimeSearchLayer(timestamps, maxRes, map)
	
	
	/**
	 * @type {Object}
	 * @private
	 */
	this._controller = new VK2.Controller.MapSearchController(map, this._ftLayer, this._hoverLayer)
	
	/**
	 * @type {Object}
	 * @private
	 */
	this._table = new VK2.Tools.SearchTable('tableParent', [{'id':'time', 'title':'Zeit'},{'id':'titel', 'title':'Titel'}], this._controller);
	
	// register table object in controller
	this._controller.registerSearchTable(this._table);
	
	// add layers to map object
	map.addLayer(this._hoverLayer);
	map.addLayer(this._ftLayer);
	
	// add event behavior 
	this._controller.registerFeatureLayerBehavior(this._feedBackEl);
}
