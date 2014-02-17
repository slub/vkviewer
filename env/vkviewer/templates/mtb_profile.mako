<%inherit file="basic_page_slim.mako" />

<%block name="header_content">
	<link rel="stylesheet" type="text/css" href="${request.static_url('vkviewer:static/lib/css/ol.css')}" />
	<link rel="stylesheet" type="text/css" href="${request.static_url('vkviewer:static/css/vk2/templates/mtb_profile.css')}" />
</%block>

<%block name="body_content">
	<div class="mtb-profile-page">
		<div class="container">
			<div class="row">
				<div class="col-md-8 col-lg-8">
					<div class="map-container" id="map-container">
						<div class="opacity-container">
							<div class="opacity-slider" id="opacity-slider">
								<div class="tooltip top in fade">
									<div class="tooltip-arrow"></div>
									<div class="tooltip-inner"></div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="col-md-4 col-lg-4">
					<div class="metadata-container" id="metadata-container"></div>
				</div>
			</div>
		</div>
	</div>
</%block>

<%block name="js_content">
	<script src="//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>
	<script src="${request.static_url('vkviewer:static/lib/jquery-ui-1.10.4.custom.min.js')}"></script>	 
	<script src="${request.static_url('vkviewer:static/js/locale/'+_('js_library')+'.js')}"></script>
	<script src="${request.static_url('vkviewer:static/lib/ol.js')}"></script>
	<script src="${request.static_url('vkviewer:static/js/Vkviewer-ol3.min.js')}"></script> 

	
	<!-- 
	<script src="${request.static_url('vkviewer:static/js/ol3/LayerSpy.js')}"></script>
	<script src="${request.static_url('vkviewer:static/js/ol3/RotateNorth.js')}"></script>	
    <script src="${request.static_url('vkviewer:static/js/utils/Settings.js')}"></script> 
	<script src="${request.static_url('vkviewer:static/js/tools/MesstischblattViewer.js')}"></script>	
	<script src="${request.static_url('vkviewer:static/js/events/EventType.js')}"></script>
	<script src="${request.static_url('vkviewer:static/js/events/ParsedCswRecordEvent.js')}"></script>
	<script src="${request.static_url('vkviewer:static/js/requests/CSW_GetRecordById.js')}"></script>
	<script src="${request.static_url('vkviewer:static/js/tools/MetadataVisualizer.js')}"></script>-->
	
    <script>
    	$(document).ready(function(){
    		// parse extent from query 
    		var str_extent = VK2.Utils.getQueryParam('extent');
    		var str_extent = str_extent.split(',');
    		var extent = []
    		for (var i = 0; i < str_extent.length; i++){
    			extent.push(parseFloat(str_extent[i]));
    		}
			var mtbViewer = new VK2.Tools.MesstischblattViewer('map-container', {
				'time': VK2.Utils.getQueryParam('time'),
				'extent': extent,
				'opacity_slider': 'opacity-slider'
			});
			var mdVisualizer = new VK2.Tools.MetadataVisualizer('metadata-container',VK2.Utils.getQueryParam('key'),{
				 'csw_url':'http://kartenforum.slub-dresden.de/geonetwork/srv/eng/csw'});
		});
    </script> 
</%block>
