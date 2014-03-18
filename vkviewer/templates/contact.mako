# -*- coding: utf-8 -*-
<%inherit file="basic_page.mako" />

<%block name="header_content">	 
	<link rel="stylesheet" type="text/css" href="${request.static_url('vkviewer:static/css/styles.css')}" />
	<style>
		html, body {
			width: 600px;
		}
	</style>
</%block>

<%block name="body_content">
	<div class="contact-formular page-container">
		<div class="panel panel-default">
			<div class="panel-heading">${_('contact_header')}</div>
			<div class="panel-body">
				<p class="contant-message" id="contant-message">${_('contact_header_text')} </p><br>
				<form role="form" onsubmit="return validateForm()">
					<div class="form-group">
						<label for="contactMessage">Email:</label>
						<input type="text" class="form-control" name="email" placeholder="Email" autocomplete="on" id="input-email" autofocus></input>
					</div>
					<div class="form-group">
						<label for="contactMessage">${_('contact_message_label')}:</label>
						<textarea class="form-control" rows="5" name="message" placeholder="${_('contact_message_placeholder')}" id="input-message"></textarea>
						<span class="help-block">${_('contact_message_help')}</span>
					</div>
					<div class="form-group right">
						<button class="btn btn-primary" id="submit-button">Submit</button>
					</div>
				</form>
			</div>
		</div>
	</div>
</%block>

<%block name="js_content">
    <script>
    	var validateForm = function(){
    		var email = goog.dom.getElement('input-email').value;
			var message = goog.dom.getElement('input-message').value;
			
			// check email adress
			var isValide = true;
			isValide = isValide && VK2.Validation.checkEmailAdress('input-email', 'contant-message', 'ui-state-error');
			if (!isValide) return isValide;
			
			// build request
			var url = '${request.route_url('report', action='contact')}' + '?message=' + message + '&email=' + email + '&reference=contact';
			var success_callback = function(xhrio){alert(VK2.Utils.get_I18n_String('send_con_message_suc'));};
			var error_callback = function(xhrio){alert(VK2.Utils.get_I18n_String('send_con_message_err'));};
			VK2.Utils.sendReport(url, success_callback, error_callback);
			
			return false;
    	}
    </script> 
</%block>

