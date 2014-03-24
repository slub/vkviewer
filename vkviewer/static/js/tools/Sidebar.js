goog.provide('VK2.Tools.Sidebar');

goog.require('goog.dom');
goog.require('goog.dom.classes');
goog.require('goog.object');

/**
 * @param {Object} settings
 * @param {Array.<string>} toolPanelIds
 * @param {VK2.Controller.MapController} mapController
 * @constructor
 */
VK2.Tools.Sidebar = function(settings, toolPanelIds, mapController){
	
	/**
	 * @type {Object}
	 * @private
	 */
	this._settings = {
		sidebarPanel: 'vk2SBPanel',
		sidebarContentPanel: 'vk2SBContentPanel',
		sidebarBodyPanel: 'vk2SidebarBodyPanel',
		sidebarHeaderPanel: 'vk2SBHeaderPanel', 
		sidebarHeaderLabel: 'vk2SBHeaderLabel',
		sidebarHeaderClose: 'vk2SBClose',
		
		// for control elements
		sidebarIcon: 'vk2SidebarIcon',
		sidebarControlBtn: 'vk2SBControlBtn',
		sidebarToolActive: 'vk2ToolActivate',
	};
	goog.object.extend(this._settings, settings);
	
	/**
	 * @type {VK2.Controller.SidebarController}
	 * @private
	 */
	this._sidebarController = null;
	
	this._loadHtmlElements(toolPanelIds);
	this._loadSidebarController(mapController);
};

/**
 * @param {Array.<string>} toolPanelIds
 * @private
 */
VK2.Tools.Sidebar.prototype._loadHtmlElements = function(toolPanelIds){
	
	var mainContainer = goog.dom.getElement(this._settings.sidebarPanel);
	
	var contentContainer = goog.dom.createDom('div', {
		'id': this._settings.sidebarContentPanel,
		'class': this._settings.sidebarContentPanel
	});
	goog.dom.appendChild(mainContainer, contentContainer);
	
	
	// create header elements
	var headerContainer = goog.dom.createDom('div', {
		'id': this._settings.sidebarHeaderPanel,
		'class': this._settings.sidebarHeaderPanel			
	})
	goog.dom.appendChild(contentContainer, headerContainer);
	
	var headerLabel = goog.dom.createDom('div', {
		'id': this._settings.sidebarHeaderLabel,
		'class': this._settings.sidebarHeaderLabel
	});
	goog.dom.appendChild(headerContainer, headerLabel);

	var headerCloseBtn = goog.dom.createDom('button', {
		'type': 'button',
		'innerHTML': '&times;',
		'aria-hidden':'true',
		'id': this._settings.sidebarHeaderClose,
		'class': 'close '+this._settings.sidebarHeaderClose
	});
	goog.dom.appendChild(headerContainer, headerCloseBtn);
	
	// body 
	var bodyContainer = goog.dom.createDom('div', {
		'id': this._settings.sidebarBodyPanel,
		'class': this._settings.sidebarBodyPanel			
	});
	goog.dom.appendChild(contentContainer, bodyContainer);
	
	for (var i = 0; i < toolPanelIds.length; i++){
		var toolPanel = goog.dom.createDom('div', {
			'id': toolPanelIds[i],
			'class': toolPanelIds[i]
		});
		goog.dom.appendChild(bodyContainer, toolPanel);
	};
};

/**
 * @param {VK2.Controller.MapController} mapController
 * @private
 */
VK2.Tools.Sidebar.prototype._loadSidebarController = function(mapController){
	// find out panel width
	var panelWidth = $('#'+this._settings.sidebarPanel).css('width');
	
	this._sidebarController = new VK2.Controller.SidebarController({
		speed: 300,
		panelLocation: 'right',
		sidebarPanel: this._settings.sidebarPanel,
		sidebarHeaderLabel: this._settings.sidebarHeaderLabel,
		sidebarPanelWidth: panelWidth,
		sidebarCloseBtn: this._settings.sidebarHeaderClose
	}, mapController);
};

/**
 * @param {string} controlId
 * @param {string} controlPanel
 * @private
 */
VK2.Tools.Sidebar.prototype._createControlElement = function(controlId, controlPanel){
	var controlAnchor = goog.dom.createDom('a',{
		'id': controlId,
		'class': controlId + ' ' +this._settings.sidebarControlBtn
	});
	controlAnchor.setAttribute('value', controlPanel);
	goog.dom.appendChild(goog.dom.getElement(this._settings.sidebarPanel), controlAnchor);
	
	var controlSpan = goog.dom.createDom('span',{ 'class': this._settings.sidebarIcon });
	goog.dom.appendChild(controlAnchor, controlSpan);
	
	// dirty hack for badges
	if (controlId == 'vk2LayerbarControl'){
		var badgeSpan = goog.dom.createDom('span', {
			'class': 'badge pull-right',
			'id': 'vk2-layerbar-badge-counter',
			'innerHTML':''
		});
		goog.dom.appendChild(controlSpan, badgeSpan);
	}
};

/**
 * @param {string} panel
 * @private
 */
VK2.Tools.Sidebar.prototype._appendControlPanel = function(panel){
	goog.dom.appendChild(goog.dom.getElement(this._settings.sidebarBodyPanel), goog.dom.getElement(panel));
	goog.dom.classes.add(goog.dom.getElement(panel), this._settings.sidebarToolActive);
};

/**
 * Append a control element with panel content.
 * 
 * @param {string} controlId
 * @param {string} controlPanel
 * @param {Object} controlObject
 * @public
 */
VK2.Tools.Sidebar.prototype.appendControl = function(controlId, controlPanel, controlObject){
	this._createControlElement(controlId, controlPanel);
	this._appendControlPanel(controlPanel);
	this._sidebarController._registerControl(controlId, controlObject)
};

/**
 * Append a control element with panel content.
 * 
 * @param {string} controlId
 * @param {Object} controlObject
 * @public
 */
VK2.Tools.Sidebar.prototype.appendSlimControl = function(controlId, controlObject){
	this._createControlElement(controlId, '');
	this._sidebarController._registerSlimControl(controlId, controlObject)
};

/**
 * @param {Event} event
 * @public
 */
VK2.Tools.Sidebar.prototype.open = function(event){
	this._sidebarController._slideOut();
};

/**
 * @param {Event} event
 * @public
 */
VK2.Tools.Sidebar.prototype.close = function(event){
	this._sidebarController._deactivateControls();
	this._sidebarController._slideIn();
};