goog.provide('VK2.Controller.SidebarController');

goog.require('goog.dom');
goog.require('goog.dom.classes');
goog.require('goog.style');
goog.require('goog.events');
goog.require('goog.events.EventType');

/**
 * @param {string} sidebar_container
 * @constructor
 * @export
 */
VK2.Controller.SidebarController = function(sidebar_container){
		
	// if parent_container exist initialize sidebar_container
	if (goog.dom.getElement(sidebar_container)){
		/**
		 * @type {Element} 
		 * @private
		 */
		this._container = goog.dom.getElement(sidebar_container);
		
		/**
		 * @type {Array.<VK2.Module.AbstractModule>}
		 * @private
		 */
		this._modules = [];
		
		/**
		 * @type {string}
		 * @private
		 * @final
		 */
		this.SIDEBAR_ICON = 'vk2SidebarIcon';
		
		/**
		 * @type {string}
		 * @private
		 * @final
		 */
		this.SIDEBAR_CONTROL_BTN = 'vk2SBControlBtn';
		
		/**
		 * @type {string}
		 * @private
		 * @final
		 */
		this.SIDEBAR_TOOL_ACTIVE = 'vk2ToolActivate';
		
		// load HTML view
		this._loadHTML();
	} else {
		throw new Error('Invalide sidebar container id for appending the sidebar controller.');
	};	
};

/**
 * @private
 */
VK2.Controller.SidebarController.prototype._loadHTML = function(){
	
	this._contentContainer = goog.dom.createDom('div', {
		'id': 'vk2SBContentPanel',
		'class': 'vk2SBContentPanel'
	});
	goog.dom.appendChild(this._container, this._contentContainer);
	
	// create header elements
	var headerContainer = goog.dom.createDom('div', {
		'id': 'vk2SBHeaderPanel',
		'class': 'vk2SBHeaderPanel'			
	})
	goog.dom.appendChild(this._contentContainer, headerContainer);
	
	var headerLabel = goog.dom.createDom('div', {
		'id': 'vk2SBHeaderLabel',
		'class': 'vk2SBHeaderLabel'
	});
	goog.dom.appendChild(headerContainer, headerLabel);
	
	// close button together with close behavior
	var headerCloseBtn = goog.dom.createDom('button', {
		'type': 'button',
		'innerHTML': '&times;',
		'aria-hidden':'true',
		'id': 'vk2SBClose',
		'class': 'close vk2SBClose'
	});
	goog.dom.appendChild(headerContainer, headerCloseBtn);
	goog.events.listen(headerCloseBtn, goog.events.EventType.CLICK, function(event){
		this._closeSidebar();
	}, false, this);
	
	/**
	 * @type {Element}
	 * @private
	 */
	this._bodyContainer = goog.dom.createDom('div', {
		'id': 'vk2SidebarBodyPanel',
		'class': 'vk2SidebarBodyPanel'			
	});
	goog.dom.appendChild(this._contentContainer, this._bodyContainer);
};

///**
// * @param {Element} modul_control
// * @param {Object} modul_object
// * @private
// */
//VK2.Controller.SidebarController.prototype._activateModule = function(modul_control, modul_object){
//	
//};

/**
 * Slide in the sidebar panel. Actual this function only support slideIn if the panel is placed 
 * on the right side.
 * @private
 */
VK2.Controller.SidebarController.prototype._slideIn = function(){
	// find out panel width if not already defined
	if (!goog.isDef(this._panel_width)){
		/**
		 * @type {number}
		 * @private
		 */
		this._panel_width = goog.style.getSize(this._container).width;
	};
	
	var switch_off_container = this._contentContainer;
	if (goog.dom.classes.has(this._container, 'open')){
		$(this._container).animate({'right': '-'+this._panel_width+'px'}, 300, function(){
			goog.style.setStyle(switch_off_container,'display','none');
		}).removeClass('open');
	};
};

/**
 * Slide out the sidebar panel. Actual this function only support slideIn if the panel is placed 
 * on the right side.
 * @private
 */
VK2.Controller.SidebarController.prototype._slideOut = function(){
	goog.style.setStyle(goog.dom.getElement(this._contentContainer),'display','block');
	$(this._container).animate({'right': '-3px'}, 300).addClass('open');
};

/**
 * @private
 */
