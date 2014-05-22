goog.provide('vk2.georeference.gcp.DeleteGcpControl');

goog.require('vk2.georeference.gcp.DeleteGcpControl')
/**
 * @param {vk2.georeference.ZoomifyViewer} zoomifyViewer
 * @param {vk2.georeference.ResultViewer} resultViewer
 * @param {{ol.source.Vector} unreferenceSource
 * @constructor
 * @extends {vk2.georeference.gcp.AbstractGcpControl}
 * @param {Object} settings
 */
vk2.georeference.gcp.DeleteGcpControl = function(zoomifyViewer, resultViewer, unreferenceSource){
	
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
	this._unreferenceSource = unreferenceSource;
	
	/**
	 * @type {ol.interaction.Select}
	 * @private
	 */
	this._select = new ol.interaction.Select({
		style: function(feature, resolution) {
			return [vk2.utils.Styles.GEOREFERENCE_POINT_HOVER];
		},
		'condition': goog.bind(function(event){
			if (event.type === 'click'){
				this._zoomifyViewer.getMap().forEachFeatureAtPixel(event.pixel, function(feature){
					this._unreferenceSource.removeFeature(feature); 
				}, this);
			}
			return false;
		}, this)
	});
	
	goog.base(this);
};
goog.inherits(vk2.georeference.gcp.DeleteGcpControl, vk2.georeference.gcp.AbstractGcpControl);

/**
 * @override
 */
vk2.georeference.gcp.DeleteGcpControl.prototype.activate = function(){
	if (goog.DEBUG)
		console.log('Activate DeleteGcpControl');
	
	this._zoomifyViewer.getMap().addInteraction(this._select);
};

/**
 * @override
 */
vk2.georeference.gcp.DeleteGcpControl.prototype.deactivate = function(){
	if (goog.DEBUG)
		console.log('Dectivate DeleteGcpControl');
	
	this._zoomifyViewer.getMap().removeInteraction(this._select);
};