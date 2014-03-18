<%inherit file="basic_page_slim.mako" />

<%block name="header_content">	 
	<link rel="stylesheet" type="text/css" href="${request.static_url('vkviewer:static/css/styles.css')}" />
</%block>

<%block name="body_content">
	<div class="reset-pw-success page-container">
		<div class="reset-pw-container">
			<div class="alert alert-success">
				${_('reset_pw_dialog_success')}
				<br>
				<a href="${request.route_url('home')}" class"alert-link">${_('go_back_main_page')}</a>
			</div>		
		</div> 
	</div>
</%block>