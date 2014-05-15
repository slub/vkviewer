goog.provide('vk2.layer.HistoricMap');

goog.require('goog.net.XhrIo');
goog.require('goog.events');
goog.require('goog.object');
goog.require('vk2.settings');
goog.require('vk2.utils');
goog.require('vk2.utils.Styles');
goog.require('vk2.layer.Messtischblatt');

/**
 * @param {Object} settings
 * @constructor
 * @extends {ol.layer.LayerGroup}
 */
vk2.layer.HistoricMap = function(settings){

	/**
	 * @type {Object}
	 * @private
	 */
	this._baseSettings = goog.object.clone(settings);
	
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
	this._name = goog.isDef(settings['name']) ? settings['name'] : 'Messtischblätter für '+ this._time; 
	
	/**
	 * @type {boolean}
	 * @private
	 */
	this._displayInLayerBar = true;
	
	/**
	 * @type {<Array.<Array<number>>}
	 * @private
	 */
	this._borderPolygon = goog.isDef(settings['border']) ? settings['border'] : undefined;
	
	/**
	 * @type {ol.layer.Tile}
	 * @private
	 */
	this._mtbLayer = new vk2.layer.Messtischblatt({'time':this._time, 'border':settings['border'],'map':settings['map']}); 

	
	/**
	 * @type {ol.layer.Vector}
	 * @private
	 */
	this._borderLayer = new ol.layer.Vector({
		source: new ol.source.Vector({
				'features':[ new ol.Feature(new ol.geom.Polygon([this._borderPolygon]))]
		}),
		'style': function(feature, resolution) {
			return [vk2.utils.Styles.MESSTISCHBLATT_BORDER_STYLE];
		}
	});
	
	settings.layers = [this._mtbLayer, this._borderLayer];
	goog.base(this, settings);
};
goog.inherits(vk2.layer.HistoricMap, ol.layer.Group);

/**
 * @return {number}
 */
vk2.layer.HistoricMap.prototype.getTime = function(){
	return this._time;
};

/**
 * @return {boolean}
 */
vk2.layer.HistoricMap.prototype.getDisplayInLayerBar = function(){
	return this._displayInLayerBar;
};

/**
 * @return {string}
 */
vk2.layer.HistoricMap.prototype.getName = function(){
	return this._name;
};

/**
 * @return {string}
 */
vk2.layer.HistoricMap.prototype.getThumbnail = function(){
	return "/vkviewer/static/images/layer_default.png";
};