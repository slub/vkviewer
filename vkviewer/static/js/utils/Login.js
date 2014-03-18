VK2.Login = {
		
	createSubmitLoginBtn: function(){
		$('#submitPasswortBtn').click(function(){
			if (VK2.Login.validateLoginForm()){
				$.ajax({
					type: 'POST',
					url: '/vkviewer/sign/in',
					data: {
						username: $('#loginUsername').val(),
						password: $('#loginPassword').val(),
						'form.submitted': true,
						came_from: '/vkviewer/sign/getscreen'	
					},
					success: function( data, textStatus, jqXHR ){
						var response = false;
						
						try {
							response = JSON.parse(data)
							console.log(response);
						} catch(e) {}
						
						if (response) {
							$('#validationTips').html(response.message).addClass('ui-state-error');
						} else {
							var a = document.createElement('a');
							a.href = '../auth';
							a.target = '_top';
							document.body.appendChild(a);
							a.click();
						}
					}
				})
			};
		});
	},
	
	createSubmitNewUserBtn: function(){
		$('#submitNewUserBtn').click(function(){
			if (VK2.Login.validateNewLoginForm()){
				$.ajax({
					type: 'POST',
					url: '/vkviewer/sign/new',
					data: {
						username: $('#loginNewUsername').val(),
						password: $('#loginNewPassword').val(),
						email: $('#loginNewEmail').val(),
						vorname: $('#loginNewVorname').val(),
						nachname: $('#loginNewNachname').val(),
						'form.submitted': true,
						came_from: '/vkviewer/sign/getscreen'	
					},
					success: function( data, textStatus, jqXHR ){
						var response = false;
						
						try {
							response = JSON.parse(data)
							console.log(response);
						} catch(e) {}
						
						if (response) {
							$('#validationTips').html(response.message).addClass('ui-state-error');
						} else {
							var a = document.createElement('a');
							a.href = '../auth';
							a.target = '_top';
							document.body.appendChild(a);
							a.click();
						}
					}
				})
			};
		});
	},
	
	initializeForgetPwDialog: function(btnName){
		
		var forgetPwDialog = document.getElementById('forgetPwDialog');
		$(forgetPwDialog).dialog({
			autoOpen: false,
			height: 300,
			width: 500,
			modal: true,
			buttons: {
				btnName : function(){
		    		var username = $(document.getElementById('forgetDialogUsername'));
		    		var email = $(document.getElementById('forgetDialogMail'));
					var isValide = validateDialogForm(username, email);       					
		    		
		    		if (isValide){
		    			$.ajax({
		    				type: 'POST',
		    				url: getHost('/vkviewer/sign/reset'),
		    				data: {
		    					'username': username.val(),
		    					'email': email.val(),
		    					'form.submitted': 'Reset Passwort', 
		    					'came_from': '/vkviewer/static/login.html'
		    				},
		    				success: function( data ){
		    					console.log(data.message);
		    					$(document.getElementById('forgetPwDialog')).dialog('close');
		    				}
		    			})
		    		}
				}
			},
			close: function(){
				$(document.getElementById('forgetDialogUsername')).val("").removeClass( 'ui-state-error' );
				$(document.getElementById('forgetDialogMail')).val("").removeClass( 'ui-state-error' );
			}
		})
		
		$( '#openForgetPwDialog' ).click(function(){
			$(forgetPwDialog).dialog( 'open' );
		});
	},
	
	validateDialogForm: function(username, email){
		var validationTipObj = $(document.getElementById('forgetDialogValidationTips'));
	        		
	    var isValide = true;
	    isValide = isValide && VK2.Login.Utils.checkUsername(username, validationTipObj);
	    isValide = isValide && VK2.Login.Utils.checkEmail(email, validationTipObj);
	   		
	    return isValide;
	},
    	
	validateLoginForm: function(){
		var validationTipObj = $(document.getElementById('validationTips'))
		var username = $(document.getElementById('loginUsername'));
		var password = $(document.getElementById('loginPassword'));       		

		var isValide = true;
		isValide = isValide && VK2.Login.Utils.checkUsername(username, validationTipObj);
		isValide = isValide && VK2.Login.Utils.checkPassword(password, validationTipObj);

		return isValide;
	},

	validateNewLoginForm: function(){
		var validationTipObj = $(document.getElementById('validationTips'))
		var username = $(document.getElementById('loginNewUsername'));
		var email = $(document.getElementById('loginNewEmail'));   
		var surname = $(document.getElementById('loginNewVorname'));
		var familyname = $(document.getElementById('loginNewNachname'));   
		var password = $(document.getElementById('loginNewPassword'));   
	
		var isValide = true;
		isValide = isValide && VK2.Login.Utils.checkUsername(username, validationTipObj);
		isValide = isValide && VK2.Login.Utils.checkEmail(email, validationTipObj);
		isValide = isValide && VK2.Login.Utils.checkName(surname, validationTipObj, 'Vorname');
		isValide = isValide && VK2.Login.Utils.checkName(familyname, validationTipObj, 'Nachname');
		isValide = isValide && VK2.Login.Utils.checkPassword(password, validationTipObj);
		
		return isValide;
	}
};

