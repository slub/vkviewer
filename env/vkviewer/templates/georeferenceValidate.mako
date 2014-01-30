<%inherit file="basic_page.mako" />

<%block name="header_content">
	<link rel="stylesheet" type="text/css" href="${request.static_url('vkviewer:static/css/vk2/templates/styles.css')}" /> 
    <link rel="stylesheet" type="text/css" href="${request.static_url('vkviewer:static/css/vk2/templates/basicFooterLayout.css')}" />       
    <link rel="stylesheet" type="text/css" href="${request.static_url('vkviewer:static/css/vk2/templates/georeferenceValidate.css')}" />
	<link rel="stylesheet" type="text/css" href="${request.static_url('vkviewer:static/css/vk2/tools/Georeferencer.css')}" />
	
	<style>
		.olImageLoadError { 
	   		/* when OL encounters a 404, don't display the pink image */
	    	display: none !important;
		} 
	</style>
</%block>

<%block name="body_content">
	<div class="page-container">
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
		
		<!-- Link back to main page -->
		<a id="anchorBackToIndexPage" class="anchorBackToIndexPage" target="_top"
			 href="${request.route_url('home_login')}?georef=on"></a>
			 
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
        
        <!-- sidebar -->
		<div id="vk2GeoreferenceToolsPanel" class="vk2GeoreferenceToolsPanel">
			<a id="vk2GeoreferenceToolsHandle" class="vk2GeoreferenceToolsHandle" 
				data-open="${request.static_url('vkviewer:static/images/layerbar.png')}" 
				data-close="${request.static_url('vkviewer:static/images/close.png')}"
				title="${_('tool_titel_georeference')}"></a>
			
			<!-- Georeference Tools Content -->
		</div>
	
		<!-- report error btn -->
		<div id="vk2GeoreferenceReportErrorPanel" class="vk2GeoreferenceReportErrorPanel">
			<img id="vk2GeoreferenceReportErrorHandle" class="vk2GeoreferenceReportErrorHandle" 
				src="${request.static_url('vkviewer:static/images/close.png')}" 
				title="${_('report_error_titel')}"></a>
		</div>
	</div>
	
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
	
			// init report error
			var reportErrorTools = new VK2.Tools.ReportError({});
			$('#vk2GeoreferenceReportErrorPanel').click(function(){
				reportErrorTools.reportError(urlParams['mtbid'], 'messtischblatt');
			});
		});
    </script>  
</%block>


