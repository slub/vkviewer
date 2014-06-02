goog.provide('vk2.module.MapSearchModule');

goog.require('goog.dom');
goog.require('goog.dom.classes');
goog.require('goog.events');
goog.require('goog.events.EventTarget');
goog.require('goog.events.EventType');
goog.require('vk2.factory.MapSearchFactory');

/**
 * @param {Element|string} parentEl_id
 * @param {ol.layer.Vector=} feature_layer
 * @constructor
 * @extends {goog.events.EventTarget}
 */
vk2.module.MapSearchModule = function(parentEl, feature_layer){
	
	/**
	 * @type {Element}
	 * @private
	 */
	this._parentEl = goog.isString(parentEl) ? goog.dom.getElement(parentEl) : parentEl;

	/**
	 * @type {Array.<string>}
	 * @private
	 */
	this._searchCols = ['time','title','georeference'];
	
	/**
	 * @type {Object}
	 * @private
	 */
	this._searchFeatures = {
			/**@type {Array.<ol.Features>} */
			'features':[],
			/** @type {number} */
			'index':0,
			/** @type {string}*/
			'sortedby': null,
			/**
			 * function for getting the right feature for a mtbid
			 * @param {string} id
			 */
			'getFeatureForId': function(id){
				for (var i = 0, len = this['features'].length; i < len; i++){
					if (this['features'][i].get('mtbid') == id)
						return this['features'][i];
				};
			},
			/**
			 * function for sorting the feature arrays 
			 * @param {string} type
			 */
			'sortFeatures': function(type){			
				// compare functions
				var compareNumbers = function(a, b){
				    return parseInt(a.get(type)) - parseInt(b.get(type));
				};
				
				var compareString = function(a, b){
				    if (a.get('titel') > b.get('titel'))
				        return 1;
				      if (a.get('titel') < b.get('titel'))
				        return -1;
				         return 0;
				};
				
				var expre = goog.isDef(type) ? type : this['sortedBy'];
				switch(expre) {
					case 'time':
						this['features'].sort(compareNumbers);
						this['sortedby'] = 'time';
						break;
					case 'georeference':
						this['features'].sort(compareNumbers);
						this['sortedby'] = 'georeference';
						break;
					case 'title':
						this['features'].sort(compareString);
						this['sortedby'] = 'title';
						break;
					default:
						this['features'].sort();
						this['sortedby'] = null;
						break;
				};
			},
	};
	
	/**
	 * @type {ol.layer.Vector}
	 * @private
	 */
	this._featureLayer = goog.isDef(feature_layer) ? feature_layer : undefined;
	
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
		var col = goog.dom.createDom('div',{'class':'inner-col'});
		var content = goog.dom.createDom('div',{
			'data-type':type,
			'class': 'sort-element '+type,
			'innerHTML': type+' <span class="caret caret-reversed"></span>'
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
			var feature = this._searchFeatures.getFeatureForId(origin_target.id);
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
			this._sortFeatures(sort_type);
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
				var startIndex = this._searchFeatures['index'];
				var endIndex = this._searchFeatures['index'] + 20;
				var features = this._searchFeatures['features'].slice(startIndex, endIndex);
				this._appendFeaturesToList(features);
				// update index
				this._searchFeatures['index'] = endIndex;
				
				scroll_event_blocked = false;
			} else {
				if (goog.DEBUG)
					console.log('Scroll event fired but not used');
			}			
		}, undefined, this);
	}
};

/**
 * @param {Array.<ol.Features>} features
 * @param {string=} display_order
 * @private
 */
vk2.module.MapSearchModule.prototype._appendFeaturesToList = function(features, display_order){
	var displayOrder = goog.isDef(display_order) ? display_order : 'descending';
	
	/**
	 * @param {ol.Feature} feature
	 */
	var addElementFunction = goog.bind(function(feature){
		var element = vk2.factory.MapSearchFactory.getMapSearchRecord(features[i]);
		goog.dom.appendChild(this._searchListEl,element);
		if (goog.isDef(this._featureLayer))
			vk2.factory.MapSearchFactory.addHoverToMapSearchRecord(element, features[i], this._featureLayer);
	}, this);

	if (displayOrder === 'descending') {
		// append features to list
		for (var i = 0, ii = features.length; i < ii; i++){
			addElementFunction(features[i]);};
	} else {
		// append features to list
		for (var i = features.length - 1, ii = 0; i >= ii; i--){
			addElementFunction(features[i]);};
	};
};

/**
 * @param {number} startIndex
 * @param {number} endIndex
 * @param {string=} display_order
 * @private
 */
vk2.module.MapSearchModule.prototype._refreshMapSearchList = function(startIndex, endIndex, display_order){
	// clear search list
	this._searchListEl.innerHTML = '';
	
	// redraw search list
	var numberShownRecords = endIndex > this._searchFeatures['features'].length ? 
			this._searchFeatures['features'].length : endIndex;
	this._appendFeaturesToList(this._searchFeatures['features'].slice(startIndex, endIndex), display_order);
	this._searchFeatures['index'] = endIndex;
};

/**
 * @param {string|number}
 * @private
 */
vk2.module.MapSearchModule.prototype._sortFeatures = function(type){
	// sort features
	this._searchFeatures.sortFeatures(type);
	
	// add class to sort element
	var display_order;
	var sortElements = goog.dom.getElementsByClass('sort-element');
	for (var i = 0; i < sortElements.length; i++){
		var has_descending_class = goog.dom.classes.has(sortElements[i], 'descending');
		// remove old classes
		goog.dom.classes.remove(sortElements[i], 'descending');
		goog.dom.classes.remove(sortElements[i], 'ascending');
		
		// find out display order and append class
		if (goog.dom.classes.has(sortElements[i], type)){
			display_order =  has_descending_class ? 'ascending' : 'descending';
			goog.dom.classes.add(sortElements[i], display_order);
		};
	};

	// refresh the mapsearch list
	this._refreshMapSearchList(0, this._searchFeatures['index'], display_order);
};

/**
 * @param {Array.<ol.Features>} features
 */
vk2.module.MapSearchModule.prototype.updateFeatures = function(features){
	this._searchFeatures['features'] = features;
	this._searchFeatures['index'] = 0;
	this._refreshMapSearchList(0, 30);
};

/**
 * @return {Array.<ol.Features>} 
 */
vk2.module.MapSearchModule.prototype.getFeatures = function(){
	return this._searchFeatures['features'];
};
	
/**
 * @enum {string}
 */
vk2.module.MapSearchModule.EventType = {
		ADDMTB: 'addmtb'
};
