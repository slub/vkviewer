VK2.Controller.SidebarController = VK2.Class({
	
	_settings: {
		speed: 300,
		panelLocation: 'right',
		sidebarPanel: 'vk2SBPanel',
		sidebarHeaderLabel: 'vk2SBHeaderLabel',
		sidebarContentPanel: 'vk2SBContentPanel',
		sidebarPanelWidth: 300,
		sidebarCloseBtn: 'vk2SBClose'
	},
	
	_sidebar: $('#vk2SBPanel'),
	
	_mapController: null,
	
	_controls: [],

	_controlElements: [],

	_activateControl: function(controlElement, controlObject){
		// deactivate all controls
		this._deactivateControls();
		this._deactivateControlElements();
		
		// now only activate the choosen control
		controlObject.activate();
		this._changeHeader(controlObject.NAME);
		
		controlElement.addClass('open');
		$('#'+controlElement.attr('value')).css('display','block');
	},
	
	_changeHeader: function(headerContent){
		var headerContentContainer = $('#'+this._settings.sidebarHeaderLabel)
		headerContentContainer.empty();
		$('<h4/>', {
			'html': headerContent
		}).appendTo(headerContentContainer);
	},
	
	_closeSlidebar: function(){
		this._deactivateControls();
		this._deactivateControlElements();
		this._slideIn();
		this._mapController.activateTimeFeatureControl();
	},
	
	_createControlBehavior: function(controlId, controlObject){
		$('#'+controlId).click($.proxy(function(event){
			var controlElement = $(event.currentTarget);
			if (controlElement.hasClass('open')){
				this._closeSlidebar();
			} else {
				this._activateControl(controlElement, controlObject);
				this._slideOut();
			}
		}, this));
	},

	_createSlimControlBehavior: function(controlId, controlObject){
		$('#'+controlId).click($.proxy(function(event){
			var controlElement = $(event.currentTarget);
			if (controlElement.hasClass('open')){
				this._closeSlidebar();
			} else {
				this._activateControl(controlElement, controlObject);
				this._slideIn();
			}
		}, this));
	},
	
	_deactivateControls: function(){
		for (var i = 0; i < this._controls.length; i++){
			this._controls[i].deactivate();
		}
	},
	
	_deactivateControlElements: function(){
		for (var i = 0; i < this._controlElements.length; i++){
			this._controlElements[i].removeClass('open');
			$('#'+this._controlElements[i].attr('value')).css('display','none');
		}		
	},
	
	_updateSettings: function(settings){
		for (var key in settings){
			this._settings[key] = settings[key];
		}	
		
		//update sidebar object
		this._sidebar = $('#'+this._settings.sidebarPanel);
	},
	
	_loadCloseBehavior: function(){
		if (document.getElementById(this._settings.sidebarCloseBtn) != null){
			$(document.getElementById(this._settings.sidebarCloseBtn))
				.click($.proxy(function(){
					this._closeSlidebar();
				}, this))
				.hover(
					function(){
						$(this).addClass('hover');
					}, 
					function(){
						$(this).removeClass('hover');
					}
			)
		}
	},
	
	_registerControl: function(controlId, controlObject){
		this._createControlBehavior(controlId, controlObject);
		this._controls.push(controlObject);
		this._controlElements.push($('#'+controlId));
	},
	
	_registerSlimControl: function(controlId, controlObject){
		this._createSlimControlBehavior(controlId, controlObject);
		this._controls.push(controlObject);
		this._controlElements.push($('#'+controlId));
	},
	
	_slideIn: function(){
		if (this._settings.panelLocation == 'right'){
			var displayOffContainer = $('#'+this._settings.sidebarContentPanel);
			this._sidebar.animate(
					{right: '-' + this._settings.sidebarPanelWidth}, 
					this._settings.speed,
					function(){
						displayOffContainer.css('display','none');
					}
			).removeClass('open');	
		}
	},
	
	_slideOut: function(){
		// change visibilty of the sidebar content panel before the animation
		$('#'+this._settings.sidebarContentPanel).css('display','block');
		
		if (this._settings.panelLocation == 'right'){
			this._sidebar.animate(
					{right: '-3px'}, 
					this._settings.speed
			).addClass('open');
		}
	},
	
	initialize: function(settings, MapController){
		this._mapController = MapController;
		this._updateSettings(settings);
		this._loadCloseBehavior();
	}
});