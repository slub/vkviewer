<%inherit file="basic_page_slim.mako" />

<%block name="header_content">
	  <link rel="stylesheet" type="text/css" href="${request.static_url('vkviewer:static/css/vk2/templates/template_pages.css')}" />
	  <link rel="stylesheet" type="text/css" href="${request.static_url('vkviewer:static/css/vk2/templates/development.css')}" />
	  <link rel="stylesheet" type="text/css" href="${request.static_url('vkviewer:static/lib/min/css/vkviewer-libarys.min.css')}" media="screen" />	  
	  <link rel="stylesheet" type="text/css" href="${request.static_url('vkviewer:static/lib/ol3/ol.css')}" />
	  
	  <style>
	  		.ol-layerspy{
	  			position: absolute;
				background: rgba(255,255,255,0.4);
				border-radius: 4px;
				left: 8px;
				padding: 2px;
				top: 95px;
	  		}
	  		
	  		.ol-layerspy a{
	  			display: block;
				margin: 1px;
				padding: 0;
				color: white;
				font-size: 16px;
				font-family: 'Lucida Grande',Verdana,Geneva,Lucida,Arial,Helvetica,sans-serif;
				font-weight: bold;
				text-decoration: none;
				text-align: center;
				height: 22px;
				width: 22px;
				background-color: rgba(0,60,136,0.5);
				border-radius: 2px;
	  		}
	  		
	  		.ol-layerspy a:hover{
	  			background: rgba(0,60,136,0.7);
	  		}
	  		
	  		      .rotate-north {
        position: absolute;
        top: 125px;
        left: 8px;
        background: rgba(255,255,255,0.4);
        border-radius: 4px;
        padding: 2px;
      }
      .ol-touch .rotate-north {
        top: 80px;
      }
      .rotate-north a {
        display: block;
        color: white;
        font-size: 16px;
        font-family: 'Lucida Grande',Verdana,Geneva,Lucida,Arial,Helvetica,sans-serif;
        font-weight: bold;
        margin: 1px;
        text-decoration: none;
        text-align: center;
        border-radius: 2px;
        height: 22px;
        width: 22px;
        background: rgba(0,60,136,0.5);
      }
      .ol-touch .rotate-north a {
        font-size: 20px;
        height: 30px;
        width: 30px;
        line-height: 26px;
      }
      .rotate-north a:hover {
        background: rgba(0,60,136,0.7);
      }
	  </style>
</%block>

<%block name="body_content">
	<div id="map" class="map" style="width:100%;height:600px;"></div>
	<div id="mouse-position" style="width:100px; height:100px; position:relative; float:left;"></div>
</%block>

<%block name="js_content">
	<script src="${request.static_url('vkviewer:static/lib/min/proj4js.js')}"></script>
	<script src="${request.static_url('vkviewer:static/lib/min/jquery.min.js')}"></script>
	<script src="${request.static_url('vkviewer:static/lib/ol3/ol-whitespace.js')}"></script>
	<script src="${request.static_url('vkviewer:static/dev/LayerSpy.js')}"></script>
	<script src="${request.static_url('vkviewer:static/dev/RotateNorth.js')}"></script>
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