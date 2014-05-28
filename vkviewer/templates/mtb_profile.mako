<%inherit file="basic_page.mako" />

<%block name="header_content">
	<script>
	    goog.require('VK2.Module.SingleMapViewer');
	</script>
</%block>

<%block name="body_content">
	<div class="mtb-profile-page">
		<div class="container">
			<div class="row header">
				<div class="col-lg-10 col-md-10 col-sm-8 col-xs-6">
					<h1 id="singlemapview-title"></h1>
				</div>
				<div class="col-lg-2 col-md-2 col-sm-4 col-xs-6">
					<li class="dropdown choose-timestamp">
						<a href="#" class="dropdown-toggle" data-toggle="dropdown">${_('singlemapview_choosetimestamp')}<b class="caret"></b></a>
						<ul class="dropdown-menu" id="timestamp-chooser"></ul>
					</li>
				</div>
			</div>
			
			
			<div class="row body">
				<!-- tab navigation -->
				<ul id="singlemapview-tab-list" class="nav nav-tabs">
					<li class="active"><a href="#georef-view" data-toggle="tab">${_('singlemapview_georefmtbtab')}</a></li>
				  	<li><a href="#original-view">${_('singlemapview_originalmtbtab')}</a></li>
				  	<li><a href="#metadata-view">${_('singlemapview_metadatatab')}</a></li>
				</ul>
			
				<!-- tab-panels -->
				<div id="singlemapview-tab-content" class="tab-content">
				
					<!-- Georeference Messtischblatt -->
					<div class="tab-pane active" id="georef-view">
						<div class="container">
							<div class="map-container" id="map-container">
						
								## Tool for remove georef dataset from database
								% if with_modify:
								<a class="reset-georef-map" id="reset-georef-map"></a>
								% endif
					
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
					</div>
					
					<!-- Unreferenced Messtischblatt -->
					<div class="tab-pane" id="original-view">
						<div class="container">
							<div class="zoomify-container" id="zoomify-container"></div>
						</div>				
					</div>
					
					<!-- Metadata view -->
					<div class="tab-pane" id="metadata-view">
						<div class="container">
							<div class="metadata-container" id="metadata-container"></div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</%block>

<%block name="js_content">
    <script>
    	% if key and zoomify_prop and zoomify_width and zoomify_height:
    	var singleMapViewer = new VK2.Module.SingleMapViewer({
    		zoomify_url: '${zoomify_prop}'.substring(0,'${zoomify_prop}'.lastIndexOf("/")+1),
			zoomify_width: ${zoomify_width},
			zoomify_height: ${zoomify_height},
			map_id: VK2.Utils.getQueryParam('id'),
			str_extent: VK2.Utils.getQueryParam('extent'),
			time: VK2.Utils.getQueryParam('time'),
			metadata_key: '${key}',
			timestamp_chooser_list: 'timestamp-chooser'
    	});
    	%endif
    </script> 
</%block>
