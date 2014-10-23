# -*- coding: utf-8 -*-
<%inherit file="basic_page.mako" />

<%block name="header_content">	 

<style>

body { overflow: initial; }
.container { margin: 30px auto 60px auto; }
.content { margin-top: -50px; }
h2 { border-bottom: 1px dotted #ccc; padding: 30px 0 10px 0; margin: 20px 0; clear: both; }
h3 { font-size: 22px; color: #666; padding: 20px 0 0 0; margin: 10px 0; clear: both; }
p { margin: 16px 0; }
.media-container { position: relative; padding: 5px; border: 1px solid #ccc;}
.media-container.pos-left { float: left; margin: 0 10px 10px 0; }
.media-container.pos-right { float: right; margin: 0 0 10px 10px; text-align: right; }
.media-container img { border: 1px solid #eee; }
.caption { font-size: 11px; color: #666; margin: 4px 0; }
#faq-affix-sidebar > .nav { border-top: 1px dotted #ccc; padding-top: 10px;  }
#faq-affix-sidebar .nav .nav { display: none; }
#faq-affix-sidebar .nav .active .nav { display: block; }    
#faq-affix-sidebar .nav > li a { color: #666; font-size: 16px; padding: 2px 6px 2px 10px; border-left: 1px solid transparent; }
#faq-affix-sidebar .nav > li a:hover { background: transparent; text-decoration: underline; }
#faq-affix-sidebar .nav > li > a { font-weight: bold; }    
#faq-affix-sidebar .nav > li li > a { font-weight: 300; font-size: 14px; padding-left: 20px; }      
#faq-affix-sidebar .nav .active > a { color: #f33; border-left: 1px solid #f33; }
#faq-affix-sidebar .nav .totop { font-weight: 300; border-top: 1px dotted #ccc; font-size: 12px; color: #999; margin-top: 10px; }
.bs-callout{ padding: 20px; margin: 20px 0; border: 1px solid #eee; border-left-width: 5px; border-radius: 3px; }
.bs-callout-warning { border-left-color: #f0ad4e;}
</style>

</%block>

<%block name="body_content">

	<div id="faq" data-spy="scroll" data-target="#faq-affix-sidebar" class="faq">
		<h1 class="sr-only sr-only-focusable">${_('faq-title')}</h1>
	
	    <div class="container">
	
	      <div class="row">
	
	        <div class="content col-md-9">
	          
			<!--the article before the first article-->
			<article id="general-navigation">
				<h2>${_('faq-general-title')}</h2>
				<p>${_('faq-general-content-1') | n}</p>
					<figure class="media-container pos-left">
						<img src="${request.static_url('vkviewer:static/images/faq/uploads_' + _('js_library') + '/anmelden.png')}" alt="anmelden">
						<figcaption class="caption"></figcaption>
					</figure>
				<p>
					${_('faq-general-content-2') | n}
				</p>	
			</article>	
	
	
					
	          	<!-- first article (eg. search maps) -->
	        <article id="map-detection">
	            	<h2>${_('faq-map-detection')}</h2>
	            <p>
					${_('faq-map-detection-1')}
				</p>
				<p>
					${_('faq-map-detection-2')}
				</p>
					
				<section id="search-for-a-place">
					<h3>${_('faq-place-name')}</h3>
					<figure class="media-container pos-left">
						<img src="${request.static_url('vkviewer:static/images/faq/uploads_' + _('js_library') + '/ortsname.png')}" alt="ortsname_dt">
						<figcaption class="caption"></figcaption>
					</figure>
					<p>
						${_('faq-place-name-1') | n} 
					</p>
				</section>
					
				<section id="adjust-the-time">
					<h3>${_('faq-time-bar')}</h3>
					<figure class="media-container pos-left">
						<img src="${request.static_url('vkviewer:static/images/faq/uploads_' + _('js_library') + '/zeitleiste.png')}" alt="zeitleiste">
						<figcaption class="caption"></figcaption>
					</figure>
					<p>
						${_('faq-time-bar-1')}
					</p>
				</section>
					
				<section id="the-search-list">
					<h3>${_('faq-search-list')}</h3>
					<figure class="media-container pos-left">
						<img src="${request.static_url('vkviewer:static/images/faq/uploads_' + _('js_library') + '/suchliste.png')}" alt="suchliste">
						<figcaption class="caption"></figcaption>
					</figure>				
					<p>
						${_('faq-search-list-1') | n}
					</p>
					<p>
						${_('faq-search-list-2')}
					</p>		
				</section>
						
				<section id="map-navigation">
					<h3>${_('faq-map-navigation')}</h3>
				    	<figure class="media-container pos-left">
	                		<img src="${request.static_url('vkviewer:static/images/faq/uploads_' + _('js_library') + '/buttons.png')}" alt="buttons_dt">
	                		<figcaption class="caption"></figcaption>
	                	</figure>
					<p>
						${_('faq-map-navigation-1')}
					</p> 
					<p>
						${_('faq-map-navigation-2') | n}
					</p>
					<p>
						${_('faq-map-navigation-3') | n}
					</p>
					<p>
						${_('faq-map-navigation-4') | n}
					</p> 
					<p>
						${_('faq-map-navigation-5')}
					</p>
				</section>
				
			</article>	
			
			<!-- second article (eg. manage choosen maps) -->
			<article id="manage-chosen-maps">
				<h2>${_('faq-map-management')}</h2>
				<figure class="media-container pos-left">
					<img src="${request.static_url('vkviewer:static/images/faq/uploads_' + _('js_library') + '/kartenauswahl.png')}" alt="kartenauswahl">
					<figcaption class="caption"></figcaption>
				</figure>
	            
				<p>
					${_('faq-map-management-1')}
				</p>
					
				<section id="change-transparency">
	              			<h3>${_('faq-change-transparency')}</h3>
					<figure class="media-container pos-left">
						<img src="${request.static_url('vkviewer:static/images/faq/uploads_' + _('js_library') + '/transparenz.png')}" alt="transparenz">
						<figcaption class="caption"></figcaption>
					</figure>
			        	<p>
							${_('faq-change-transparency-2')}
						</p>
				</section>
				  
				<section id="activate-deactivate-maps">
					<h3>${_('faq-activate-deactivate')}</h3>
					<figure class="media-container pos-left">
						<img src="${request.static_url('vkviewer:static/images/faq/uploads_' + _('js_library') + '/aktiviert.png')}" alt="aktiviert">
						<figcaption class="caption">${_('activate-deactivate-1')}</figcaption>
					</figure>
					<figure class="media-container pos-left">
						<img src="${request.static_url('vkviewer:static/images/faq/uploads_' + _('js_library') + '/deaktiviert.png')}" alt="deaktiviert">
						<figcaption class="caption">${_('activate-deactivate-2')}</figcaption>
					</figure>
	              	<p>
						${_('faq-activate-deactivate-4')}
					</p>
				</section>
				  
				<section id="add-delete-maps">
	              	<h3>${_('faq-add-delete')}</h3>
	              	<p>
						${_('faq-add-delte-1')}
					</p>
	              	<p>
						${_('faq-add-delete-2') | n}
					</p>
	            </section>
				  
				<section id="reorder-maps">
	              			<h3>${_('faq-reorder')}</h3>
					<figure class="media-container pos-left">
						<img src="${request.static_url('vkviewer:static/images/faq/uploads_' + _('js_library') + '/verschieben.png')}" alt="verschieben">
						<figcaption class="caption"></figcaption>
					</figure>
					<p>
						${_('faq-reorder-1')}
					</p>
				  	<p>
						${_('faq-reorder-2')}
					</p>
	            </section>
				  
	            <section id="original-maps-meta-data">
	              	<h3>${_('faq-original-meta')}</h3>
					<figure class="media-container pos-left">
						<img src="${request.static_url('vkviewer:static/images/faq/uploads_' + _('js_library') + '/meta.png')}" alt="meta_dt">
						<figcaption class="caption"></figcaption>
					</figure>
					<p>
						${_('faq-original-meta-1')}
					</p>
	              	<p>
						${_('faq-original-meta-2') | n}
					</p>		
				</section>
			</article>
	          
	          	<!-- third article (eg. georef) -->
	        <article id="geo-referencing-of-maps">
	            	<h2>${_('faq-geo-referencing-maps')}</h2>
	            	<p>
						${_('faq-geo-referencing-maps-1')}
					<p>
						${_('faq-geo-referencing-maps-2')}
					</p>
	            
				<div class="bs-callout bs-callout-warning">
					<p>
						${_('faq-call-out')}
					</p>
				</div>
				
				<section id="map-selection">
	              	<h3>${_('faq-map-selection')}</h3>
					<figure class="media-container pos-left">
						<img src="${request.static_url('vkviewer:static/images/faq/uploads_' + _('js_library') + '/angemeldet.png')}" alt="angemeldet">
						<figcaption class="caption"></figcaption>
					</figure>
					<p>
						${_('faq-map-selection-1')}
					</p>
	            </section>
				  
	            <section id="geo-referencing">
	            	<h3>${_('faq-geo-referencing')}</h3>
	            		<figure class="media-container pos-left">
	            			<img src="${request.static_url('vkviewer:static/images/faq/uploads_' + _('js_library') + '/georef.jpg')}" alt="Georeferenzierung">
							<figcaption class="caption"></figcaption>
	            		</figure>
	              	<p>
						${_('faq-geo-referencing-1')}
					</p> 
				  	<p>
						${_('faq-geo-referencing-2')}
					</p>
				  	<p>
						${_('faq-geo-referencing-3') | n}
					</p>
				  	<p>
						${_('faq-geo-referencing-4') | n}
					</p>		
					<p>
						${_('faq-geo-referencing-5') | n}
					</p>
					<p>
						${_('faq-geo-referencing-6') | n}
					</p>              
				</section>
	
				<section id="geo-referncing-history">
					<h3>${_('faq-geo-referencing-history')}</h3>
					<figure class="media-container pos-left">
						<img src="${request.static_url('vkviewer:static/images/faq/uploads_' + _('js_library') + '/kopf_rechts.png')}" alt="kopf_rechts">
						<figcaption class="caption"></figcaption>
					</figure>
					<p>
						${_('faq-geo-referencing-history-11') | n}
					</p>
				</section>
			 
			</article>
	            
	            
	        </div>
	        <div class="sidebar col-md-3">
	        
	          <nav id="faq-affix-sidebar">
	            <ul class="nav sidenav" data-spy="affix" data-offset-top="0" data-offset-bottom="0">
					<li class="active">
						<a href="#general-navigation">${_('faq-sidebar')}</a>
					</li>
					<li>
	                	<a href="#map-detection">${_('faq-sidebar-1')}</a>
						<ul class="nav">
							<li><a href="#search-for-a-place">${_('faq-sidebar-2')}</a></li>
							<li><a href="#adjust-the-time">${_('faq-sidebar-3')}</a></li>
							<li><a href="#the-search-list">${_('faq-sidebar-4')}</a></li>
							<li><a href="#map-navigation">${_('faq-sidebar-5')}</a></li>
						</ul>
	              	</li>
	              	<li>
						<a href="#manage-chosen-maps">${_('faq-sidebar-6')}</a>
						<ul class="nav">
							<li><a href="#change-transparency">${_('faq-sidebar-7')}</a></li>
							<li><a href="#activate-deactivate-maps">${_('faq-sidebar-8')}</a></li>
							<li><a href="#add-delete-maps">${_('faq-sidebar-9')}</a></li>
							<li><a href="#reorder-maps">${_('faq-sidebar-10')}</a></li>
							<li><a href="#original-maps-meta-data">${_('faq-sidebar-11')}</a></li>
						</ul>
					</li>
	              	<li>
						<a href="#geo-referencing-of-maps">${_('faq-sidebar-12')}</a>
						<ul class="nav">
							<li><a href="#map-selection">${_('faq-sidebar-13')}</a></li>
							<li><a href="#geo-referencing">${_('faq-sidebar-14')}</a></li>
							<li><a href="#geo-referncing-history">${_('faq-sidebar-15')}</a></li>
						</ul>
	              	</li>
	              	<li><a href="#top" class="totop">${_('faq-sidebar-16')}</a></li>
	            </ul>
	          </nav>
	          
	        </div> <!-- / sidebar -->
	        
	      </div> <!-- / row -->
	      
	    </div>  <!-- / container -->
	</div>
	
</%block>

<%block name="js_content">
		
<script>
	var body = document.getElementsByTagName('body')[0];
	body.className = 'faq';
	body.setAttribute('data-spy','scroll');
	body.setAttribute('data-target','#faq-affix-sidebar');
</script>

</%block>