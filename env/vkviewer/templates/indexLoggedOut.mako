# -*- coding: utf-8 -*-
<%inherit file="basicIndexLayout.mako"/>

<%block name="js_content">
	<script>
		$(document).ready(function(){ 
			app = new VK2.Utils.AppLoader({}, initConfiguration);
			app.loadApplication();
	    });
	</script>
</%block>
