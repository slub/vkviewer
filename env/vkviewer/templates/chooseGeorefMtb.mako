# -*- coding: utf-8 -*-
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en"
      xmlns:tal="http://xml.zope.org/namespaces/tal"
      xmlns:i18n="http://xml.zope.org/namespaces/i18n"
      i18n:domain="vkviewer">
    <head>
        <META HTTP-EQUIV="Content-Type" CONTENT="text/html; CHARSET=UTF-8">
        <title>Virtuelles Kartenforum 2.0</title>
        
        <!-- vk2 librarys -->
        <link rel="stylesheet" type="text/css" href="${request.static_url('vkviewer:static/lib/jquery-ui-1.10.3/themes/base/jquery-ui.css')}" />
        <link rel="stylesheet" type="text/css" href="${request.static_url('vkviewer:static/css/vk2/templates/styles.css')}" /> 
        <link rel="stylesheet" type="text/css" href="${request.static_url('vkviewer:static/css/vk2/templates/chooseGeorefMtb.css')}" />
      	<script src="${request.static_url('vkviewer:static/lib/jquery.js')}"></script>
      	<script src="${request.static_url('vkviewer:static/lib/jquery-ui.js')}"></script>
    </head>
    
    <script>

    </script>  
	<body>
		<div class="vk2ChooseGeorefMtb">
			
			##
			## List of unreferenced messtischblaetter for a given blattnumber (via paginator)
			##
			% if paginator.items:
			
				<h2>Wähle Karte für Georeferenzierung</h2>
				
				% for mtb in paginator.items:
					
					<a href="${request.route_url('georeference_start')}?mtbid=${mtb['mtbid']}&zoomify_prop=${mtb['zoomify_prop']}&zoomify_width=${mtb['zoomify_width']}&zoomify_height=${mtb['zoomify_height']}&layer=${mtb['titel']}">${mtb['titel']}</a> <br> 
						
				% endfor
			
			% else:
			
				<h2>Für diese Blattnummer können keine Messtischblätter mehr georeferenziert werden</h2>
			
			% endif
			
		</div>
    </body>
</html>
