goog.provide('vk2.utils');

goog.require('goog.dom');
goog.require('goog.dom.classes');

/**
 * @param {Element} element
 * @param {string} className
 */
vk2.utils.getClosestParentElementForClass = function(element, className){
	var element = goog.dom.classes.has(element, className) ? element : 
		this.getClosestParentElementForClass(goog.dom.getParentElement(element), className);
	return element;
};


