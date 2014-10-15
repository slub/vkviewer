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
  
  var this_ = this;
  var openToolbox = goog.bind(function(event) {
	  event.preventDefault();
	  
	  if (goog.dom.classes.has(event.target, 'active')){
		  goog.dom.classes.remove(event.target, 'active');
		  this.close_();
		  return;
	  } 
	  
	  goog.dom.classes.add(event.target, 'active');
	  this.open_();
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
 * @private
 */
vk2.control.ImageManipulation.prototype.close_ = function(){
	if (goog.DEBUG)
		console.log('Close toolbox ...');
};

/**
 * @private
 */
vk2.control.ImageManipulation.prototype.open_ = function(){
	if (goog.DEBUG)
		console.log('Open toolbox ...');
};

