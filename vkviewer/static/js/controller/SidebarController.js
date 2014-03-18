goog.provide('VK2.Controller.SidebarController');

goog.require('goog.dom');
goog.require('goog.dom.classes');
goog.require('goog.object');
goog.require('goog.events');
goog.require('goog.events.EventType');
goog.require('goog.style');

/**
 * @param {Object} settings
 * @param {VK2.Controller.MapController} mapController
 * @constructor
 */
VK2.Controller.SidebarController = function(settings, mapController){
	
	/**
	 * @type {Object}
	 * @private
	 */
	this._settings = {
		'speed': 300,
		'panelLocation': 'right',
		'sidebarPanel': 'vk2SBPanel',
		'sidebarHeaderLabel': 'vk2SBHeaderLabel',
		'sidebarContentPanel': 'vk2SBContentPanel',
		'sidebarPanelWidth': 300,
		'sidebarCloseBtn': 'vk2SBClose'
	};
	goog.object.extend(this._settings, settings);
	
	/**
	 * @type {Element}
	 * @private
	 */
	this._sidebar = $(goog.dom.getElement(this._settings.sidebarPanel));
	
	/**
	 * @type {VK2.Controller.MapController}
	 * @private
	 */
	this._mapController = mapController;
	
	/**
	 * @type {array} 
	 * @private
	 */
	this._controls = [];
	
	/**
	 * @type {array}
	 * @private
	 */
	this._controlElements = [];
	
	this._loadCloseBehavior();
};

/**
 * @param {Element} controlElement 
 * @param {Object} controlObject Is an Object from the VK2 Namespace which has an activate and deactivate method
 * @private
 */
VK2.Controller.SidebarController.prototype._activateControl = function(controlElement, controlObject){
	// deactivate all controls
	this._deactivateControls();
	this._deactivateControlElements();
	
	// now only activate the choosen control
	controlObject.activate();
	this._changeHeader(controlObject.NAME);
	
	goog.dom.classes.add(controlElement, 'open');
	var tool_panel = goog.dom.getElement(controlElement.getAttribute('value'));
	if (goog.isDefAndNotNull(tool_panel))
		goog.style.setStyle(tool_panel, 'display', 'block');
};

/**
 * @private
 */
VK2.Controller.SidebarController.prototype._changeHeader = function(headerContent){
	var headerContentContainer = goog.dom.getElement(this._settings.sidebarHeaderLabel);
	headerContentContainer.innerHTML = '<h4>'+headerContent+'</h4>';
};

/**
 * @private
 */
VK2.Controller.SidebarController.prototype._closeSlidebar = function(){
	this._deactivateControls();
	this._deactivateControlElements();
	this._slideIn();
	this._mapController.activateTimeFeatureControl();
};

/**
 * @param {string} controlId 
 * @param {Object} controlObject Is an Object from the VK2 Namespace which has an activate and deactivate method
 * @private
 */
VK2.Controller.SidebarController.prototype._createControlBehavior = function(controlId, controlObject){
	goog.events.listen(goog.dom.getElement(controlId), goog.events.EventType.CLICK, function(event){
		var controlElement = event.currentTarget;
		if (goog.dom.classes.has(controlElement,'open')){
			this._closeSlidebar();
		} else {
			this._activateControl(controlElement, controlObject);
			this._slideOut();
		}
	}, undefined, this);
};

/**
 * @param {string} controlId 
 * @param {Object} controlObject Is an Object from the VK2 Namespace which has an activate and deactivate method
 * @private
 */
VK2.Controller.SidebarController.prototype._createSlimControlBehavior = function(controlId, controlObject){
	goog.events.listen(goog.dom.getElement(controlId), goog.events.EventType.CLICK, function(event){
		var controlElement = event.currentTarget;
		if (goog.dom.classes.has(controlElement,'open')){
			this._closeSlidebar();
		} else {
			this._activateControl(controlElement, controlObject);
			this._slideIn();
		}
	}, undefined, this);
};

/**
 * Deactivate all registered control objects
 * @private
 */
VK2.Controller.SidebarController.prototype._deactivateControls = function(){
	for (var i = 0; i < this._controls.length; i++){
		this._controls[i].deactivate();
	}
};

/**
 * @private
 */
VK2.Controller.SidebarController.prototype._deactivateControlElements = function(){
	for (var i = 0; i < this._controlElements.length; i++){
		goog.dom.classes.remove(this._controlElements[i], 'open');
		var tool_panel = goog.dom.getElement(this._controlElements[i].getAttribute('value'));
		if (goog.isDefAndNotNull(tool_panel))
			goog.style.setStyle(tool_panel, 'display', 'none');
	}		
};

/**
 * This functions loads the close and hover behavior for the sidebar close button.
 * @private
 */
VK2.Controller.SidebarController.prototype._loadCloseBehavior = function(){
	if (document.getElementById(this._settings.sidebarCloseBtn) != null){
		goog.events.listen(goog.dom.getElement(this._settings.sidebarCloseBtn), goog.events.EventType.CLICK, function(event){
			this._closeSlidebar();
		}, undefined, this);
//		$(document.getElementById(this._settings.sidebarCloseBtn))
//			.click($.proxy(function(){
//				this._closeSlidebar();
//			}, this))
//			.hover(
//				function(){
//					$(this).addClass('hover');
//				}, 
//				function(){
//					$(this).removeClass('hover');
//				}
//		)
	}
};

/**
 * @param {string} controlId 
 * @param {Object} controlObject Is an Object from the VK2 Namespace which has an activate and deactivate method
 * @private
 */
VK2.Controller.SidebarController.prototype._registerControl = function(controlId, controlObject){
	this._createControlBehavior(controlId, controlObject);
	this._controls.push(controlObject);
	this._controlElements.push(goog.dom.getElement(controlId));
};


/**
 * @param {string} controlId 
 * @param {Object} controlObject Is an Object from the VK2 Namespace which has an activate and deactivate method
 * @private
 */
VK2.Controller.SidebarController.prototype._registerSlimControl = function(controlId, controlObject){
	this._createSlimControlBehavior(controlId, controlObject);
	this._controls.push(controlObject);
	this._controlElements.push(goog.dom.getElement(controlId));
};


/**
 * @private
 */
VK2.Controller.SidebarController.prototype._slideIn = function(){
	if (this._settings.panelLocation == 'right'){
		var displayOffContainer = goog.dom.getElement(this._settings.sidebarContentPanel);
		this._sidebar.animate(
				{right: '-' + this._settings.sidebarPanelWidth}, 
				this._settings.speed,
				function(){
					goog.style.setStyle(displayOffContainer,'display','none');
				}
		).removeClass('open');	
	}
};
	
/**
 * @private
 */
VK2.Controller.SidebarController.prototype._slideOut = function(){
	// change visibilty of the sidebar content panel before the animation
	goog.style.setStyle(goog.dom.getElement(this._settings.sidebarContentPanel),'display','block');
	
	if (this._settings.panelLocation == 'right'){
		this._sidebar.animate(
				{right: '-3px'}, 
				this._settings.speed
		).addClass('open');
	}
};
