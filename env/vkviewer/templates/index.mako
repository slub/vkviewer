# -*- coding: utf-8 -*-
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en"
      xmlns:tal="http://xml.zope.org/namespaces/tal"
      xmlns:i18n="http://xml.zope.org/namespaces/i18n"
      i18n:domain="vkviewer">
    <head>
        <META HTTP-EQUIV="Content-Type" CONTENT="text/html; CHARSET=UTF-8">
        <title>Virtuelles Kartenforum 2.0</title>
        <link rel="stylesheet" type="text/css" href="${request.static_url('vkviewer:static/lib/ext-3.4.1/resources/css/ext-all.css')}"></link>
        <link rel="stylesheet" type="text/css" href="${request.static_url('vkviewer:static/lib/GeoExt/resources/css/geoext-all-debug.css')}"></link>
        <link rel="stylesheet" type="text/css" href="${request.static_url('vkviewer:static/lib/jquery-ui-1.10.3/themes/base/jquery-ui.css')}" />
        <link rel="stylesheet" type="text/css" href="${request.static_url('vkviewer:static/lib/fancyapps-fancyBox/source/jquery.fancybox.css')}" media="screen" />
        <link rel="stylesheet" type="text/css" href="${request.static_url('vkviewer:static/css/styles.css')}" />
    </head>
    <body>
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
	            		<%block name="menubar" />
	            	</div>
	            </div>
	        </div>
        </div> 
        
        <!-- Body -->
        <div id="mapdiv" class="olMap"></div>

		<!-- Sidebar Elements -->
        <%block name="sidebar" />
        ${next.body()}
        
        <!-- Footer -->
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
        				<li class="listelement leftborder">FAQ</li>
        				<li class="listelement leftborder">${_('footer_contact')}</li>        				
        				<li class="listelement leftborder">${_('footer_partners')}</li>
        				<li class="listelement">${_('footer_editorial')}</li>
        			</ul>
        		</div>
        	</div>
        </div>
        
        <!-- load generic js librarys -->
        <script src="${request.static_url('vkviewer:static/lib/jquery-ui-1.10.3/jquery-1.9.1.js')}"></script>
        <script src="${request.static_url('vkviewer:static/lib/jquery-ui-1.10.3/ui/jquery-ui.js')}"></script>  
        <script src="${request.static_url('vkviewer:static/lib/fancyapps-fancyBox/source/jquery.fancybox.pack.js')}"></script>
        <script src="${request.static_url('vkviewer:static/lib/jquery.tabSlideOut.v1.3.js')}"></script> 
        <script src="${request.static_url('vkviewer:static/lib/OpenLayers-2.13.1/OpenLayers.js')}"></script>
        <script src="${request.static_url('vkviewer:static/lib/ext-3.4.1/adapter/ext/ext-base.js')}"></script>
        <script src="${request.static_url('vkviewer:static/lib/ext-3.4.1/ext-all.js')}"></script>
        <script src="${request.static_url('vkviewer:static/lib/GeoExt/GeoExt.js')}"></script>  
        <script src="${request.static_url('vkviewer:static/lib/proj4js-combined.js')}"></script>
        <script src="http://maps.google.com/maps/api/js?v=3.2&sensor=false"></script>
        
        <!-- vk2 librarys -->
        <script src="${request.static_url('vkviewer:static/js/Utils.js')}"></script>
        <script src="${request.static_url('vkviewer:static/js/Controller.js')}"></script>
        <script src="${request.static_url('vkviewer:static/js/Vkviewer.js')}"></script>
        <script src="${request.static_url('vkviewer:static/js/tools/EventFeatureLayer.js')}"></script>
        <script src="${request.static_url('vkviewer:static/js/tools/Gazetteersearch.js')}"></script>
        <script src="${request.static_url('vkviewer:static/js/tools/Georeferencer.js')}"></script>
        <script src="${request.static_url('vkviewer:static/js/tools/Layersearch.js')}"></script>    
        <script src="${request.static_url('vkviewer:static/js/tools/LayerManagement.js')}"></script>
        <script src="${request.static_url('vkviewer:static/js/tools/TimeSlider.js')}"></script>
        <script src="${request.static_url('vkviewer:static/js/tools/TimeViewer.js')}"></script>
        <script src="${request.static_url('vkviewer:static/js/locale/'+_('js_library')+'.js')}"></script>
        <script>        
            $(document).ready(function(){
                initVkViewer('mapdiv');
            });
        </script>       
    </body>
</html>
