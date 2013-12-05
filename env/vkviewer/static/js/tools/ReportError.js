VK2.Tools.ReportError = VK2.Class({
	
	_settings: {
		formClassEl: {
			jqueryDialogClass: 'vk2ReportErrorDialogContainer',
			dialogContainer: 'vk2ReportErrorDialog',
			textArea: 'vk2ErrorReportField',
			hiddenId: 'vk2ErrorReportObjectId',
			hiddenRef: 'vk2ErrorReportObjectRef'
		}
	},
	
	_updateSettings: function(settings){
		for (var key in settings){
			this._settings[key] = settings[key];
		}		
	},
	
	_loadHTMLContent: function(){
		var dialogContainer = $('<div/>', {
			'id': this._settings.formClassEl.dialogContainer,
			'class': this._settings.formClassEl.dialogContainer
		}).appendTo(document.body);
		
		$('<textarea/>', {
			'id': this._settings.formClassEl.textArea,
			'class': this._settings.formClassEl.textArea + ' ui-corner-all ui-widget-content'
		}).appendTo(dialogContainer);	
		
		$('<input/>', {
			'id': this._settings.formClassEl.hiddenId,
			'type': 'hidden',
			'name': 'id'
		}).appendTo(dialogContainer);
		
		$('<input/>', {
			'id': this._settings.formClassEl.hiddenRef,
			'type': 'hidden',
			'name': 'reference'
		}).appendTo(dialogContainer);		
	},
	
	_loadJQDialog: function(){
		$( '#'+this._settings.formClassEl.dialogContainer ).dialog({
			autoOpen: false,
		    height: 'auto',
		    width: 'auto',
		    modal: true,
		    dialogClass: this._settings.formClassEl.jqueryDialogClass,
		    buttons: {		    	
		    	'Submit': $.proxy(function() {
		    		var message = document.getElementById(this._settings.formClassEl.textArea).value;
		    		var id = document.getElementById(this._settings.formClassEl.hiddenId).value;
		    		var reference = document.getElementById(this._settings.formClassEl.hiddenRef).value;
		    		$.ajax({
						'url' : '../reporterror',
						'type' : 'GET',
						'data' : {
							'message' : message,
							'id' : id,
							'reference' : reference 
						},
						success : $.proxy(function(data){	
							$( '#'+this._settings.formClassEl.dialogContainer ).dialog( "close" );
							alert(VK2.Utils.get_I18n_String('report_error_confirmed'))
						}, this),
						error: $.proxy(function(data){
							$( '#'+this._settings.formClassEl.dialogContainer ).dialog( "close" );
							alert(VK2.Utils.get_I18n_String('report_error_alert'));
						}, this),
						complete: $.proxy(function(data){
							$( '#'+this._settings.formClassEl.dialogContainer ).dialog( "close" );
						}, this)
		    		});
		    	}, this),
		    	'Cancel': function() {				
		    		$( this ).dialog( "close" );
		    	}
		    },
		    close: function() {			
		    	$( this ).dialog( "close" );
		    }
		});	
	},
	
	initialize: function(settings){
		this._updateSettings();
		this._loadHTMLContent();
		this._loadJQDialog();
	},
	
	reportError: function(mtbid, reference){
		$('#'+this._settings.formClassEl.hiddenId).val(mtbid);
		$('#'+this._settings.formClassEl.hiddenRef).val(reference);
		$('#'+this._settings.formClassEl.textArea).val('');
		$('#'+this._settings.formClassEl.dialogContainer).dialog('option', 'title', VK2.Utils.get_I18n_String('report_error_titel')+': '+mtbid)
				.dialog('open');
	}
})

