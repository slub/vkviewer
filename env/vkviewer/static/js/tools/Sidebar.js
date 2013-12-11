VK2.Tools.Sidebar = VK2.Class({
	
	_settings: {
		sidebarPanel: 'vk2SBPanel',
		sidebarContentPanel: 'vk2SidebarBodyPanel'
	},
	
	_sidebarController: null,
	
	_updateSettings: function(settings){
		for (var key in settings){
			this._settings[key] = settings[key];
		}	
	},
	


	
	_loadSidebarController: function(){
		// find out panel width
		var panelWidth = $('#'+this._settings.sidebarPanel).css('width');
		
		this._sidebarController = new VK2.Controller.SidebarController({
			speed: 300,
			panelLocation: 'right',
			sidebarPanel: this._settings.sidebarPanel,
			sidebarPanelWidth: panelWidth,
			sidebarCloseBtn: 'vk2SBClose'
		});
	},
	
	_createControlElement: function(controlId, controlPanel){
		$('<a/>', {
			'id': controlId,
			'class': controlId,
			'value': controlPanel
		}).appendTo($('#'+this._settings.sidebarPanel));
	},
	
	_appendControlPanel: function(panel){
		$('#'+panel).appendTo($('#'+this._settings.sidebarContentPanel));
		$('#'+panel).addClass('vk2ToolActivate')
	},
	

	
	initialize: function(settings){
		this._updateSettings(settings);
		this._loadSidebarController();
	},
	
	appendControl: function(controlId, controlPanel, controlObject){
		this._createControlElement(controlId, controlPanel);
		this._appendControlPanel(controlPanel);
		this._sidebarController._registerControl(controlId, controlObject)
	},
	
	open: function(event){
		this._sidebarController._slideOut();
	},
	
	close: function(event){
		this._sidebarController._deactivateControls();
		this._sidebarController._slideIn();
	}
});