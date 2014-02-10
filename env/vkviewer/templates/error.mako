<%inherit file="basic_page_slim.mako" />

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
