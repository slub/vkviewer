goog.provide('vk2.georeference.DeleteFeatureInteraction');

goog.require('goog.array');
goog.require('goog.functions');
goog.require('ol.FeatureOverlay');
goog.require('ol.events.condition');
goog.require('ol.interaction.Interaction');

/**
 * @constructor
 * @extends {ol.interaction.Interaction}
 * @param {olx.interaction.SelectOptions} options Options.
 * @todo stability experimental
 */
vk2.georeference.DeleteFeatureInteraction = function(options) {

  goog.base(this);

  /**
   * @private
   * @type {ol.events.ConditionType}
   */
  this.condition_ = goog.isDef(options.condition) ?
      options.condition : ol.events.condition.singleClick;
  
  /**
   * Target source for drawn features.
   * @type {ol.source.Vector}
   * @private
   */
  this.source_ = goog.isDef(options.source) ? options.source : null;
};
goog.inherits(vk2.georeference.DeleteFeatureInteraction, ol.interaction.Interaction);

/**
 * @inheritDoc
 */
vk2.georeference.DeleteFeatureInteraction.prototype.handleMapBrowserEvent =
  function(mapBrowserEvent) {
	var map = mapBrowserEvent.map;
	
	if (!this.condition_(mapBrowserEvent)) {
		return true;
	};
	  
	/** @type {ol.Feature|undefined} */
	var feature = map.forEachFeatureAtPixel(mapBrowserEvent.pixel,
			
	/**
	 * @param {ol.Feature} feature Feature.
	 * @param {ol.layer.Layer} layer Layer.
     */
	function(feature, layer) {
		return feature;
    });
    
	if (goog.isDef(feature)) {
		this.source_.removeFeature(feature);
    };
	
	return false;
};


/**
 * @inheritDoc
 */
vk2.georeference.DeleteFeatureInteraction.prototype.setMap = function(map) {
  goog.base(this, 'setMap', map);
};