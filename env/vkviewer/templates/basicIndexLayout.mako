# -*- coding: utf-8 -*-
<%inherit file="basicFooterLayout.mako"/>       

<%block name="headerJsCss">
	<link rel="stylesheet" type="text/css" href="${request.static_url('vkviewer:static/lib/ext-3.4.1/resources/css/ext-all.css')}"></link>
    <link rel="stylesheet" type="text/css" href="${request.static_url('vkviewer:static/css/geoext-all.css')}"></link>
    <link rel="stylesheet" type="text/css" href="${request.static_url('vkviewer:static/css/styles.css')}" />
    
    <!-- load generic js librarys -->
    <script src="${request.static_url('vkviewer:static/lib/jquery.tabSlideOut.js')}"></script> 
    <script src="${request.static_url('vkviewer:static/lib/ext-base.js')}"></script>
    <script src="${request.static_url('vkviewer:static/lib/ext-all.js')}"></script>    
    <script src="${request.static_url('vkviewer:static/lib/OpenLayers-2.13.1/OpenLayers.js')}"></script> 
    <script src="${request.static_url('vkviewer:static/lib/GeoExt/GeoExt.js')}"></script>  
    <script src="${request.static_url('vkviewer:static/lib/proj4js.js')}"></script>
    
    <!-- vk2 librarys -->
    <script src="${request.static_url('vkviewer:static/js/Vkviewer.js')}"></script>
    <script src="${request.static_url('vkviewer:static/js/locale/'+_('js_library')+'.js')}"></script>	
    
    <!-- init the vkviewer application -->
    <script>
    	$(document).ready(function(){ initVkViewer('mapdiv'); });
    </script>
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
	            		<%block name="menubar" />
	            	</div>
	            </div>
	        </div>
        </div> 
        
        <!-- Body -->
        <div id="mapdiv" class="olMap"></div>

</%block>

${next.body()}