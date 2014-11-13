# -*- coding: utf-8 -*-
<%inherit file="basic_page.mako" />

<%block name="header_content">
    <link rel="stylesheet" type="text/css" href="${request.static_url('vkviewer:static/css/vk2/single/georeference_evaluation.css')}" />	
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
						<h1>${_('admin_validation')} #${user_id}</h1>
						<br><a href="${request.route_url('home_login')}" target="_top">${_('georef_back_to_overview')}</a>
					% endif
					
				</hgroup>
			</header>
			
			<div id="content-container" class="content-container">   
				<div class="header-container">
					<div class="form-inline">
						<!-- get all processes which are waiting for an validation -->
						<div class="form-group">
							<button class="btn btn-primary" id="getallprocesses">${_('admin_getAllUnvalidProcesses')}</button>
						</div>
						
						<!-- get all processes for id -->
						<div class="form-group">
						    <label class="sr-only" for="mapid">Map Id</label>
						    <input type="name" class="form-control" id="input-mapid" placeholder="${_('admin_enterMapId')}">
						    <button class="btn btn-primary" id="getsingleprocesss-mapid" data-src="input-mapid" >${_('admin_getAllProcesses')}</button>
						 </div>
						 
						 <!-- get all processes for user -->
						<div class="form-group">
						    <label class="sr-only" for="mapid">User Id</label>
						    <input type="name" class="form-control" id="input-userid" placeholder="${_('admin_enterUserId')}">
						    <button class="btn btn-primary" id="getsingleprocesss-userid" data-src="input-userid">${_('admin_getAllProcesses')}</button>
						</div>
					</div>
				</div>  
				<div class="list-container" id="list-container">
				 				 			
				</div>		
				
								
				<div class="map-container">
					<div class="georeferenced-map olMap" id="evaluation-map">
						<div id="opacity-slider-container" class="opacity-slider-container"></div>
					</div>
				</div>

				
			</div>
		</div>
	</div>
</%block>

<%block name="js_content">
	<script>
		var app = new vk2.app.AdminEvaluationApp({
			'process_list':'list-container',
			'btn_getallprocess':'getallprocesses',
			'map_container':'evaluation-map',
			'btn_getsingleprocess_mapid':'getsingleprocesss-mapid',
			'btn_getsingleprocess_userid':'getsingleprocesss-userid'
		});
    </script> 
</%block>
