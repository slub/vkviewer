<%inherit file="basic_page.mako" />

<%block name="header_content">
    <link rel="stylesheet" type="text/css" href="${request.static_url('vkviewer:static/css/vk2/single/georeference_profile.css')}" />	
	<script>
	    goog.require('vk2.utils.AppLoader');
	</script>
	<style>
		html {overflow: hidden;}
	</style>
</%block>

<%block name="body_content">
	<div class="georef-history container">
		<div>
			<header>
				<hgroup>
				
					<%
					from pyramid.security import authenticated_userid
					user_id = authenticated_userid(request)
					%>    
											
					% if user_id:
						<h1>${_('georef_user_history')} #${user_id}</h1>
						<h2>${_('georef_previous_georef')} - ${_('georef_points')}: [${points}]</h2>
						<br><a href="${request.route_url('home_login')}" target="_top">${_('georef_back_to_overview')}</a>
					% endif
					
				</hgroup>
			</header>
			
			<div id="content-container" class="content-container">                             
	                             
				% if georef_profile:
					% for record in georef_profile:
 	
				 	<article id="${record['georef_id']}" class="">
				 		<div class="media">
				 		
				 			% if record['transformed']:
					 		<a class="pull-right" href="http://kartenforum.slub-dresden.de/cgi-bin/mtbows?SERVICE=WMS&amp;VERSION=1.1.1&amp;REQUEST=GetMap&amp;LAYERS=Historische%20Messtischblaetter&amp;TRANSPARENT=true&amp;FORMAT=image/png&amp;STYLES=&amp;SRS=EPSG:900913&amp;BBOX=${record['boundingbox']}&amp;WIDTH=256&amp;HEIGHT=256&amp;TIME=${record['time']}">
					 		% else:
					 		<a class="pull-right" href="#">
					 		% endif
					 			
					 			% if 'key' in record:
					 				<img onerror="this.onerror=null;this.src='/images/noimage/image120.jpg'" alt="" src="http://fotothek.slub-dresden.de/mids/df/dk/0010000/${record['key']}.jpg">
					 			% else:
					 				<img onerror="this.onerror=null;this.src='/images/noimage/image120.jpg'" alt="" src="/images/noimage/image120.jpg">
					 			% endif
				 			
					 		</a>
				 		
				 			<div class="media-body">
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
								 	
								 	% if record['published']:
								 		<a href="${request.route_url('map_profile')}?objectid=${record['mtb_id']}&georef=true" target="_blank">Klick</a> 
								 	% else:
								 		${_('georef_result_being_generated')}
								 	% endif
								 		
								</p>
						        <p class="meta">Created: ${record['time_georef']}</p>
							</div>
						</div>  
					</article>
					% endfor
				% endif
				
			</div>
		</div>
	</div>
</%block>

<%block name="js_content">
	<script>
		//vk2.utils.AppLoader.loadGeoreferenceProfilePage('georef-history');
    </script> 
</%block>
