goog.provide('ol3.interaction.DeleteFeature');

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
ol3.interaction.DeleteFeature = function(options) {

  goog.base(this);

  /**
   * Target source for drawn features.
   * @type {ol.source.Vector}
   * @private
   */
  this.source_ = goog.isDef(options.source) ? options.source : null;
  
  /**
   * @private
   * @type {ol.events.ConditionType}
   */
  this.condition_ = goog.isDef(options.condition) ?
      options.condition : ol.events.condition.singleClick;

  /**
   * @private
   * @type {ol.events.ConditionType}
   */
  this.addCondition_ = goog.isDef(options.addCondition) ?
      options.addCondition : ol.events.condition.shiftKeyOnly;

  var layerFilter;
  if (goog.isDef(options.layerFilter)) {
    layerFilter = options.layerFilter;
  } else if (goog.isDef(options.layer)) {
    var layer = options.layer;
    layerFilter =
        /**
         * @param {ol.layer.Layer} l Layer.
         * @return {boolean} Include.
         */
        function(l) {
      return l === layer;
    };
  } else if (goog.isDef(options.layers)) {
    var layers = options.layers;
    layerFilter =
        /**
         * @param {ol.layer.Layer} layer Layer.
         * @return {boolean} Include.
         */
        function(layer) {
      return goog.array.indexOf(layers, layer) != -1;
    };
  } else {
    layerFilter = goog.functions.TRUE;
  }

  /**
   * @private
   * @type {function(ol.layer.Layer): boolean}
   */
  this.layerFilter_ = layerFilter;

  /**
   * @private
   * @type {ol.FeatureOverlay}
   */
  this.featureOverlay_ = options.featureOverlay;

};
goog.inherits(ol3.interaction.DeleteFeature, ol.interaction.Interaction);


/**
 * @return {ol.FeatureOverlay} Feature overlay.
 * @todo stability experimental
 */
ol3.interaction.DeleteFeature.prototype.getFeatureOverlay = function() {
  return this.featureOverlay_;
};


/**
 * @inheritDoc
 */
ol3.interaction.DeleteFeature.prototype.handleMapBrowserEvent =
    function(mapBrowserEvent) {

  if (!this.condition_(mapBrowserEvent)) {
    return true;
  }
  
  var add = this.addCondition_(mapBrowserEvent);
  var map = mapBrowserEvent.map;
  var features = this.featureOverlay_.getFeatures();
  map.withFrozenRendering(
      /**
       * @this {ol.interaction.Select}
       */
      function() {
        if (add) {
          map.forEachFeatureAtPixel(mapBrowserEvent.pixel,
              /**
               * @param {ol.Feature} feature Feature.
               * @param {ol.layer.Layer} layer Layer.
               */
              function(feature, layer) {
                if (goog.array.indexOf(features.getArray(), feature) == -1) {
                  features.push(feature);
                }
              }, undefined, this.layerFilter_);
        } else {
          /** @type {ol.Feature|undefined} */
          var feature = map.forEachFeatureAtPixel(mapBrowserEvent.pixel,
              /**
               * @param {ol.Feature} feature Feature.
               * @param {ol.layer.Layer} layer Layer.
               */
              function(feature, layer) {
                return feature;
              }, undefined, this.layerFilter_);
          if (goog.isDef(feature)) {
        	  this.source_.removeFeature(feature);
          } 
        }
      }, this);
  return false;
};


/**
 * @inheritDoc
 */
ol3.interaction.DeleteFeature.prototype.setMap = function(map) {
  goog.base(this, 'setMap', map);
  this.featureOverlay_.setMap(map);
};