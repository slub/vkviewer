<%inherit file="basic_page_slim.mako" />

<%block name="body_content">
	<div class="modal-dialog modal-lg">
	<div class="modal-content choose-georef">
	<div class="modal-header">
  		<button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>		
		<h4 class="slubcolor modal-title">${_('georef_choose_map')}</h4>
  	</div>
	<div class="modal-body">
	<div class="choose-georef page-container">
  		<div class="vk2ChooseGeorefMtb">
			
			##
			## List of unreferenced messtischblaetter for a given blattnumber (via paginator)
			##
			% if paginator.items:
			
				<h2>${_('georef_choose_map')}</h2>
				
				% for mtb in paginator.items:
					
					<a href="${request.route_url('georeference_start')}?mtbid=${mtb['mtbid']}&zoomify_prop=${mtb['zoomify_prop']}&zoomify_width=${mtb['zoomify_width']}&zoomify_height=${mtb['zoomify_height']}&layer=${mtb['titel']}">${mtb['titel']}</a> <br> 
						
				% endfor
			
			% else:
			
				<h2>${_('georef_choose_map_notfound')}</h2>
			
			% endif
			
		</div>
	</div>   
	</div>
	</div>
	</div>
	</div>
</%block>
