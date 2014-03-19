<%inherit file="basic_page.mako" />

<%block name="header_content">
	<link rel="stylesheet" type="text/css" href="${request.static_url('vkviewer:static/css/styles.css')}" />
</%block>

<%block name="body_content">
	<div class="main-page body-container">
		<div class="navbar navbar-fixed-top vk2HeaderNavBar" role="navigation">
		
			<!-- Brand and toggle get grouped for better mobile display -->
	        <div class="navbar-header">
	          	<button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-ex1-collapse">
		            <span class="sr-only">Toggle navigation</span>
		            <span class="icon-bar"></span>
		            <span class="icon-bar"></span>
		            <span class="icon-bar"></span>
	          	</button>
	          	<a class="navbar-brand" href="#">Virtuelles Kartenforum 2.0</a>
	          	
	          	<!-- language switcher -->
	          	<ul class="langswitch">
	          		<li><a href="${request.route_url('set_locales')}?language=de"><span class="language_switcher switch_de"></span>${_('header_language_de')}</a></li>
			        <li><a href="${request.route_url('set_locales')}?language=en"><span class="language_switcher switch_en"></span>${_('header_language_en')}</a></li>  
	          	</ul>
	        </div>        
	        
	        <!-- Collect the nav links, forms, and other content for toggling -->
        	<div class="collapse navbar-collapse navbar-ex1-collapse">
        		<ul class="nav navbar-nav navbar-right vk2-navbar-user">
        			<li class="dropdown info-dropdown">
	                	<a href="#" class="dropdown-toggle" data-toggle="dropdown" title="${_('header_service')}">${_('header_service')} <b class="caret"></b></a>
		                <ul class="dropdown-menu">
		                
				              	% if faq_url:
				         			<li><a href="${faq_url}" class="vk2FooterLinks fancybox-open">FAQ</a></li>        				
				        		% else:
				        			<li><a href="${request.route_url('faq')}" class="vk2FooterLinks fancybox-open">FAQ</a></li>
				        		% endif
			        		
				              	<li><a href="${request.route_url('contact')}" class="vk2FooterLinks fancybox-open">${_('footer_contact')}</a></li>
				              	<li><a href="${request.route_url('project')}" class="vk2FooterLinks fancybox-open">${_('footer_project')}</a></li>
				              	<li><a href="${request.route_url('impressum')}" class="vk2FooterLinks fancybox-open">${_('footer_editorial')}</a><li>     
				              	     
		                </ul>
	             	</li>
          		
          			<!-- user menu -->
			        <li class="dropdown user-dropdown">
			            
				           	<%
							from pyramid.security import authenticated_userid
							user_id = authenticated_userid(request)
							%>    
										
							% if user_id:
						
			              	<a href="#" class="dropdown-toggle" data-toggle="dropdown"></span> ${user_id} <b class="caret"></b></a>
			              	<ul class="dropdown-menu">
				                <li><a href="${request.route_url('users_profile_georef')}" class="fancybox-open">${_('georef_history')}</a></li>
				                <li><a href="${request.route_url('change_pw', action='page')}" class="fancybox-open">${_('change_pw_header')}</a></li>
				                <li class="divider"></li>
				                <li><a href="${request.route_url('auth',action='out')}"><span class="glyphicon glyphicon-off"></span> ${_('logout_button')} </a></li>
				              </ul>
			              
				            % else:
				              <a href="${request.route_url('auth',action='getscreen')}" id="vk2UserToolsLogin" class="vk2UserToolsLogin fancybox-open" > ${_('login_button')} <b class="caret"></b> </a>
				         	% endif
			        </li>
			    </ul>
	          	<form class="navbar-form vk2Gazetteer" role="search">
	          		<div class="form-group">
							<input type="text" id="vk2GazetteerSearchInput" class="form-control vk2GazetteerSearchInput" placeholder="${_('placeholder_town_name')}" />
			        </div>
			        <button type="submit" class="btn btn-success gazetteer-submit-button">Search</button>  
			    </form>
	          	</div>
          	</div>
        </div><!-- /.navbar-collapse -->
      
              
        <!-- Body -->
        <div class="container main-page content-container">
        			
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
					        					<a href="${faq_url}" class="vk2FooterLinks fancybox-open">FAQ</a>        				
					        				</li>       		   		
					        		   		% else:
					        				<li class="listelement leftborder">
					        					<a href="${request.route_url('faq')}" class="vk2FooterLinks fancybox-open">FAQ</a>        				
					        				</li>
					        				% endif
					        				<li class="listelement leftborder">
					         					<a href="${request.route_url('contact')}" class="vk2FooterLinks fancybox-open">${_('footer_contact')}</a>		
					        				</li>        				
					        				<li class="listelement leftborder">
					        					<a href="${request.route_url('project')}" class="vk2FooterLinks fancybox-open">${_('footer_project')}</a>    				
					        				</li>
					        				<li class="listelement">
					        					<a href="${request.route_url('impressum')}" class="vk2FooterLinks fancybox-open">${_('footer_editorial')}</a>
					        				</li>
					        			</ul>
					        		</div>
        						</div>
        					</div>
			        	</div>
						<!-- end footer -->
						     
						<!-- block for further privilege dependent html content -->  
						<%block name="inner_body_content" />
		</div>

		% if context.get('welcomepage') is not 'off':
			<a href="${request.route_url('welcome')}" id="vk2WelcomePage"></a>
		% endif  
	</div>
	
	${next.body()}

</%block>



