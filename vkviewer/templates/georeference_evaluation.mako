<%inherit file="basic_page.mako" />

<%block name="header_content">
    <link rel="stylesheet" type="text/css" href="${request.static_url('vkviewer:static/css/vk2/single/georeference_evaluation.css')}" />	
	<script>
	    goog.require('vk2.utils.AppLoader');
	</script>
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
						<h1>${_('georef_evaluation')} #${user_id}</h1>
						<br><a href="${request.route_url('home_login')}" target="_top">${_('georef_back_to_overview')}</a>
					% endif
					
				</hgroup>
			</header>
			
			<div id="content-container" class="content-container">                             
	                             
				% if georef_profile:
					% for record in georef_profile:
 	
				 	<article id="${record['georef_id']}" class="">
				 		<div class="media">
				 		
					 		<a class="pull-right" href="#">
					 			
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
						          	<strong>User-ID:</strong><br> ${record['userid']}  
						        </p>
								<p>  
						          	<strong>${_('georef_map_sheet_info')}:</strong><br> ${record['titel']}
						        </p>
								<p>  
						          	<strong>${_('georef_parameter')}:</strong><br> ${record['clip_params']}
						        </p>
						        <p>  
						          	<strong>Type:</strong><br> ${record['type']}
						        </p>
						        <p class="meta">Created: ${record['time_georef']}</p>
						        <br><br>
						        <p>
								  <a href="#" data-href="${request.route_url('georeference_evaluation', action='publish')}?objectid=${record['mtb_id']}&georeferenceid=${record['georef_id']}" 
								  		data-id="${record['georef_id']}" class="btn btn-primary action-btn">Publish</a>
								  <a href="${request.route_url('georeference_page')}?id=${record['mtb_id']}&georeferenceid=${record['georef_id']}" class="btn btn-primary" target="_blank">Show Georeference Process</a>
								  <a href="#" data-href="${request.route_url('georeference_evaluation', action='delete')}?georeferenceid=${record['georef_id']}" data-id="${record['georef_id']}" 
								  		class="btn btn-warning action-btn">Delete Georeference Process</a>
								</p>
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
		vk2.utils.AppLoader.loadGeoreferenceEvaluationRecordBehavior('action-btn', 'data-href', 'data-id');
    </script> 
</%block>
