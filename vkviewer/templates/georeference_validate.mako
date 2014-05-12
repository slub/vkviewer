<%inherit file="basic_page_slim.mako" />

<%block name="header_content">
	<link rel="stylesheet" type="text/css" href="${request.static_url('vkviewer:static/lib/css/ol.css')}" />
	<link rel="stylesheet" type="text/css" href="${request.static_url('vkviewer:static/css/styles.css')}" />
</%block>

<%block name="body_content">
	<div class="georeference-validate page-container full-display">
		<div class="row georeference-validate-container">
			<div class="col-sm-6 col-md-6 col-lg-6 outer-map-container">
				<div id="unreferenced-map" class="unreferenced-map">
					<!-- report error dialog -->
					<div id="open-error-dialog" class="open-error-dialog">
						<span class="icon" />
					</div>
				</div>
			</div>
			<div class="col-sm-6 col-md-6 col-lg-6 outer-map-container">
				<div id="georeferenced-map" class="georeferenced-map">
					<div class="opacity-container">
						<div class="opacity-slider" id="opacitySlider">
							<div class="tooltip top in fade">
								<div class="tooltip-arrow"></div>
								<div class="tooltip-inner"></div>
							</div>
						</div>
					</div>				
				</div>
			</div>	
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
		<!-- footer end -->
		
	</div>
</%block>

<%block name="js_content">
	<script src="//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>
	<script src="//netdna.bootstrapcdn.com/bootstrap/3.0.3/js/bootstrap.min.js"></script>  
	<script src="${request.static_url('vkviewer:static/lib/jquery-ui-1.10.4.custom.min.js')}"></script>	 
	<script src="${request.static_url('vkviewer:static/lib/vkviewer-plugin-libarys.min.js')}"></script>  
	<script src="${request.static_url('vkviewer:static/js/locale/'+_('js_library')+'.js')}"></script>	
	
	<!-- production -->
	<script src="${request.static_url('vkviewer:static/lib/ol.js')}"></script>	
	<script src="${request.static_url('vkviewer:static/js/Vkviewer-ol3.js')}"></script>

    <script>
		$(document).ready(function(){
			VK2.Utils.initializeFancyboxForClass('vk2FooterLinks');
			
			var url = new goog.Uri(window.location.href);
			var mtbid = url.getQueryData().get('mtbid');
			var imgWidth = url.getQueryData().get('zoomify_width');
			var imgHeight = url.getQueryData().get('zoomify_height');
			var zoomify_url = url.getQueryData().get('zoomify_prop').substring(0,url.getQueryData().get('zoomify_prop').lastIndexOf("/")+1);
			var georef_params = url.getQueryData().get('points');
			var georefid = url.getQueryData().get('georefid');
			var georeferencer = new VK2.Tools.Georeferencer('unreferenced-map', mtbid, {
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
			var unparsed_extent = url.getQueryData().get('extent').split(',');
			var parsed_extent = []
			for (var i = 0; i < unparsed_extent.length; i++){parsed_extent.push(parseFloat(unparsed_extent[i]))};
			georeferencer.loadValidationMap('georeferenced-map', wms_url, layer_id, parsed_extent);
			
			// report error dialog
			var errorDialog = new VK2.Tools.ReportError('open-error-dialog', 'unreferenced-map', mtbid,'messtischblatt');
		});
    </script> 
</%block>
