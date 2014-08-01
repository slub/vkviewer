# -*- coding: utf-8 -*-
<%inherit file="basic_page.mako" />

<%block name="header_content">
</%block>

<%block name="body_content">
	<div id="main-page-container" class="body-container">
		
      
              
        <!-- Body -->
        <div class="container main-page content-container">
        			
        			<!-- Map panel -->

        				<div id="vk2MapPanel" class="vk2MapPanel">
        					<!-- map container -->
			        		<div id="mapdiv" class="olMap" tabindex="0"></div>
			        		<!-- /end map container -->
			        		
			        		<!-- user header --> 
			        		<div class="user-header">
			        			<ul class="nav nav-pills vk2-navbar-user" id="vk2-navbar-user">
			        				<li class="dropdown user-dropdown">
			        				
						        		<%
										from pyramid.security import authenticated_userid
										user_id = authenticated_userid(request)
										%>    
													
										% if user_id:
									
						              	<a href="#" class="dropdown-toggle" data-toggle="dropdown"><span class="glyphicon glyphicon-user"></span> ${user_id} <b class="caret"></b></a>
						              	<ul class="dropdown-menu">
							                <li><a href="${request.route_url('users_profile_georef')}" data-src="${request.route_url('users_profile_georef')}" data-classes="georef-history" 
								        		class="vk2-modal-anchor" data-title="">${_('georef_history')}</a></li>
							                <li><a href="${request.route_url('change_pw', action='page')}" data-src="${request.route_url('change_pw', action='page')}" data-classes="pw-change" 
								        		class="vk2-modal-anchor" data-title="${_('change_pw_header')}">${_('change_pw_header')}</a></li>
							                <li class="divider"></li>
							                <li><a href="${request.route_url('auth',action='out')}"><span class="glyphicon glyphicon-off"></span> ${_('logout_button')} </a></li>
							              </ul>
						              
							            % else:
							              <a href="${request.route_url('auth',action='getscreen')}" data-src="${request.route_url('auth',action='getscreen')}" data-classes="login" 
								        		class="vk2-modal-anchor" data-title="${_('login_button')}"> ${_('login_button')} <b class="caret"></b> </a>
							         	% endif
							         </li>
							         <li id="georeference-chooser-container"></li>
							    </ul>
					         	
					 			<!-- language switcher -->
					 			<ul class="langswitch">
	          						<li><a href="${request.route_url('set_locales')}?language=de"><span class="language_switcher switch_de"></span>${_('header_language_de')}</a></li>
			        				<li><a href="${request.route_url('set_locales')}?language=en"><span class="language_switcher switch_en"></span>${_('header_language_en')}</a></li>  
	          					</ul>
				         	
			        		</div>
			        		<!-- user header end -->
			        		
			        		<!-- spatial search div -->
			        		<div class="spatialsearch-container" id="spatialsearch-container">
			        				
			        			<!-- navbar -->
			        			<div class="vk2HeaderNavBar" role="navigation">
		
										<!-- Brand and toggle get grouped for better mobile display -->
								        <div class="vk2-navbar-header">
								          	<a class="navbar-brand" href="#">Virtuelles Kartenforum 2.0</a>  	
								          	
								          	<!-- Collect the nav links, forms, and other content for toggling -->
								        	<ul class="nav nav-pills">
								        		<li class="dropdown info-dropdown">
									                <a href="#" class="dropdown-toggle" data-toggle="dropdown" title="${_('header_service')}">${_('header_service')} <b class="caret"></b></a>
									                <ul class="dropdown-menu">
					                	
										            	% if faq_url:
										            		<li class="listelement leftborder">
													        	<a href="${faq_url}" data-src="${faq_url}" data-classes="faq" 
													        			class="vk2-modal-anchor" data-title="${_('faq_main_heading')}">FAQ</a>        				
													        </li>       		   		
													    % else:
													    	<li class="listelement leftborder">
													        	<a href="${request.route_url('faq')}" data-src="${request.route_url('faq')}" data-classes="faq" 
													        			class="vk2-modal-anchor" data-title="${_('faq_main_heading')}">FAQ</a>        				
													        </li>
													    % endif
									        			
													    <li class="listelement leftborder">
													    	<a href="${request.route_url('contact')}" data-src="${request.route_url('contact')}" data-classes="contact" 
													        		class="vk2-modal-anchor" data-title="${_('contact_header')}">${_('footer_contact')}</a>		
													    </li>        				
													    <li class="listelement leftborder">
													    	<a href="${request.route_url('project')}" data-src="${request.route_url('project')}" data-classes="project" 
													        		class="vk2-modal-anchor" data-title="${_('project_name_short')}">${_('footer_project')}</a>    				
													    </li>
													    <li class="listelement">
													    	<a href="${request.route_url('impressum')}" data-src="${request.route_url('impressum')}" data-classes="impressum" 
													        		class="vk2-modal-anchor" data-title="${_('footer_editorial')}">${_('footer_editorial')}</a>
													    </li> 
									        
													    % if with_modify:  
													    <li class="listelement">
													    	<a href="${request.route_url('georeference_evaluation', action='evaluation')}" data-src="${request.route_url('georeference_evaluation', action='evaluation')}" data-classes="admin-evaluation" 
													        		class="vk2-modal-anchor" data-title="">Evaluierung</a>
													    </li> 
													    % endif     
												          
									                </ul>
								             	</li>
			          						</ul>
								        </div>        
		        
								        
					        						        		
        						</div>
        						<!-- end spatial search -->
        				</div>
      	
			        	<!-- Footer panel -->
			        	<div class="vk2FooterPanel">
			        		<div id="vk2Footer" class="vk2Footer">
			        			<div class="footerContainer">
        							<div class="leftside">
					        			<ul class="footerList">
					        				<li class="listelement thick leftborder">${_('footer_project_name')}</li>
					        				<li class="listelement">${_('footer_project_desc_long')}</li>
					        			</ul>
        							</div>
					        		<div class="rightside">
					        		   	<ul class="footerList">
					        				<li class="listelement leftborder">
					        					<a href="${request.route_url('faq')}" data-src="${request.route_url('faq')}" data-classes="faq" 
					        							class="vk2-modal-anchor" data-title="Häufig gestellte Fragen (FAQ)">FAQ</a>        				
					        				</li>
					        				<li class="listelement leftborder">
					         					<a href="${request.route_url('contact')}" data-src="${request.route_url('contact')}" data-classes="contact" 
					        							class="vk2-modal-anchor" data-title="">${_('footer_contact')}</a>		
					        				</li>        				
					        				<li class="listelement leftborder">
					        					<a href="${request.route_url('project')}" data-src="${request.route_url('project')}" data-classes="project" 
					        							class="vk2-modal-anchor" data-title="">${_('footer_project')}</a>    				
					        				</li>
					        				<li class="listelement">
					        					<a href="${request.route_url('impressum')}" data-src="${request.route_url('impressum')}" data-classes="impressum" 
					        							class="vk2-modal-anchor" data-title="">${_('footer_editorial')}</a>
					        				</li>
					        			</ul>
					        		</div>
        						</div>
        					</div>
			        	</div>
						<!-- end footer -->
		</div>

		% if context.get('welcomepage') is not 'off':
			<a href="${request.route_url('welcome')}" id="vk2WelcomePage" data-src="${request.route_url('welcome')}" data-classes="welcomeBox" 
				class="vk2-modal-anchor" data-title=""></a>
		% endif  
	</div>
</%block>

<%block name="js_content">
	<script>
	<%
		from pyramid.security import authenticated_userid
		user_id = authenticated_userid(request)
	%>

	% if user_id:
		var apploader = new vk2.utils.AppLoader({
			'authenticate':true
		});
	% else:
		var apploader = new vk2.utils.AppLoader({});
	% endif
	
	</script>
</%block>

