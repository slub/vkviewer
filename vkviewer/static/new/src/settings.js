goog.provide('VK2.Settings');

/**
 * @type {Object}
 */
VK2.Settings.MAIN_MAP_SETTINGS = {
	projection: 'EPSG:900913',
    minResolution: 1.194328566789627,
    maxResolution: 2445.9849047851562,
    extent: [640161.933,5958026.134,3585834.8011505,7847377.4901306],
    center: [1528150, 6630500],
    zoom: 2
};

/**
 * @type {Object}
 */
VK2.Settings.WFS_PARSER_CONFIG = {
	'featureNS': 'http://mapserver.gis.umn.edu/mapserver',
    'featureType': 'Historische_Messtischblaetter_WFS'
};

/**
 * @type {string}
 */
VK2.Settings.WFS_URL = 'http://194.95.145.43/cgi-bin/mtbows';

/**
 * @type {string}
 */
VK2.Settings.PROXY_URL = 'http://localhost:8080/vkviewer/proxy/?url=';

/**
 * @type {string}
 */
VK2.Settings.GEONETWORK = 'http://kartenforum.slub-dresden.de/geonetwork/srv/eng/search#|';