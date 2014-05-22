goog.provide('vk2.georeference.gcp.AbstractGcpControl');

goog.require('goog.events.EventTarget');

/**
 * @constructor
 * @extends {goog.events.EventTarget}
 */
vk2.georeference.gcp.AbstractGcpControl = function(){
	goog.base(this);
};
goog.inherits(vk2.georeference.gcp.AbstractGcpControl, goog.events.EventTarget);

/**
 * @interface
 */
vk2.georeference.gcp.AbstractGcpControl.prototype.activate = function() {};

/**
 * @interface
 */
vk2.georeference.gcp.AbstractGcpControl.prototype.deactivate = function() {};