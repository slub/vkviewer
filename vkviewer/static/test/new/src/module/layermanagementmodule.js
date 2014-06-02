goog.provide('vk2.module.LayerManagementModule');

goog.require('goog.dom');
goog.require('goog.events');
goog.require('goog.events.EventTarget');
goog.require('goog.events.EventType');
goog.require('ol.Collection');
goog.require('vk2.factory.LayerManagementFactory');


/**
 * @param {Element|string} parentEl_id
 * @param {ol.Collection} layerCollection
 * @param {ol.Map} map
 * @constructor
 * @extends {goog.events.EventTarget}
 */
vk2.module.LayerManagementModule = function(parentEl, layers, map){
	
	/**
	 * @type {Element}
	 * @private
	 */
	this._parentEl = goog.isString(parentEl) ? goog.dom.getElement(parentEl) : parentEl;
	
	/**
	 * @type {ol.Collection}
	 * @private
	 */
	this._layers = layers;
	
	/**
	 * @type {ol.Map}
	 * @private
	 */
	this._map = map;
	
	// load html content
	this._loadHtmlContent(this._parentEl);
	
	// listeners for registering new or removed layers
	this._activate();
	
	goog.base(this);
};
goog.inherits(vk2.module.LayerManagementModule, goog.events.EventTarget);

/**
 * @param {Element} parentEl
 * @private
 */
vk2.module.LayerManagementModule.prototype._loadHtmlContent = function(parentEl){
	
	var containerEl = goog.dom.createDom('div',{'class':'layermanagement-container'});
	goog.dom.appendChild(parentEl, containerEl);
	
	// header
	var headerContainer = goog.dom.createDom('div', {'class':'heading'});
	goog.dom.appendChild(containerEl, headerContainer);
	
	var headerLabel = goog.dom.createDom('span', {
		'class':'header-label',
		'innerHTML': vk2.utils.getMsg('layermanagement_label')
	});
	goog.dom.appendChild(headerContainer, headerLabel);
	
	// body
	/**
	 * @type {Element}
	 * @private
	 */
	this._bodyEl = goog.dom.createDom('div',{'class':'layermanagement-body'});
	goog.dom.appendChild(containerEl, this._bodyEl);
};

/**
 * @param {ol.CollectionEvent} event
 * @private
 */
vk2.module.LayerManagementModule.prototype._refresh = function(event){
	if (goog.isDef(event.element.getDisplayInLayerManagement) 
			&& event.element.getDisplayInLayerManagement()){
		// clear list
		this._bodyEl.innerHTML = '';
		
		var layers = this._layers.getArray();
		for (var i = layers.length-1, ii = 0; i >= ii; i--){
			if (goog.isDef(layers[i].getDisplayInLayerManagement)	&& layers[i].getDisplayInLayerManagement()){
				var layermanagementrecord = vk2.factory.LayerManagementFactory.getLayerManagementRecord(layers[i], this._map);
				goog.dom.appendChild(this._bodyEl, layermanagementrecord);
			};
		};
	};
};

/**
 * @private
 */
vk2.module.LayerManagementModule.prototype._activate = function(){
	this._layers.on('add', this._refresh, this);
	this._layers.on('remove', this._refresh, this);	
};

/**
 * @private
 */
vk2.module.LayerManagementModule.prototype._deactivate = function(){
	this._layers.un('add', this._refresh, this);
	this._layers.un('remove', this._refresh, this);	
};

/**
 * @return {ol.Collection}
 */
vk2.module.LayerManagementModule.prototype.getLayers = function(){
	return this._layers.getArray();
};