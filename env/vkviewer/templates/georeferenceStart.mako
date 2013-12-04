# -*- coding: utf-8 -*-
<%inherit file="basicFooterLayout.mako"/>       

<%block name="headerJsCss">
	<link rel="stylesheet" type="text/css" href="${request.static_url('vkviewer:static/css/vk2/templates/georeferenceStart.css')}" />
	<script src="${request.static_url('vkviewer:static/lib/jquery.tabSlideOut.js')}"></script> 
	<script src="${request.static_url('vkviewer:static/lib/OpenLayers-2.13.1/OpenLayers.js')}"></script>
	<script src="${request.static_url('vkviewer:static/js/Vkviewer.Georef.js')}"></script>   	
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
		<div class="vk2GeoreferenceToolsContent">

			<ul id="controlsList" class="controlsList">
				<li>
					<input type="radio" name="type" value="none" id="noneToggle" checked="checked" />
					<label for="noneToggle">Karte verschieben</label>
				</li>
				<li>
					<input type="radio" name="type" value="point" id="pointToggle" />
					<label for="pointToggle">Eckpunkt setzen</label>
				</li>
				<li>
					<input type="radio" name="type" value="drag" id="dragToggle" />
					<label for="dragToggle">Eckpunkt verschieben</label>
				</li>
				<li>
					<input type="radio" name="type" value="delete" id="deleteToggle" />
					<label for="polygonToggle">Eckpunkt löschen</label>
				</li><br>
				
				<input type="hidden" id="points" name="points">
				<input type="hidden" id="mtbid" name="mtbid">
				<input type="button" value="Vorschau Georeferenzierung" id="btnValidate"
						class="ui-button-text-icon ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-button-text"><br>
				<input type="button" value="Absenden ohne Vorschau" id="btnSubmit"
				 		class="ui-button-text-icon ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-button-text">
			</ul>
			
		</div>
	</div>

</%block>

<script>
	$(document).ready(function(){
		VK2.Utils.initializeFancyboxForClass('vk2FooterLinks');

		var urlParams = VK2.Utils.getAllUrlParams();
		var map = VK2.Utils.Georef.initializeGeoreferencerMap('georeferenceMap', urlParams);
		var georeferenceTool = new VK2.Tools.Georeferencer({
			container: 'vk2GeoreferenceToolsPanel',
			handler: 'vk2GeoreferenceToolsHandle',
			map: map,
			controller: VK2.Controller.GeoreferenceController,
			urlParams: urlParams
		});
	});
</script>