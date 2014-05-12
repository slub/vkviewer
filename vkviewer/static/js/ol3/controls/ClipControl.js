goog.provide('ol3.control.ClipControl');

goog.require('ol.geom.Polygon');

/**
 * @param {Array.<number>} clip_polygon_coordinates
 * @param {ol.Layer} clip_layer
 * @param {ol.Map}
 * @constructor
 * @extends {ol.control.Control}
 * 
 */
ol3.control.ClipControl = function(clip_polygon_coordinates, clip_layer, map){

	this._map = map;

	/**
	 * @type {Array.<Array.<Array.<number>>>} 
	 * @private
	 */
	this._rawCoordinates = clip_polygon_coordinates;
	
	/**
	 * @type {ol.geom.Polygon}
	 * @private
	 */
	this._clipPolygon = new ol.geom.Polygon([this._rawCoordinates]);
	
	/**
	 * @type {ol.Layer}
	 * @private
	 */
	this._clipLayer = clip_layer;
	
	// add clip event
	this._clipLayer.on('precompose', function(event){
		if (!this._isExtentWithinClipPolygon(event.frameState.extent)){
			var canvas = event.context;
			var clip_pixel = this._getPixelForClipPolygon();
			canvas.save();
			this._drawClipPolygonOnCanvas(clip_pixel, canvas);		
			canvas.clip();
		};
	}, this);
	
	this._clipLayer.on('postcompose', function(event){
		var canvas = event.context;
		canvas.restore();
	});
	
	var element = goog.dom.createDom('div',{'class':'ol-clipcontrol ol-unselectable'}); //goog.dom.createDom('a',{'href':'#clipcontrol','innerHTML'})
	goog.base(this, {'element':element});
};
goog.inherits(ol3.control.ClipControl, ol.control.Control);

/**
 * @private
 * @return {Array.<Array.<number>>}
 */
ol3.control.ClipControl.prototype._getPixelForClipPolygon = function(){
	var clip_pixel = [];
	for (var i = 0; i < this._rawCoordinates.length; i++){
		clip_pixel.push(this._map.getPixelFromCoordinate(this._rawCoordinates[i]));
	};
	return clip_pixel;
};

/**
 * @param {Array.<Array.<number>>} clip_pixel
 * @param {Object} canvas
 * @private
 */
ol3.control.ClipControl.prototype._drawClipPolygonOnCanvas = function(clip_pixel, canvas){
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
ol3.control.ClipControl.prototype._isExtentWithinClipPolygon = function(extent){
	var polygon = VK2.Utils.getPolygonFromExtent(extent);
	for (var i = 0; i < polygon.length; i++){
		if (!this.isPointInPolygon(this._rawCoordinates, polygon[i]))
			return false;
	};
	return true;
};

/**
 * The function counts the number of line crosses if a line is drawed from the point and cross the polygon
 * @param {Array.<Array.<number>>} poly
 * @param {Array.<number>} point
 */
ol3.control.ClipControl.prototype.isPointInPolygon = function(poly, point){
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