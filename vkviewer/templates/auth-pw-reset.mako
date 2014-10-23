<%inherit file="basic_page.mako" />

<%block name="header_content">
	<script>
	    goog.require('vk2.validation');
	</script>
</%block>

<%block name="body_content">
	<div class="reset-pw page-container">
		<div class="container change-pw">
			<div class="panel panel-default">
				<div class="panel-heading" id="panelHeading">
					<p id="validationTips" class="validationTips">${_('reset_pw_header')}</p>
				</div>
				
				<div class="panel-body reset-pw">
					<p>${_('reset_pw_explanation')}</p>
					<form class="form-reset-pw" action="${request.route_url('auth', action='reset')}" target="_top" 
							role="form" onsubmit="return vk2.validation.resetPasswordForm()" method="POST">
						<div class="form-group">
							<label for="inputUsername" class="col-sm-4 control-label">${_('loginScreen_placeholder_username')}</label>
							<input type="text" name="username" class="form-control" id="inputUsername" placeholder="${_('loginScreen_placeholder_username')}" />
  						</div>
						<div class="form-group">
    						<label for="inputEmail" class="col-sm-4 control-label">${_('loginScreen_placeholder_email')}</label>
    						<input type="text" name="email" class="form-control" id="inputEmail" placeholder="${_('loginScreen_placeholder_email')}" />
  						</div>
     					<button type="submit" name="form.submitted" class="btn btn-primary">${_('reset_pw')}</button>
					</form>
				</div>
			</div>
        </div>
	</div> 
</%block>

