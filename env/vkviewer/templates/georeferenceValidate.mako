# -*- coding: utf-8 -*-
<%inherit file="basicFooterLayout.mako"/>       

<%block name="headerJsCss">
	<link rel="stylesheet" type="text/css" href="${request.static_url('vkviewer:static/css/vk2/templates/georeferenceValidate.css')}" />
	<script src="${request.static_url('vkviewer:static/lib/jquery.tabSlideOut.js')}"></script> 
	<script src="${request.static_url('vkviewer:static/lib/OpenLayers-2.13.1/OpenLayers.js')}"></script>
	<script src="${request.static_url('vkviewer:static/lib/proj4js.js')}"></script>
	<script src="${request.static_url('vkviewer:static/js/Vkviewer.Georef.js')}"></script>   	
</%block>

<%block name="bodyBlock">
		
	<div class="vk2GeoreferenceMtbValidatePage">
		<div class="vk2GeoreferenceMtbValidateBodyContainer">
			<div class="georeferenceMapContainer">
				<div id="georeferenceMap" class="georeferenceMap"></div>
			</div>
			<div class="georeferenceResultMapContainer">
				<div id="georeferenceResultMap" class="georeferenceResultMap"></div>
			</div>		
		</div>
	</div>
	
	<!-- Loading overlay screen -->
	<div id="georefLoadingScreen" class="georefLoadingScreen">
		<div class="centerLoading">
			<center><h2>Loading ... </h2></center>
			<img src="${request.static_url('vkviewer:static/images/ajax_loader.gif')}" />
		</div>
	</div>
		
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
				<input type="button" value="Vorschau aktualisieren" id="btnValidate"
						class="ui-button-text-icon ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-button-text"><br>
				<input type="button" value="Georeferenzierung bestätigen" id="btnSubmit"
				 		class="ui-button-text-icon ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only ui-button-text">
			</ul>
			
		</div>
	</div>

</%block>

<script>
	$(document).ready(function(){
		VK2.Utils.initializeFancyboxForClass('vk2FooterLinks');
		VK2.Utils.setGenericOpenLayersPropertys("vkviewer/proxy/?url=");
		
		// def the used srs
		Proj4js.defs["EPSG:900913"] = "+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +wktext +over no_defs";
		Proj4js.defs["EPSG:4314"] = "+proj=longlat +ellps=bessel +towgs84=582,105,414,1.04,0.35,-3.08,8.3 +no_defs"; 
		Proj4js.defs["EPSG:31467"] = "+proj=tmerc +lat_0=0 +lon_0=9 +k=1 +x_0=3500000 +y_0=0 +ellps=bessel +datum=potsdam +units=m +no_defs";
		
		var urlParams = VK2.Utils.getAllUrlParams();
		var map_original = VK2.Utils.Georef.initializeGeoreferencerMap('georeferenceMap', urlParams);
		var map_result = VK2.Utils.Georef.initializeGeoreferenceResultMap('georeferenceResultMap', urlParams);
		var georeferenceTool = new VK2.Tools.Georeferencer({
			container: 'vk2GeoreferenceToolsPanel',
			handler: 'vk2GeoreferenceToolsHandle',
			map: map_original,
			controller: VK2.Controller.GeoreferenceController,
			urlParams: urlParams, 
			status: 'validate'
		});

	});
</script>