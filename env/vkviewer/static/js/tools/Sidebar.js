VK2.Tools.Sidebar = VK2.Class({
	
	_settings: {
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
	},
	
	_sidebarController: null,
	
	_updateSettings: function(settings){
		for (var key in settings){
			this._settings[key] = settings[key];
		}	
	},
	
	_loadHtmlElements: function(toolPanels){
		var mainContainer = $('#'+this._settings.sidebarPanel);
		
		var contentContainer = $('<div/>', {
			'id': this._settings.sidebarContentPanel,
			'class': this._settings.sidebarContentPanel
		}).appendTo(mainContainer);
		
		
		// create header elements
		var headerContainer = $('<div/>', {
			'id': this._settings.sidebarHeaderPanel,
			'class': this._settings.sidebarHeaderPanel			
		}).appendTo(contentContainer);
		
		$('<div/>', {
			'id': this._settings.sidebarHeaderLabel,
			'class': this._settings.sidebarHeaderLabel
		}).appendTo(headerContainer);
		
		$('<div/>', {
			'id': this._settings.sidebarHeaderClose,
			'class': this._settings.sidebarHeaderClose + ' ' + this._settings.sidebarIcon
		}).appendTo(headerContainer);
		
		// body 
		var bodyContainer = $('<div/>', {
			'id': this._settings.sidebarBodyPanel,
			'class': this._settings.sidebarBodyPanel			
		}).appendTo(contentContainer);
		
		for (var i = 0; i < toolPanels.length; i++){
			$('<div/>', {
				'id': toolPanels[i],
				'class': toolPanels[i]
			}).appendTo(bodyContainer);
		}
	},
	
	_loadSidebarController: function(MapController){
		// find out panel width
		var panelWidth = $('#'+this._settings.sidebarPanel).css('width');
		
		this._sidebarController = new VK2.Controller.SidebarController({
			speed: 300,
			panelLocation: 'right',
			sidebarPanel: this._settings.sidebarPanel,
			sidebarHeaderLabel: this._settings.sidebarHeaderLabel,
			sidebarPanelWidth: panelWidth,
			sidebarCloseBtn: this._settings.sidebarHeaderClose
		}, MapController);
	},
	
	_createControlElement: function(controlId, controlPanel){
		$('<span/>', {
			'class': this._settings.sidebarIcon
		}).appendTo($('<a/>', {
				'id': controlId,
				'class': controlId + ' ' +this._settings.sidebarControlBtn,
				'value': controlPanel
			}).appendTo($('#'+this._settings.sidebarPanel))
		);
	},
	
	_appendControlPanel: function(panel){
		$('#'+panel).appendTo($('#'+this._settings.sidebarBodyPanel));
		$('#'+panel).addClass(this._settings.sidebarToolActive)
	},
	

	
	initialize: function(settings, MapController, toolPanels){
		this._updateSettings(settings);
		this._loadHtmlElements(toolPanels);
		this._loadSidebarController(MapController);
	},
	
	/**
	 * Method: appendControl
	 * Append a control element with panel content
	 */
	appendControl: function(controlId, controlPanel, controlObject){
		this._createControlElement(controlId, controlPanel);
		this._appendControlPanel(controlPanel);
		this._sidebarController._registerControl(controlId, controlObject)
	},
	
	/**
	 * Method: appendSlimControl
	 * Append a control element without panel content
	 */
	appendSlimControl: function(controlId, controlObject){
		this._createControlElement(controlId, '');
		this._sidebarController._registerSlimControl(controlId, controlObject)
	},
	
	open: function(event){
		this._sidebarController._slideOut();
	},
	
	close: function(event){
		this._sidebarController._deactivateControls();
		this._sidebarController._slideIn();
	}
});