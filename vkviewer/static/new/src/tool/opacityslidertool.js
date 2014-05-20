goog.provide('vk2.tool.OpacitySlider');

goog.require('goog.dom');

/**
 * @param {Element|string} parentEl_id
 * @param {ol.layer.Layer} layer
 * @constructor
 * @extends {goog.events.EventTarget}
 */
vk2.tool.OpacitySlider = function(parentEl, layer){
	
	/**
	 * @type {Element}
	 * @private
	 */
	this._parentEl = goog.isString(parentEl) ? goog.dom.getElement(parentEl) : parentEl;


	// load html content
	this._loadHtmlContent(this._parentEl);
	this._appendSliderBehavior(this._sliderEl, layer);
};

/**
 * @param {Element} parentEl
 * @private
 */
vk2.tool.OpacitySlider.prototype._loadHtmlContent = function(parentEl){
	
	var containerEl = goog.dom.createDom('div',{'class':'opacity-container'});
	goog.dom.appendChild(parentEl, containerEl);
	
	
	var  sliderContainer = goog.dom.createDom('div', {'class':'slider-container'});
	goog.dom.appendChild(containerEl, sliderContainer);	
	
	/**
	 * @type {Element}
	 * @private
	 */
	this._sliderEl = goog.dom.createDom('div',{'class':'slider'});
	goog.dom.appendChild(sliderContainer, this._sliderEl);	
};

/**
 * @param {Element} sliderEl
 * @param {ol.layer.Layer} layer
 * @private
 */
vk2.tool.OpacitySlider.prototype._appendSliderBehavior = function(sliderEl, layer){
	var baseMin = 0, baseMax = 100;
	var minValueEl, maxValueEl;
	/**
	 * 	@param {number} value
	 *	@param {Element} element 
	 */
	var updatePosition = function(value, element){
		var style_left = (value - baseMin) / (baseMax - baseMin) * 100;
		element.style.left = style_left + '%';
		element.innerHTML = value + '%';
	};
	
	$(sliderEl).slider({
        'min': 0,
        'max': 100,
        'value': 100,
        'animate': 'slow',
        'orientation': 'horizontal',
        'step': 1,
        'slide': function( event, ui ) {
        	updatePosition(ui.value, valueEl);
        	layer.setOpacity(ui.value/100);        	
        },
        'change': goog.bind(function( event, ui ){
        	updatePosition(ui.value, valueEl);
        	layer.setOpacity(ui.value/100);
        }, this)
    });
	
	// append tooltips
	var valueEl = goog.dom.createDom('div',{
		'class':'tooltip value',
		'innerHTML':'100%'
	});
	goog.dom.appendChild(sliderEl, valueEl);
	
};

