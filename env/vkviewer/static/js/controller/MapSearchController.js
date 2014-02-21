goog.provide('VK2.Controller.MapSearchController');

goog.require('goog.dom');
goog.require('goog.dom.classes');
goog.require('goog.events');
goog.require('goog.events.EventType');

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
	
	goog.events.listen(rowElement, goog.events.EventType.CLICK, function(event){
		
		if (goog.dom.classes.has(event.target, 'anchor-show-metadata')) {
			// if event comes from a show single map click than show metadata 
			// if parentElement not initialize do it
			var parentElementId = 'metadata-record-parent';
			if (!goog.isDefAndNotNull(goog.dom.getElement(parentElementId))){
				var parentElement = goog.dom.createDom('div', {
					'class': 'metadata-record',
					'id': parentElementId
				});
				goog.dom.appendChild(document.body, parentElement);
			}
			
			// open mtb single view
			var extent = feature.geometry.bounds.left + ',' + feature.geometry.bounds.bottom + ',' + feature.geometry.bounds.right + ',' + feature.geometry.bounds.top;
			var anchor = goog.dom.createDom('a',{
				'href': '/vkviewer/profile/mtb?key='+feature.data.dateiname+'&extent='+extent+'&time='+feature.data.time,
			});
			goog.dom.appendChild(document.body, anchor);
			
			$(anchor).fancybox({
				'type': 'iframe',
				'href': '/vkviewer/profile/mtb?key='+feature.data.dateiname+'&extent='+extent+'&time='+feature.data.time,
				'width': '100%',
				'height': '100%'
			}).trigger('click');
			
			
		} else {
			// if not than jump to the place on the map		
			// set map center corresponding to the feature
			var center = feature.geometry.getCentroid();
			var zoom = _ftLayer.map.getZoom() > 4 ? _ftLayer.map.getZoom() : 4;
			_ftLayer.map.setCenter(new OpenLayers.LonLat(center.x, center.y), zoom);
			
			// update time value in input field
			goog.dom.getElement('spatialsearch-tools-input-layer').value = feature.data['time'];
			this._table.setLastFocusRow(feature.data['mtbid']);
		};
	}, undefined, this);
};

/**
 * @param {Element} rowElement Represention the <tr> element of an row.
 * @param {Object} feature OpenLayers.Feature.Vector.Polygon
 * @private
 */
VK2.Controller.MapSearchController.prototype._addRowHoverBehavior = function(rowElement, feature){
	var _ftLayer = this._ftLayer;
	var _hoverLayer = this._hoverLayer;
	
	$(rowElement).hover( 
			function(event){
				if (!$(this).hasClass('hover-table')){
					$(this).addClass('hover-table');
					_hoverLayer.updateGeometry(feature.geometry);
				}
			}, 
			function(event){
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
	
	// event for updating the layer in case of a map move event
	this._map.events.register('moveend', this, this._updateLayerFeatures);
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
	
	// event for updating the layer in case of a map move event
	this._map.events.unregister('moveend', this, this._updateLayerFeatures);
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
		goog.dom.getElementByClass('content',this._ftLoadingCbEl).innerHTML = VK2.Utils.get_I18n_String('change_zoomlevel');
	}
}

/**
 * @private
 */
VK2.Controller.MapSearchController.prototype._featureLoadingFeedback = function(e){
		
	var loadingEl = goog.dom.getElementByClass('loading',this._ftLoadingCbEl);
		
	if (e.type == 'loadstart'){
		goog.dom.classes.add(loadingEl,'active');
	} else if (e.type == 'loadend'){
		if (goog.dom.classes.has(loadingEl,'active'))
			goog.dom.classes.remove(loadingEl, 'active');
		
		// display message how many maps find
		goog.dom.getElementByClass('content', this._ftLoadingCbEl).innerHTML = 
			this._ftLayer.features.length + ' ' + VK2.Utils.get_I18n_String('found_mtb');
		
		if (this._ftLayer.features.length == 0)
			this._updateDisplayedFeatureData();
	}
}

/**
 * @param {Object} objData 
 * @private
 */
VK2.Controller.MapSearchController.prototype._updateDisplayedFeatureData = function(objData){
	
	if (goog.isDef(objData))
		console.log('Event type: '+objData.type);

	
	var data = {};

	if (objData){
		for (var i = 0; i < objData.features.length; i++){
			var feature = objData.features[i]
			data[feature.data['mtbid']] = {
				'titel':feature.data['titel'],
				'time':feature.data['time'], 
				'csw_id':feature.data['dateiname'],
				'feature':feature
			};
		}
	} 

	this._table.refreshData(data);
	this._hoverLayer.activate();
}

