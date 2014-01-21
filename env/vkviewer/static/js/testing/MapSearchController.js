goog.provide('VK2.Controller.MapSearchController');

/**
 * @param {Object} map OpenLayers.Map
 * @param {Object} ftLayer OpenLayers.Layer.Vector
 * @param {Object} hoverLayer OpenLayers.Layer.Vector
 * @constructor
 */
VK2.Controller.MapSearchController = function(map, ftLayer, hoverLayer){
	
	/**
	 * @type {Object}
	 * @private
	 */
	this._map = map;
	
	/**
	 * @type {Object}
	 * @private
	 */
	this._ftLayer = ftLayer;
	
	/**
	 * @type {Object}
	 * @private
	 */
	this._hoverLayer = hoverLayer; 
}

/**
 * @param {Object} table VK2.Tools.SearchTable
 * @public
 */
VK2.Controller.MapSearchController.prototype.registerSearchTable = function(table){
	this._table = table;
}

/**
 * @param {Element} rowElement Represention the <tr> element of an row.
 * @param {Object} feature OpenLayers.Feature.Vector.Polygon
 * @public
 */
VK2.Controller.MapSearchController.prototype.addRowBehavior = function(rowElement, feature){
	this._addRowClickBehavior(rowElement, feature);
	this._addRowHoverBehavior(rowElement, feature);
}

/**
 * @param {Element} rowElement Represention the <tr> element of an row.
 * @param {Object} feature OpenLayers.Feature.Vector.Polygon
 * @private
 */
VK2.Controller.MapSearchController.prototype._addRowClickBehavior = function(rowElement, feature){
	var _ftLayer = this._ftLayer;
	
	$(rowElement).click( function() {
		// set map center corresponding to the feature
		var center = feature.geometry.getCentroid();
		_ftLayer.map.setCenter(new OpenLayers.LonLat(center.x, center.y), 4);
		
		// restore hover event after click event
		$(this).trigger('mouseenter');
		
		// hear the callback should be placed
		console.log(feature.data['time'])
	});
}

/**
 * @param {Element} rowElement Represention the <tr> element of an row.
 * @param {Object} feature OpenLayers.Feature.Vector.Polygon
 * @private
 */
VK2.Controller.MapSearchController.prototype._addRowHoverBehavior = function(rowElement, feature){
	var _ftLayer = this._ftLayer;
	var _hoverLayer = this._hoverLayer;
	
	$(rowElement).hover( 
			function(){
				if (!$(this).hasClass('hover-table')){
					$(this).addClass('hover-table');
					_hoverLayer.updateGeometry(feature.geometry);
				}
			}, 
			function(){
				if ($(this).hasClass( 'hover-table' )){
					$(this).removeClass( 'hover-table' );
					
					// clear hover feature and redraw the underlying feature
					_hoverLayer.removeAllFeatures();
					_ftLayer.drawFeature(feature);
				}
			}
	)
}

/**
 * @param {Function} callbackRefreshData Callback for the feature data of the feature layer
 * @param {Element} ftLoadingCbEl Element for giving back feature loading status.
 * @public
 */
VK2.Controller.MapSearchController.prototype.registerFeatureLayerBehavior = function(ftLoadingCbEl){
	// persist parameter in class scope
	/**
	 * @type {Element}
	 * @private
	 */
	this._ftLoadingCbEl = ftLoadingCbEl;
	
	// register events
	
	// loading feedback events
	this._ftLayer.events.register('loadstart', this, this._featureLoadingFeedback);
	this._ftLayer.events.register('loadend', this, this._featureLoadingFeedback);
	
	// update feature data in table
	this._ftLayer.events.register('featuresadded', this, this._updateDisplayedFeatureData);
	this._ftLayer.events.register('featuresremoved', this, this._updateDisplayedFeatureData);
	
	// event for updating the layer in case of a map move event
	map.events.register('moveend', this, this._updateLayerFeatures);
}

/**
 * @public
 */
VK2.Controller.MapSearchController.prototype.unregisterFeatureLayerBehavior = function(){
	// unregister events
	
	// loading feedback events
	this._ftLayer.events.unregister('loadstart', this, this._featureLoadingFeedback);
	this._ftLayer.events.unregister('loadend', this, this._featureLoadingFeedback);
	
	// update feature data in table
	this._ftLayer.events.unregister('featuresadded', this, this._updateDisplayedFeatureData);
	this._ftLayer.events.unregister('featuresremoved', this, this._updateDisplayedFeatureData);
	
	// event for updating the layer in case of a map move event
	map.events.unregister('moveend', this, this._updateLayerFeatures);
}

/**
 * @private
 */
VK2.Controller.MapSearchController.prototype._updateLayerFeatures = function(e){
	if (this._map.getResolution() <= this._ftLayer.maxResolution){
		this._ftLayer.refreshLayer();
		//this._updateDisplayedFeatureData();
	} else {
		this._updateDisplayedFeatureData()
	
		// 	display error message in table header
		$(this._ftLoadingCbEl).find('.content').html('Bitte wählen Sie eine höhere Zoomstufe.')
	}
}

/**
 * @private
 */
VK2.Controller.MapSearchController.prototype._featureLoadingFeedback = function(e){
	
	var loadingEl = $(this._ftLoadingCbEl).find('.loading');
		
	if (e.type == 'loadstart'){
		loadingEl.addClass('active');
	} else if (e.type == 'loadend'){
		if (loadingEl.hasClass('active'))
			loadingEl.removeClass('active');
			
		$(this._ftLoadingCbEl).find('.content').html(this._ftLayer.features.length + ' Messtischblätter gefunden.')
	}
}

/**
 * @param {Object} objData 
 * @private
 */
VK2.Controller.MapSearchController.prototype._updateDisplayedFeatureData = function(objData){
	
	var data = {};

	if (objData){

		for (var i = 0; i < objData.features.length; i++){
			var feature = objData.features[i]
			data[feature.data['mtbid']] = {
				'titel':feature.data['titel'],
				'time':feature.data['time'], 
				'feature':feature
			};
		}
	} 

	this._table.refreshData(data);
	this._hoverLayer.activate();
}

