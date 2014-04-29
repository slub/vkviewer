goog.provide('VK2.Utils.Styles');

/**
 * @type {Object}
 */
VK2.Utils.Styles.MAP_SEARCH_FEATURE = new ol.style.Style({
    stroke: new ol.style.Stroke({
    	color: 'rgba(0, 0, 255, 1.0)',
    	width: 2
    })
});

/**
 * @type {Object} 
 */
VK2.Utils.Styles.MAP_SEARCH_HOVER_FEATURE = new ol.style.Style({
	stroke: new ol.style.Stroke({
		color: '#f00',
        width: 1
    }),
    fill: new ol.style.Fill({
        color: 'rgba(255,0,0,0.1)'
    })
});