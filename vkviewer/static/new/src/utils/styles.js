goog.provide('vk2.utils.Styles');

/**
 * @type {Object}
 */
vk2.utils.Styles.MAP_SEARCH_FEATURE = new ol.style.Style({
    stroke: new ol.style.Stroke({
    	color: 'rgba(0, 0, 255, 1.0)',
    	width: 2
    })
});

/**
 * @type {Object} 
 */
vk2.utils.Styles.MAP_SEARCH_HOVER_FEATURE = new ol.style.Style({
	stroke: new ol.style.Stroke({
		color: '#f00',
        width: 1
    }),
    fill: new ol.style.Fill({
        color: 'rgba(255,0,0,0.1)'
    })
});

/**
 * @type {Object}
 */
vk2.utils.Styles.MESSTISCHBLATT_BORDER_STYLE = new ol.style.Style({
	stroke: new ol.style.Stroke({
		color: '#000000',
		width: 2
	})
});