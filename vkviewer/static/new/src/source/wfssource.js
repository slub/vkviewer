goog.provide('VK2.Source.WFS');

goog.require('goog.net.XhrIo');
goog.require('goog.events');

/**
 * @constructor
 * @extends {ol.source.VectorFile}
 * @fires {@link ol.source.VectorEvent} ol.source.VectorEvent
 * @param {olx.source.GPXOptions=} opt_options Options.
 * @todo stability experimental
 */
VK2.Source.WFS = function(opt_options) {
	console.log('WFS source loaded!');
	
	// create request object
	var xhr = new goog.net.XhrIo();
	
	// add listener to request object
	goog.events.listenOnce(xhr, 'success', function(e){
		var xhr = /** @type {goog.net.XhrIo} */ (e.target);
		var data = xhr.getResponseXml() ? xhr.getResponseXml() :  xhr.getResponseText();
		xhr.dispose();
		var config = {
			'featureType': 'Historische_Messtischblaetter_WFS',
            'featureNS': 'http://mapserver.gis.umn.edu/mapserver'
		};
		
		var parser = new ol.format.WFS(config);
		var features = parser.readFeatures(data);
		window['features'] = features;
	}, false, this);
	

	// send request
	xhr.send('/vkviewer/static/new/test/wfs/wfs-data.xml');
//  var options = goog.isDef(opt_options) ? opt_options : {};
//
//  goog.base(this, {
//	format: new ol.format.WFS({
//	      featureType: 'Historische_Messtischblaetter_WFS',
//	      featureNS: 'http://mapserver.gis.umn.edu/mapserver'
//	}),
//	projection: 'EPSG:900913',
//	url: 'http://194.95.145.43/cgi-bin/mtbows'
//  });

};
//goog.inherits(ol3.source.WFS, ol.source.VectorFile);