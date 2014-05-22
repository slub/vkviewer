goog.provide('vk2.georeference.gcp.DragGcpControl');

goog.require('vk2.utils.Styles');
goog.require('vk2.georeference.gcp.AbstractGcpControl');

/**
 * @param {vk2.georeference.ZoomifyViewer} zoomifyViewer
 * @param {vk2.georeference.ResultViewer} resultViewer
 * @constructor
 * @extends {vk2.georeference.gcp.AbstractGcpControl}
 * @param {Object} settings
 */
vk2.georeference.gcp.DragGcpControl = function(zoomifyViewer, resultViewer){
	
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
	 * @type {ol.interaction.Select}
	 * @private
	 */
	this._select = new ol.interaction.Select({
		style: function(feature, resolution) {
			return [vk2.utils.Styles.GEOREFERENCE_POINT_HOVER];
		}
	});
	
	/**
	 * @type {ol.interaction.Modify}
	 * @private
	 */
	this._modify = new ol.interaction.Modify({
    	features: this._select.getFeatures(),
    	pixelTolerance: 10,
    	style: function(feature, resolution) {
			return [vk2.utils.Styles.GEOREFERENCE_POINT_HOVER];
    	}
	});
	
	goog.base(this);
};
goog.inherits(vk2.georeference.gcp.DragGcpControl, vk2.georeference.gcp.AbstractGcpControl);

/**
 * @override
 */
vk2.georeference.gcp.DragGcpControl.prototype.activate = function(){
	if (goog.DEBUG)
		console.log('Activate DragGcpControl');
	
	this._zoomifyViewer.getMap().addInteraction(this._select);
	this._zoomifyViewer.getMap().addInteraction(this._modify);
};

/**
 * @override
 */
vk2.georeference.gcp.DragGcpControl.prototype.deactivate = function(){
	if (goog.DEBUG)
		console.log('Dectivate DragGcpControl');
	
	this._zoomifyViewer.getMap().removeInteraction(this._select);
	this._zoomifyViewer.getMap().removeInteraction(this._modify);
};

/**
 * @enum {string}
 */
vk2.georeference.gcp.DragGcpControl.EventType = {
		DRAGGCP: 'draggcp'
};