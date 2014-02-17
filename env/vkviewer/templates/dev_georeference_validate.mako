<%inherit file="basic_page_slim.mako" />

<%block name="header_content">	 
	<link rel="stylesheet" href="//netdna.bootstrapcdn.com/bootstrap/3.0.3/css/bootstrap.min.css">	      
	<link rel="stylesheet" type="text/css" href="${request.static_url('vkviewer:static/lib/css/vkviewer-libarys.min.css')}" media="screen" />
	<link rel="stylesheet" type="text/css" href="${request.static_url('vkviewer:static/css/vk2/templates/template_pages.css')}" />   	
	<link rel="stylesheet" type="text/css" href="${request.static_url('vkviewer:static/lib/css/ol.css')}" />
	<link rel="stylesheet" type="text/css" href="${request.static_url('vkviewer:static/css/styles.css')}" />
	
	<style>
		.ol-zoom-in:before {
			content: "";
		}
		
		.ol-zoom-out:before {
			content: "";
		}
		
		.georeference-validate-container{
			width: 100%;
			height: 95%;
		}
		
		.outer-map-container{
			height: 100%;
		}
		
		.unreferenced-map{
			width: 100%;
			height: 100%;
		}
		
		.unreferenced-map .georeference-tools-container{
			margin-left: 15px;
		}
			
		.georeferenced-map{
			width: 100%;
			height: 100%;
		}
	</style>
</%block>

<%block name="body_content">
	<div class="georeference-start page-container full-display">
		<div class="row georeference-validate-container">
			<div class="col-sm-6 col-md-6 col-lg-6 outer-map-container">
				<div id="unreferenced-map" class="unreferenced-map"></div>
			</div>
			<div class="col-sm-6 col-md-6 col-lg-6 outer-map-container">
				<div id="georeferenced-map" class="georeferenced-map"></div>
			</div>	
		</div>
		
		<!-- Loading overlay screen -->
		<div id="georefLoadingScreen" class="georefLoadingScreen">
			<div class="centerLoading">
				<div class="progress progress-striped active">
				  <div class="progress-bar"  role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" style="width: 100%">
				  </div>
				</div>
			</div>
		</div>
		
		<!-- Link back to main page -->
		<a id="anchorBackToIndexPage" class="anchorBackToIndexPage" target="_top"
			 href="${request.route_url('home_login')}?georef=on&points=20"></a>
			 
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
        

		
			<!-- Georeference Tools Content -->

		</div>
	</div>
		

</%block>

<%block name="js_content">

	<script src="${request.static_url('vkviewer:static/lib/proj4js.js')}"></script> 
	<script src="${request.static_url('vkviewer:static/lib/debug/ol3/ol-whitespace.js')}"></script>	
	<script src="${request.static_url('vkviewer:static/js/ol3/LayerSpy.js')}"></script>
	<script src="${request.static_url('vkviewer:static/dev/DeleteFeature.js')}"></script>
	<script src="${request.static_url('vkviewer:static/dev/Georeferencer.js')}"></script>
	
	<script src="${request.static_url('vkviewer:static/lib/closure-library/closure/goog/base.js')}"></script>
    <script src="${request.static_url('vkviewer:static/lib/closure-library/closure/goog/net/cookies.js')}"></script> 
	<script src="${request.static_url('vkviewer:static/lib/closure-library/closure/goog/ui/idgenerator.js')}"></script> 
    <script src="${request.static_url('vkviewer:static/lib/OpenLayers.js')}"></script>  
    <script src="${request.static_url('vkviewer:static/lib/jquery.min.js')}"></script>
	<script src="${request.static_url('vkviewer:static/lib/jquery-ui-1.10.4.custom.min.js')}"></script>
	<script src="${request.static_url('vkviewer:static/lib/jquery.fancybox.min.js')}"></script>
	<script src="${request.static_url('vkviewer:static/lib/jquery.tablesorter.min.js')}"></script>  
	<script src="${request.static_url('vkviewer:static/lib/jquery.tabslideout.min.js')}"></script>  
	<script src="${request.static_url('vkviewer:static/lib/bootstrap.min.js')}"></script>
	<script src="${request.static_url('vkviewer:static/js/locale/'+_('js_library')+'.js')}"></script>
	<script src="${request.static_url('vkviewer:static/js/Vkviewer.js')}"></script>  
	
	
	<script src="${request.static_url('vkviewer:static/dev/VK2_Georeferencer.js')}"></script>
    <script>

		$(document).ready(function(){		
			var url = new goog.Uri(window.location.href);
			var mtbid = url.getQueryData().get('mtbid');
			var imgWidth = url.getQueryData().get('zoomify_width');
			var imgHeight = url.getQueryData().get('zoomify_height');
			var zoomify_url = url.getQueryData().get('zoomify_prop').substring(0,url.getQueryData().get('zoomify_prop').lastIndexOf("/")+1);
			var georef_params = url.getQueryData().get('points');
			var georefid = url.getQueryData().get('georefid');
			var georeferencer = new Dev.VK2.Tools.Georeferencer('unreferenced-map', mtbid, {
				'width': imgWidth,
				'height': imgHeight,
				'url': zoomify_url,
				'zoomify': true,
				'status': 'validation',
				'georef_params': georef_params,
				'georef_id': georefid,
				'target_href': '${request.route_url('home_login')}?georef=on&points=20',
			});
			
			// load validation map
			var wms_url = url.getQueryData().get('wms_url');
			var layer_id = url.getQueryData().get('layer_id');
			georeferencer.loadValidationMap('georeferenced-map', wms_url, layer_id);
		});
    </script> 
</%block>


