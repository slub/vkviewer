goog.provide('vk2.tool.SearchList');

goog.require('goog.object');
//goog.require('ol.Feature');

/**
 * @param {Array.<ol.Feature>=} features
 * @constructor
 */
vk2.tool.SearchList = function(opt_features){
	
	/**
	 * @type {Array.<ol.Features>}
	 * @private 
	 */
	this._features = goog.isDef(opt_features) ? opt_features : [];
	
	/**
	 * @type {string}
	 * @private
	 */
	this._sortedBy = undefined;
	
	/**
	 * @type {boolean}
	 * @private
	 */
	this._sortOrder = 'descending';
	
	/**
	 * @type {number}
	 * @private
	 */
	this._getFeaturePointer = 0;
	
	/**
	 * @type {number}
	 * @private
	 */
	this._interval = 20;
};

/**
 * @param {number}
 * @private
 */
vk2.tool.SearchList.prototype._incrementPointer = function(value){
	var incrementedValue = this._getFeaturePointer + value;
	
	if (incrementedValue > this._features.length)
		this._getFeaturePointer = this._features.length;
	
	if (incrementedValue < 0)
		this._getFeaturePointer = 0;
	
	this._getFeaturePointer = incrementedValue;
};

/**
 * @private
 */
vk2.tool.SearchList.prototype._refreshGetFeaturePointer = function(){
	this._getFeaturePointer = this._sortOrder === 'descending' ? 0 : this._features.length - 1;
};

/**
 * Function for sorting the feature arrays 
 * @param {string=} opt_type
 */
vk2.tool.SearchList.prototype.sort = function(opt_type){
	var _sortFunctions = {
			'compareNumbers': function(a, b){
			    return parseInt(a.get(opt_type)) - parseInt(b.get(opt_type));
			},
			'compareString':function(a, b){
			    if (a.get('titel') > b.get('titel'))
			       return 1;
			    if (a.get('titel') < b.get('titel'))
			       return -1;
			    return 0;
			}
	};
	
	if (goog.isDef(opt_type) && opt_type != this._sortedBy){
		switch(opt_type) {
		case 'time':
			this._features.sort(_sortFunctions['compareNumbers']);
			this._sortedBy = 'time';
			break;
		case 'georeference':
			this._features.sort(_sortFunctions['compareNumbers']);
			this._sortedBy = 'georeference';
			break;
		case 'title':
			this._features.sort(_sortFunctions['compareString']);
			this._sortedBy = 'title';
			break;
		default:
			this._features.sort();
		this._sortedBy = null;
			break;
		};
	};
};

/**
 * @return {Array.<ol.Feature>}
 */
vk2.tool.SearchList.prototype.getAllFeatures = function(){
	return this._features;
};

/**
 * @return {number}
 */
vk2.tool.SearchList.prototype.getCount = function(){
	return this._features.length;
};

/**
 * @param {string} sort_order
 */
vk2.tool.SearchList.prototype.getFeatures = function(sort_order){
	if (sort_order === 'descending')
		return this._features;
	
	if (sort_order === 'ascending'){
		var array = [];
		for (var i = this._features.length - 1; i >= 0; i--){
			array.push(this._features[i]);
		};
		return array;
	}
	return undefined;
};


vk2.tool.SearchList.prototype.getFeaturesIncremental = function(){
	var array = [];
	if (this._sortOrder === 'descending'){		
		var endLoop = (this._getFeaturePointer + this._interval) <= this._features.length ? this._getFeaturePointer + this._interval : 
			this._features.length;
		for (var i = this._getFeaturePointer; i < endLoop; i++){
			array.push(this._features[i]);
		};		
		this._incrementPointer(this._interval);
	} else if (this._sortOrder === 'ascending'){
		var endLoop = (this._getFeaturePointer - this._interval) >= 0 ? this._getFeaturePointer - this._interval : -1;
		for (var i = this._getFeaturePointer; i > endLoop; i--){	
			array.push(this._features[i]);
		};		
		this._incrementPointer(-1*this._interval);
	};
	return array;
};

/**
 * @param {number} interval
 */
vk2.tool.SearchList.prototype.setInterval = function(interval){
	this._interval = interval;
};

/**
 * True means descending, false means ascending
 * @param {string} sortOrder
 */
vk2.tool.SearchList.prototype.setSortOrder = function(sortOrder){
	if (sortOrder !== this._sortOrder){
		this._sortOrder = sortOrder;
		this._refreshGetFeaturePointer();
	};		
};


