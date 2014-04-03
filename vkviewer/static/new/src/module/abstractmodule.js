goog.provide('VK2.Module.AbstractModule');

/**
 * @param {Object} settings
 * @constructor
 */
VK2.Module.AbstractModule = function(settings){

	/**
	 * @type {Object}
	 * @protected
	 */
	this._settings = goog.isDef(settings) ? settings : {};
	
	/**
	 * @type {ol.Map}
	 * @protected
	 */
	this._map = goog.isDef(settings) ? settings.map : {};
	
	/**
	 * @type {string}
	 * @protected
	 */
	this.NAME_ = goog.isDef(settings.NAME) ? settings.NAME : '';
	
	/**
	 * @type {string}
	 * @public
	 * @expose
	 */
	this.PANEL_ID = goog.isDef(settings['panel_id']) ? settings['panel_id'] : undefined;
	
	/**
	 * @type {string}
	 * @public
	 * @expose
	 */
	this.CONTROL_ID = goog.isDef(settings['control_id']) ? settings['control_id'] : undefined;
	
	/**
	 * @type {string}
	 * @protected
	 */
	this.TYPE_ = goog.isDef(settings['panel_id']) ? 'content' : 'click';
};

/**
 * @return {ol.Map}
 */
VK2.Module.AbstractModule.prototype.getMap = function(){
	return this._map;
};

/**
 * @return {string}
 */
VK2.Module.AbstractModule.prototype.getName = function(){
	return this.NAME_;
};

/**
 * @return {string}
 */
VK2.Module.AbstractModule.prototype.getType = function(){
	return this.TYPE_;
};

/**
 * @interface
 */
VK2.Module.AbstractModule.prototype.activate = function() {};

/**
 * @interface
 */
VK2.Module.AbstractModule.prototype.deactivate = function() {};