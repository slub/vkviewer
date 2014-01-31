<%inherit file="basic_page.mako" />

<%block name="header_content">
	  <link rel="stylesheet" type="text/css" href="${request.static_url('vkviewer:static/css/vk2/templates/template_pages.css')}" />
	  <link rel="stylesheet" type="text/css" href="${request.static_url('vkviewer:static/css/vk2/templates/development.css')}" />
</%block>

<%block name="body_content">
	<div class="metadata-record page-container">	
		<div id="parentElement"></div>
	</div>

</%block>

<%block name="js_content">
	<script>
		$(document).ready(function(){
		
			var mdVisualizer = new VK2.Tools.MetadataVisualizer('parentElement');

		});
    </script>  
</%block>