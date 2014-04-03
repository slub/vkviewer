goog.provide('ol3.source.WFS');

/**
 * @constructor
 * @extends {ol.source.VectorFile}
 * @fires {@link ol.source.VectorEvent} ol.source.VectorEvent
 * @param {olx.source.GPXOptions=} opt_options Options.
 * @todo stability experimental
 */
ol3.source.WFS = function(opt_options) {

  var options = goog.isDef(opt_options) ? opt_options : {};

  goog.base(this, {
	format: new ol.format.WFS({
	      featureType: 'Historische_Messtischblaetter_WFS',
	      featureNS: 'http://mapserver.gis.umn.edu/mapserver'
	}),
	projection: 'EPSG:900913',
	url: 'http://194.95.145.43/cgi-bin/mtbows'
  });

};
goog.inherits(ol3.source.WFS, ol.source.VectorFile);