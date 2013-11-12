# -*- coding: utf-8 -*-
<!DOCTYPE html>
<html>
    <head>
        <META HTTP-EQUIV="Content-Type" CONTENT="text/html; CHARSET=UTF-8">
        <title>Virtuelles Kartenforum 2.0</title>
    </head>
    <body>  
       	% if paginator.items:      	
	       	<h2>Wähle Karte für Georeferenzierung<h2>
			% for mtb in paginator.items:
				<a href="${request.static_url('vkviewer:static/georeference.html')}?mtbid=${mtb['mtbid']}&wms=${mtb['wms_url']}&layer=${mtb['layername']}">${mtb['titel']}<a/><br>
			% endfor
		
		% else:
			<p>Keine Karten gefunden!</p>
		% endif
        </script>       
    </body>
</html>