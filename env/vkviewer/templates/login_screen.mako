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
		<link rel="stylesheet" type="text/css" href="${request.static_url('vkviewer:static/lib/min/css/vkviewer-libarys.min.css')}" media="screen" />
        <link rel="stylesheet" type="text/css" href="${request.static_url('vkviewer:static/css/vk2/templates/template_pages.css')}" />
	    <script src="${request.static_url('vkviewer:static/lib/min/vkviewer-libarys.min.js')}"></script>  
	    <script src="${request.static_url('vkviewer:static/js/locale/'+_('js_library')+'.js')}"></script>
	    <script src="${request.static_url('vkviewer:static/lib/min/OpenLayers.js')}"></script> 
	    <script src="${request.static_url('vkviewer:static/js/Vkviewer.min.js')}"></script>
    </head>
    
    <script>
    	var validateLoginForm = function(){
    		var isValide = true;
			
			// check username
			isValide = isValide && VK2.Validation.checkUsername(loginUsername, 'validationTipsLogin', 'ui-state-error');
			if (!isValide) return isValide;
										
			// check password
			isValide = isValide && VK2.Validation.checkPassword(loginPassword, 'validationTipsLogin', 'ui-state-error');
			if (!isValide) return isValide;
    	}
    	
    	var validateRegisterNewUser = function(){
    	
    		var isValide = true;
    					debugger;
			// check username
			isValide = isValide && VK2.Validation.checkUsername(loginNewUsername, 'validationTipsRegisterUser', 'ui-state-error');
			if (!isValide) return isValide;
				
			// check new password
			isValide = isValide && VK2.Validation.checkPassword(loginNewPassword, 'validationTipsRegisterUser', 'ui-state-error');
			if (!isValide) return isValide;
				
			// check if new password matches validation password
			isValide = isValide && VK2.Validation.checkPasswordMatch(loginNewPassword, loginNewPasswordValidate, 'validationTipsRegisterUser', 'ui-state-error'); 
			if (!isValide) return isValide;
			
			// check sur- and familyname
			isValide = isValide && VK2.Validation.checkPersonName(loginNewVorname, 'validationTipsRegisterUser', 'ui-state-error');
			if (!isValide) return isValide;
			isValide = isValide && VK2.Validation.checkPersonName(loginNewNachname, 'validationTipsRegisterUser', 'ui-state-error');
			if (!isValide) return isValide;
			
			// check email adress
			isValide = isValide && VK2.Validation.checkEmailAdress(loginNewEmail, 'validationTipsRegisterUser', 'ui-state-error');
			if (!isValide) return isValide;
    	}

    </script>  
	<body class="login-screen">
		<div class="container">
			<div class="panel panel-default">
				<div class="panel-heading" id="panelHeading"><p id="validationTips" class="validation-tips">${_('loginScreen_welcome')}</p></div>
				
				<div class="panel-body">
					<!-- Anmeldung für existierende Nutzer -->
					<div class="panel panel-default panel-vk2Login">
						<div class="panel-heading">
							<p id="validationTipsLogin" class="validation-tips">${_('plz_login')}</p>
						</div>
						<div class="panel-body panel-body-vk2Login">
							<form class="form-user-login" action="${request.route_url('auth', action='in')}" target="_top" 
								role="form" onsubmit="return validateLoginForm()" method="POST">
								<div class="form-group">
									<label for="loginUsername" class="col-sm-4 control-label">${_('loginScreen_placeholder_username')}</label>
									<input type="text" name="username" class="form-control" id="loginUsername" 
										placeholder="${_('loginScreen_placeholder_username')}" />
								</div>
								<div class="form-group">
									<label for="loginPassword" class="col-sm-4 control-label">${_('loginScreen_placeholder_password')}</label>
									<input type="password" name="password" class="form-control" id="loginPassword" 
										placeholder="${_('loginScreen_placeholder_password')}" />
								</div>
								<div class="form-group">
									<a class="forgot" href="${request.route_url('auth', action='page_reset')}">${_('loginScreen_reset_pw')}</a>
								</div>
								<button type="submit" name="form.submitted" class="btn btn-primary">${_('loginScreen_submit_btn')}</button>
							</form>
						</div>
					</div> 
					
					<!-- Neue registrierung für Nutzer -->
					<div class="panel panel-default panel-vk2RegisterNewUser">
						<div class="panel-heading">
							<p id="validationTipsRegisterUser" class="validation-tips">${_('loginScreen_welcome_new')}</p>
						</div>
						
						<div class="panel-body">
							<form class="form-user-register" action="${request.route_url('auth', action='new')}" target="_top" 
								role="form" onsubmit="return validateRegisterNewUser()" method="POST">
								<div class="form-group">
									<label for="loginNewUsername" class="col-sm-4 control-label">${_('loginScreen_placeholder_username')}</label>
									<input type="text" name="username" class="form-control" id="loginNewUsername" 
										placeholder="${_('loginScreen_placeholder_username')}" />
								</div>
								<div class="form-group double-input-field">
									<label for="loginNewPassword" class="col-sm-4 control-label">${_('loginScreen_placeholder_password')}</label>
									<input type="password" name="password" class="form-control password-new" id="loginNewPassword" 
										placeholder="${_('loginScreen_placeholder_password')}" />
									<input type="password" name="password_validate" class="form-control right" id="loginNewPasswordValidate" 
										placeholder="${_('loginScreen_placeholder_password')}" />
								</div>
								<div class="form-group double-input-field">
									<label for="loginNewVorname" class="col-sm-4 control-label">${_('loginScreen_placeholder_surname')} & ${_('loginScreen_placeholder_familyname')}</label>
									<input type="text" name="vorname" class="form-control" id="loginNewVorname" 
										placeholder="${_('loginScreen_placeholder_surname')}" />
									<input type="text" name="nachname" class="form-control right" id="loginNewNachname" 
										placeholder="${_('loginScreen_placeholder_familyname')}" />
								</div>
								<div class="form-group">
									<label for="loginNewEmail" class="col-sm-4 control-label">${_('loginScreen_placeholder_email')}</label>
									<input type="text" name="email" class="form-control" id="loginNewEmail" 
										placeholder="${_('loginScreen_placeholder_email')}" />
								</div>							
								<button type="submit" name="form.submitted" class="btn btn-primary">${_('loginScreen_submit_btn')}</button>
							</form>
						</div>
					</div>
					
				</div>
			</div>
		</div>
		

    </body>
</html>
