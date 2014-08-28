goog.provide('vk2.module.MapSearchModule');

goog.require('goog.dom');
goog.require('goog.dom.classes');
goog.require('goog.events');
goog.require('goog.events.Event');
goog.require('goog.events.EventTarget');
goog.require('goog.events.EventType');
//goog.require('ol.FeatureOverlay');
goog.require('vk2.factory.MapSearchFactory');
goog.require('vk2.tool.SearchList');
goog.require('vk2.source.ServerPagination');


/**
 * @param {Element|string} parentEl_id
 * @param {ol.FeatureOverlay=} featureOverlay
 * @param {ol.Map} map
 * @constructor
 * @extends {goog.events.EventTarget}
 */
vk2.module.MapSearchModule = function(parentEl, featureOverlay, map){
	
	/**
	 * @type {Element}
	 * @private
	 */
	this._parentEl = goog.isString(parentEl) ? goog.dom.getElement(parentEl) : parentEl;
	
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
	 * @type {string}
	 * @private
	 */
	this.sortOrder_ = 'ascending';
	
	/**
	 * @type {Array.<string>}
	 * @private
	 */
	this._searchCols = ['time','title','georeference'];
	
	/**
	 * @type {Object}
	 * @private
	 */
	this._searchFeatures = null;
	
	/**
	 * @type {number}
	 * @private
	 */
	this._featurePointer = 0
	
	/**
	 * @type {number}
	 * @private
	 */
	this._interval = 20;
	
	/**
	 * @type {string}
	 * @private
	 */
	this._sortType = 'title';
	
	/**
	 * @type {ol.featureOverlay}
	 * @private
	 */
	this._featureOverlay = goog.isDef(featureOverlay) ? featureOverlay : undefined;
	
	// load html content
	this._loadHtmlContent(this._parentEl);
	
	// append different events 
	this._appendSortBehavior(this._parentEl);
	this._appendScrollBehavior();
	this._appendClickBehavior();
	
	goog.base(this);
};
goog.inherits(vk2.module.MapSearchModule, goog.events.EventTarget);

/**
 * @param {Element} parentEl
 * @private
 */
vk2.module.MapSearchModule.prototype._loadHtmlContent = function(parentEl){
	
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
	this._searchListEl = goog.dom.createDom('ul',{'id':'mapsearch-contentlist', 'class':'mapsearch-contentlist'});
	goog.dom.appendChild(listContainer, this._searchListEl);	
};

/**
 * @private
 */
vk2.module.MapSearchModule.prototype._appendClickBehavior = function(){
	if (goog.isDef(this._searchListEl)){
		goog.events.listen(this._searchListEl, goog.events.EventType.CLICK, function(event){
			// get proper feature to the event
			var origin_target = vk2.utils.getClosestParentElementForClass(event.getBrowserEvent().target, 'mapsearch-record');
			
			// get the corresponding feature to this event
			var feature; 
			var features = this.featureSource_.getFeatures();
			features.forEach(function(ft){
				if (ft.get('id') == origin_target.id)
					feature = ft;
			});
//			
//			for (var i = 0, ii = this._searchFeatures.length; i < ii; i++){
//				if (this._searchFeatures[i].get('id') == origin_target.id)
//					feature =  this._searchFeatures[i];
//			};

			// dispatch event
			this.dispatchEvent(new goog.events.Event(vk2.module.MapSearchModule.EventType.ADDMTB,{'feature':feature}));
		}, undefined, this);
	};
};

/**
 * @param {Element} parentEl
 * @private
 */
vk2.module.MapSearchModule.prototype._appendSortBehavior = function(parentEl){
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
vk2.module.MapSearchModule.prototype._appendScrollBehavior = function(){
	// this variable blocks the append behavior if another appendFeatureToListRequest is 
	// right now in the pipe
	var scroll_event_blocked = false;
	if (goog.isDef(this._searchListEl)){
		goog.events.listen(this._searchListEl, goog.events.EventType.SCROLL, function(event){
			// looks if another scroll event is already in the pipe
			if (!scroll_event_blocked){
				scroll_event_blocked = true;
				
				var scrollEl = event.currentTarget;
				// check if scrolled to end of list and if yes triggger append event
				if (scrollEl.offsetHeight + scrollEl.scrollTop >= scrollEl.scrollHeight){
					
					//this._dispatchListEndEvent();
					
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
vk2.module.MapSearchModule.prototype._appendFeaturesToList = function(features){
	for (var i = 0; i < features.length; i++){
		var element = vk2.factory.MapSearchFactory.getMapSearchRecord(features[i]);
		goog.dom.appendChild(this._searchListEl,element);
		if (goog.isDef(this._featureOverlay))
			vk2.factory.MapSearchFactory.addHoverToMapSearchRecord(element, features[i], this._featureOverlay);
	};		
};

/**
 * @private
 */
vk2.module.MapSearchModule.prototype._dispatchListEndEvent = function(){
	if (goog.DEBUG){
		console.log('Dispatch ListEnd Event!');
	}
};

/**
 * @return {Array.<ol.Features>} 
 */
vk2.module.MapSearchModule.prototype.getFeatures = function(){
	return this.featureSource_.getFeatures();
};

/**
 * @param {Array.<Element>} elements
 * @param {string} type
 * @private
 */
vk2.module.MapSearchModule.prototype._getSortOrder = function(elements, type){
	for (var i = 0; i < sortElements.length; i++){
		
	}
};

/**
 * @private
 */
vk2.module.MapSearchModule.prototype._refreshMapSearchList = function(){
	this._searchListEl.innerHTML = '';
	this._appendFeaturesToList();
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
	
	// add class to sort element
//	var display_order;
//	var sortElements = goog.dom.getElementsByClass('sort-element');
//	for (var i = 0; i < sortElements.length; i++){
//		var has_descending_class = goog.dom.classes.has(sortElements[i], 'descending');
//		
//		// remove old classes
//		goog.dom.classes.remove(sortElements[i], 'descending');
//		goog.dom.classes.remove(sortElements[i], 'ascending');
//		
//		// find out display order and append class
//		if (goog.dom.classes.has(sortElements[i], type)){
//			display_order =  has_descending_class ? 'ascending' : 'descending';
//			goog.dom.classes.add(sortElements[i], display_order);
//		};
//	};

//	// refresh the mapsearch list
//	this._searchFeatures = sorter.getFeatures(display_order);
//	this._featurePointer = 0;
//	this._refreshMapSearchList();
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
	this._searchListEl.innerHTML = '';
	this._appendFeaturesToList(event.target.features);
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
	this._appendFeaturesToList(event.target.features);
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
		ADDMTB: 'addmtb',
		LISTEND: 'listend'
};
