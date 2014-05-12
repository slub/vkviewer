# -*- coding: utf-8 -*-
<%inherit file="index_page.mako"/>

<%block name="js_content">
	<script>
		$(document).ready(function(){ 
			app = new VK2.Utils.AppLoader({}, initConfiguration);
			app.loadApplication();
	    });
	</script>
</%block>
