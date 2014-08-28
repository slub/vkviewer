goog.provide('vk2.source.ServerPagination');

goog.require('ol.extent');
goog.require('goog.array');
goog.require('goog.net.XhrIo');
goog.require('goog.events');
goog.require('goog.events.EventTarget');
goog.require('goog.events.EventType');
goog.require('vk2.settings');
goog.require('vk2.utils');


/**
 * @classdesc
 * A vector source in one of the supported formats, using a custom function to
 * read in the data from a remote server.
 *
 * @param {olx.source.ServerPaginationOptions} options Options.
 * @constructor
 * @extends {goog.events.EventTarget}
 */
vk2.source.ServerPagination = function(options) {

	/**
	 * @private
	 * @type {string}
	 */
	this.projection_ = goog.isDef(options.projection) ? options.projection : 'EPSG:900913';
	  
	/**
	 * @private
	 * @type {number}
	 */
	this.maxFeatures_ = goog.isDef(options.maxfeatures) ?
	  options.maxfeatures : 20;
	
	/**
	 * @private
	 * @type {ol.extent}
	 */
	this.lastUpdateExtent_ = undefined;
	  
	/**
	 * @private
	 * @type {ol.Collection}
	 */
	this.featureCol_ = new ol.Collection();
	
	/**
	 * @private
	 * @type {string}
	 */
	this.sortAttribute_ = 'title';
	
	/**
	 * @private
	 * @type {string}
	 */
	this.sortOrder_ = 'ascending';
	
	/**
	 * This variable give the starting point for pagination
	 * @private
	 * @type {number}
	 */
	this.index_ = 0;
	
	/**
	 * @private
	 * @type {number}
	 */
	this.totalFeatures_ = undefined;
	  
	/**
	 * @private
	 * @type {ol.format.GeoJSON} 
	 */
	this.parser_ = new ol.format.GeoJSON({'defaultProjection':'EPSG:900913'});
	
	/**
	 * @private
	 * @type {ol.Map}
	 */
	this.map_ = options.map;
	   
  	this.activate();
	
  	goog.base(this);
};
goog.inherits(vk2.source.ServerPagination, goog.events.EventTarget);

/**
 * 
 */
vk2.source.ServerPagination.prototype.activate = function(){
	this.map_.on('moveend', this.update_, this);
};

/**
 * @param {Array.<ol.Feature>} features
 * @private
 */
vk2.source.ServerPagination.prototype.dispatchRefreshEvent_ = function(features){
	this.dispatchEvent(new goog.events.Event(vk2.source.ServerPagination.EventType.REFRESH,{
		'features': features,
		'totalFeatureCount': this.totalFeatures_
	}));
	
	if (goog.DEBUG){
		console.log('Refresh event.');
		console.log('Size of FeatureCollection: '+this.featureCol_.getLength());
		console.log('TotalFeatures: '+this.totalFeatures_);
	}
};

/**
 * @param {Array.<ol.Feature>} features
 * @private
 */
vk2.source.ServerPagination.prototype.dispatchPaginateEvent_ = function(features){
	this.dispatchEvent(new goog.events.Event(vk2.source.ServerPagination.EventType.PAGINATE,{
		'features': features,
		'totalFeatureCount': this.totalFeatures_
	}));
	
	if (goog.DEBUG){
		console.log('Paginate event.');
		console.log('Size of FeatureCollection: '+this.featureCol_.getLength());
		console.log('TotalFeatures: '+this.totalFeatures_);
	}
};

/**
 * @return {ol.Collection}
 */
vk2.source.ServerPagination.prototype.getFeatures = function(){
	return this.featureCol_;
};

/**
 * @return {number}
 */
vk2.source.ServerPagination.prototype.getTotalFeatures = function(){
	return this.totalFeatures_;
};

/**
 * @return {string}
 */
vk2.source.ServerPagination.prototype.getSortAttribute = function(){
	return this.sortAttribute_;
};

/**
 * @return {string}
 */
vk2.source.ServerPagination.prototype.getSortOrder = function(){
	return this.sortOrder_;
};

