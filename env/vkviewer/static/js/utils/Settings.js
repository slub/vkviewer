goog.provide('VK2.Utils.Settings');
goog.provide('VK2.Utils.Settings.DOM');

/**
 * Proxy url is used for doing cross-site HTTP requests
 * @type {string}
 * @public
 */
VK2.Utils.Settings.proxy_url = '/vkviewer/proxy/?url=';

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