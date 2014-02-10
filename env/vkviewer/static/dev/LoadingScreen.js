VK2.Tools.LoadingScreen = VK2.Class({
	
	_settings: {
		status: 0,
	},
	
	_createLoadingScreen: function(){
		var loadingScreenContainer = $('<div/>',{
			'html': 'Bitte warten Sie. Ihre raumzeitliche Reise wird vorbereitet.',
			'id': 'loadingScreen',
			'class': 'loadingScreen'
		}).appendTo('body');
		
		$('<br/>').appendTo(loadingScreenContainer);
		$('<span/>',{
			'html': this._settings.status + ' % geladen.',
			'id': 'loadingStatus'
		}).appendTo(loadingScreenContainer);
	},		
	
	_updateLoadingScreen: function(status){
		if (status < 100){
			$('#loadingStatus').text(status + ' % geladen.');
		}
	},
	
	_updateSettings: function(settings){
		for (var key in settings){
			this._settings[key] = settings[key];
		}		
	},
	
	initialize: function(settings){
		this._updateSettings(settings);	
		this._createLoadingScreen();
	},
	
	setStatus: function(status){
		this._settings.status = status;
		this._updateLoadingScreen(status);
	},
	
	clearLoadingScreen: function(){
		$('#loadingScreen').remove();
	}
})