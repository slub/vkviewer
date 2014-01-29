# -*- coding: utf-8 -*-

##
## This is a base class for slim page without mostly javascript
##

<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en"
      xmlns:tal="http://xml.zope.org/namespaces/tal"
      xmlns:i18n="http://xml.zope.org/namespaces/i18n"
      i18n:domain="vkviewer">
    <head>
        <META HTTP-EQUIV="Content-Type" CONTENT="text/html; CHARSET=UTF-8">
        <title>Virtuelles Kartenforum 2.0</title>
        
         <!-- js/css librarys via cdn -->
		<link rel="stylesheet" href="//netdna.bootstrapcdn.com/bootstrap/3.0.3/css/bootstrap.min.css">	      
	    
	    <%block name="header_content" />
    </head>
	<body>
		
		<%block name="body_content" />
		${self.body()}
			
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
    </body>
</html>