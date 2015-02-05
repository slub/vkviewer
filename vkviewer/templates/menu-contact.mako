# -*- coding: utf-8 -*-
<%inherit file="basic_page.mako" />

<%block name="body_content">
	<div class="contact-formular page-container">
		<div class="panel panel-default">
			<div class="panel-heading">${_('contact_header')}</div>
			<div class="panel-body">
				<p class="contant-message" id="contant-message">${_('contact_header_text')}</p><br>
				<div id="contact-form-validation-message" class="alert validation-error" style="display:none;"></div>
				<form id="contact-form" role="form" onsubmit="return vk2.validation.validateContactForm()" href="${request.route_url('report', action='contact')}">
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


