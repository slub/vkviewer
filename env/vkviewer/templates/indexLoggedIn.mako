# -*- coding: utf-8 -*-
<%inherit file="basicIndexLayout.mako"/>

<script>
	$(document).ready(function(){ 
    	app = new VK2.Utils.AppLoader({}, initConfiguration);
		app.loadApplicationWithGeoref();
    });
</script>