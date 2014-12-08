<%inherit file="basic_page.mako" />

<%block name="header_content">
	<style>
		body { overflow: initial; }
		.container { margin: 30px auto 60px auto; }
		.content { margin-top: -50px; }
		h2 { border-bottom: 1px dotted #ccc; padding: 30px 0 10px 0; margin: 20px 0; clear: both; }
		h3 { font-size: 22px; color: #666; padding: 20px 0 0 0; margin: 10px 0; clear: both; }
		p { margin: 16px 0; }
	</style>
</%block>

<%block name="body_content">
	<div class="container">
		<div>
			<header>
				<hgroup>
				
					<%
					from pyramid.security import authenticated_userid
					user_id = authenticated_userid(request)
					%>    
											
					% if user_id:
						<h2>Ihre bereits hochgeladenen Karten #${user_id}</h2>
						<br><a href="${request.route_url('home_login')}" target="_top">${_('georef_back_to_overview')}</a>
						<br><a href="${request.route_url('upload', action='form')}" target="_top">weitere Karte hochladen</a>
					% endif
					
				</hgroup>
			</header>

       
    		<div id="content-container" class="content-container">
    			% if upload_profile:
					% for record in upload_profile:
					
    				<article id="${record['upload_id']}" class="">
    					<div class="media">
    						<a class="pull-right" href="${request.route_url('profile-map')}?objectid=${record['upload_mapid']}">
    						
    							% if 'thumbnail' in record:
					 				<img onerror="this.onerror=null;this.src='/vkviewer/static/images/layer_default.png'" alt="hochgeladene Karte" src="${record['thumbnail']}"></a>
					 			% else:
					 				<img alt="" src="/vkviewer/static/images/layer_default.png">
					 			% endif
					 		</a>
					 		
    						<div class="media-body">
								<p>
									<strong>Upload_Id:</strong><br> ${record['upload_id']}
								</p>
								<p>  
				          			<strong>Lizenz:</strong><br> ${record['licence']}  
				        		</p>
								<p>  
						          	<strong>Map-ID:</strong><br> ${record['upload_mapid']}  
						        </p>
								<p>  
						          	<strong>Titel des Kartenblattes:</strong><br> ${record['title']}
						        </p>
								<p>  
						          	<strong>Zeit:</strong><br> ${record['time']}
						        </p>

						        <p class="meta">Created: ${record['upload_time']}</p>
							</div>     		
    		
    					</div>  
					</article>
					% endfor
				% endif
			</div>
		</div>
	</div>
	
</%block>   
