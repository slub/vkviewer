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
	<body style="width:600px;">
	
		<script>
			// this functions validates the form and checks if the passwords are valide
			var validateForm = function(){				
				var isValide = true;
							
				// check old password
				isValide = isValide && VK2.Validation.checkPassword(inputOldPassword, 'validationTips', 'ui-state-error');
				if (!isValide) return isValide;
				
				// check new password
				isValide = isValide && VK2.Validation.checkPassword(inputNewPassword, 'validationTips', 'ui-state-error');
				if (!isValide) return isValide;
				
				// check if new password matches validation password
				isValide = isValide && VK2.Validation.checkPasswordMatch(inputNewPassword, inputNewPasswordValidate, 'validationTips', 'ui-state-error'); 
				return isValide;
			}
    	</script>  
    
		<div class="container change-pw">
			<div class="panel panel-default">
				<div class="panel-heading" id="panelHeading"><p id="validationTips" class="validationTips">${_('change_pw_header')}</p></div>
				
				<div class="panel-body change-pw">
					<form  class="change-pw" action="${request.route_url('change_pw', action='update')}" target="_top" 
							role="form" onsubmit="return validateForm()" method="POST">
						<div class="form-group">
							<label for="inputOldPassword" class="col-sm-4 control-label">${_('old_password')}</label>
							<input type="password" name="old_password" class="form-control" id="inputOldPassword" placeholder="${_('old_password_placeholder')}" />
  						</div>
						<br>
						<div class="form-group">
    						<label for="inputNewPassword" class="col-sm-4 control-label">${_('new_password')}</label>
    						<input type="password" name="new_password" class="form-control" id="inputNewPassword" placeholder="${_('new_password_placeholder')}" />
  						</div>
  						<div class="form-group">
    						<label for="inputNewPasswordValidate" class="col-sm-4 control-label">${_('new_password_validate')}</label>
    						<input type="password" class="form-control" id="inputNewPasswordValidate" placeholder="${_('new_password_placeholder')}" />
  						</div>
     					<button type="submit" name="form.submitted" class="btn btn-primary">${_('change_pw')}</button>
					</form>
				</div>

        </body>  
    </body>
</html>
