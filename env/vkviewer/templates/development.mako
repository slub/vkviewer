<%inherit file="basic_page.mako" />

<%block name="header_content">
	  <link rel="stylesheet" type="text/css" href="${request.static_url('vkviewer:static/css/vk2/templates/template_pages.css')}" />
	  <link rel="stylesheet" type="text/css" href="${request.static_url('vkviewer:static/css/vk2/templates/development.css')}" />
</%block>

<%block name="body_content">
	<div id="georefPointContainer" class="georef-point-container alert alert-success"></div>
</%block>

<%block name="js_content">
	<script>
		var points = VK2.Utils.getQueryParam('points');
		console.log(points);
		VK2.Utils.Georef.showGeorefPoints(goog.dom.getElement('georefPointContainer'), points);
    </script>  
</%block>