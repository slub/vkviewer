<%inherit file="basic_page.mako" />

<%block name="header_content">	 
	<link rel="stylesheet" type="text/css" href="${request.static_url('vkviewer:static/css/styles.css')}" />
	<script>
		goog.require('vk2.georeference.Georeferencer');
	</script>
</%block>

<%block name="body_content">
	<div class="georeference-validate page-container full-display">
		<div class="row georeference-validate-container">
			<div class="col-sm-6 col-md-6 col-lg-6 outer-map-container">
				<div id="unreferenced-map" class="unreferenced-map map-container"></div>
			</div>
			<div class="col-sm-6 col-md-6 col-lg-6 outer-map-container">
				<div id="georeferenced-map" class="georeferenced-map map-container"></div>
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
        <!-- end footer -->
		</div>
	</div>
	
	<!-- append ground control points -->
	% if gcps:
		% for gcp in gcps:
			<input type="hidden" name="gcp" class="hidden-gcps" value="${gcp}">
		% endfor
	% endif
</%block>

<%block name="js_content">
    <script>	
		var url = new goog.Uri(window.location.href);
		var mtbid = url.getQueryData().get('mtbid');
		var imgWidth = url.getQueryData().get('zoomify_width');
		var imgHeight = url.getQueryData().get('zoomify_height');
		var zoomify_url = url.getQueryData().get('zoomify_prop').substring(0,url.getQueryData().get('zoomify_prop').lastIndexOf("/")+1);		
		
		var unparsed_extent = url.getQueryData().get('extent').split(',');
		var parsed_extent = []
		for (var i = 0; i < unparsed_extent.length; i++){parsed_extent.push(parseFloat(unparsed_extent[i]))};	
		
		var georeferencer = new vk2.georeference.Georeferencer({
			// parameters for unreferenced map
			'zoomify':{
				'width': imgWidth,
				'height': imgHeight,
				'url': zoomify_url
			},
			'unreferenced_map':'unreferenced-map',
			
			// parameters for the referenced map
			'referenced_map': 'georeferenced-map',
			'result': {
				'extent':parsed_extent
			},
			
			// unused right now
			'target_href': '${request.route_url('home_login')}?georef=on&points=20',
		});
    </script> 
</%block>


