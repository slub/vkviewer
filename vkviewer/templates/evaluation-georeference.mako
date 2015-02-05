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
				<section class="header-container">
					<nav class="navbar navbar-default" role="navigation">
						<div class="container-fluid">   
						    <div class="collapse navbar-collapse">
								<form class="navbar-form navbar-left" role="search">
									<div class="form-group">
										<label class="sr-only" for="mapid">Map Id</label>
						    			<input type="name" class="form-control" id="input-mapid" placeholder="${_('admin_enterMapId')}">
									</div>
						        	<button class="btn btn-default" id="getsingleprocesss-mapid" data-src="input-mapid" >${_('admin_getAllProcesses')}</button>
						      	</form>
						      	<form class="navbar-form navbar-left" role="search">
									<div class="form-group">
										<label class="sr-only" for="mapid">User Id</label>
						    			<input type="name" class="form-control" id="input-userid" placeholder="${_('admin_enterUserId')}">
									</div>
						        	<button class="btn btn-default" id="getsingleprocesss-userid" data-src="input-userid">${_('admin_getAllProcesses')}</button>
						      	</form>
						      	<ul class="nav navbar-nav navbar-right">
						        	<li><a href="#" id="getallprocesses">${_('admin_getAllUnvalidProcesses')}</a></li>
						        	<li class="dropdown">
						          		<a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false">Get Process<span class="caret"></span></a>
						          		<ul class="dropdown-menu" role="menu">
								            <li><a href="#" id="getallinvalideprocesses">Get all "invalide" processes</a></li>
						          		</ul>
						        	</li>
						      	</ul>
						   </div><!-- /.navbar-collapse -->
						</div><!-- /.container-fluid -->
					</nav>

				</section>  
				<section class="list-container" id="list-container">
				 				 			
				</section>		
				
								
				<section class="map-container">
					<div class="georeferenced-map olMap" id="evaluation-map">
						<div id="opacity-slider-container" class="opacity-slider-container"></div>
					</div>
				</section>

				
			</div>
		</div>
	</div>
</%block>

<%block name="js_content">
	<script>
		var app = new vk2.app.AdminEvaluationApp({
			'process_list':'list-container',
			'btn_getallprocess':'getallprocesses',
			'btn_getallinvalideprocess':'getallinvalideprocesses',
			'map_container':'evaluation-map',
			'btn_getsingleprocess_mapid':'getsingleprocesss-mapid',
			'btn_getsingleprocess_userid':'getsingleprocesss-userid'
		});
    </script> 
</%block>
