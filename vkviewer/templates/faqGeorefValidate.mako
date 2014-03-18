# -*- coding: utf-8 -*-
<%inherit file="faq.mako"/>

<%block name="js_content">
	<script>
		$(document).ready(function(){
			$('#collapse-georef').collapse();
			$('#collapse-georef-validate').collapse();
		});
	</script>
</%block>
