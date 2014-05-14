goog.provide('vk2.controller.MapController');

goog.require('goog.object');

/**
 * @param {Object} settings
 * @param {string} map_container
 * @constructor
 * @export
 */
vk2.controller.MapController = function(settings, map_container){
		
	/**
	 * @type {Object}
	 * @private
	 */
	this._settings = {};
	goog.object.extend(this._settings, settings);
	
	this._loadBaseMap(map_container);
}

/**
 * @param {string} map_container
 * @private
 */
vk2.controller.MapController.prototype._loadBaseMap = function(map_container){
	
	var styleArray = [new ol.style.Style({
		  stroke: new ol.style.Stroke({
		    color: '#000000',
		    width: 3
		  })
	})];
	
	/**
	 * @type {ol.Map}
	 * @private
	 */
	this._map = new ol.Map({
		layers: [
		   new ol.layer.Tile({
			   //source: new ol.source.OSM()
			   source: new ol.source.BingMaps({
				   key: 'ApU2pc7jDCWIlPogOWrr2FzQTj-1LyxAWKC6uSc26yuYv6gGxnQrXjAoeMmdngG_',
				   imagerySet: 'Road'
			   })
		   })
		],
		renderer: 'canvas',
		target: map_container,
		view: new ol.View2D({
			projection: 'EPSG:900913',
	        minResolution: 1.194328566789627,
	        maxResolution: 2445.9849047851562,
	        extent: [640161.933,5958026.134,3585834.8011505,7847377.4901306],
			center: [1528150, 6630500],
			zoom: 2
		})
	});
	
	this._addFeatureClickBehavior(this._map);
};

/**
 * @param {ol.Map}
 * @private
 */
vk2.controller.MapController.prototype._addFeatureClickBehavior = function(map){
	map.on('click', function(evt){
		var features = [];
		map.forEachFeatureAtPixel(evt.pixel, function(feature, layer){
			features.push(feature);
		});
		
		if (goog.DEBUG)
			console.log(features);
	});
};

/**
 * @returns {ol.Map}
 * @export
 */
vk2.controller.MapController.prototype.getMap = function(){
	return this._map;
};

/**
 * @param {vk2.module.SpatialTemporalSearchModule}
 */
vk2.controller.MapController.prototype.registerSpatialTemporalSearch = function(spatialTempSearch){

	/**
	 * @type {vk2.module.MapSearchModule}
	 * @private
	 */
	this._mapsearch = spatialTempSearch.getMapSearchModule();
	
	// register mapsearchlayer for fetching search records from the wfs service
	var mapsearchLayer = new vk2.layer.MapSearch({
		'projection':'EPSG:900913',
		'style': function(feature, resolution){
			return undefined;
		}
	});
	this._map.addLayer(mapsearchLayer);
	
	// register map moveend event for looking if there are new search features
	var lastMoveendCenter = null;
	var lastMoveendFeatureCount = null;
	this._map.on('moveend', function(event){
		if (goog.DEBUG)
			console.log('Moveend Event');
		
		var view = event.map.getView().getView2D();
		var featureCount = mapsearchLayer.getSource().getFeatures().length;
		if (lastMoveendCenter !== view.getCenter() || lastMoveendFeatureCount !== featureCount){
			if (goog.DEBUG)
				console.log('Moveened Event with update');
			
			lastMoveendCenter = view.getCenter();
			lastMoveendFeatureCount = featureCount;
			
			// extract features in current extent
			var current_extent = view.calculateExtent(event.map.getSize());
			var features = []
			mapsearchLayer.getSource().forEachFeatureInExtent(current_extent, function(feature){
				features.push(feature);
			});
			this._mapsearch.updateFeatures(features);
		}
	}, this);
};