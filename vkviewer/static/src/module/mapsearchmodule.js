goog.provide('vk2.module.MapSearchModule');

goog.require('goog.dom');
goog.require('goog.dom.classes');
goog.require('goog.events');
goog.require('goog.events.Event');
goog.require('goog.events.EventTarget');
goog.require('goog.events.EventType');
//goog.require('ol.FeatureOverlay');
goog.require('vk2.factory.MapSearchFactory');
goog.require('vk2.source.ServerPagination');


/**
 * @param {Element|string} parentEl_id
 * @param {ol.FeatureOverlay=} featureOverlay
 * @param {ol.Map} map
 * @constructor
 * @extends {goog.events.EventTarget}
 */
vk2.module.MapSearchModule = function(parentEl, map){
	
	/**
	 * @type {Element}
	 * @private
	 */
	this.parentEl_ = goog.isString(parentEl) ? goog.dom.getElement(parentEl) : parentEl;
	
	/**
	 * @type {vk2.source.ServerPagination}
	 * @private
	 */
	this.featureSource_ = new vk2.source.ServerPagination({
		'projection': 'EPSG:900913',
		'map': map
	});
	goog.events.listen(this.featureSource_, 'refresh', goog.bind(this.refresh_, this));
	goog.events.listen(this.featureSource_, 'paginate', goog.bind(this.update_, this));
	
	/**
	 * @type {Array.<string>}
	 * @private
	 */
	this._searchCols = ['time','title','georeference'];
	
	/**
	 * @type {ol.featureOverlay}
	 * @private
	 */
	this.featureOverlay_ = new ol.FeatureOverlay({
		map: map,
		style: function(feature, resolution) {
		    return [vk2.utils.Styles.MAP_SEARCH_HOVER_FEATURE];
		}	
	});
	
	// load html content
	this.loadHtmlContent_(this.parentEl_);
	
	// append different events 
	this.appendSortBehavior_(this.parentEl_);
	this.appendScrollBehavior_();
	this.appendClickBehavior_();
	
	goog.base(this);
};
goog.inherits(vk2.module.MapSearchModule, goog.events.EventTarget);

/**
 * @param {Element} parentEl
 * @private
 */
vk2.module.MapSearchModule.prototype.loadHtmlContent_ = function(parentEl){
	
	/**
	 * @param {string} type
	 * @return {Element}
	 */
	var createSearchCol = function(type){
		var col = goog.dom.createDom('div',{'class':'inner-col '+type});
		var content = goog.dom.createDom('div',{
			'data-type':type,
			'class': 'sort-element '+type,
			'innerHTML': vk2.utils.getMsg(type)+' <span class="caret caret-reversed"></span>'
		});
		goog.dom.appendChild(col, content);
		return col;
	};
	
	var containerEl = goog.dom.createDom('div',{'class':'mapsearch-container'});
	goog.dom.appendChild(parentEl, containerEl);
	
	var panelEl = goog.dom.createDom('div',{'class':'panel panel-default searchTablePanel'});
	goog.dom.appendChild(containerEl, panelEl);
	
	// add mapsearch heading
	var heading = goog.dom.createDom('div',{'class':'panel-heading'});
	goog.dom.appendChild(panelEl, heading);
	
	/**
	 * @type {Element}
	 * @private
	 */
	this._headingContentEl = goog.dom.createDom('div',{'class':'content'});
	goog.dom.appendChild(heading, this._headingContentEl);
	
	/**
	 * @type {Element}
	 * @private
	 */
	this._loadingFeedbackEl = goog.dom.createDom('div',{'class':'loading'});
	goog.dom.appendChild(heading, this._loadingFeedbackEl);
	
	// add mapsearch body
	var body = goog.dom.createDom('div',{'class':'panel-body'});
	goog.dom.appendChild(panelEl, body);
	
	var listContainer = goog.dom.createDom('div',{'class':'mapsearch-list'});
	goog.dom.appendChild(body, listContainer);
	
	var listHeader = goog.dom.createDom('div',{'class':'list-header'});
	goog.dom.appendChild(listContainer, listHeader);
	
	// append heading cols 
	for (var i = 0; i < this._searchCols.length; i++){
		goog.dom.appendChild(listHeader, createSearchCol(this._searchCols[i]))
	};
	
	/**
	 * @type {Element}
	 * @private
	 */
	this.searchListEl_ = goog.dom.createDom('ul',{'id':'mapsearch-contentlist', 'class':'mapsearch-contentlist'});
	goog.dom.appendChild(listContainer, this.searchListEl_);	
};

/**
 * @private
 */
vk2.module.MapSearchModule.prototype.appendClickBehavior_ = function(){
	if (goog.isDef(this.searchListEl_)){
		goog.events.listen(this.searchListEl_, goog.events.EventType.CLICK, function(event){
			// get proper feature to the event
			var origin_target = vk2.utils.getClosestParentElementForClass(event.getBrowserEvent().target, 'mapsearch-record');
			
			// get the corresponding feature to this event
			var feature; 
			var features = this.featureSource_.getFeatures();
			features.forEach(function(ft){
				if (ft.get('id') == origin_target.id)
					feature = ft;
			});

			this.dispatchEvent(new goog.events.Event(vk2.module.MapSearchModule.EventType.ADDMTB,{'feature':feature}));
		}, undefined, this);
	};
};

