goog.provide('VK2.Utils.Settings');
goog.provide('VK2.Utils.Settings.DOM');

/**
 * Proxy url is used for doing cross-site HTTP requests
 * @type {string}
 * @public
 */
VK2.Utils.Settings.proxy_url = '/vkviewer/proxy/?url=';

/**
 * Url to the geonetwork catalog instance
 * @type {String}
 * @public
 */
VK2.Utils.Settings.geonetwork = 'http://kartenforum.slub-dresden.de/geonetwork/srv/eng/search#|';

/**
 * Url to the catalog service for the web catalog instance
 * @type {String}
 * @public
 */
VK2.Utils.Settings.csw_url = 'http://kartenforum.slub-dresden.de/geonetwork/srv/eng/csw';

/**
 * Service options for the time wms and wfs.
 * @type {Object}
 * @public
 */
VK2.Utils.Settings.timeWmsWfsOptions = {
	extent: null,
    time: null,
    wms: "http://194.95.145.43/mapcache", //"http://194.95.145.43/cgi-bin/mtbows",
    wms_layer: "messtischblaetter", //"Historische Messtischblaetter",
    wfs: "http://194.95.145.43/cgi-bin/mtbows",
    layer: "Historische Messtischblaetter",
    featureType: "Historische_Messtischblaetter_WFS",
    featurePrefix: "ms",
    featureNS: "http://mapserver.gis.umn.edu/mapserver",
    geometryName: "boundingbox",
    serviceVersion: "1.0.0",
    maxFeatures: 10000,
    srsName: "EPSG:900913",
    maxResolution: 305.74811309814453
};

/**
 * Id of the control anchor for the georeference chooser
 * @type {String}
 * @public
 */
VK2.Utils.Settings.DOM.idControlGeorefChooser = 'vk2GeorefControl';

/**
 * Id of the control anchor for the search map tool
 * @type {String}
 * @public
 */
VK2.Utils.Settings.DOM.idControlSearchMap = 'vk2LayersearchControl';
