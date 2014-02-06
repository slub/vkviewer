<%inherit file="basic_page_slim.mako" />

<%block name="header_content">
	  <link rel="stylesheet" type="text/css" href="${request.static_url('vkviewer:static/css/vk2/templates/template_pages.css')}" />
	  <link rel="stylesheet" type="text/css" href="${request.static_url('vkviewer:static/css/vk2/templates/development.css')}" />
	  <link rel="stylesheet" type="text/css" href="${request.static_url('vkviewer:static/lib/min/css/vkviewer-libarys.min.css')}" media="screen" />	  
	  <link rel="stylesheet" type="text/css" href="${request.static_url('vkviewer:static/lib/ol3/ol.css')}" />
</%block>

<%block name="body_content">
	<div id="map" class="map" style="width:100%;height:600px;"></div>
	<div id="mouse-position" style="width:100px; height:100px; position:relative; float:left;"></div>
</%block>

<%block name="js_content">
	<script src="${request.static_url('vkviewer:static/lib/min/proj4js.js')}"></script>
	<script src="${request.static_url('vkviewer:static/lib/ol3/ol-whitespace.js')}"></script>
	<script src="${request.static_url('vkviewer:static/dev/ZoomifyViewer.js')}"></script>
	<script src="${request.static_url('vkviewer:static/dev/MesstischblattViewer.js')}"></script>
	<script src="${request.static_url('vkviewer:static/lib/min/jquery.min.js')}"></script>
	<script src="${request.static_url('vkviewer:static/lib/min/jquery.fancybox.min.js')}"></script>
	<script>
		##var url = new goog.Uri(window.location.href);
		##var imgWidth = url.getQueryData().get('zoomify_width');
		##var imgHeight = url.getQueryData().get('zoomify_width');
		##var url = url.getQueryData().get('zoomify_prop').substring(0,url.getQueryData().get('zoomify_prop').lastIndexOf("/")+1);
		 
		##var zoomifyViewer = new VK2.Tools.ZoomifyViewer('map', {
		##	'width': imgWidth,
		##	'height': imgHeight,
		##	'zoomify_url': url
		##});
	
		##$.fancybox({
		##	href: goog.dom.getElement('map'),
		##	type: 'inline',
		##	width: '100%',
		##	height: '100%',
		##	closeClick: false	
		##});
		
		##$(goog.dom.getElement('map')).trigger("click");

		var mtbViewer = new VK2.Tools.MesstischblattViewer('map', {

		});
		
		
    </script>  
</%block>