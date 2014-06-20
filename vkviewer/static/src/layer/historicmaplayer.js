goog.provide('vk2.layer.HistoricMap');

goog.require('goog.events');
goog.require('goog.object');
goog.require('vk2.settings');
goog.require('vk2.utils');
goog.require('vk2.utils.Styles');
goog.require('vk2.layer.Messtischblatt');

/**
 * @param {Object} settings
 * @param {ol.Map} map
 * @constructor
 * @extends {ol.layer.LayerGroup}
 */
vk2.layer.HistoricMap = function(settings, map){
	
	/**
	 * @type {Object}
	 * @private
	 */
	this._baseSettings = goog.object.clone(settings);
	
	/**
	 * @type {string}
	 * @private
	 */
	this._id = goog.isDef(settings['id']) ? settings['id'] : undefined;
	
	/**
	 * @type {string} 
	 * @private
	 */
	this._metadata = goog.isDef(settings['metadata']) && goog.isObject(settings['metadata']) ? settings['metadata'] : undefined;
	
	/**
	 * @type {number}
	 * @private
	 */
	this._time = settings.time;

	/**
	 * @type {string}
	 * @private
	 */
	this._proj = settings.projection;
	
	/**
	 * @type {string}
	 * @private
	 */
	this._title = goog.isDef(settings['title']) ? settings['title'] : undefined; 
	
	/**
	 * @type {string}
	 * @private
	 */
	this._thumbnail = goog.isDef(settings['thumbnail']) ? settings['thumbnail'] : '/vkviewer/static/images/layer_default.png';
	
	/**
	 * @type {boolean}
	 * @private
	 */
	this._displayInLayerManagement = (goog.isDef(settings['displayinlayermanagement']) && goog.isBoolean(settings['displayinlayermanagement'])) ? 
			settings['displayinlayermanagement'] : true;
	
	/**
	 * @type {<Array.<Array.<number>>}
	 * @private
	 */
	this._borderPolygon = goog.isDef(settings['border']) ? settings['border'] : undefined;
	
	/**
	 * @type {ol.layer.Tile}
	 * @private
	 */
	this._mtbLayer = new vk2.layer.Messtischblatt({
		'time':this._time, 
		'border':settings['border'],
		'extent':settings['extent']
	}, map); 

	/**
	 * @type {Array.<vk2.layer.HistoricMap>|undefined}
	 * @private
	 */
	this._associations = undefined;
	
	// feature
	var feature = new ol.Feature(new ol.geom.Polygon([this._borderPolygon]))
	feature.setValues({
		'objectid':this._id,
		'time':this._time,
		'title':this._title
	});
	
	/**
	 * @type {ol.layer.Vector}
	 * @private
	 */
	this._borderLayer = new ol.layer.Vector({
		source: new ol.source.Vector({
				'features':[ feature ]
		}),
		'style': function(feature, resolution) {
			return [vk2.utils.Styles.MESSTISCHBLATT_BORDER_STYLE];
		}
	});
	
	settings.layers = [this._mtbLayer, this._borderLayer];
	ol.layer.Group.call(this, settings);
};
ol.inherits(vk2.layer.HistoricMap, ol.layer.Group);

/**
 * @return {number}
 */
vk2.layer.HistoricMap.prototype.getTime = function(){
	return this._time;
};

/**
 * @return {boolean}
 */
vk2.layer.HistoricMap.prototype.getDisplayInLayerManagement = function(){
	return this._displayInLayerManagement;
};

/**
 * @return {string}
 */
vk2.layer.HistoricMap.prototype.getTitle = function(){
	return this._title;
};

/**
 * @return {string}
 */
vk2.layer.HistoricMap.prototype.getThumbnail = function(){
	return this._thumbnail;
};

/**
 * @return {string}
 */
vk2.layer.HistoricMap.prototype.getId = function(){
	return this._id;
};

/**
 * @return {Array.<vk2.layer.HistoricMap>}
 */
vk2.layer.HistoricMap.prototype.getAssociations = function(){
	return this._associations;
};

/**
 * @return {Object}
 */
vk2.layer.HistoricMap.prototype.getMetadata = function(){
	return this._metadata;
};

/**
 * @param {Array.<vk2.layer.HistoricMap>} array
 */
vk2.layer.HistoricMap.prototype.setAssociations = function(array){
	this._associations = array;
};