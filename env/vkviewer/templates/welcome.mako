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
        <link rel="stylesheet" type="text/css" href="${request.static_url('vkviewer:static/css/vk2/templates/styles.css')}" /> 
        <link rel="stylesheet" type="text/css" href="${request.static_url('vkviewer:static/css/vk2/templates/welcome.css')}" />
      	<script src="${request.static_url('vkviewer:static/lib/jquery.js')}"></script>
      	<script src="${request.static_url('vkviewer:static/lib/jquery-ui.js')}"></script>
    </head>
    
    <script>
    	$(document).ready(function(){
			$('#deactivateWelcomePage').change(function(){
				var queryValue = $(this).prop('checked') ? 'off' : 'on';
	   			$.ajax({
        			url: '/vkviewer/welcomeoff',
        			type: 'GET',
        			data: {
        				'welcomepage': queryValue
        			},
        			success: function( data ){  
						console.log(data);
        			},
        			statusCode: {
        				400: function(){
        					alert( 'bad request' );
        				}
        			}
	   			});
	   		});
	   	});
    </script>  
	<body>
	    <h2 class="slubcolor">Willkommen im Virtuellen Kartenforum 2.0</h2>
	    <br>
	    <div>
	    	<span>Willkommensseite in Zukunft nicht mehr anzeigen</span>
	    	<input type="checkbox" id="deactivateWelcomePage" name="deactivateWelcomePage"> 
	    </div>
    </body>
</html>
