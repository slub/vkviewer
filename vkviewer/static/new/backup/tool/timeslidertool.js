goog.provide('vk2.tool.TimeSlider');

goog.require('goog.dom');
goog.require('goog.events');
goog.require('goog.events.EventTarget');
goog.require('goog.events.EventType');

/**
 * @param {Element|string} parentEl_id
 * @constructor
 * @extends {goog.events.EventTarget}
 */
vk2.tool.TimeSlider = function(parentEl, feature_layer){
	
	/**
	 * @type {Element}
	 * @private
	 */
	this._parentEl = goog.isString(parentEl) ? goog.dom.getElement(parentEl) : parentEl;


	// load html content
	this._loadHtmlContent(this._parentEl);
	this._appendSliderBehavior(this._sliderEl);
	
	goog.base(this);
};
goog.inherits(vk2.tool.TimeSlider, goog.events.EventTarget);

/**
 * @param {Element} parentEl
 * @private
 */
vk2.tool.TimeSlider.prototype._loadHtmlContent = function(parentEl){
	
	var containerEl = goog.dom.createDom('div',{'class':'timeslider-container'});
	goog.dom.appendChild(parentEl, containerEl);
	
	var labelEl = goog.dom.createDom('label',{'innerHTML':'Cooming soon ...'});
	goog.dom.appendChild(containerEl, labelEl);
	
	// add mapsearch heading
	/**
	 * @type {Element}
	 * @private
	 */
	this._sliderEl = goog.dom.createDom('div',{'class':'slider'});
	goog.dom.appendChild(containerEl, this._sliderEl);	
};

/**
 * @param {Element} sliderEl
 * @private
 */
vk2.tool.TimeSlider.prototype._appendSliderBehavior = function(sliderEl){
	var baseMin = 1868, baseMax = 1945;
	var minValueEl, maxValueEl;
	/**
	 * 	@param {number} value
	 *	@param {Element} element 
	 */
	var updatePosition = function(value, element){
		var style_left = (value - baseMin) / (baseMax - baseMin) * 100;
		element.style.left = style_left + '%';
		element.innerHTML = value;
	};
	
	$(sliderEl).slider({
        'range': true,
        'min': 1868,
        'max': 1945,
        'values': [1868, 1945],
        'animate': 'slow',
        'orientation': 'horizontal',
        'step': 1,
        'slide': function( event, ui ) {
        	updatePosition(ui.values[0], minValueEl);
        	updatePosition(ui.values[1], maxValueEl);
        },
        'change': goog.bind(function( event, ui ){
        	updatePosition(ui.values[0], minValueEl);
        	updatePosition(ui.values[1], maxValueEl);
        	this.dispatchEvent(new goog.events.Event(vk2.tool.TimeSlider.EventType.TIMECHANGE,{'time':ui.values}));
        }, this)
    });
	
	// append tooltips
	minValueEl = goog.dom.createDom('div',{
		'class':'tooltip min-value',
		'innerHTML':1868
	});
	goog.dom.appendChild(sliderEl, minValueEl);
	
	maxValueEl = goog.dom.createDom('div',{
		'class':'tooltip max-value',
		'innerHTML':1945
	});
	goog.dom.appendChild(sliderEl, maxValueEl);
};

/**
 * @enum {string}
 */
vk2.tool.TimeSlider.EventType = {
		TIMECHANGE: 'timechange'
};
