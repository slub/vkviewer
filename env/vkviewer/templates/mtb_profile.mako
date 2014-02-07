<%inherit file="basic_page.mako" />
	<link rel="stylesheet" type="text/css" href="${request.static_url('vkviewer:static/lib/ol3/ol.css')}" />
	<link rel="stylesheet" type="text/css" href="${request.static_url('vkviewer:static/css/vk2/templates/mtb_profile.css')}" />
<%block name="header_content">

</%block>

<%block name="body_content">
	<div class="mtb-profile-page">
		<div class="container">
			<div class="row">
				<div class="col-md-8 col-lg-8">
					<div class="map-container" id="map-container"></div>
				</div>
				<div class="col-md-4 col-lg-4">
					<div class="metadata-container" id="metadata-container"></div>
				</div>
			</div>
		</div>
	</div>
</%block>

<%block name="js_content">
	<script src="${request.static_url('vkviewer:static/lib/ol3/ol.js')}"></script>
	<script src="${request.static_url('vkviewer:static/js/ol3/LayerSpy.js')}"></script>
	<script src="${request.static_url('vkviewer:static/js/ol3/RotateNorth.js')}"></script>	
	<!-- <script src="${request.static_url('vkviewer:static/js/Vkviewer-ol3.min.js')}"></script> -->
	
	<!--<script src="${request.static_url('vkviewer:static/lib/closure-library/closure/goog/base.js')}"></script>
    <script src="${request.static_url('vkviewer:static/lib/closure-library/closure/goog/net/cookies.js')}"></script> 
	 <script src="${request.static_url('vkviewer:static/js/utils/Utils.js')}"></script>
    <script src="${request.static_url('vkviewer:static/js/utils/Settings.js')}"></script> 
	<script src="${request.static_url('vkviewer:static/dev/LayerSpy.js')}"></script>
	<script src="${request.static_url('vkviewer:static/dev/RotateNorth.js')}"></script>
	<script src="${request.static_url('vkviewer:static/dev/ZoomifyViewer.js')}"></script>
	<script src="${request.static_url('vkviewer:static/dev/MesstischblattViewer.js')}"></script>	
	<script src="${request.static_url('vkviewer:static/js/events/EventType.js')}"></script>
	<script src="${request.static_url('vkviewer:static/js/events/ParsedCswRecordEvent.js')}"></script>
	<script src="${request.static_url('vkviewer:static/js/requests/CSW_GetRecordById.js')}"></script>
	<script src="${request.static_url('vkviewer:static/js/tools/MetadataVisualizer.js')}"></script> -->
	
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
				'extent': extent
			});
			var mdVisualizer = new VK2.Tools.MetadataVisualizer('metadata-container',VK2.Utils.getQueryParam('key'), 
				'http://kartenforum.slub-dresden.de/geonetwork/srv/eng/csw', false);
	   	});
    </script> 
</%block>
