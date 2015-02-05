# -*- coding: utf-8 -*-
<%inherit file="basic_page.mako" />

<%block name="body_content">
	<div class="login-screen page-container">
		<div class="container">
			<div class="panel panel-default">
				<div class="panel-heading" id="panelHeading"><p id="validationTips" class="validation-tips">${_('loginScreen_welcome')}</p></div>
				
				<div class="panel-body">
				
					<!-- Anmeldung für existierende Nutzer -->
					<div class="panel panel-default panel-vk2Login">
						<div class="panel-heading">
							<p class="validation-tips">${_('plz_login')}</p>
						</div>
						<div id="validationTipsLogin" class="alert validation-error">
						</div>
						<div class="panel-body panel-body-vk2Login">
							<form class="form-user-login" action="${request.route_url('auth', action='in')}" target="_top" 
								role="form" onsubmit="return vk2.validation.validateLoginForm()" method="POST">
								<div class="form-group">
									<label for="loginUsername" class="control-label">${_('loginScreen_placeholder_username')}</label>
									<input type="text" name="username" class="form-control" id="loginUsername" 
										placeholder="${_('loginScreen_placeholder_username')}" />
								</div>
								<div class="form-group">
									<label for="loginPassword" class="control-label">${_('loginScreen_placeholder_password')}</label>
									<input type="password" name="password" class="form-control" id="loginPassword" 
										placeholder="${_('loginScreen_placeholder_password')}" />
								</div>
								<div class="form-group"></div>
								<button type="submit" name="form.submitted" class="btn btn-primary">${_('loginScreen_submit_btn')}</button>
								<a class="forgot" href="${request.route_url('auth', action='page_reset')}">${_('loginScreen_reset_pw')}</a>
							</form>
						</div>
					</div> 
					
					<!--  added ".back-to-login" for switch back if registration is active -->	
					<div class="back-to-login">${_('loginScreen_backTo')} <span class="trigger-login">${_('loginScreen_registration')}</span></div>
					
					<!-- Neue registrierung für Nutzer -->
					<div class="panel panel-default panel-vk2RegisterNewUser">
						<div class="panel-heading">
							<p class="validation-tips">${_('loginScreen_welcome_new')} <span class="trigger-registration">${_('loginScreen_register_now')}</span></p>
						</div>
						<div id="validationTipsRegisterUser" class="alert validation-error">
						</div>
						<div class="panel-body">
							<form class="form-user-register" action="${request.route_url('auth', action='new')}" target="_top" 
								role="form" onsubmit="return vk2.validation.validateRegisterNewUser()" method="POST">
								<div class="form-group">
									<label for="loginNewUsername" class="control-label">${_('loginScreen_placeholder_username')}</label>
									<input type="text" name="username" class="form-control" id="loginNewUsername" 
										placeholder="${_('loginScreen_placeholder_username')}" />
								</div>
								<div class="form-group double-input-field">
									<label for="loginNewPassword" class="control-label">${_('loginScreen_placeholder_password')}</label>
									<div class="row">
										<div class="col-xs-6 col-sm-6 col-md-6 col-lg-6">
											<input type="password" name="password" class="form-control password-new" id="loginNewPassword" 
												placeholder="${_('loginScreen_placeholder_password')}" />
										</div>
										<div class="col-xs-6 col-sm-6 col-md-6 col-lg-6">
											<input type="password" name="password_validate" class="form-control right" id="loginNewPasswordValidate" 
												placeholder="${_('loginScreen_placeholder_password')}" />
										</div>
									</div>
								</div>
								<div class="form-group double-input-field">
									<label for="loginNewVorname" class="control-label">${_('loginScreen_placeholder_surname')} & ${_('loginScreen_placeholder_familyname')}</label>
									<div class="row">
										<div class="col-xs-6 col-sm-6 col-md-6 col-lg-6">
											<input type="text" name="vorname" class="form-control" id="loginNewVorname" 
												placeholder="${_('loginScreen_placeholder_surname')}" />
										</div>
										<div class="col-xs-6 col-sm-6 col-md-6 col-lg-6">
											<input type="text" name="nachname" class="form-control right" id="loginNewNachname" 
												placeholder="${_('loginScreen_placeholder_familyname')}" />
										</div>
									</div>
								</div>
								<div class="form-group">
									<label for="loginNewEmail" class="control-label">${_('loginScreen_placeholder_email')}</label>
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
	</div>
</%block>

<%block name="js_content">
<script>
$(document).ready(function(){
  $('.trigger-registration, .trigger-login').click(function() {
    $('.panel-vk2Login').slideToggle();
    $('.panel-vk2RegisterNewUser .panel-heading').slideToggle();
    $('.panel-vk2RegisterNewUser .panel-body').slideToggle();
    $('.panel-vk2RegisterNewUser #validationTipsRegisterUser').slideToggle();
    $('.back-to-login').fadeToggle();
  });      
});
</script>
</%block>
