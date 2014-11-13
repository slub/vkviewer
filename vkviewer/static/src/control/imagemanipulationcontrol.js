goog.provide('vk2.control.ImageManipulation');

goog.require('goog.events');
goog.require('goog.dom.classes');

/**
 * @constructor
 * @extends {ol.control.Control}
 * @param {Object=} opt_options Control options.
 */
vk2.control.ImageManipulation = function(opt_options) {

  var options = opt_options || {};

  var anchor = document.createElement('a');
  anchor.href = '#image-manipulation';
  anchor.innerHTML = 'I';
  anchor.className = 'ol-has-tooltip';

  var tooltip = goog.dom.createDom('span', {'role':'tooltip','innerHTML':vk2.utils.getMsg('openImagemanipulation')})
  goog.dom.appendChild(anchor, tooltip);
  
  var openToolbox = goog.bind(function(event) {
	  event.preventDefault();
	  
	  if (goog.dom.classes.has(event.target, 'active')){
		  goog.dom.classes.remove(event.target, 'active');
		  this.close_(event.currentTarget.parentElement);
		  return;
	  } 
	  
	  goog.dom.classes.add(event.target, 'active');
	  this.open_(event.currentTarget.parentElement);
  }, this);

  
  goog.events.listen(anchor, 'click', openToolbox, undefined, this);
  goog.events.listen(anchor, 'touchstart', openToolbox, undefined, this);

  var element = document.createElement('div');
  element.className = 'image-manipulation ol-unselectable';
  element.appendChild(anchor);

  ol.control.Control.call(this, {
    element: element,
    target: options.target
  });

};
ol.inherits(vk2.control.ImageManipulation, ol.control.Control);

/**
 * @param {Element} parentEl
 * @private
 */
vk2.control.ImageManipulation.prototype.close_ = function(parentEl){
	if (goog.DEBUG)
		console.log('Close toolbox ...');
	
	$(this.sliderContainer_).fadeOut().removeClass('open');
};

/**
 * @param {string} className
 * @param {string} orientation
 * @param {Function} updateFn
 * @param {number=} opt_baseValue
 * @return {Element}
 * @private
 */
vk2.control.ImageManipulation.prototype.createSlider_ = function(className, orientation, updateFn, opt_baseValue){
	var sliderEl = goog.dom.createDom('div', {'class': 'slider ' + className});
	
	var baseMin = 0, baseMax = 100;
	var minValueEl, maxValueEl;
	var startValue = goog.isDef(opt_baseValue) ? opt_baseValue : 100;

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
        	updateFn(value);       	
        },
        'change': goog.bind(function( event, ui ){
        	var value = ui['value'];
        	updatePosition(value, valueEl);
        	updateFn(value);
        }, this)
    });
	
	// append tooltips
	var innerHtml = goog.isDef(opt_baseValue) ? opt_baseValue + '%' : '100%'; 
	var valueEl = goog.dom.createDom('div',{
		'class':'tooltip value '+className,
		'innerHTML': innerHtml
	});
	goog.dom.appendChild(sliderEl, valueEl);
	
	return sliderEl;
};

/**
 * @private
 * @return {ol.layer.Base}
 */
vk2.control.ImageManipulation.prototype.getBaseLayer_ = function(){
	return this.getMap().getLayers().getArray()[0];
};

/**
 * @param {Element} parentEl
 * @private
 */
vk2.control.ImageManipulation.prototype.initializeSliderContainer_ = function(parentEl){
	
	// create the container
	var sliderContainer = goog.dom.createDom('div', {'class':'slider-container', 'style':'display:none;'});
	goog.dom.appendChild(parentEl, sliderContainer);
	
	// add contrast slider
	var contrastSlider = this.createSlider_('slider-contrast', 'horizontal', goog.bind(function(value){
		this.getBaseLayer_()['setContrast'](value/100);
	}, this));
	goog.dom.appendChild(sliderContainer, contrastSlider);
	
	// add satuartion slider
	var saturationSlider = this.createSlider_('slider-saturation', 'horizontal', goog.bind(function(value){
		this.getBaseLayer_()['setSaturation'](value/100);
	}, this));
	goog.dom.appendChild(sliderContainer, saturationSlider);
	
	// add brightness slider
	var brightnessSlider = this.createSlider_('slider-brightness', 'horizontal', goog.bind(function(value){
		// doing linar mapping (normalisierung)
		var linarMapping = 2 * value / 100 -1;
		this.getBaseLayer_()['setBrightness'](linarMapping);
	}, this), 50);
	goog.dom.appendChild(sliderContainer, brightnessSlider);

	// add contrast slider
	var baseValue = 50;
	var hueSlider = this.createSlider_('slider-hue', 'horizontal', goog.bind(function(value){
		// doing arbitray mapping 
		var mapping = (value - baseValue) * 0.25;
		var hueValue = mapping == 0 ? 0 : mapping + this.getBaseLayer_()['getHue']();
		this.getBaseLayer_()['setHue'](hueValue);
	}, this), baseValue);
	goog.dom.appendChild(sliderContainer, hueSlider);
		
	return sliderContainer;
};

/**
 * @param {Element} parentEl
 * @private
 */
vk2.control.ImageManipulation.prototype.open_ = function(parentEl){
	if (goog.DEBUG)
		console.log('Open toolbox ...');
	
	if (goog.isDef(this.sliderContainer_)) {
		$(this.sliderContainer_).fadeIn().addClass('open');
	} else {
		this.sliderContainer_ = this.initializeSliderContainer_(parentEl);
		
		// fade in
		$(this.sliderContainer_).fadeIn().addClass('open');
	};
};

