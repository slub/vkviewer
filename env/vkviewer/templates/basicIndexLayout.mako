# -*- coding: utf-8 -*-
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en"
      xmlns:tal="http://xml.zope.org/namespaces/tal"
      xmlns:i18n="http://xml.zope.org/namespaces/i18n"
      i18n:domain="vkviewer">
	<head>
        <META HTTP-EQUIV="Content-Type" CONTENT="text/html; CHARSET=UTF-8">
        <title>Virtuelles Kartenforum 2.0</title>
			        	      
        <link rel="stylesheet" type="text/css" href="${request.static_url('vkviewer:static/lib/jquery-ui-1.10.3/themes/base/minified/jquery-ui.min.css')}" />
        <link rel="stylesheet" type="text/css" href="${request.static_url('vkviewer:static/lib/fancyapps-fancyBox/source/jquery.fancybox.css')}" media="screen" />    
        <link rel="stylesheet" type="text/css" href="${request.static_url('vkviewer:static/css/vk2/templates/styles.css')}" /> 
        <link rel="stylesheet" type="text/css" href="${request.static_url('vkviewer:static/css/vk2/templates/basicFooterLayout.css')}" />   			        	      
		<link rel="stylesheet" type="text/css" href="${request.static_url('vkviewer:static/lib/bootstrap-3.0.3/css/bootstrap.css')}"></link>
		<link rel="stylesheet" type="text/css" href="${request.static_url('vkviewer:static/lib/ext-3.4.1/resources/css/ext-all.css')}"></link>
	    <link rel="stylesheet" type="text/css" href="${request.static_url('vkviewer:static/css/geoext-all.css')}"></link>
	    <link rel="stylesheet" type="text/css" href="${request.static_url('vkviewer:static/css/vk2/templates/basicIndexLayout.css')}" />
	    <link rel="stylesheet" type="text/css" href="${request.static_url('vkviewer:static/css/styles.css')}" />
    
	    <!-- load generic js librarys -->
	    <script src="${request.static_url('vkviewer:static/lib/jquery.min.js')}"></script>
	    <script src="${request.static_url('vkviewer:static/lib/jquery-ui.min.js')}"></script>
	    <script src="${request.static_url('vkviewer:static/lib/jquery.fancybox.min.js')}"></script> 
	    <script src="${request.static_url('vkviewer:static/lib/ext-base.js')}"></script>
	    <script src="${request.static_url('vkviewer:static/lib/ext-all.js')}"></script> 
	    <script src="${request.static_url('vkviewer:static/lib/OpenLayers-2.13.1/OpenLayers.js')}"></script> 
	    <script src="${request.static_url('vkviewer:static/lib/GeoExt.min.js')}"></script>  
	    <script src="${request.static_url('vkviewer:static/lib/proj4js.js')}"></script>
	    <script src="${request.static_url('vkviewer:static/lib/bootstrap.min.js')}"></script>
    
         <!-- javascript internationalization --> 
      	<script src="${request.static_url('vkviewer:static/js/locale/'+_('js_library')+'.js')}"></script>
	    
	    <!-- vk2 librarys -->
	    <script src="${request.static_url('vkviewer:static/js/Vkviewer.min.js')}"></script>	
	</head>
	
	<body>

		<div class="navbar navbar-inverse navbar-fixed-top vk2HeaderNavBar" role="navigation">
		
			<!-- Brand and toggle get grouped for better mobile display -->
	        <div class="navbar-header">
	          	<button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-ex1-collapse">
		            <span class="sr-only">Toggle navigation</span>
		            <span class="icon-bar"></span>
		            <span class="icon-bar"></span>
		            <span class="icon-bar"></span>
	          	</button>
	          	<a class="navbar-brand" href="#">Virtuelles Kartenforum 2.0</a>
	        </div>        
	        
	        <!-- Collect the nav links, forms, and other content for toggling -->
        	<div class="collapse navbar-collapse navbar-ex1-collapse">
          		<div class="navbar-inner">
          		
	          		<ul class="nav navbar-nav navbar-left vk2Gazetteer">
	          			<div id="vk2GazetteerSearchDiv" class="vk2GazetteerSearchDiv">
							<input id="vk2GazetteerSearchInput" class="vk2GazetteerSearchInput" 
								placeholder="${_('placeholder_town_name')}" />
			            </div>
	          		</ul>
          		
	          		<ul class="nav navbar-nav navbar-right vk2-navbar-user">
	          
			          	<! further options -->
			          	<li class="drowdown">
			              	<a href="#" class="dropdown-toggle" data-toggle="dropdown"></span> ${_('header_service')} <b class="caret"></b></a>
			              	<ul class="dropdown-menu">
			              
				              	% if faq_url:
				         			<li><a href="${faq_url}" class="vk2FooterLinks">FAQ</a></li>        				
				        		% else:
				        			<li><a href="${request.route_url('faq')}" class="vk2FooterLinks">FAQ</a></li>
				        		% endif
			        		
				              	<li><a href="${request.route_url('contact')}" class="vk2FooterLinks">${_('footer_contact')}</a></li>
				              	<li><a href="${request.route_url('project')}" class="vk2FooterLinks">${_('footer_project')}</a></li>
				              	<li><a href="${request.route_url('impressum')}" class="vk2FooterLinks">${_('footer_editorial')}</a><li>             
			              	</ul>                 		
			          	</li>
		          
			          	<!-- language chooser -->
			          	<li class="dropdown">
			              	<a href="#" class="dropdown-toggle" data-toggle="dropdown"></span> ${_('header_language')} <b class="caret"></b></a>
			              	<ul class="dropdown-menu">
			                	<li><a href="${request.route_url('set_locales')}?language=de"><span class="language_switcher switch_de"></span>${_('header_language_de')}</a></li>
			                	<li><a href="${request.route_url('set_locales')}?language=en"><span class="language_switcher switch_en"></span>${_('header_language_en')}</a></li>              
			              	</ul>          		
			          	</li>
		          	
		          	
			          	<!-- user menu -->
			            <li class="dropdown user-dropdown">
			            
				           	<%
							from pyramid.security import authenticated_userid
							user_id = authenticated_userid(request)
							%>    
										
							% if user_id:
						
			              	<a href="#" class="dropdown-toggle" data-toggle="dropdown"><span class="glyphicon glyphicon-user"></span> ${user_id} <b class="caret"></b></a>
			              	<ul class="dropdown-menu">
				                <li><a href="#"> Profile</a></li>
				                <li><a href="#"> Settings</a></li>
				                <li class="divider"></li>
				                <li><a href="${request.route_url('auth',action='out')}"><span class="glyphicon glyphicon-off"></span> ${_('logout_button')} </a></li>
				              </ul>
			              
				            % else:
				              <a href="${request.route_url('auth',action='getscreen')}" id="vk2UserToolsLogin" class="vk2UserToolsLogin" > ${_('login_button')} </a>
				         	% endif
			            </li>
	          		</ul>
	          	</div>
          	</div>
        </div><!-- /.navbar-collapse -->
      
              
        <!-- Body -->
        <div class="container vk2BodyContainer">
        			
        			<!-- Map panel -->

        				<div class="vk2MapPanel">
			        		<div id="mapdiv" class="olMap" tabindex="0"></div>
			        		<div id="vk2SBPanel" class="vk2SBPanel"></div>
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
					        		   	
					        		   		% if faq_url:
					         				<li class="listelement leftborder">
					        					<a href="${faq_url}" class="vk2FooterLinks">FAQ</a>        				
					        				</li>       		   		
					        		   		% else:
					        				<li class="listelement leftborder">
					        					<a href="${request.route_url('faq')}" class="vk2FooterLinks">FAQ</a>        				
					        				</li>
					        				% endif
					        				<li class="listelement leftborder">
					         					<a href="${request.route_url('contact')}" class="vk2FooterLinks">${_('footer_contact')}</a>		
					        				</li>        				
					        				<li class="listelement leftborder">
					        					<a href="${request.route_url('project')}" class="vk2FooterLinks">${_('footer_project')}</a>    				
					        				</li>
					        				<li class="listelement">
					        					<a href="${request.route_url('impressum')}" class="vk2FooterLinks">${_('footer_editorial')}</a>
					        				</li>
					        			</ul>
					        		</div>
        						</div>
        					</div>
			        	</div>

			      			        
		</div>
		
		% if context.get('welcomepage') is not 'off':
			<a href="${request.route_url('welcome')}" id="vk2WelcomePage"></a>
		% endif  
	
		${next.body()}
	</body>
</html>
