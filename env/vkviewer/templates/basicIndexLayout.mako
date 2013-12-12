# -*- coding: utf-8 -*-
<%inherit file="basicFooterLayout.mako"/>       

<%block name="headerJsCss">
	<link rel="stylesheet" type="text/css" href="${request.static_url('vkviewer:static/lib/ext-3.4.1/resources/css/ext-all.css')}"></link>
    <link rel="stylesheet" type="text/css" href="${request.static_url('vkviewer:static/css/geoext-all.css')}"></link>
    <link rel="stylesheet" type="text/css" href="${request.static_url('vkviewer:static/css/styles.css')}" />
    
    <!-- load generic js librarys -->
    <script src="${request.static_url('vkviewer:static/lib/ext-base.js')}"></script>
    <script src="${request.static_url('vkviewer:static/lib/ext-all.js')}"></script>    
    <script src="${request.static_url('vkviewer:static/lib/OpenLayers-2.13.1/OpenLayers.js')}"></script> 
    <script src="${request.static_url('vkviewer:static/lib/GeoExt/GeoExt.js')}"></script>  
    <script src="${request.static_url('vkviewer:static/lib/proj4js.js')}"></script>
    
    <!-- vk2 librarys -->
    <script src="${request.static_url('vkviewer:static/js/Vkviewer.js')}"></script>	
    

</%block>

<%block name="bodyBlock">

    	<!-- Header -->
        <div id="vk2Header" class="vk2Header">      	
            <img src="${request.static_url('vkviewer:static/images/searchbg.png')}" class="stretch" alt="" />
            <div class="vk2InnerHeader">
	            <div class="vk2Logo"></div>
	            <div class="vk2Gazetteer">
		            <div id="vk2GazetteerSearchDiv" class="vk2GazetteerSearchDiv">
						<input id="vk2GazetteerSearchInput" class="vk2GazetteerSearchInput" 
							placeholder="${_('placeholder_town_name')}" />
		            </div>
		         </div>
	            <div class="vk2Menubar">
	            	<div class="vk2MenubarDropDowns">
		            	<div id="vk2GeneralDiv" class="vk2GeneralDiv">
							<a id="vk2GeneralLink" class="vk2GeneralLink" title="${_('in_progress')}"></a>
						</div>
						<div id="vk2UserDiv" class="vk2UserDiv">
							<a id="vk2UserLink" class="vk2UserLink" title="${_('in_progress')}"></a>
						</div>
					</div>
					<div class="userLogin">
	            		
	            		<%
						from pyramid.security import authenticated_userid
						user_id = authenticated_userid(request)
						%>    
						
						% if user_id:
						
						 	<div class="loginMenu signin">
						 		<ul>
						 			<li>
										<div class="loginScreenContainer">
											<div class="labelLogin loginElement">${_('login_as_who')}</div>
											<div class="loginId loginElement">${user_id}</div>
											<div class="signOut loginElement">
												<a class="vk2UserToolLogout" href="${request.route_url('auth',action='out')}">${_('logout_button')}</a>
											</div>
										</div>
									</li>
									<li class="language_switcher">
										<a class="switch_de" href="${request.route_url('set_locales')}?language=de"></a>
									</li>
									<li class="language_switcher">
										<a class="switch_en" href="${request.route_url('set_locales')}?language=en"></a>
									</li>
								</ul>
							</div>
							
							
						%else:
						
						 	<div class="loginMenu signout">
								<ul>
									<li>
										<div id="vk2UserToolsDashboard" class="vk2UserToolsDashboard">${_('login_description')}</div>
									</li>
									<li>
										<a href="${request.route_url('auth',action='getscreen')}" id="vk2UserToolsLogin" class="vk2UserToolsLogin">${_('login_button')}</a>
									</li>
									<li class="language_switcher">
										<a class="switch_de" href="${request.route_url('set_locales')}?language=de"></a>
									</li>
									<li class="language_switcher">
										<a class="switch_en" href="${request.route_url('set_locales')}?language=en"></a>
									</li>
								</ul>
							</div>
						
						%endif
						
						
	            	</div>
	            </div>
	        </div>
        </div> 
        
        <!-- Body -->
        <div id="mapdiv" class="olMap"></div>
        <div id="vk2SBPanel" class="vk2SBPanel"></div>  

		% if context.get('welcomepage') is not 'off':
			<a href="${request.route_url('welcome')}" id="vk2WelcomePage"></a>
		% endif  
</%block>

${next.body()}