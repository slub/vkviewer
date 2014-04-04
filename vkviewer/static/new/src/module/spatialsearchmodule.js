goog.provide('VK2.Module.SpatialSearchModule');

goog.require('VK2.Utils');
goog.require('VK2.Module.AbstractModule');

/**
 * @constructor
 * @extends {VK2.Module.AbstractModule}
 * @param {Object} settings
 */
VK2.Module.SpatialSearchModule = function(settings){
	
	/**
	 * @type {string}
	 * @protected
	 */
	settings.NAME = VK2.Utils.getMsg('toolname_layersearch');
	goog.base(this, settings);
	
};
goog.inherits(VK2.Module.SpatialSearchModule, VK2.Module.AbstractModule);

/**
 * Should be triggered for activate the module.
 * @override
 */
VK2.Module.SpatialSearchModule.prototype.activate = function() {
	console.log('SpatialSearchModule activated.');
};

/**
 * Should be triggered for deactivate the module.
 * @override
 */
VK2.Module.SpatialSearchModule.prototype.deactivate = function() {
	console.log('SpatialSearchModule deactivated.');
};