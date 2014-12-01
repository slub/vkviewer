goog.provide('vk2.module.SpatialTemporalSearchModule');

goog.require('goog.dom');
goog.require('goog.dom.classes');
goog.require('goog.events');
//goog.require('ol.FeatureOverlay');
goog.require('vk2.factory.MapSearchFactory');
goog.require('vk2.tool.TimeSlider');
goog.require('vk2.tool.GazetteerSearch');
goog.require('vk2.module.MapSearchModule');

/**
 * @param {Element|string} parentEl
 * @param {ol.Map} map
 * @constructor
 */
vk2.module.SpatialTemporalSearchModule = function(parentEl, map){
	
	/**
	 * @type {Element}
	 * @private
	 */
	this._parentEl = goog.isString(parentEl) ? goog.dom.getElement(parentEl) : parentEl;

	// load html content
	this._loadHtmlContent(this._parentEl);
	
	// load module and tools
	this._loadGazetteerSearch(this._bodyContainerEl);
	this._loadTimeSlider(this._bodyContainerEl);
	this._loadMapSearchModule(this._bodyContainerEl, map);
};

/**
 * @param {Element} parentEl
 * @private
 */
vk2.module.SpatialTemporalSearchModule.prototype._loadHtmlContent = function(parentEl){
	
	var containerEl = goog.dom.createDom('div',{'class':'spatialsearch-inner-container'});
	goog.dom.appendChild(parentEl, containerEl);
	
	var panelEl = goog.dom.createDom('div',{'class':'spatialsearch-content-panel'});
	goog.dom.appendChild(containerEl, panelEl);
	
	// add mapsearch heading
	var heading = goog.dom.createDom('div',{'class':'header-container'});
	goog.dom.appendChild(panelEl, heading);
	
	/**
	 * @type {Element}
	 * @private
	 */
	this._headingContentEl = goog.dom.createDom('div',{'class':'content'});
	goog.dom.appendChild(heading, this._headingContentEl);
		
	// add mapsearch body
	this._bodyContainerEl = goog.dom.createDom('div',{'class':'body-container'});
	goog.dom.appendChild(panelEl, this._bodyContainerEl);
};

/**
 * @param {Element} parentEl
 * @private
 */
vk2.module.SpatialTemporalSearchModule.prototype._loadGazetteerSearch = function(parentEl){
	/**
	 * @type {vk2.tool.GazetteerSearch}
	 * @private
	 */
	this._gazetteer = new vk2.tool.GazetteerSearch(parentEl);
};

/**
 * @param {Element} parentEl
 * @param {ol.Map} map
 * @private
 */
vk2.module.SpatialTemporalSearchModule.prototype._loadMapSearchModule = function(parentEl, map){	
	/**
	 * @type {vk2.module.MapSearchModule}
	 * @private
	 */
	this._mapsearch = new vk2.module.MapSearchModule(parentEl, map);
};

vk2.module.SpatialTemporalSearchModule.prototype._loadTimeSlider = function(parentEl){
	/**
	 * @type {vk2.tool.TimeSlider}
	 * @private
	 */
	this._timeslider = new vk2.tool.TimeSlider(parentEl);
};

/**
 * @return {vk2.tool.TimeSlider}
 */
vk2.module.SpatialTemporalSearchModule.prototype.getTimesliderTool = function(){
	return this._timeslider;
};

/**
 * @return {vk2.tool.GazetteerSearch}
 */
vk2.module.SpatialTemporalSearchModule.prototype.getGazetteerSearchTool = function(){
	return this._gazetteer;
};

/**
 * @return {vk2.module.MapSearchModule}
 */
vk2.module.SpatialTemporalSearchModule.prototype.getMapSearchModule = function(){
	return this._mapsearch;
};