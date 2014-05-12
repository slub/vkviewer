# -*- coding: utf-8 -*-
<%inherit file="index_page.mako"/>

<%block name="inner_body_content">

	<!-- container for giving a georef point feedback -->
	<div id="georefPointContainer" class="georef-point-container alert alert-warning"></div>	 	
	
</%block>

<%block name="js_content">
	<script>
		$(document).ready(function(){ 
	    	app = new VK2.Utils.AppLoader({}, initConfiguration);
			app.loadApplicationWithGeoref();
	    });
	</script>
</%block>
