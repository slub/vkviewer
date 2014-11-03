<%inherit file="basic_page.mako" />

<%block name="header_content">
	<script>
	    goog.require('vk2.app.MapProfileApp');
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
					</div>
				</div>
			</div>
			<div class="row metadata" id="metadata-container">
			</div>
			
			
			<div class="row map">

				<div class="original-view">
						<div class="container">
							<div class="zoomify-container unreferenced-map olMap" id="zoomify-container"></div>
						</div>				
				</div>

			</div>
		</div>
	</div>
</%block>

<%block name="js_content">
    <script>
    	% if key and zoomify:
    	var mapProfileApp = new vk2.app.MapProfileApp({
    		'metadataId': '${key}',
    		'metadataContainer': 'metadata-container',
    		'zoomify': '${zoomify}',
    		'zoomifyContainer': 'zoomify-container'
    	});

    	%endif
    </script> 
</%block>
