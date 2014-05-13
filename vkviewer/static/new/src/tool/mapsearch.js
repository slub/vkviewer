/**
 * @fileoverview FeatureRecord is a record class which does the binding between the vector data source and the SearchTable
 * @author jacobmendt@googlemail.de (Jacob Mendt)
 */
goog.provide('VK2.Tools.MapSearch');

goog.require('goog.dom');
goog.require('goog.dom.classes');
goog.require('goog.events');
goog.require('goog.events.EventType');
goog.require('VK2.Layer.MapSearch');
goog.require('VK2.Tools.SearchTable');
goog.require('VK2.Utils.Styles');
goog.require('VK2.Tools.MinimizeMesstischblattView');

/**
 * @param {Object} map OpenLayers.Map object
 * @param {number} maxRes Maximum resolution for displaying the feature layer
 * @param {Array.<number>} timestamps Array which contains the min and max timestamps
 * @param {string} feedBackContainer Id of the container where the feature loading feedback should be displayed
 * @param {string} table_container
 * @param {Element} container_minimizeView
 * @constructor
 */
VK2.Tools.MapSearch = function(map, maxRes, timestamps, feedBackContainer, table_container, container_minimizeView){
	
	/**
	 * @type {Object}
	 * @private
	 */
	this._map = map;
		
	/**
	 * @type {VK2.Tools.MinimizeMesstischblattView}
	 * @private
	 */
	this._minimizeView = new VK2.Tools.MinimizeMesstischblattView(container_minimizeView);	
	
	/**
	 * @type {Function}
	 * @private
	 */
	this._callbackUpdateHeading = function(count){
		var headingEl = goog.dom.getElementByClass('content', goog.dom.getElement(feedBackContainer));
		headingEl.innerHTML = count + ' ' + VK2.Utils.getMsg('found_mtb');
	};
	
	/**
	 * @type {Function}
	 * @private
	 */
	this._callbackMinimizeView = goog.bind(function(features){
		this._minimizeView.updateView(features);
	}, this);
	
	/**
	 * @type {Array.<number>} 
	 * @private
	 * Work around for the multiple firing of ol3 moveend events. Through comparing the center point of the move end event
	 * multiple running of the buisness logic is prevented.
	 */
	this._moveendIdentifier = null;
	
	/**
	 * @type {Object}
	 * @private
	 */
	this._eventListeners = {
			'update': function(event){
				if (goog.DEBUG)
					console.log('moveend event');
				
				// this expression is necessary for preventing multiple unnecessary calls of moveend behavior
				// because of multiple moveend events
				if (this._moveendIdentifier !== event.map.getView().getCenter()){
					var view = event.map.getView();
					var features = this._msLayer.getTimeFilteredFeatures(view.getView2D().calculateExtent(event.map.getSize()));
					if (features.length != this._table.getRowCount()){
						this._moveendIdentifier = view.getCenter();
						this._table.refresh(features, event.map, this._hoverLayer, this._callbackUpdateHeading, this._callbackMinimizeView);
						// update tablesorter
						$(this._table.getTableDomElement()).trigger('update');
					}
				};
			}
	};
	
	/**
	 * @type {VK2.Layer.MapSearch}
	 * @private
	 */
	this._msLayer = new VK2.Layer.MapSearch({
		'projection':'EPSG:900913',
		'loading_start': function(){
			var loadingEl = goog.dom.getElementByClass('loading',goog.dom.getElement(feedBackContainer));
			if (!goog.dom.classes.has(loadingEl,'active'))
				goog.dom.classes.add(loadingEl,'active');
		},
		'loading_end': function(){
			var loadingEl = goog.dom.getElementByClass('loading',this._feedBackEl);
			if (goog.dom.classes.has(loadingEl,'active'))
				goog.dom.classes.remove(loadingEl, 'active');
		}
	});
	
	/**
	 * @type {ol.FeatureOverlay}
	 * @private
	 */
	this._hoverLayer = new ol.FeatureOverlay({
		map: this._map,
		style: function(feature, resolution){
			return [ VK2.Utils.Styles.MAP_SEARCH_HOVER_FEATURE ];
		}
	});
	
	/**
	 * @type {Object}
	 * @private
	 */
	this._table = new VK2.Tools.SearchTable(table_container, [{'id':'time', 'title':VK2.Utils.getMsg('timestamp')},{'id':'titel', 'title':VK2.Utils.getMsg('titel')}]);
	// initialize tablesorter plugin for the searchtable
	$(this._table.getTableDomElement()).tablesorter();
};

/**
 * @private
 */
VK2.Tools.MapSearch.prototype._registerMapEvents = function(){
	console.log('Register event');
	this._map.on('moveend', this._eventListeners['update'], this);
};

/**
 * @private
 */
VK2.Tools.MapSearch.prototype._unregisterMapEvents = function(){
	console.log('Unregister event');
	this._map.un('moveend', this._eventListeners['update'], this);
};

/**
 * @param {number} start_time
 * @param {number} end_time
 */
VK2.Tools.MapSearch.prototype.updateTimeFilter = function(start_time, end_time){
	this._msLayer.setTimeFilter(start_time,end_time);
	console.log('Displayed features '+features.length);
//	this._ftLayer.timestamps = timestamps;
//	this._ftLayer.refreshLayer();
}

VK2.Tools.MapSearch.prototype.activate = function(){
	console.log('MapSearch activated.');
	this._map.addLayer(this._msLayer);
	this._registerMapEvents();

	
//	if (this._map.getLayerIndex(this._ftLayer) == -1){
//		// add layers to map object
//		this._map.addLayer(this._hoverLayer);
//		this._map.addLayer(this._ftLayer);
//		
//		// add event behavior 
//		this._controller.registerFeatureLayerBehavior(this._feedBackEl);
//	}
//	
//	this._ftLayer.setVisibility(true);
//	this._ftLayer.refreshLayer();
//	this._hoverLayer.setVisibility(true);
	//this._controller.unregisterFeatureLayerBehavior();
}

VK2.Tools.MapSearch.prototype.deactivate = function(){
	console.log('MapSearch deactivated.');
	this._map.removeLayer(this._msLayer);
	this._unregisterMapEvents();
}

