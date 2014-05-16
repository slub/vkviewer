goog.provide('vk2.layer.Messtischblatt');

goog.require('ol.Map');
goog.require('ol.layer.Tile');
goog.require('ol.geom.Polygon');
goog.require('vk2.utils');

/**
 * @param {Object} settings
 * @constructor
 */
vk2.layer.Messtischblatt = function(settings){
	
	var extent = goog.isDef(settings['extent']) ? settings['extent'] : [];
	
	// define source
	var projection = goog.isDef(settings.projection) ? settings.projection : 'EPSG:900913';
	settings.source = new ol.source.TileWMS({
		'url': 'http://194.95.145.43/mapcache',
		'params': {
			'LAYERS':'messtischblaetter',
			'TIME':settings.time,
			'VERSION': '1.1.1'
		}, 
		'projection': projection,
		'extent': extent
	});
	var messtischblattLayer = new ol.layer.Tile(settings);
	
	/**
	 * @type {ol.Map}
	 * @private
	 */
	messtischblattLayer._map = goog.isDef(settings['map']) ? settings['map'] : undefined;
	
	/**
	 * @type {<Array.<Array.<number>>}
	 * @private
	 */
	messtischblattLayer._borderPolygon = goog.isDef(settings['border']) ? settings['border'] : undefined;
	
	/**
	 * @private
	 * @return {Array.<Array.<number>>}
	 */
	messtischblattLayer._getPixelForClipPolygon = function(){
		var clip_pixel = [];
		for (var i = 0; i < this._borderPolygon.length; i++){
			clip_pixel.push(this._map.getPixelFromCoordinate(this._borderPolygon[i]));
		};
		return clip_pixel;
	};

	/**
	 * @param {Array.<Array.<number>>} clip_pixel
	 * @param {Object} canvas
	 * @private
	 */
	messtischblattLayer._drawClipPolygonOnCanvas = function(clip_pixel, canvas){
		canvas.beginPath();
		canvas.moveTo(clip_pixel[0][0],clip_pixel[0][1]);
		for (var i = 1; i < clip_pixel.length; i++){
			canvas.lineTo(clip_pixel[i][0],clip_pixel[i][1]);
		};
		canvas.closePath();
	};

	/**
	 * @param {Array.<number>} extent
	 * @private
	 * @return boolean;
	 */
	messtischblattLayer._isExtentWithinClipPolygon = function(extent){
		var polygon = vk2.utils.getPolygonFromExtent(extent);
		for (var i = 0; i < polygon.length; i++){
			if (!this.isPointInPolygon(this._borderPolygon, polygon[i]))
				return false;
		};
		return true;
	};

	/**
	 * The function counts the number of line crosses if a line is drawed from the point and cross the polygon
	 * @param {Array.<Array.<number>>} poly
	 * @param {Array.<number>} point
	 */
	messtischblattLayer.isPointInPolygon = function(poly, point){
		var linecrosses = false;
		var i, j;
		for (i = 0, j = poly.length -1; i < poly.length; j = i++){
			if ( ((poly[i][1] >= point[1]) != (poly[j][1] >= point[1])) && 
			(point[0] <= (poly[j][0] - poly[i][0]) * (point[1] - poly[i][1]) / (poly[j][1] - poly[i][1]) + poly[i][0]) ){
				linecrosses = !linecrosses;
			};
		};
		return linecrosses;
	};
	
	// borderPolygon definded than add clip behavior
	if (goog.isDef(messtischblattLayer._borderPolygon) && goog.isDef(messtischblattLayer._map)){
		messtischblattLayer.on('precompose', function(event){
			//if (!this._isExtentWithinClipPolygon(event.frameState.extent)){
				var canvas = event.context;
				var clip_pixel = this._getPixelForClipPolygon();
				canvas.save();
				
//				if (goog.DEBUG){
//					console.log('------------------------------------------');
//					for (var i = 0, ii = clip_pixel.length; i < ii; i++ ){
//						console.log(clip_pixel[i]);
//					};
//					console.log('------------------------------------------');
//				}
				
				this._drawClipPolygonOnCanvas(clip_pixel, canvas);		
				canvas.clip();
			//};
		}, messtischblattLayer);
		
		messtischblattLayer.on('postcompose', function(event){
			var canvas = event.context;
			canvas.restore();
		});
	};
	return messtischblattLayer;
};