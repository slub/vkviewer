# -*- coding: utf-8 -*-
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en"
      xmlns:tal="http://xml.zope.org/namespaces/tal"
      xmlns:i18n="http://xml.zope.org/namespaces/i18n"
      i18n:domain="vkviewer">
    <head>
        <META HTTP-EQUIV="Content-Type" CONTENT="text/html; CHARSET=UTF-8">
        <title>User #jm | History of user #jm</title>
        <link rel="stylesheet" type="text/css" href="${request.static_url('vkviewer:static/css/vk2/templates/users_profile_georef.css')}" />   			
    </head>
    
    <script>
   	
    </script>  
	<body>
		<header>
			<hgroup>
			
				<%
				from pyramid.security import authenticated_userid
				user_id = authenticated_userid(request)
				%>    
										
				% if user_id:
					<h1>History of user #${user_id}</h1>
					<h2>Previous Georeferencing - Points: [${points}]</h2>
					<br><a href="#">Back to map sheet overview</a>
				% endif
				
			</hgroup>
		</header>
		
		<div id="main">                             
                             
			% if georef_profile:
				% for record in georef_profile:
			 	
			 	<article class="">
					<p>
						<strong>Process-ID:</strong><br> ${record['georef_id']}
					</p>
					<p>  
	          			<strong>Result validated:</strong><br> ${record['isvalide']}  
	        		</p>
					<p>  
			          	<strong>Messtischblatt-ID:</strong><br> ${record['mtb_id']}  
			        </p>
					<p>  
			          	<strong>Map sheet information:</strong><br> ${record['titel']}
			        </p>
					<p>  
			          	<strong>Set corner points (lon:lat):</strong><br> ${record['clip_params']}
			        </p>
					<p>
					 	<strong>Persistent access to georeferenced map:</strong><br>
					 
					 	Being generated (duration approx. 20 Min. )
					</p>
			        <p class="meta">Created: ${record['time']}</p>  
				</article>

				% endfor
			% endif
			
		</div>
    </body>
</html>
