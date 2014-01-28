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
        <script src="${request.static_url('vkviewer:static/lib/min/vkviewer-libarys.min.js')}"></script>

    </head>

    <script>
   		$(document).ready(function(){
   			// get query parameter
   			var queryString = window.location.search.substring(1);
			var vars = queryString.split('&');
			var queryParams = {}
			for (var i = 0; i < vars.length; i++){
				var pair = vars[i].split('=');
				queryParams[pair[0]] = decodeURIComponent(pair.slice(1).join('='))
			};
   			
   			// if query parameter is set add class to element with georefid
   			if ('georefid' in queryParams){
   				$(document.getElementById(queryParams['georefid'])).addClass('complete');
   			}
   		})
    </script>  
	<body style="width: 1000px;">
		<header>
			<hgroup>
			
				<%
				from pyramid.security import authenticated_userid
				user_id = authenticated_userid(request)
				%>    
										
				% if user_id:
					<h1>${_('georef_user_history')} #${user_id}</h1>
					<h2>${_('georef_previous_georef')} - ${_('georef_points')}: [${points}]</h2>
					<br><a href="${request.route_url('home_login')}?georef=on" target="_top">${_('georef_back_to_overview')}</a>
				% endif
				
			</hgroup>
		</header>
		
		<div id="main">                             
                             
			% if georef_profile:
				% for record in georef_profile:
			 	
			 	<article id="${record['georef_id']}" class="">
					<p>
						<strong>${_('georef_process_id')}:</strong><br> ${record['georef_id']}
					</p>
					<p>  
	          			<strong>${_('georef_result_validate')}:</strong><br> ${record['isvalide']}  
	        		</p>
					<p>  
			          	<strong>Messtischblatt-ID:</strong><br> ${record['mtb_id']}  
			        </p>
					<p>  
			          	<strong>${_('georef_map_sheet_info')}:</strong><br> ${record['titel']}
			        </p>
					<p>  
			          	<strong>${_('georef_parameter')}:</strong><br> ${record['clip_params']}
			        </p>
					<p>
					 	<strong>${_('georef_persist_access')}:</strong><br>
					 	
					 	% if 'transformed' in record:
					 		<a href="http://139.30.111.16/fgs/vkll/EN/viewer.php?mtbid=${record['transformed']['mtbid']}&amp;
					 			timestamp=${record['transformed']['time']}&amp;bounds=${record['transformed']['boundingbox']}" target="_blank">Klick</a> 
					 	% else:
					 		${_('georef_result_being_generated')}
					 	% endif
					 		
					</p>
			        <p class="meta">Created: ${record['time']}</p>  
				</article>

				% endfor
			% endif
			
		</div>
    </body>
</html>