VK2.Controller.SidebarController.prototype._deactivateModules = function(){
	for (var i = 0; i < this._modules.length; i++){
		this._modules[i].deactivate();
		
		// deactivate also the control_element and panel for the module
		var control_element = goog.dom.getElement(this._modules[i].CONTROL_ID);
		var tool_panel = goog.dom.getElement(this._modules[i].PANEL_ID);
		goog.dom.classes.remove(control_element, 'open');
		if (goog.isDefAndNotNull(tool_panel)) goog.style.setStyle(tool_panel, 'display', 'none');
	}
};

/**
 * @private
 */
VK2.Controller.SidebarController.prototype._closeSidebar = function(){
	this._deactivateModules();
	this._slideIn();
//	this._mapController.activateTimeFeatureControl();
};

/**
 * @param {VK2.Module.AbstractModule} module
 * @private
 */
VK2.Controller.SidebarController.prototype._activateModule = function(module){
	// deactivate all modules for preventing module conflicts
	this._deactivateModules();

	// activate the choosen module
	module.activate();
	
	// change header
	var header = goog.dom.getElement('vk2SBHeaderLabel');
	header.innerHTML = '<h4>'+module.getName()+'</h4>';
	
	// activate also the control_element and panel for the module
	var control_element = goog.dom.getElement(module.CONTROL_ID);
	var tool_panel = goog.dom.getElement(module.PANEL_ID);
	goog.dom.classes.add(control_element, 'open');
	if (goog.isDefAndNotNull(tool_panel)) goog.style.setStyle(tool_panel, 'display', 'block');
};

/**
 * @param {VK2.Module.AbstractModule} module
 * @private
 */
VK2.Controller.SidebarController.prototype._createControlElement = function(module){
	var controlAnchor = goog.dom.createDom('a',{
		'id': module.CONTROL_ID,
		'class': module.CONTROL_ID + ' ' +this.SIDEBAR_CONTROL_BTN
	});
	controlAnchor.setAttribute('value', module.PANEL_ID);
	goog.dom.appendChild(this._container, controlAnchor);
	
	var controlSpan = goog.dom.createDom('span',{ 'class': this.SIDEBAR_ICON });
	goog.dom.appendChild(controlAnchor, controlSpan);
	
	// dirty hack for badges
	// @TODO find better solution
	if (module.CONTROL_ID == 'vk2LayerbarControl'){
		var badgeSpan = goog.dom.createDom('span', {
			'class': 'badge pull-right',
			'id': 'vk2-layerbar-badge-counter',
			'innerHTML':''
		});
		goog.dom.appendChild(controlSpan, badgeSpan);
	}
	
	// not quite sure why
	if (goog.isDefAndNotNull(goog.dom.getElement(module.PANEL_ID))){
		goog.dom.appendChild(this._bodyContainer, goog.dom.getElement(module.PANEL_ID));
		goog.dom.classes.add(goog.dom.getElement(module.PANEL_ID), this.SIDEBAR_TOOL_ACTIVE);
	};
};

/**
 * @param {VK2.Module.AbstractModule} module
 */
VK2.Controller.SidebarController.prototype._registerContentModule = function(module){
	this._createControlElement(module);
	
	// append control behavior
	goog.events.listen(goog.dom.getElement(module.CONTROL_ID), goog.events.EventType.CLICK, function(event){
		var control_element = event.currentTarget;
		if (goog.dom.classes.has(control_element, 'open')){
			this._closeSidebar();
		} else {
			this._activateModule(module);
			this._slideOut();	
		}
	}, false, this);
};

/**
 * @param {VK2.Module.AbstractModule} module
 */
VK2.Controller.SidebarController.prototype._registerClickModule = function(module){
	this._createControlElement(module);
	
	// append control behavior
	goog.events.listen(goog.dom.getElement(module.CONTROL_ID), goog.events.EventType.CLICK, function(event){
		var control_element = event.currentTarget;
		if (goog.dom.classes.has(control_element, 'open')){
			this._closeSidebar();
		} else {
			this._activateModule(module);
			this._slideIn();	
		}
	}, false, this);
};

/**
 * Registers the AbstractModule on the sidebar. In case of type 'content'
 * the module content is shown in the sidebar. In case of 'click' there is 
 * only a click controller for activating the module.
 * 
 * @param {VK2.Module.AbstractModule}
 */
VK2.Controller.SidebarController.prototype.registerModule = function(module){
	switch(module.getType()){
		case 'content':
			this._registerContentModule(module);
			this._modules.push(module);
			break;
		case 'click':
			this._registerClickModule(module);
			this._modules.push(module);
			break;
	}
};

/**
 * @return {Element}
 */
VK2.Controller.SidebarController.prototype.getContentElement = function(){
	return this._bodyContainer;
};
	
