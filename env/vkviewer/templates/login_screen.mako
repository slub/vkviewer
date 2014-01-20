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
        <link rel="stylesheet" type="text/css" href="${request.static_url('vkviewer:static/css/vk2/templates/login_screen.css')}" />
        <link rel="stylesheet" type="text/css" href="${request.static_url('vkviewer:static/lib/bootstrap-3.0.3/css/bootstrap.css')}"></link>
      	<script src="${request.static_url('vkviewer:static/lib/jquery.js')}"></script>
      	<script src="${request.static_url('vkviewer:static/lib/jquery-ui.js')}"></script>
      	<script src="${request.static_url('vkviewer:static/js/Initialize.Login.js')}"></script>  
      	<script src="${request.static_url('vkviewer:static/js/locale/'+_('js_library')+'.js')}"></script>
    </head>
    
    <script>
        	$(document).ready(function(){									
				// create submit buttons
				VK2.Login.createSubmitLoginBtn();
				VK2.Login.createSubmitNewUserBtn();		
				VK2.Login.initializeForgetPwDialog('${_('loginScreen_reset_pw_btn')}');
				
				$('#loginUsername').focus();
			})      	
    </script>  
	<body style="font-family: Arial, Verdana, Helvetica, sans-serif">
		<div class="container">
			<div class="panel panel-default">
				<div class="panel-heading" id="panelHeading"><p id="validationTips" class="validationTips">${_('loginScreen_welcome')}</p></div>
				
				<div class="panel-body">
				
					<!-- Anmeldung für existierende Nutzer -->
					<div class="panel panel-default panel-vk2Login">
						<div class="panel-body panel-body-vk2Login">
							<div class="vk2LoginLayout">
								<div class="form-group">
						    		<input id="loginUsername" class="loginInput large form-control" type="text" value="" 
										name="username" placeholder="${_('loginScreen_placeholder_username')}"/>								
								</div>
								<div class="form-group">
									<input id="loginPassword" class="loginPassword loginInput small form-control" type="password" value="" 
										name="password" size="10" placeholder="${_('loginScreen_placeholder_password')}"/>						
								</div>
								<div class="form-group vkLoginBtn">
									<button type="button" id="submitPasswortBtn" name="form.submitted" class="btn btn-primary">${_('loginScreen_submit_btn')}</button>
								</div>
								<div id="openForgetPwDialog" class="loginForgot">${_('loginScreen_forgetpassword')}</div>
							</div>
						</div>
					</div> 
					
					<!-- Neue registrierung für Nutzer -->
					<div class="panel panel-default panel-vk2RegisterNewUser">
						<div class="panel-heading">${_('loginScreen_welcome_new')}</div>
						<div class="panel-body">
							<div class"vk2RegisterNewUserLayout">
								<div class="vk2RegisterUserLayoutInner">
									<div class="registerElement form-group">
										<input id="loginNewUsername" class="loginNewUsername loginInput large form-control" type="text" value=""
											name="username" placeholder="${_('loginScreen_placeholder_username')}"/>
									</div>
									<div class="registerElement form-group">
										<input id="loginNewPassword" class="loginNewPassword loginInput small form-control" type="password" value="" style="width: 120px;"
											name="password" placeholder="${_('loginScreen_placeholder_password')}" size="10" />
									</div>
									<div class="registerElement form-group">
										<input id="loginValidatePassword" class="loginNewPassword loginInput small form-control" type="password" value="" style="width: 120px;"
											name="validate_password" placeholder="${_('loginScreen_placeholder__validate_password')}" size="10" />
									</div>
								</div>
								
								<div class="vk2RegisterUserLayoutInner">
									<div class="registerElement form-group">
										<input id="loginNewVorname" class="loginNewFullname loginInput medium form-control" type="text" value="" style="width: 160px;"
											name="vorname" placeholder="${_('loginScreen_placeholder_surname')}"/>
									</div>
									<div class="registerElement form-group">
										<input id="loginNewNachname" class="loginNewFullname loginInput medium form-control" type="text" value="" style="width: 160px;"
											name="nachname" placeholder="${_('loginScreen_placeholder_familyname')}"/>
									</div>
								</div>
								
								<div class="vk2RegisterUserLayoutInner">
									<div class="registerElement form-group">
										<input id="loginNewEmail" class="loginNewEmail loginInput large form-control" type="text" value="" style="width: 200px;"
											name="email" placeholder="${_('loginScreen_placeholder_email')}"/>	
									</div>
									<div class="registerElement form-group vkLoginBtn">
										<button type="button" id="submitNewUserBtn" name="form.submitted" class="btn btn-primary " style="width: 120px;">${_('loginScreen_submit_btn')}</button>
									</div>
								</div>
							</div>

						</div>
					</div>
					
				</div>
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
