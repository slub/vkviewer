# -*- coding: utf-8 -*-
<%inherit file="faq.mako"/>

<%block name="js_content">
	<script>
		$(document).ready(function(){
			$('#collapse-search').collapse();
			$('#collapse-search-map-navigation').collapse();
		});
	</script>
</%block>
