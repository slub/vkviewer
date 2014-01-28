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
    </head>
	<body class="error">
		<div class="error-container">
			<div class="alert alert-danger">
				% if error_msg: 
					${error_msg}
				% endif
				<br>
				<a href="${request.route_url('home')}" class"alert-link">${_('try_again')}</a>
			</div>		
		</div>  
		        
    </body>
</html>