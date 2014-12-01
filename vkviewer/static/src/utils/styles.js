goog.provide('vk2.utils.Styles');

//goog.require('ol.style');

/**
 * @type {Object}
 */
vk2.utils.Styles.MAP_SEARCH_FEATURE = new ol.style.Style({
    'stroke': new ol.style.Stroke({
    	'color': 'rgba(0, 0, 255, 1.0)',
    	'width': 2
    })
});

/**
 * @type {Object} 
 */
vk2.utils.Styles.MAP_SEARCH_HOVER_FEATURE = new ol.style.Style({
	'stroke': new ol.style.Stroke({
		'color': '#f00',
        'width': 1
    }),
    'fill': new ol.style.Fill({
        'color': 'rgba(255,0,0,0.1)'
    })
});

/**
 * @type {Object}
 */
vk2.utils.Styles.MESSTISCHBLATT_BORDER_STYLE = new ol.style.Style({
	'stroke': new ol.style.Stroke({
		'color': '#000000',
		'width': 2
	})
});

/**
 * @type {Object}
 */
vk2.utils.Styles.GEOREFERENCE_POINT = new ol.style.Style({
	'image': new ol.style.Circle({
		'radius': 7,
		'fill': new ol.style.Fill({
			'color': 'rgba(255, 255, 255, 0.6)'
		}),
		'stroke': new ol.style.Stroke({
			'color': '#319FD3',
			'width': 1.5
		})
	})
});

/**
 * @type {Object}
 */
vk2.utils.Styles.GEOREFERENCE_POINT_HOVER = new ol.style.Style({
	'image': new ol.style.Circle({
		'radius': 7,
	    'fill': new ol.style.Fill({
	    	'color': 'rgba(255,0,0,0.1)'
	    }),
	    'stroke': new ol.style.Stroke({
	    	'color': '#f00',
	    	'width': 1
	    })
	}),
	'zIndex': 100000
})