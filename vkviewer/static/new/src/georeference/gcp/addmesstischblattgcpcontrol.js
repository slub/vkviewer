goog.provide('vk2.georeference.gcp.AddMesstischblattGcpControl');

goog.require('goog.ui.IdGenerator');
goog.require('vk2.utils.Styles');
goog.require('vk2.georeference.gcp.AbstractGcpControl');

/**
 * @param {vk2.georeference.ZoomifyViewer} zoomifyViewer
 * @param {vk2.georeference.ResultViewer} resultViewer
 * @constructor
 * @extends {vk2.georeference.gcp.AbstractGcpControl}
 */
vk2.georeference.gcp.AddMesstischblattGcpControl = function(zoomifyViewer, resultViewer){
	
	/**
	 * @type {vk2.georeference.ZoomifyViewer}
	 * @private
	 */
	this._zoomifyViewer = zoomifyViewer;
	
	/**
	 * @type {vk2.georeference.ResultViewer}
	 * @private
	 */
	this._resultViewer = resultViewer;
	
	/**
	 * @type {ol.source.Vector}
	 * @private
	 */
	this._unreferencedSource = new ol.source.Vector();		
	this._zoomifyViewer.getMap().addLayer(new ol.layer.Vector({
		  'source': this._unreferencedSource,
		  'style': function(feature, resolution) {
			  return [vk2.utils.Styles.GEOREFERENCE_POINT];
		  }
	}));
	
	/**
	 * @type {ol.interaction.Draw}
	 * @private
	 */
	this._drawInteraction = this._loadDrawInteraction(this._unreferencedSource);
		
	goog.base(this);
};
goog.inherits(vk2.georeference.gcp.AddMesstischblattGcpControl, vk2.georeference.gcp.AbstractGcpControl);

/**
 * @param {ol.source.Vector} unreferencedSource
 * @private
 * @returns {ol.interaction.Draw}
 */
vk2.georeference.gcp.AddMesstischblattGcpControl.prototype._loadDrawInteraction = function(unreferencedSource){
	var drawInteraction = new ol.interaction.Draw({
    	source: unreferencedSource,
    	type: 'Point',
    	'style': function(feature, resolution) {
    		return [vk2.utils.Styles.GEOREFERENCE_POINT_HOVER]
		}
    });	
	return drawInteraction;
};

/**
 * @override
 */
vk2.georeference.gcp.AddMesstischblattGcpControl.prototype.activate = function(){
	if (goog.DEBUG)
		console.log('Activate AddMesstischblattGcpControl');
	
	this._zoomifyViewer.getMap().addInteraction(this._drawInteraction);
};

/**
 * @override
 */
vk2.georeference.gcp.AddMesstischblattGcpControl.prototype.deactivate = function(){
	if (goog.DEBUG)
		console.log('Dectivate AddMesstischblattGcpControl');
	
	this._zoomifyViewer.getMap().removeInteraction(this._drawInteraction);
};

/**
 * @returns {ol.source.Vector}
 */
vk2.georeference.gcp.AddMesstischblattGcpControl.prototype.getUnrefSource = function(){
	return this._unreferencedSource;
};