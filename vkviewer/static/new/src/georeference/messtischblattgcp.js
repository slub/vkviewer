goog.provide('vk2.georeference.MesstischblattGcp');

goog.require('goog.events');

/**
 * @param {ol.source.Vector} featureSource
 * @param {ol.source.Vector} drawSource
 * @param {Array.<Array.<number>>} mtb_coords 
 * @constructor
 */
vk2.georeference.MesstischblattGcp = function(featureSource, drawSource, mtb_coords){
	
	var corners = {};
	
	// identifiy corners
	var lowX = mtb_coords[0][0], lowY = mtb_coords[0][1]; 
	for (var i = 0; i < mtb_coords.length; i++){
		if (mtb_coords[i][0] < lowX)
			lowX = mtb_coords[i][0];
		if (mtb_coords[i][1] < lowY)
			lowY = mtb_coords[i][1];
	};
	
	for (var i = 0; i < mtb_coords.length; i++){
		if (mtb_coords[i][0] === lowX && mtb_coords[i][1] === lowY)
			corners['llc'] = mtb_coords[i];
		if (mtb_coords[i][0] === lowX && mtb_coords[i][1] > lowY)
			corners['ulc'] = mtb_coords[i];
		if (mtb_coords[i][0] > lowX && mtb_coords[i][1] === lowY)
			corners['lrc'] = mtb_coords[i];
		if (mtb_coords[i][0] > lowX && mtb_coords[i][1] > lowY)
			corners['urc'] = mtb_coords[i];
	};
	
	if (goog.DEBUG)
		console.log(corners);
	
	goog.events.listen(featureSource, 'addfeature', function(event){
		var xlow, ylow, cornerType;
		var assumption_MidHeight = 4000;
		var assumption_MidWidth = 4000;
		var coordinates = event.feature.getGeometry().getCoordinates();
		
		// checks
		var xlow = (coordinates[0] - 4000 > 0) ? false : true;
		var ylow = (-1*coordinates[1] - 4000 > 0) ? true : false;
		
		// detect correct corner typ
		if (xlow && ylow) 
			cornerType = 'llc';
		if (xlow && !ylow) 
			cornerType = 'ulc';	
		if (!xlow && ylow) 
			cornerType = 'lrc';		
		if (!xlow && !ylow) 
			cornerType = 'urc';
		
		console.log('Cornertype: '+cornerType);
		
		// add feature to featureSource
		var featureCoords = corners[cornerType];
		var point = new ol.Feature(new ol.geom.Point(featureCoords));
		drawSource.addFeatures([point]);
	});
};

