<%inherit file="basic_page.mako" />

<%block name="header_content">
        <link rel="stylesheet" type="text/css" href="${request.static_url('vkviewer:static/css/vk2/templates/users_profile_georef.css')}" />	
		<link rel="stylesheet" type="text/css" href="${request.static_url('vkviewer:static/css/styles.css')}" />	
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
					 		<a class="pull-right"href="http://kartenforum.slub-dresden.de/cgi-bin/mtbows?SERVICE=WMS&amp;VERSION=1.1.1&amp;REQUEST=GetMap&amp;LAYERS=Historische%20Messtischblaetter&amp;TRANSPARENT=true&amp;FORMAT=image/png&amp;STYLES=&amp;SRS=EPSG:900913&amp;BBOX=${record['boundingbox']}&amp;WIDTH=256&amp;HEIGHT=256&amp;TIME=${record['time']}">
					 			<img class="media-object thumbnail" src="" alt="..." data-src="http://kartenforum.slub-dresden.de/cgi-bin/mtbows?SERVICE=WMS&amp;VERSION=1.1.1&amp;REQUEST=GetMap&amp;LAYERS=Historische%20Messtischblaetter&amp;TRANSPARENT=true&amp;FORMAT=image/png&amp;STYLES=&amp;SRS=EPSG:900913&amp;BBOX=${record['boundingbox']}&amp;WIDTH=256&amp;HEIGHT=256&amp;TIME=${record['time']}">
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
								 	
								 	% if record['transformed']:
								 		<a href="${request.route_url('mtb_profile')}?key=${record['key']}&amp;
								 			time=${['time']}&amp;extent=${record['boundingbox']}" target="_blank">Klick</a> 
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
   		$(document).ready(function(){
   			var url = new goog.Uri(window.location.href);
   			var georef_id = url.getQueryData().get('georefid'); 			
   			// if query parameter is set add class to element with georefid
   			if (goog.isDef(georef_id)){
   				var article = goog.dom.getElement(georef_id);
   				goog.dom.classes.add(georef_id, 'complete');
   			}
    			
			var container = goog.dom.getElementByClass('georef-history');
			var thumbnailsNodeList = goog.dom.getElementsByClass('thumbnail');	
			var thumbnailsArr = VK2.Utils.castNodeListToArray(thumbnailsNodeList);
			var lazyLoading = VK2.Utils.getLazyImageLoadingFn(thumbnailsArr, 'src', 'data-src');
			var timeout;
			goog.events.listen(container, goog.events.EventType.SCROLL, function(e){
				clearTimeout(timeout);
				timeout = setTimeout(lazyLoading, 1000);
			});
			lazyLoading();
   		})
    </script> 
</%block>