/**
 * Method checks if all features for a given extent are loaded. 
 * @return {boolean}
 */
vk2.source.ServerPagination.prototype.isComplete = function(){
	return this.featureCol_.getLength() >= this.totalFeatures_;
};

/**
 * @param {ol.Extent} extent
 * @param {string} projection
 * @param {Function} event_callback
 */
vk2.source.ServerPagination.prototype.loadFeatures_ = function(extent, projection, event_callback){
	
	var sortOrder = this.sortOrder_ === 'ascending' ? '+A' : '+D';
	var url = vk2.settings.PROXY_URL+'http://kartenforum.slub-dresden.de/geoserver/virtuelles_kartenforum/ows?service=WFS&version=1.0.0&request=GetFeature&' +	
			'typeName=virtuelles_kartenforum:mapsearch&outputFormat=application/json&' + 
			'srsname=' + projection + '&bbox=' + extent.join(',') + '&sortBy=' + this.sortAttribute_ + sortOrder +
			'&startIndex=' + this.index_ + '&maxFeatures=' + this.maxFeatures_;
						
	var xhr = new goog.net.XhrIo();
	goog.events.listenOnce(xhr, 'success', function(e){
		if (goog.DEBUG){
			console.log('Receive features');
		};
		    
		var xhr = /** @type {goog.net.XhrIo} */ (e.target);
		if (xhr.getResponseText()){
			// parse response GeoJSON 
			var data = xhr.getResponseJson();
			this.totalFeatures_ = data['totalFeatures'];
			xhr.dispose();
			var parsed_data = this.parser_.readFeatures(data);
			
			// fill featureCol and increment startIndex
			this.featureCol_.extend(parsed_data);
			this.index_ += parsed_data.length;
			    
			event_callback.call(this, parsed_data);		
		} else {
			console.log('Response is empty');
		};    
	}, false, this);
	
	xhr.send(url);
};

/**
 * @private
 */
vk2.source.ServerPagination.prototype.paginate_ = function(){
	if (goog.DEBUG) {
		console.log('Update Data of ServerPaginationSource.');
	};
	
	// check if there are anymore features to paginate and if yes gramp them
	if (this.index_ < this.totalFeatures_){
		var actual_extent = vk2.utils.calculateMapExtentForPixelViewport(this.map_);
		this.loadFeatures_(actual_extent, this.projection_, this.dispatchPaginateEvent_);
	};
};

vk2.source.ServerPagination.prototype.refresh = function(){
	this.refreshFeatures_(vk2.utils.calculateMapExtentForPixelViewport(this.map_), this.projection_);
};

/**
 * @private
 */
vk2.source.ServerPagination.prototype.update_ = function(){
	if (goog.DEBUG) {
		console.log('Update Data of ServerPaginationSource.');
	};

	var actual_extent = vk2.utils.calculateMapExtentForPixelViewport(this.map_);
	if (!goog.isDef(this.lastUpdateExtent_) || !ol.extent.equals(this.lastUpdateExtent_, actual_extent)){
		this.refreshFeatures_(actual_extent, this.projection_);
		this.lastUpdateExtent_ = goog.array.clone(actual_extent);
	};
};

/**
 * @param {ol.Extent} extent Extent
 * @param {string} projection
 */
vk2.source.ServerPagination.prototype.refreshFeatures_ = function(extent, projection) {
	this.featureCol_.clear();
	this.index_ = 0;
	this.loadFeatures_(extent, projection, this.dispatchRefreshEvent_);
};

/**
 * @param {string} sortAttribute
 */
vk2.source.ServerPagination.prototype.setSortAttribute = function(sortAttribute){
	this.sortAttribute_ = sortAttribute;
};

/**
 * @param {string} sortOrder
 */
vk2.source.ServerPagination.prototype.setSortOrder = function(sortOrder){
	this.sortOrder_ = sortOrder;
};

/**
 * @enum {string}
 */
vk2.source.ServerPagination.EventType = {
		// Is triggered if there was a pagination event. Incrementel data is added.
		PAGINATE: 'paginate',
		// Refresh is called when the complete search data is refreshed
		REFRESH: 'refresh'
};