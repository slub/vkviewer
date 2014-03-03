# -*- coding: utf-8 -*-
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en"
      xmlns:tal="http://xml.zope.org/namespaces/tal"
      xmlns:i18n="http://xml.zope.org/namespaces/i18n"
      i18n:domain="vkviewer">
    <head>
        <META HTTP-EQUIV="Content-Type" CONTENT="text/html; CHARSET=UTF-8" />
        <META HTTP-EQUIV="cache-control" CONTENT="max-age=3600" />
        <title>Virtuelles Kartenforum 2.0</title>
        
        <!-- js/css librarys via cdn -->
		<link rel="stylesheet" href="//netdna.bootstrapcdn.com/bootstrap/3.0.3/css/bootstrap.min.css">	 
		<link rel="stylesheet" type="text/css" href="${request.static_url('vkviewer:static/lib/css/vkviewer-libarys.min.css')}" media="screen" />
		
		<%block name="header_content" />
	     
    </head>
	<body>
		<noscript>
	    	<style type="text/css">
	    		body {padding-top: 0px;}
	        	div { display:none; }
	   		</style>
   			${_('javascript_disabled')}
		</noscript>
	
		<%block name="body_content" />

	    <!-- development 
	  	<script src="${request.static_url('vkviewer:static/lib/jquery.min.js')}"></script>
	    <script src="${request.static_url('vkviewer:static/lib/jquery-ui-1.10.4.custom.min.js')}"></script>
	    <script src="${request.static_url('vkviewer:static/lib/jquery.fancybox.min.js')}"></script>
	    <script src="${request.static_url('vkviewer:static/lib/jquery.tablesorter.min.js')}"></script>  
	    <script src="${request.static_url('vkviewer:static/lib/bootstrap.min.js')}"></script>
	    <script src="${request.static_url('vkviewer:static/lib/proj4js.js')}"></script>
	    <script src="${request.static_url('vkviewer:static/lib/OpenLayers.js')}"></script> -->
	    
	    <!-- production -->
		<!-- js librarys -->
      	<script src="//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>
      	<script src="//netdna.bootstrapcdn.com/bootstrap/3.0.3/js/bootstrap.min.js"></script>  
        <script src="${request.static_url('vkviewer:static/lib/jquery-ui-1.10.4.custom.min.js')}"></script>	    
	    <script src="${request.static_url('vkviewer:static/lib/OpenLayers.js')}"></script> 
	    <script src="${request.static_url('vkviewer:static/lib/vkviewer-plugin-libarys.min.js')}"></script>  
	    <script src="${request.static_url('vkviewer:static/js/locale/'+_('js_library')+'.js')}"></script>
	    <script src="${request.static_url('vkviewer:static/js/Vkviewer.js')}"></script> 
	    	    
	    <%block name="js_content" />
	    
        <!-- Piwik -->
		<script type="text/javascript">
  			var _paq = _paq || [];
		  	_paq.push(["trackPageView"]);
		  	_paq.push(["enableLinkTracking"]);
		
		  	(function() {
			    var u=(("https:" == document.location.protocol) ? "https" : "http") + "://piwik.slub-dresden.de/";
			    _paq.push(["setTrackerUrl", u+"piwik.php"]);
		    	_paq.push(["setSiteId", "164"]);
		    	var d=document, g=d.createElement("script"), s=d.getElementsByTagName("script")[0]; g.type="text/javascript";
		    	g.defer=true; g.async=true; g.src=u+"piwik.js"; s.parentNode.insertBefore(g,s);
		  	})();
		</script>  

		${self.body()}
    </body>
</html>