VK2.Login.Utils = {

		/**
		 * The next code blog contains different functions for evaluation of the login form values
		 * 
		 * It is based on http://jqueryui.com/dialog/#modal-form
		 */
		updateTips: function(validationTipObj, msg){
			validationTipObj.text( msg ).addClass( 'ui-state-highlight' );
			setTimeout(function(){
				validationTipObj.removeClass( 'ui-state-highlight', 1500);
			}, 500);
		},

		checkLength: function( object, minLength, maxLength, validationTipObj, msg ){
			if (object.val().length > maxLength || object.val().length < minLength ){
				object.addClass( 'ui-state-error' );
				VK2.Login.Utils.updateTips( validationTipObj, msg );
				return false;
			} else {
				if (object.hasClass( 'ui-state-error' ))
					object.removeClass( 'ui-state-error' );
				return true;
			}
		},

		checkRegexp: function( object, regexp, validationTipObj, validationMsg ){
			if ( !( regexp.test( object.val() ))){
				object.addClass( 'ui-state-error' );
				VK2.Login.Utils.updateTips( validationTipObj, validationMsg );
				return false;
			} else {
				if (object.hasClass( 'ui-state-error' ))
					object.removeClass( 'ui-state-error' );
				return true;
			}
		},
		
		checkName: function( object, validationTipObj, tagName ){
			var isValide = true;
			
			isValide = isValide && VK2.Login.Utils.checkLength( object, 3, 16, validationTipObj, "Der "+ tagName + " sollte zwischen" +
					" 3 und 16 Zeichen umfassen");
			isValide = isValide && VK2.Login.Utils.checkRegexp( object, /^([a-zA-Z])+$/, validationTipObj, "Der Name sollte sich aus Buchstaben des Alphabets zusammensetzen");
			
			return isValide;
		},
		
		checkUsername: function( object, validationTipObj ){
			var isValide = true;
			
			isValide = isValide && VK2.Login.Utils.checkLength( object, 3, 16, validationTipObj, "Der Benutzername sollte zwischen" +
					" 3 und 16 Zeichen umfassen");
			isValide = isValide && VK2.Login.Utils.checkRegexp( object, /^([0-9a-zA-Z])+$/, validationTipObj, "Der Benutzername sollte sich aus des Alphabets oder Zahlen zwischen 0 und 9 zusammensetzen");
			
			return isValide;
		},
		
		checkPassword: function( object, validationTipObj ){
			var isValide = true;
			
			isValide = isValide && VK2.Login.Utils.checkLength( object, 5, 16, validationTipObj, "Das Passwort sollte zwischen" +
					" 5 und 16 Zeichen umfassen");
			isValide = isValide && VK2.Login.Utils.checkRegexp( object, /^([0-9a-zA-Z])+$/, validationTipObj, "Das Passwort sollte sich aus des Alphabets oder Zahlen zwischen 0 und 9 zusammensetzen");
			
			return isValide;
		},
		
		checkEmail: function( object, validationTipObj ){
			var isValide = true;
			
			isValide = isValide && VK2.Login.Utils.checkLength( object, 6, 80, validationTipObj, "Die Email sollte zwischen" +
					" 6 und 80 Zeichen umfassen");
			isValide = isValide && VK2.Login.Utils.checkRegexp( object, /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i, validationTipObj, "z.B. Max.Mustermann@slub-dresden.de");
			
			return isValide;
		},
		
		checkIsSamePassword: function( password, password_validate, validationTipObj ){
			var isValide = true;
			
			isValide = (password == password_validate)
			
			if (isValide){
				if (validationTipObj.hasClass( 'ui-state-error' ))
					validationTipObj.removeClass( 'ui-state-error' );
				return isValide;
			} else {
				validationTipObj.addClass( 'ui-state-error' );
				VK2.Login.Utils.updateTips( validationTipObj, 'Das Passwort ist nicht das gleiche.' );
				return false;
			}
			
			
		}
}
