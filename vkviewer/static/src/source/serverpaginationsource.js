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
	this.sortObject_ = 'title';
	
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
	this.map_.on('moveend', this.refresh_, this);
};

/**
 * @private
 */
vk2.source.ServerPagination.prototype.dispatchRefreshEvent_ = function(){
	this.dispatchEvent(new goog.events.Event(vk2.source.ServerPagination.EventType.REFRESH,{}));
	
	if (goog.DEBUG){
		console.log('Refresh event.');
		console.log('Size of FeatureCollection: '+this.featureCol_.getLength());
		console.log('TotalFeatures: '+this.totalFeatures_);
	}
};

/**
 * @private
 */
vk2.source.ServerPagination.prototype.dispatchPaginateEvent_ = function(){
	this.dispatchEvent(new goog.events.Event(vk2.source.ServerPagination.EventType.PAGINATE,{}));
	
	if (goog.DEBUG){
		console.log('Paginate event.');
		console.log('Size of FeatureCollection: '+this.featureCol_.getLength());
		console.log('TotalFeatures: '+this.totalFeatures_);
	}
};

/**
 * @param {ol.Extent} extent
 * @param {string} projection
 * @param {Function} event_callback
 */
vk2.source.ServerPagination.prototype.loadFeatures_ = function(extent, projection, event_callback){
		  	
		var url = vk2.settings.PROXY_URL+'http://kartenforum.slub-dresden.de/geoserver/virtuelles_kartenforum/ows?service=WFS&version=1.0.0&request=GetFeature&' +	
			'typeName=virtuelles_kartenforum:mapsearch&outputFormat=application/json&' + 
			'srsname=' + projection + '&bbox=' + extent.join(',') + '&sortedBy=' + this.sortObject_ + 
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
			    
			    event_callback.call(this, data);		
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
	
	var actual_extent = vk2.utils.calculateMapExtentForPixelViewport(this.map_);
	this.loadFeatures_(actual_extent, this.projection_, this.dispatchPaginateEvent_);
};

/**
 * @private
 * @param {Object} event
 */
vk2.source.ServerPagination.prototype.refresh_ = function(event){
	if (goog.DEBUG) {
		console.log('Update Data of ServerPaginationSource.');
		console.log(event);
	};

	var actual_extent = vk2.utils.calculateMapExtentForPixelViewport(event.currentTarget);
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
 * @enum {string}
 */
vk2.source.ServerPagination.EventType = {
		PAGINATE: 'paginate',
		// Refresh is called when the complete search data is refreshed
		REFRESH: 'refresh'
};