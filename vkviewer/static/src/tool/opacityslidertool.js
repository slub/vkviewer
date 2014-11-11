goog.provide('vk2.tool.OpacitySlider');

goog.require('goog.dom');

/**
 * @param {Element|string} parentEl_id
 * @param {ol.layer.Layer} layer
 * @param {string=} opt_orientation
 * @constructor
 * @extends {goog.events.EventTarget}
 */
vk2.tool.OpacitySlider = function(parentEl, layer, opt_orientation){
	
	/**
	 * @type {Element}
	 * @private
	 */
	this._parentEl = goog.isString(parentEl) ? goog.dom.getElement(parentEl) : parentEl;

	var orientation = goog.isDef(opt_orientation) && goog.isString(opt_orientation) ? opt_orientation : 'horizontal'

	// load html content
	this._loadHtmlContent(this._parentEl);
	this._appendSliderBehavior(this._sliderEl, layer, orientation);
};

/**
 * @param {Element} parentEl
 * @private
 */
vk2.tool.OpacitySlider.prototype._loadHtmlContent = function(parentEl){
	
	var containerEl = goog.dom.createDom('div',{'class':'opacity-container'});
	goog.dom.appendChild(parentEl, containerEl);
	
	
	var  sliderContainer = goog.dom.createDom('div', {'class':'slider-container opacity-slider'});
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
 * @param {string} orientation
 * @private
 */
vk2.tool.OpacitySlider.prototype._appendSliderBehavior = function(sliderEl, layer, orientation){
	var baseMin = 0, baseMax = 100;
	var minValueEl, maxValueEl;
	var startValue = layer.getOpacity()*100;

	/**
	 * 	@param {number} value
	 *	@param {Element} element 
	 */
	var updatePosition = function(value, element){
		if (orientation == 'vertical'){
			var style_top = 100 - ((value - baseMin) / (baseMax - baseMin) * 100);
			element.style.top = style_top + '%';
			element.innerHTML = value + '%';
			return;
		};
		
		var style_left = (value - baseMin) / (baseMax - baseMin) * 100;
		element.style.left = style_left + '%';
		element.innerHTML = value + '%';
	};
	
	$(sliderEl).slider({
        'min': 0,
        'max': 100,
        'value': startValue,
        'animate': 'slow',
        'orientation': orientation,
        'step': 1,
        'slide': function( event, ui ) {
        	var value = ui['value'];
        	updatePosition(value, valueEl);
        	layer.setOpacity(value/100);        	
        },
        'change': goog.bind(function( event, ui ){
        	var value = ui['value'];
        	updatePosition(value, valueEl);
        	layer.setOpacity(value/100);
        }, this)
    });
	
	// append tooltips
	var valueEl = goog.dom.createDom('div',{
		'class':'tooltip value',
		'innerHTML':'100%'
	});
	goog.dom.appendChild(sliderEl, valueEl);
	
	// append slide behavior 
	var breakValue = 19;
	layer.on('change:opacity', function(event){
		var opacity = this.getOpacity() * 100;
		//console.log('Opacity: ' + opacity + ', Slider value: ' + $(sliderEl).slider('value'));

		if (Math.abs(opacity - $(sliderEl).slider('value')) > breakValue){
			$(sliderEl).slider('value', opacity);
		};
	});
};