/**
 * @param {Element} parentEl
 * @private
 */
vk2.module.MapSearchModule.prototype.appendSortBehavior_ = function(parentEl){
	var sortElements = goog.dom.getElementsByClass('sort-element', parentEl);
	for (var i = 0; i < sortElements.length; i++){
		goog.events.listen(sortElements[i], goog.events.EventType.CLICK, function(event){
			var sort_type = event.target.getAttribute('data-type');
			this.sort_(sort_type);
		}, undefined, this);
	};
};

/**
 * @private
 */
vk2.module.MapSearchModule.prototype.appendScrollBehavior_ = function(){
	// this variable blocks the append behavior if another appendFeatureToListRequest is 
	// right now in the pipe
	var scroll_event_blocked = false;
	if (goog.isDef(this.searchListEl_)){
		goog.events.listen(this.searchListEl_, goog.events.EventType.SCROLL, function(event){
			// looks if another scroll event is already in the pipe
			if (!scroll_event_blocked){
				scroll_event_blocked = true;
				
				var scrollEl = event.currentTarget;
				// check if scrolled to end of list and if yes triggger append event
				if (scrollEl.offsetHeight + scrollEl.scrollTop >= scrollEl.scrollHeight){
				
					// check if there are still features to append
					if (!this.featureSource_.isComplete())
						this.featureSource_.paginate_()
				};			
				
				scroll_event_blocked = false;
			} else {
				if (goog.DEBUG)
					console.log('Scroll event fired but not used');
			}			
		}, undefined, this);
	}
};

/**
 * @param {Array.<ol.Feature>} features
 * @private
 */
vk2.module.MapSearchModule.prototype.appendFeaturesToList_ = function(features){
	for (var i = 0; i < features.length; i++){
		var element = vk2.factory.MapSearchFactory.getMapSearchRecord(features[i]);
		goog.dom.appendChild(this.searchListEl_,element);
		if (goog.isDef(this.featureOverlay_))
			vk2.factory.MapSearchFactory.addHoverToMapSearchRecord(element, features[i], this.featureOverlay_);
	};		
};

/**
 * @return {Array.<ol.Features>} 
 */
vk2.module.MapSearchModule.prototype.getFeatures = function(){
	return this.featureSource_.getFeatures();
};

/**
 * @return {vk2.source.ServerPagination} 
 */
vk2.module.MapSearchModule.prototype.getFeatureSource = function(){
	return this.featureSource_;
};

/**
 * @private
 */
vk2.module.MapSearchModule.prototype.refreshMapSearchList_ = function(){
	this.searchListEl_.innerHTML = '';
	this.appendFeaturesToList_();
};

/**
 * @param {string|number}
 * @private
 */
vk2.module.MapSearchModule.prototype.sort_ = function(type){
	// get the sort control element and the sortOrder
	var sortControlEl = goog.dom.getElementByClass('sort-element.'+type);
	var sortOrder = goog.dom.classes.has(sortControlEl, 'ascending') ? 
			'descending' : 'ascending';
	
	// remove old sort classes
	var sortElements = goog.dom.getElementsByClass('sort-element');
	for (var i = 0; i < sortElements.length; i++){
		goog.dom.classes.remove(sortElements[i], 'descending');
		goog.dom.classes.remove(sortElements[i], 'ascending');
	};
	
	// sort list
	goog.dom.classes.add(sortControlEl, sortOrder);
	this.featureSource_.setSortAttribute(type);
	this.featureSource_.setSortOrder(sortOrder);
	this.featureSource_.refresh();
};

/**
 * @private
 * @param {Object} event
 */
vk2.module.MapSearchModule.prototype.refresh_ = function(event){
	if (goog.DEBUG){
		console.log('Refresh MapSearchModule.')
	};
	
	this.updateHeading_(event.target.totalFeatureCount);
	this.searchListEl_.innerHTML = '';
	this.appendFeaturesToList_(event.target['features']);
};

/**
 * @private
 * @param {Object} event
 */
vk2.module.MapSearchModule.prototype.update_ = function(event){
	if (goog.DEBUG){
		console.log('Refresh MapSearchModule.')
	};
	
	this.updateHeading_(event.target.totalFeatureCount);
	this.appendFeaturesToList_(event.target['features']);
};

/**
 * @param {number} count_features
 * @private
 */
vk2.module.MapSearchModule.prototype.updateHeading_ = function(count_features){
	if (count_features > 0){
		this._headingContentEl.innerHTML = count_features + ' ' + vk2.utils.getMsg('found_mtb');
		return undefined;
	};
	this._headingContentEl.innerHTML = vk2.utils.getMsg('found_no_maps');
};
	
/**
 * @enum {string}
 */
vk2.module.MapSearchModule.EventType = {
		ADDMTB: 'addmtb'
};
