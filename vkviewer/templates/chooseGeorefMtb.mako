<%inherit file="basic_page.mako" />

<%block name="body_content">
	<div class="choose-georef page-container">
  		<div class="vk2ChooseGeorefMtb">
			
			##
			## List of unreferenced messtischblaetter for a given blattnumber (via paginator)
			##
			% if paginator.items:
			
				<h2>${_('georef_choose_map')}</h2>
				
				% for mtb in paginator.items:
					
					<a href="${request.route_url('georeference_page')}?id=${mtb['mtbid']}&zoomify_prop=${mtb['zoomify_prop']}&zoomify_width=${mtb['zoomify_width']}&zoomify_height=${mtb['zoomify_height']}&layer=${mtb['titel']}" 
						target="_top">${mtb['titel']}</a> <br> 
						
				% endfor
			
			% else:
			
				<h2>${_('georef_choose_map_notfound')}</h2>
			
			% endif
			
		</div>
	</div>   
</%block>
