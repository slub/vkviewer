<%inherit file="basic_page.mako" />

<%block name="header_content">
	<script>
	    goog.require('vk2.georeference.ZoomifyViewer');
	</script>
</%block>

<%block name="body_content">
	<div class="map-profile-page">
		<div class="container">
			<div class="row header">
				<div class="col-lg-8 col-md-8 col-sm-8 col-xs-6">
					<h1 id="singlemapview-title">${titel_short}</h1>
					<h3 id="singlemapview-title">${titel_long}</h3>
				</div>
				<div class="col-lg-4 col-md-4 col-sm-4 col-xs-6">
					<div class="btn-group-vertical header-btn">
						<a href="${permalink}" class="btn btn-default" target="_blank">Gehe zu Fotothek</a>
						<a href="http://kartenforum.slub-dresden.de/geonetwork/srv/eng/search#|${key}" class="btn btn-default" target="_blank">Zeige Metadatensatz</a>
					</div>
				</div>
			</div>
			
			
			<div class="row body">

				<div class="original-view">
						<div class="container">
							<div class="zoomify-container" id="zoomify-container"></div>
						</div>				
				</div>

			</div>
		</div>
	</div>
</%block>

<%block name="js_content">
    <script>
    	% if key and zoomify_prop and zoomify_width and zoomify_height:
    	var zoomifyViewer = new vk2.georeference.ZoomifyViewer('zoomify-container', {
			'width':  ${zoomify_width},
			'height':${zoomify_height},
			'url': '${zoomify_prop}'.substring(0,'${zoomify_prop}'.lastIndexOf("/")+1)
		});
    	%endif
    </script> 
</%block>
