<%inherit file="basic_page_slim.mako" />

<%block name="header_content">
	<link rel="stylesheet" type="text/css" href="${request.static_url('vkviewer:static/lib/css/ol.css')}" />
	<link rel="stylesheet" type="text/css" href="${request.static_url('vkviewer:static/css/styles.css')}" />
	<style>
	
		.mtb-profile-page .container > h1{
			margin-top: 10px;
			margin-bottom: 10px;
		}
		
		.tab-content .tab-pane {
			height: 100%;
			width: 100%;
			overflow: auto;
			margin-right: 0px;
			margin-left: 0px;
		}
		
		.tab-content .tab-pane .container{
			height: 100%;
			margin-top: 10px;
			margin-bottom: 10px;
		}
		
		.zoomify-container{
			width: 100%;
			height: 100%;
		}
		
		
	</style>
</%block>

<%block name="body_content">
	<div class="mtb-profile-page">
		<div class="container">
			<h1 id="singlemapview-title"></h1>
			<!-- tab navigation -->
			<ul id="singlemapview-tab-list" class="nav nav-tabs">
				<li><a href="#georef-view">Georeferenziertes Messtischblatt</a></li>
			  	<li><a href="#original-view">Originales Messtischblatt</a></li>
			  	<li class="active"><a href="#metadata-view" data-toggle="tab">Metadaten</a></li>
			</ul>
			
			<!-- tab-panels -->
			<div id="singlemapview-tab-content" class="tab-content">
			
				<!-- Georeference Messtischblatt -->
				<div class="tab-pane" id="georef-view">
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
				<div class="tab-pane active" id="metadata-view">
					<div class="container">
						<div class="metadata-container" id="metadata-container"></div>
					</div>
				</div>
			</div>
		</div>
	</div>
</%block>

<%block name="js_content">
	<script src="//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>
	<script src="${request.static_url('vkviewer:static/lib/jquery-ui-1.10.4.custom.min.js')}"></script>	
	<script src="//netdna.bootstrapcdn.com/bootstrap/3.0.3/js/bootstrap.min.js"></script>   
	<script src="${request.static_url('vkviewer:static/js/locale/'+_('js_library')+'.js')}"></script>
	
	<!-- production  -->
	<script src="${request.static_url('vkviewer:static/lib/ol.js')}"></script>
	<script src="${request.static_url('vkviewer:static/js/Vkviewer-ol3.js')}"></script> 
	<script src="${request.static_url('vkviewer:static/js/ol3/tools/ZoomifyViewer.js')}"></script> 
    <script>
		$('#singlemapview-tab-list a').click(function(e){
			  e.preventDefault();
  			  $(this).tab('show');
  			  
  			  // this code is important for refresh the canvas after tab changes
  			  var url = new goog.Uri(this.href);
  			  var tab_id = url.getFragment();
  			  if (tab_id == 'georef-view'){
  			  	console.log('Update size georef view');
  			  	mtbViewer.getMap().updateSize();
  			  } else if (tab_id == 'original-view'){
  			  	console.log('Update size original view');
  			  	zoomifyViewer.getMap().updateSize();
  			  }
		});
		
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
		
		if (goog.dom.getElement('reset-georef-map')){
			var resetGeoreference = new VK2.Tools.ResetGeoreferenceParameter(goog.dom.getElement('reset-georef-map'), VK2.Utils.getQueryParam('id'));
		}; 
		
		// zoomify viewer
		var zoomify_url = "http://fotothek.slub-dresden.de/zooms/df/dk/0010000/df_dk_0010001_4443_1904/";
		var zoomify_width = 8393;
		var zoomify_height = 9657;
		var zoomifyViewer = new VK2.Tools.ZoomifyViewer('zoomify-container', zoomify_url, zoomify_width, zoomify_height);			
    </script> 
</%block>
