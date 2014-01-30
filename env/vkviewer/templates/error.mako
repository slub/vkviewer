<%inherit file="basic_page_slim.mako" />

<%block name="header_content">
	<link rel="stylesheet" type="text/css" href="${request.static_url('vkviewer:static/lib/min/css/vkviewer-libarys.min.css')}" media="screen" />
	<link rel="stylesheet" type="text/css" href="${request.static_url('vkviewer:static/css/vk2/templates/template_pages.css')}" />	     	
</%block>

<%block name="body_content">
	<div class="error page-container">
		<div class="error-container">
			<div class="alert alert-danger">
				% if error_msg: 
					${error_msg}
				% endif
				<br>
				<a href="${request.route_url('home')}" class"alert-link">${_('try_again')}</a>
			</div>		
		</div>  
	</div>
</%block>
