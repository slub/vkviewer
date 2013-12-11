VK2.Controller.SidebarController = VK2.Class({
	
	_settings: {
		speed: 300,
		panelLocation: 'right',
		sidebarPanel: 'vk2SBPanel',
		sidebarContentPanel: 'vk2SBContentPanel',
		sidebarPanelWidth: 300,
		sidebarCloseBtn: 'vk2SBClose'
	},
	
	_sidebar: $('#vk2SBPanel'),
	
	_controls: [],

	_controlElements: [],

	_activateControl: function(controlElement, controlObject){
		// deactivate all controls
		this._deactivateControls();
		this._deactivateControlElements();
		
		// now only activate the choosen control
		controlObject.activate();
		controlElement.addClass('open');
		$('#'+controlElement.attr('value')).css('display','block');
	},
	
	_createControlBehavior: function(controlId, controlObject){
		$('#'+controlId).click($.proxy(function(event){
			var controlElement = $(event.currentTarget);
			if (controlElement.hasClass('open')){
				this._deactivateControls();
				this._deactivateControlElements();
				this._slideIn();
			} else {
				this._activateControl(controlElement, controlObject);
				this._slideOut();
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
			$(document.getElementById(this._settings.sidebarCloseBtn)).click($.proxy(function(){
				this._slideIn();
			}, this))
		}
	},
	
	_registerControl: function(controlId, controlObject){
		this._createControlBehavior(controlId, controlObject);
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
	
	initialize: function(settings){
		this._updateSettings(settings);
		this._loadCloseBehavior();
	}
});