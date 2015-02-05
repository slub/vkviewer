<%inherit file="basic_page.mako" />

<%block name="body_content">
	<div class="georeference-validate page-container full-display">
		<!-- Header -->
		<div class="georeference-header-container">
		  <h1><span class="vk2georef-brand">VK2-Georeferenzierer</span> Neue Georeferenzierung</h1>
		  
		  <div class="georef-validate-menu pull-right"></div>
		</div>
		
		<!-- map content -->
		<div class="row georeference-validate-container">
			<div class="col-sm-6 col-md-6 col-lg-6 outer-map-container">
				<div id="unreferenced-map" class="unreferenced-map map-container olMap"></div>
			</div>
			<div class="col-sm-6 col-md-6 col-lg-6 outer-map-container">
				<div id="georeferenced-map" class="georeferenced-map map-container olMap">
					<div id="opacity-slider-container" class="opacity-slider-container"></div>
				</div>
			</div>	
		</div>
					 
			        	<!-- Footer panel -->
			        	<div class="vk2FooterPanel">
			        		<div id="vk2Footer" class="vk2Footer">
			        			<div class="footerContainer">
        							<div class="leftside">
					        			<ul class="footerList">
					        				<li class="listelement thick leftborder">${_('footer_project_name')}</li>
					        				<li class="listelement">${_('footer_project_desc_long')}</li>
					        			</ul>
        							</div>
					        		<div class="rightside">
					        		   	<ul class="footerList">
					        				<li class="listelement leftborder">
					        					<a href="${request.route_url('faq')}" data-src="${request.route_url('faq')}" data-classes="faq" 
					        							class="vk2-modal-anchor" data-title="">FAQ</a>        				
					        				</li>
					        				<li class="listelement leftborder">
					         					<a href="${request.route_url('contact')}" data-src="${request.route_url('contact')}?referencer=georeference:${objectid}" data-classes="contact" 
					        							class="vk2-modal-anchor" data-title="">${_('footer_contact')}</a>		
					        				</li>        				
					        				<li class="listelement leftborder">
					        					<a href="${request.route_url('project')}" data-src="${request.route_url('project')}" data-classes="project" 
					        							class="vk2-modal-anchor" data-title="">${_('footer_project')}</a>    				
					        				</li>
					        				<li class="listelement">
					        					<a href="${request.route_url('impressum')}" data-src="${request.route_url('impressum')}" data-classes="impressum" 
					        							class="vk2-modal-anchor" data-title="">${_('footer_editorial')}</a>
					        				</li>
					        			</ul>
					        		</div>
        						</div>
        					</div>
			        	</div>
						<!-- end footer -->
		</div>
	</div>
</%block>

<%block name="js_content">
    <script>	
    	var georeferenceApp = new vk2.app.GeoreferenceApp('unreferenced-map','georeferenced-map');
    </script> 
</%block>


