goog.provide('vk2.settings');

/**
 * @type {string}
 */
vk2.settings.DISPLAY_SRS = 'EPSG:900913';

/**
 * @type {Object}
 */
vk2.settings.WFS_PARSER_CONFIG = {
		'mtbows':{
			'featureNS': 'http://mapserver.gis.umn.edu/mapserver',
			'featureType': 'Historische_Messtischblaetter_WFS'
		},
		'mtb_grid_puzzle':{
			'featureNS': 'http://mapserver.gis.umn.edu/mapserver',
			'featureType': 'mtb_grid_puzzle',
			'featurePrefix': 'ms'
		}
};

/**
 * @type {string}
 */
vk2.settings.WFS_URL = 'http://194.95.145.43/cgi-bin/mtbows';

/**
 * @type {string}
 */
vk2.settings.WFS_GRID_URL = 'http://194.95.145.43/cgi-bin/mtb_grid';

/**
 * @type {string}
 */
vk2.settings.PROXY_URL = 'http://localhost:8080/vkviewer/proxy/?url=';

/**
 * @type {string}
 */
vk2.settings.GEONETWORK = 'http://kartenforum.slub-dresden.de/geonetwork/srv/eng/search#|';

/**
 * @type {string}
 */
vk2.settings.CSW_URL = 'http://kartenforum.slub-dresden.de/geonetwork/srv/eng/csw';

/**
 * @type {string}
 */
vk2.settings.THUMBNAIL_URL = 'http://fotothek.slub-dresden.de/thumbs/df/dk/0010000/';

/**
 * @type {string}
 */
vk2.settings.GEOREFERENCECHOOSER_WMS = 'http://194.95.145.43/cgi-bin/mtb_grid';

/**
 * @type {string}
 */
vk2.settings.GEOREFERENCECHOOSER_LAYERID = 'mtb_grid_puzzle';

/**
 * @type {string}
 */
vk2.settings.GEOREFERENCE_GETPROCESS = '/vkviewer/georeference/getprocess';

/**
 * @type {string}
 */
vk2.settings.GEOREFERENCE_VALIDATION = '/vkviewer/georeference/validation';

/**
 * @type {string}
 */
vk2.settings.GEOREFERENCE_CONFIRM = '/vkviewer/georeference/confirm';

/**
 * @type {string}
 */
vk2.settings.GEOREFERENCE_UPDATE = '/vkviewer/georeference/update';

/**
 * @type {string}
 */
vk2.settings.MAIN_PAGE = '/vkviewer';

/**
 * @type {Object}
 */
vk2.settings.MAIN_MAP_SETTINGS = {
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
vk2.settings.MAIN_MAP_GEOREFERENCER_VIEW = {
	'center': [1510110.8611321,6808180.3878471],
	'zoom':0
};

/**
 * @type {string}
 */
vk2.settings.MAP_PROFILE_PAGE = '/vkviewer/profile/map';