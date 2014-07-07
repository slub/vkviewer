# -*- coding: utf-8 -*-
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
				<div class="container">
					<div class="row">
				 		<div class="col-lg-6 col-md-6 list">
				 			<div class="inner-list-container">
				 			
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
												<!-- <a href="${request.route_url('georeference_page')}?id=${record['mtb_id']}&georeferenceid=${record['georef_id']}" class="btn btn-primary" target="_blank">Show Georeference Process</a> -->
												<a data-params="${record['clip_params']}" data-id="${record['mtb_id']}" href="#" class="btn btn-primary btn-show-georef">Show</a>
												<a href="#" data-href="${request.route_url('georeference_evaluation', action='delete')}?georeferenceid=${record['georef_id']}" data-id="${record['georef_id']}" 
													class="btn btn-warning action-btn">Delete Georeference Process</a>
											</p>
										</article>
									% endfor
								% endif
							</div>		
						</div>
								
								<div class="col-lg-6 col-md-6 map">
									<div class="evaluation-map olMap" id="evaluation-map"></div>
					 			</div>
						</div>  

				
			</div>
		</div>
	</div>
</%block>

<%block name="js_content">
	<script>
		vk2.utils.AppLoader.loadGeoreferenceEvaluationRecordBehavior('action-btn', 'data-href', 'data-id');
		vk2.utils.AppLoader.loadGeoreferenceEvaluationMap('evaluation-map', 'btn-show-georef');
    </script> 
</%block>
