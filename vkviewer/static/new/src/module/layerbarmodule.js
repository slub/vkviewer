goog.provide('VK2.Module.LayerBarModule');

goog.require('goog.dom');
goog.require('goog.events');
goog.require('goog.events.EventType');
goog.require('VK2.Module.AbstractModule');
goog.require('VK2.Tools.LayerManagement');

/**
 * @constructor
 * @extends {VK2.Module.AbstractModule}
 * @param {Object} settings
 */
VK2.Module.LayerBarModule = function(settings){
	/**
	 * @type {string}
	 * @protected
	 */
	settings.NAME = VK2.Utils.getMsg('toolname_layerbar');
	goog.base(this, settings);
	
	this._loadHtmlContent(this._parentEl);
	
	/**
	 * @type {ol.Collection}
	 * @private
	 */
	this._layers;
	
	/**
	 * @type {Array.<VK2.Tools.LayerManagement>}
	 * @private
	 */
	this._layerManagements = [];
	
	/**
	 * @type {Object}
	 * @private
	 */
	this._listeners = {
			'refresh': function(event){
				this._clearLayerBar();
				var layers = this._getTimeLayers(event.target);
				for (var i = 0; i < layers.length; i++){
					this._layerManagements.push(new VK2.Tools.LayerManagement(this._bodyPanel, layers[i], this._map));
				};
			}
	};
	
	// add a generic add layer button
	if (goog.isDef(this._headingPanel))
		this._addNewDefaultLayerBtn(this._headingPanel, this._map);	
};
goog.inherits(VK2.Module.LayerBarModule, VK2.Module.AbstractModule);

/**
 * @param {Element} parent_element
 * @private
 */
VK2.Module.LayerBarModule.prototype._loadHtmlContent = function(parent_element){
	/**
	 * @type {Element} 
	 * @private
	 */
	this._contentPanel = goog.dom.createDom('div', {
		'id': 'panel-layerbar',
		'class': 'panel panel-default searchTablePanel'
	});
	goog.dom.appendChild(parent_element, this._contentPanel);	
	
	/**
	 * @type {Element}
	 * @private
	 */
	this._headingPanel = goog.dom.createDom('div', {'class':'panel-heading layerbar-header-container'});
	goog.dom.appendChild(this._contentPanel,this._headingPanel);
	
	/**
	 * @type {Element}
	 * @private
	 */
	this._bodyPanel = goog.dom.createDom('div',{'class':'overlayDivs'});
	goog.dom.appendChild(this._contentPanel, this._bodyPanel);
};

/**
 * @param {Element} parent_element
 * @param {ol.Map} map
 * @private
 */
VK2.Module.LayerBarModule.prototype._addNewDefaultLayerBtn = function(parent_element, map){
	var addLayerBtn = goog.dom.createDom('div',{'class':'add-layer'});
	goog.dom.appendChild(parent_element, addLayerBtn);

	goog.events.listen(addLayerBtn, goog.events.EventType.CLICK, function(event){
		map.addLayer(new VK2.Layer.HistoricMap({
			'time':1912,
			'projection':'EPSG:900913'
		}));
	});	
};

/**
 * @private
 */
VK2.Module.LayerBarModule.prototype._appendAddLayerListener = function(){
	if (!goog.isDef(this._layers))
		this._layers = this._map.getLayers();
	
	this._layers.on('add',this._listeners['refresh'], this);
	this._layers.on('change',this._listeners['refresh'], this);
	this._layers.on('remove',this._listeners['refresh'], this);
};

/**
 * @private
 */
VK2.Module.LayerBarModule.prototype._removeAddLayerListener = function(){
	if (goog.isDefAndNotNull(this._layers)){
		this._layers.un('add',this._listeners['refresh'], this);
		this._layers.un('change',this._listeners['refresh'], this);
		this._layers.un('remove',this._listeners['refresh'], this);
	};
};

/**
 * @private
 */
VK2.Module.LayerBarModule.prototype._clearLayerBar = function(){
	this._layerManagements = [];
	this._bodyPanel['innerHTML'] = '';
};

/**
 * @param {ol.Collection} layers
 * @private
 */
VK2.Module.LayerBarModule.prototype._getTimeLayers = function(layers){
	var time_layers = [];
	layers.forEach(function(layer){
		if (goog.isDef(layer.getDisplayInLayerBar)){
			if (layer.getDisplayInLayerBar())
				time_layers.push(layer);
		};
	});
	return time_layers;
};

/**
 * Should be triggered for activate the module.
 * @override
 */
VK2.Module.LayerBarModule.prototype.activate = function() {
	console.log('LayerBarModule activated.');
	goog.style.showElement(this._contentPanel, true);
	this._appendAddLayerListener();
	
	// for initial updating the layerbar if activate
	this._map.getLayers().dispatchChangeEvent();
};

/**
 * Should be triggered for deactivate the module.
 * @override
 */
VK2.Module.LayerBarModule.prototype.deactivate = function() {
	console.log('LayerBarModule deactivated.');
	goog.style.showElement(this._contentPanel, false);
	this._removeAddLayerListener();
};


