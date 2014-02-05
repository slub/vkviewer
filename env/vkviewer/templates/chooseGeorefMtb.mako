<%inherit file="basic_page_slim.mako" />

<%block name="header_content">
	<link rel="stylesheet" type="text/css" href="${request.static_url('vkviewer:static/lib/min/css/vkviewer-libarys.min.css')}" media="screen" />
	<link rel="stylesheet" type="text/css" href="${request.static_url('vkviewer:static/css/vk2/templates/template_pages.css')}" /> 	
</%block>

<%block name="body_content">
	<div class="choose-georef page-container">
  		<div class="vk2ChooseGeorefMtb">
			
			##
			## List of unreferenced messtischblaetter for a given blattnumber (via paginator)
			##
			% if paginator.items:
			
				<h2>Wähle Karte für Georeferenzierung</h2>
				
				% for mtb in paginator.items:
					
					##<a href="${request.route_url('georeference_start')}?mtbid=${mtb['mtbid']}&zoomify_prop=${mtb['zoomify_prop']}&zoomify_width=${mtb['zoomify_width']}&zoomify_height=${mtb['zoomify_height']}&layer=${mtb['titel']}">${mtb['titel']}</a> <br> 
					<a href="${request.route_url('development_page')}?mtbid=${mtb['mtbid']}&zoomify_prop=${mtb['zoomify_prop']}&zoomify_width=${mtb['zoomify_width']}&zoomify_height=${mtb['zoomify_height']}&layer=${mtb['titel']}">${mtb['titel']}</a> <br>
						
				% endfor
			
			% else:
			
				<h2>Für diese Blattnummer können keine Messtischblätter mehr georeferenziert werden</h2>
			
			% endif
			
		</div>
	</div>
    <script src="//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>
    <script src="${request.static_url('vkviewer:static/lib/min/jquery-ui-1.10.4.custom.min.js')}"></script>	    
</%block>
