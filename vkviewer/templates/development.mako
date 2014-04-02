# -*- coding: utf-8 -*-
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en"
      xmlns:tal="http://xml.zope.org/namespaces/tal"
      xmlns:i18n="http://xml.zope.org/namespaces/i18n"
      i18n:domain="vkviewer">
    <head>
        <META HTTP-EQUIV="Content-Type" CONTENT="text/html; CHARSET=UTF-8" />
        <META HTTP-EQUIV="cache-control" CONTENT="max-age=3600" />
        <title>Virtuelles Kartenforum 2.0</title>
        <!-- js/css librarys via cdn -->
		<link rel="stylesheet" href="//netdna.bootstrapcdn.com/bootstrap/3.0.3/css/bootstrap.min.css">	 
		<link rel="stylesheet" type="text/css" href="${request.static_url('vkviewer:static/lib/css/vkviewer-libarys.min.css')}" media="screen" />
		<link rel="stylesheet" type="text/css" href="${request.static_url('vkviewer:static/css/styles.css')}" />	 

	    <script src="${request.static_url('vkviewer:static/lib/closure-library/closure/goog/base.js')}"></script>
	    <script src="${request.static_url('vkviewer:static/new/deps.js')}"></script>   
	    <script>
	    	goog.require('VK2.Utils.AppLoader');
	    </script>    
    </head>
	<body>
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
	          		<li><a href="#"><span class="language_switcher switch_de"></span>Deutsch</a></li>
			        <li><a href="#"><span class="language_switcher switch_en"></span>Englisch</a></li>  
	          	</ul>
	        </div>        
	        
	        <!-- Collect the nav links, forms, and other content for toggling -->
        	<div class="collapse navbar-collapse navbar-ex1-collapse">
        		<ul class="nav navbar-nav navbar-right vk2-navbar-user">
        			<li class="dropdown info-dropdown">
	                	<a href="#" class="dropdown-toggle" data-toggle="dropdown" title="${_('header_service')}">${_('header_service')} <b class="caret"></b></a>
		                <ul class="dropdown-menu">
		                	<li><a href="#" class="vk2FooterLinks fancybox-open" data-fancyclass="faq">FAQ</a></li>
		                </ul>
	             	</li>
          		
          			<!-- user menu -->
			        <li class="dropdown user-dropdown">
						<a href="#" id="vk2UserToolsLogin" class="vk2UserToolsLogin fancybox-open" data-fancyclass="login"> Anmelden <b class="caret"></b> </a>       	
			        </li>
			    </ul>
	          	<form class="navbar-form vk2Gazetteer" role="search">
	          		<div class="form-group">
							<input type="text" id="vk2GazetteerSearchInput" class="form-control vk2GazetteerSearchInput" placeholder="Ortsname oder Blattnumber" />
			        </div>
			        <button type="submit" class="btn btn-success gazetteer-submit-button">Search</button>  
			    </form>
	          	</div>
          	</div>
        </div><!-- /.navbar-collapse -->
      
              
        <!-- Body -->
        <div class="container main-page content-container">
        			
        			<!-- Map panel -->

        				<div class="vk2MapPanel" id="vk2MapPanel">
			        		<div id="mapdiv" class="olMap" tabindex="0"></div>
			        		<div id="vk2SBPanel" class="vk2SBPanel"></div>
			        	</div>
      	
			        	<!-- Footer panel -->
			        	<div class="vk2FooterPanel">
			        		<div id="vk2Footer" class="vk2Footer">
			        			<div class="footerContainer">
        							<div class="leftside">
					        			<ul class="footerList">
					        				<li class="listelement thick leftborder">Virtuelles Kartenforum 2.0</li>
					        				<li class="listelement">ein Projekt der SLUB Dresden und der Universität Rostock</li>
					        			</ul>
        							</div>
					        		<div class="rightside">
					        		   	<ul class="footerList">
					         				<li class="listelement leftborder">
					        					<a href="#" class="vk2FooterLinks fancybox-open" data-fancyclass="faq">FAQ</a>        				
					        				</li>       		   		
					        			</ul>
					        		</div>
        						</div>
        					</div>
			        	</div>
						<!-- end footer -->
		</div> 
	</div>    

		<script src="${request.static_url('vkviewer:static/lib/jquery.min.js')}"></script>
	    <script src="${request.static_url('vkviewer:static/lib/jquery-ui-1.10.4.custom.min.js')}"></script>
	    <script src="${request.static_url('vkviewer:static/lib/jquery.tablesorter.min.js')}"></script>  
	    <script src="${request.static_url('vkviewer:static/lib/bootstrap.min.js')}"></script>
	    <script src="${request.static_url('vkviewer:static/lib/proj4js.js')}"></script>
	   	<script src="${request.static_url('vkviewer:static/js/locale/'+_('js_library')+'.js')}"></script>
	   	<script src="${request.static_url('vkviewer:static/lib/ol.js')}"></script>
		
		<!--<script src="${request.static_url('vkviewer:static/new/src/vkviewer-compiled.min.js')}"></script>-->	   	
		<script>
			var apploader = new VK2.Utils.AppLoader();
		</script>
	 
    </body>
</html>
