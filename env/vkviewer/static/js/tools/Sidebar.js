VK2.Tools.Sidebar = VK2.Class({
	
	_settings: {
		sidebarPanel: 'vk2SBPanel',
		sidebarContentPanel: 'vk2SidebarBodyPanel',
		sidebarHeaderLabel: 'vk2SBHeaderLabel'
	},
	
	_sidebarController: null,
	
	_updateSettings: function(settings){
		for (var key in settings){
			this._settings[key] = settings[key];
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
			sidebarCloseBtn: 'vk2SBClose'
		}, MapController);
	},
	
	_createControlElement: function(controlId, controlPanel){
		$('<span/>', {
			'class': 'vk2SidebarIcon'
		}).appendTo($('<a/>', {
				'id': controlId,
				'class': controlId + ' vk2SBControlBtn',
				'value': controlPanel
			}).appendTo($('#'+this._settings.sidebarPanel))
		);
	},
	
	_appendControlPanel: function(panel){
		$('#'+panel).appendTo($('#'+this._settings.sidebarContentPanel));
		$('#'+panel).addClass('vk2ToolActivate')
	},
	

	
	initialize: function(settings, MapController){
		this._updateSettings(settings);
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