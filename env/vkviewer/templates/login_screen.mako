# -*- coding: utf-8 -*-
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en"
      xmlns:tal="http://xml.zope.org/namespaces/tal"
      xmlns:i18n="http://xml.zope.org/namespaces/i18n"
      i18n:domain="vkviewer">
    <head>
        <META HTTP-EQUIV="Content-Type" CONTENT="text/html; CHARSET=UTF-8">
        <title>Virtuelles Kartenforum 2.0</title>
        
        <!-- vk2 librarys -->
        <link rel="stylesheet" type="text/css" href="${request.static_url('vkviewer:static/lib/jquery-ui-1.10.3/themes/base/jquery-ui.css')}" />
        <link rel="stylesheet" type="text/css" href="${request.static_url('vkviewer:static/css/vk2/login/styles.css')}" />
      	<script src="${request.static_url('vkviewer:static/lib/jquery.js')}"></script>
      	<script src="${request.static_url('vkviewer:static/lib/jquery-ui.js')}"></script>
      	<script src="${request.static_url('vkviewer:static/js/Initialize.Login.js')}"></script>  
      	<script src="${request.static_url('vkviewer:static/js/locale/'+_('js_library')+'.js')}"></script>
    </head>
    
    <script>
        	$(document).ready(function(){	
				// create reset password dialog
				var forgetPwDialog = document.getElementById('forgetPwDialog');
				$(forgetPwDialog).dialog({
					autoOpen: false,
					height: 300,
					width: 500,
					modal: true,
					buttons: {
						'${_('loginScreen_reset_pw_btn')}': function(){
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
				
				// create open event for reset password dialog
				var divBtn = document.getElementById( 'openForgetPwDialog' );
				$( divBtn ).click(function(){
					$(forgetPwDialog).dialog( 'open' );
				});
			})      	
    </script>  
	<body style="font-family: Arial, Verdana, Helvetica, sans-serif" onload="document.login.username.focus();">
	    <div class="loginScreen">
	    	<div class="loginScreen module">
	    			<p id="validationTips" class="validationTips">${_('loginScreen_welcome')}</p>
	    	</div>
	    	<br>
	    	<div class="loginScreen module">
	    	<form name="login" action="/vkviewer/sign/in" method="post" target="_top" onsubmit="return validateLoginForm();">
			  		<div>
						<input id="loginUsername" class="loginInput large" type="text" value="" 
							name="username" placeholder="${_('loginScreen_placeholder_username')}"/>
					</div>
					<div >
						<input id="loginPassword" class="loginPassword loginInput medium" type="password" value="" 
							name="password" size="10" placeholder="${_('loginScreen_placeholder_password')}"/>
						<input type="submit" id="submitPasswortBtn" name="form.submitted" value="${_('loginScreen_submit_btn')}" class="btn" />
					</div>
					<div class="remember-forgot">
						<div id="openForgetPwDialog" class="loginForgot">${_('loginScreen_forgetpassword')}</div>
					</div>
					<input type="hidden" name="came_from" value="/vkviewer/static/login.html" />
				</form>
			</div>
			<br>
			<div class="loginScreen module">
				<div class="header">
					<center>${_('loginScreen_welcome_new')}</center>
	    		</div>
	    		<br>
	    		<form name="loginNew" action="/vkviewer/sign/new" method="post" target="_top"  onsubmit="return validateNewLoginForm();">
			  		<div class="usernameContainer">
						<input id="loginNewUsername" class="loginNewUsername loginInput large" type="text" value="" 
							name="username" placeholder="${_('loginScreen_placeholder_username')}"/>
					</div>
					<div class="emailContainer">
						<input id="loginNewEmail" class="loginNewEmail loginInput large" type="text" value="" 
							name="email" placeholder="${_('loginScreen_placeholder_email')}"/>
					</div>
					<div class="fullnameContainer">
						<input id="loginNewVorname" class="loginNewFullname loginInput small" type="text" value="" 
							name="vorname" placeholder="${_('loginScreen_placeholder_surname')}"/>
						<input id="loginNewNachname" class="loginNewFullname loginInput small" type="text" value="" 
							name="nachname" placeholder="${_('loginScreen_placeholder_familyname')}"/>
	
					</div>
					<div class="passwordContainer">
						<input id="loginNewPassword" class="loginNewPassword loginInput medium" type="password" value="" 
							name="password" placeholder="${_('loginScreen_placeholder_password')}" size="10"/>
						<input type="submit" name="form.submitted" value="${_('loginScreen_submit_btn')}" class="btn"/>
					</div>
					<input type="hidden" name="came_from" value="/vkviewer/static/login.html" />
				</form>
			</div>
		</div>
		
		<!-- Forget passwort dialog for reseting -->
		<div id="forgetPwDialog" class="forgetPwDialog" title="${_('loginScreen_reset_pw')}" onsubmit="return validateDialogForm();">
			<p id="forgetDialogValidationTips" class="validationTips">${_('loginScreen_reset_pw_msg')}</p>
			<form>
				<fieldset>
					<input id="forgetDialogUsername" class="" type="text" value="" 
								name="username" placeholder="${_('loginScreen_placeholder_username')}"/>
					<input id="forgetDialogMail" class="" type="text" value="" 
								name="email" placeholder="${_('loginScreen_placeholder_email')}"/>			
				</fieldset>
			</form>
		</div>
        </body>  
    </body>
</html>
