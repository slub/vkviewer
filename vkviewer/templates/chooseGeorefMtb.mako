<%inherit file="basic_page.mako" />

<%block name="body_content">
	<div class="choose-georef page-container">
  		<div class="vk2ChooseGeorefMtb">
			
			##
			## List of unreferenced messtischblaetter for a given blattnumber (via paginator)
			##
			% if paginator.items:
			
				<h2>${_('georef_choose_map')}</h2>
				
				% for map in paginator.items:
					
					<a href="${request.route_url('georeference_page')}?id=${map['mapid']}" 
						target="_top">${map['title']}</a> <br> 
						
				% endfor
			
			% else:
			
				<h2>${_('georef_choose_map_notfound')}</h2>
			
			% endif
			
		</div>
	</div>   
</%block>
