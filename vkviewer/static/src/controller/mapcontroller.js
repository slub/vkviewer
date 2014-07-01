goog.provide('vk2.controller.MapController');

goog.require('goog.dom');
goog.require('goog.object');
goog.require('goog.array');
goog.require('goog.events');
goog.require('vk2.utils');
goog.require('vk2.tool.TimeSlider');
goog.require('vk2.tool.GazetteerSearch');
goog.require('vk2.module.SpatialTemporalSearchModule');
goog.require('vk2.module.MapSearchModule');
goog.require('vk2.layer.HistoricMap');
goog.require('vk2.control.LayerSpy');
goog.require('vk2.control.RotateNorth');

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
	this._appendMapClickBehavior(this._map);
	
	/**
	 * @type {Object}
	 * @private
	 */
	this._handler = {
		'updateMapSearchModule': goog.bind(function(){
			// extract features in current extent
			var current_extent = vk2.utils.calculateMapExtentForPixelViewport(this._map);  			    
			//var current_extent = view.calculateExtent(event.map.getSize());
			var features = this._mapsearchLayer.getTimeFilteredFeatures(current_extent);
			this._mapsearch.updateFeatures(features);
		}, this)
	}
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
			   preload: Infinity,
			   //source: new ol.source.OSM()
			   source: new ol.source.BingMaps({
				   key: 'ApU2pc7jDCWIlPogOWrr2FzQTj-1LyxAWKC6uSc26yuYv6gGxnQrXjAoeMmdngG_',
				   imagerySet: 'Road'
			   })
		   })
		],
		renderer: 'canvas',
		target: map_container,
		interactions: ol.interaction.defaults().extend([
		    new ol.interaction.DragRotateAndZoom()
		]),
		controls: [
		    new ol.control.Attribution(),
		   	new ol.control.Zoom(),
		   	new ol.control.FullScreen(),
			new vk2.control.LayerSpy({
				'spyLayer':new ol.layer.Tile({
					attribution: undefined,
					source: new ol.source.OSM()
				})
			}),
			new vk2.control.RotateNorth(),
			new ol.control.ScaleLine()
		],
		view: new ol.View({
			projection: 'EPSG:900913',
	        minResolution: 1.194328566789627,
	        maxResolution: 2445.9849047851562,
	        extent: [640161.933,5958026.134,3585834.8011505,7847377.4901306],
			center: [1531627.8847864927, 6632124.286850829],
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
 * @param {vk2.tool.GazetteerSearch} gazetteersearch
 */
vk2.controller.MapController.prototype._registerGazetteerSearchTool = function(gazetteersearch){
	// jumps to extent
	goog.events.listen(gazetteersearch, 'jumpto', function(event){
		var view = this._map.getView();
		view.setCenter(ol.proj.transform([parseFloat(event.target.lonlat[0]),parseFloat(event.target.lonlat[1])], 
				event.target.srs, 'EPSG:900913'));
		view.setZoom(5);
	}, undefined, this);
};

/**
 * @param {vk2.module.MapSearchModule} mapsearch
 */
vk2.controller.MapController.prototype._registerMapSearchModule = function(mapsearch){
	/**
	 * @type {vk2.module.MapSearchModule}
	 * @private
	 */
	this._mapsearch = mapsearch;
	
	// register mapsearchlayer for fetching search records from the wfs service
	/**
	 * @type {vk2.layer.MapSearch}
	 * @private
	 */
	this._mapsearchLayer = new vk2.layer.MapSearch({
		'projection':'EPSG:900913',
		'style': function(feature, resolution){
			return undefined;
		}
	});
	this._map.addLayer(this._mapsearchLayer);
	
	// register map moveend event for looking if there are new search features
	var lastMoveendCenter = null;
	var lastMoveendFeatureCount = null;
	this._map.on('moveend', function(event){
		if (goog.DEBUG)
			console.log('Moveend Event');
		
		var view = event.map.getView();
		var featureCount = this._mapsearchLayer.getSource().getFeatures().length;
		if (lastMoveendCenter !== view.getCenter() || lastMoveendFeatureCount !== featureCount){
			if (goog.DEBUG)
				console.log('Moveened Event with update');
			
			lastMoveendCenter = view.getCenter();
			lastMoveendFeatureCount = featureCount;
			this._handler['updateMapSearchModule']();
		}
	}, this);
	
	// register event for adding features after initial loading	
	goog.events.listenOnce(this._mapsearchLayer.getSource(), 'addfeature', function(event){
		setTimeout(this._handler['updateMapSearchModule'], 500);
	}, undefined, this);
	
	// register addmtb event
	goog.events.listen(this._mapsearch, 'addmtb', function(event){
		var feature = event.target.feature;
		
		// request associated messtischblaetter for a blattnr
		var layer = this._createHistoricMapForFeature(feature);
		var assocatiedMaps = this._createAssociationMapsArray(feature);	
		for (var i = 0; i < assocatiedMaps.length; i++){
			if (assocatiedMaps[i].getId() === layer.getId()){
				assocatiedMaps.splice(i, 1);
				break;
			};
		};
		layer.setAssociations(assocatiedMaps);
		this._map.addLayer(layer);
	}, undefined, this);
	
	if (goog.DEBUG){
		window['mapsearchLayer'] = this._mapsearchLayer;
	};
};

/**
 * @param {vk2.tool.Permalink} permalink
 */
vk2.controller.MapController.prototype.registerPermalinkTool = function(permalink){
	// register addmtb event
	goog.events.listen(permalink, 'addmtb', function(event){
		var feature = event.target.feature;
		
		// request associated messtischblaetter for a blattnr
		var layer = this._createHistoricMapForFeature(feature);
		var assocatiedMaps = this._createAssociationMapsArray(feature);	
		for (var i = 0; i < assocatiedMaps.length; i++){
			if (assocatiedMaps[i].getId() === layer.getId()){
				assocatiedMaps.splice(i, 1);
				break;
			};
		};
		layer.setAssociations(assocatiedMaps);
		this._map.addLayer(layer);
	}, undefined, this);
};

/**
 * @param {vk2.tool.TimeSlider} timeSlider
 */
vk2.controller.MapController.prototype._registerTimeSliderTool = function(timeSlider){
	// this event links the content of the map search list with the time slider
	goog.events.listen(timeSlider, 'timechange', function(event){
		this._mapsearchLayer.setTimeFilter(event.target.time[0], event.target.time[1]);
		this._handler['updateMapSearchModule']();
	}, undefined, this);
};

/**
 * Functions generate an array of historicmap objects which are associated to each other and
 * connected to there equal blattnr
 * @param {ol.Feature} feature
 * @return {Array.<vk2.layer.HistoricMap>}
 */
vk2.controller.MapController.prototype._createAssociationMapsArray = function(feature){
	var relativeFeatures = this._mapsearchLayer.getFeatureForBlattnr(feature.get('blattnr'));
	
	// first create for every timestamp a relative map
	var relativeMaps = [];
	for (var i = 0; i < relativeFeatures.length; i++){
		relativeMaps.push(this._createHistoricMapForFeature(relativeFeatures[i]));	
	};
	
	// now associate the maps to each other
	for (var i = 0; i < relativeMaps.length; i++){
		
		// clone the relativeMaps and remove the reference of the relativeMaps[i] object
		var associatedMaps = goog.array.clone(relativeMaps);
		for (var j = 0; j < associatedMaps.length; j++){
			if (associatedMaps[j].getId() === relativeMaps[i].getId()){
				associatedMaps.splice(j, 1);
				break;
			};
		};
		
		relativeMaps[i].setAssociations(associatedMaps);
	};
	
	return relativeMaps;	
};

/**
 * @param {ol.Feature} feature
 * @return {vk2.layer.HistoricMap}
 */
vk2.controller.MapController.prototype._createHistoricMapForFeature = function(feature){
	return new vk2.layer.HistoricMap({
		'time':feature.get('time'),
		'border': feature.getGeometry().getCoordinates()[0],
		'extent': feature.getGeometry().getExtent(),
		'thumbnail': vk2.utils.generateMesstischblattThumbnailLink(feature.get('dateiname')),
		'title': feature.get('titel'),
		'id': feature.get('mtbid'),
	}, this._map);
};


/**
 * @param {ol.Map} map
 * @private
 */
vk2.controller.MapController.prototype._appendMapClickBehavior = function(map){
	map.on('singleclick', function(event){
		if (goog.DEBUG)
			console.log('Pixel: '+event.pixel);
		
		var features = [];
		this.forEachFeatureAtPixel(event.pixel, function(feature){
			features.push(feature);
		});
		
		if (goog.DEBUG)
			console.log(features);
	
		if (features.length > 0){
			var modal = new vk2.utils.Modal('vk2-overlay-modal',document.body, true);
			modal.open(undefined, 'mapcontroller-click-modal');
			
			for (var i = 0; i < features.length; i++){
				var anchor = goog.dom.createDom('a', {
					'href': vk2.settings.MAP_PROFILE_PAGE + '?objectid=' + features[i].get('objectid'),
					'innerHTML': features[i].get('title') + ' ' + features[i].get('time')
				});
				modal.appendToBody(anchor, 'map-profile');			
			};			
			
			if (features.length == 1)
				anchor.click();
		}
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
 * @param {vk2.module.SpatialTemporalSearchModule} spatialTempSearch
 */
vk2.controller.MapController.prototype.registerSpatialTemporalSearch = function(spatialTempSearch){
	this._registerMapSearchModule(spatialTempSearch.getMapSearchModule());
	this._registerTimeSliderTool(spatialTempSearch.getTimesliderTool());
	this._registerGazetteerSearchTool(spatialTempSearch.getGazetteerSearchTool());
};

