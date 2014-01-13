# -*- coding: utf-8 -*-
<%inherit file="basicFooterLayout.mako"/>       

<%block name="headerJsCss">
	<link rel="stylesheet" type="text/css" href="${request.static_url('vkviewer:static/css/vk2/templates/georeferenceStart.css')}" />
	<link rel="stylesheet" type="text/css" href="${request.static_url('vkviewer:static/css/vk2/tools/Georeferencer.css')}" />
	<script src="${request.static_url('vkviewer:static/lib/jquery.tabSlideOut.js')}"></script> 
	<script src="${request.static_url('vkviewer:static/lib/OpenLayers-2.13.1/OpenLayers.js')}"></script>
	<script src="${request.static_url('vkviewer:static/js/Vkviewer.Georef.js')}"></script>   	
	
	<style>
		.olImageLoadError { 
    /* when OL encounters a 404, don't display the pink image */
    display: none !important;
} 
	</style>
</%block>

<%block name="bodyBlock">
		
	<div class="vk2GeoreferenceMtbStartPage">
		<div id="georeferenceMap" class="georeferenceMap"></div>			
	</div>
	
	<!-- Loading overlay screen -->
	<div id="georefLoadingScreen" class="georefLoadingScreen">
		<div class="centerLoading">
			<center><h2>Loading ... </h2></center>
			<img src="${request.static_url('vkviewer:static/images/ajax_loader.gif')}" />
		</div>
	</div>
		
	<!-- Link back to main page -->
	<a id="anchorBackToIndexPage" class="anchorBackToIndexPage" target="_top"
		 href="${request.route_url('home_login')}?georef=on"></a>
</%block>

<%block name="sidebar">

	<div id="vk2GeoreferenceToolsPanel" class="vk2GeoreferenceToolsPanel">
		<a id="vk2GeoreferenceToolsHandle" class="vk2GeoreferenceToolsHandle" 
			data-open="${request.static_url('vkviewer:static/images/layerbar.png')}" 
			data-close="${request.static_url('vkviewer:static/images/close.png')}"
			title="${_('tool_titel_georeference')}"></a>
		
		<!-- Georeference Tools Content -->

	</div>

</%block>

<script>
	var map = null;
	$(document).ready(function(){ 
		VK2.Utils.initializeFancyboxForClass('vk2FooterLinks');

		var urlParams = VK2.Utils.getAllUrlParams();
		map = VK2.Utils.Georef.initializeGeoreferencerMap('georeferenceMap', urlParams);
		var georeferenceTool = new VK2.Tools.Georeferencer({
			container: 'vk2GeoreferenceToolsPanel',
			handler: 'vk2GeoreferenceToolsHandle',
			map: map,
			controller: VK2.Controller.GeoreferenceController,
			urlParams: urlParams
		});
	});
</script>