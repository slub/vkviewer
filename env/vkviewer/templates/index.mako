# -*- coding: utf-8 -*-
<%inherit file="basicIndexLayout.mako"/>           
##
## login
##
 
<%block name="menubar">
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
</%block>

##
## sidebar 
##
<%block name="sidebar">
    <div id="vk2SBPanel" class="vk2SBPanel">
		<div id="vk2SBContentPanel" class="vk2SBContentPanel">
	    	<!-- Sidebar content -->    		
	    	<div id="vk2SBHeaderPanel" class="vk2SBHeaderPanel">
	    		<div id="vk2SBHeaderLabel" class="vk2SBHeaderLabel">
	    			<h4>Überschrift</h4>
	    		</div>
	    		<span id="vk2SBClose" class="vk2SBClose vk2SidebarIcon"></span>
	    	</div>
	    	<div id="vk2SidebarBodyPanel" class="vk2SidebarBodyPanel">
	    		<div id="vk2LayersearchPanel" class="vk2LayersearchPanel"></div>
	    		<div id="vk2LayerbarPanel" class="vk2LayerbarPanel"></div>
			</div>
	    </div>
    </div>
    

</%block>

##
## appendix
##
<%block name="appendix">
	% if context.get('welcomepage') is not 'off':
		<a href="${request.route_url('welcome')}" id="vk2WelcomePage"></a>
	% endif  
</%block>
	
