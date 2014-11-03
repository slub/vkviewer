goog.provide('vk2.control.DynamicMapVisualization');

goog.require('goog.dom');
goog.require('goog.events');
goog.require('vk2.utils');
goog.require('vk2.tool.DynamicMapVisualization');

/**
 * @param {ol.Map} map
 * @constructor
 */
vk2.control.DynamicMapVisualization = function(map){
	
	/**
	 * @type {ol.Map}
	 * @private
	 */
	this.map_ = map;
	
	/**
	 * @type {Element}
	 * @private
	 */
	this.parentEl_ = goog.dom.createDom('div', {'class':'dyn-vis-control'});
	
	// create content container with control / feedback elements
	var contentEl = goog.dom.createDom('div', {'class':'content', 'style':'display:none;'});
	goog.dom.appendChild(this.parentEl_, contentEl);	
	
	var feedbackEl = this.createFeedbackEl_(contentEl);
	
	/**
	 * @type {vk2.tool.DynamicMapVisualization}
	 * @private
	 */
	this.dynamicMapVis_ = new vk2.tool.DynamicMapVisualization(feedbackEl);

	this.createContentEl_(contentEl);
	
	// create control element for the content container
	this.createMenuEl_(this.parentEl_, contentEl);
};

/**
 * @param {Element} parentEl
 * @param {Element} contentEl
 * @private
 */
vk2.control.DynamicMapVisualization.prototype.createMenuEl_ = function(parentEl, contentEl){
	var controlEl = goog.dom.createDom('a', {'innerHTML':'o','class':'open-dyn-vis'});
	goog.dom.insertChildAt(parentEl, controlEl, 0);
	
	goog.events.listen(controlEl,'click', function(event){
		$(contentEl).slideToggle();
		
		if (goog.dom.classes.has(event.currentTarget, 'open')){
			this.dynamicMapVis_.stopTimerseriesAnimation();
			goog.dom.classes.remove(event.currentTarget, 'open');
		} else {
			goog.dom.classes.add(event.currentTarget, 'open');
		};
	}, undefined, this);
};

/**
 * @param {Element} contentEl
 * @private
 */
vk2.control.DynamicMapVisualization.prototype.createContentEl_ = function(contentEl){
		
	var eventListeners = {
		start: function(event){
			var layers = this.map_.getHistoricMapLayer();
			this.dynamicMapVis_.startTimerseriesAnimation(layers, this.map_);
		},
		stop: function(event){
			this.dynamicMapVis_.stopTimerseriesAnimation();
		}
	};

	// create start button
	var startContainerEl = goog.dom.createDom('div', {'class':'start-container'});
	goog.dom.appendChild(contentEl, startContainerEl);
	
	var startAnchor = goog.dom.createDom('a', {
		'href':'#dynamic-start',
		'title':vk2.utils.getMsg('dynMapVisStart'),
		'innerHTML':'Start'
	});
	goog.dom.appendChild(startContainerEl, startAnchor);
	goog.events.listen(startAnchor, 'click', eventListeners.start, undefined, this);
	
	var tooltipStart = goog.dom.createDom('span', {'role':'tooltip','innerHTML':vk2.utils.getMsg('dynMapVisStart')});
	goog.dom.appendChild(startAnchor, tooltipStart);
	
	// create stop button
	var stopContainerEl = goog.dom.createDom('div', {'class':'stop-container'});
	goog.dom.appendChild(contentEl, stopContainerEl);
	
	var stopAnchor = goog.dom.createDom('a', {
		'href':'#dynamic-stop',
		'title':vk2.utils.getMsg('dynMapVisStop'),
		'innerHTML':'Stop'
	});
	goog.dom.appendChild(stopContainerEl, stopAnchor);
	goog.events.listen(stopAnchor, 'click', eventListeners.stop, undefined, this);
	
	var tooltipStop = goog.dom.createDom('span', {'role':'tooltip','innerHTML':vk2.utils.getMsg('dynMapVisStop')});
	goog.dom.appendChild(stopAnchor, tooltipStop);
};

/**
 * @param {Element} contentEl
 * @return {Element}
 * @private
 */
vk2.control.DynamicMapVisualization.prototype.createFeedbackEl_ = function(contentEl){
	
	var feedbackEl = goog.dom.createDom('div', {'class':'feedback'});
	goog.dom.appendChild(contentEl, feedbackEl);
	
	return feedbackEl;
};

/**
 * @return {Element}
 */
vk2.control.DynamicMapVisualization.prototype.getElement = function(){
	return this.parentEl_;
};