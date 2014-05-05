goog.provide('VK2.Layer.HistoricMap');

goog.require('goog.net.XhrIo');
goog.require('goog.events');
goog.require('goog.object');
goog.require('VK2.Settings');
goog.require('VK2.Utils');
goog.require('VK2.Utils.Styles');
goog.require('VK2.Source.TimeWfs');

/**
 * @param {Object} settings
 * @constructor
 * @extends {ol.layer.LayerGroup}
 */
VK2.Layer.HistoricMap = function(settings){

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
	 * @type {ol.layer.Tile}
	 * @private
	 */
	this._wmsLayer = new ol.layer.Tile({
		source: new ol.source.TileWMS({
			url: 'http://194.95.145.43/mapcache',
			params: {
				'LAYERS':'messtischblaetter',
				'TIME':this._time,
				'VERSION': '1.1.1'
			}, 
			projection: this._proj
		})
	});
	
	/**
	 * @type {ol.layer.Vector}
	 * @private
	 */
	this._wfsLayer = new ol.layer.Vector ({
		source: new VK2.Source.TimeWfs({
			'time': this._time,
			'projection': this._proj
		}),
		style: function(feature, resolution){
			return [VK2.Utils.Styles.MAP_SEARCH_FEATURE];
		}
	});
	
	settings.layers = [this._wmsLayer, this._wfsLayer];
	goog.base(this, settings);
};
goog.inherits(VK2.Layer.HistoricMap, ol.layer.Group);

///**
// * @private
// */
//VK2.Layer.HistoricMap.prototype.get
/**
 * @return {number}
 */
VK2.Layer.HistoricMap.prototype.getTime = function(){
	return this._time;
};

/**
 * @return {boolean}
 */
VK2.Layer.HistoricMap.prototype.getDisplayInLayerBar = function(){
	return this._displayInLayerBar;
};

/**
 * @return {string}
 */
VK2.Layer.HistoricMap.prototype.getName = function(){
	return this._name;
};

/**
 * @return {string}
 */
VK2.Layer.HistoricMap.prototype.getThumbnail = function(){
	return "/vkviewer/static/images/layer_default.png";
};

/**
 * @param {number} time
 */
VK2.Layer.HistoricMap.prototype.setTime = function(time){
	this._time = time;
	this._wmsLayer.getSource().updateParams({'TIME':this._time});
	this._wfsLayer.getSource().setTime(this._time);
};