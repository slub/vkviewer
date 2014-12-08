<%inherit file="basic_page.mako" />

<%block name="header_content">
    <link rel="stylesheet" type="text/css" href="${request.static_url('vkviewer:static/css/vk2/single/georeference_profile.css')}" />	
    <link rel="stylesheet" href="${request.static_url('vkviewer:static/lib/css/bootstrap.min.css')}">		
	<link rel="stylesheet" type="text/css" href="${request.static_url('vkviewer:static/lib/css/jquery-ui-custom.min.css')}" media="screen" />
	<link rel="stylesheet" type="text/css" href="${request.static_url('vkviewer:static/css/styles.css')}" />
	<script>
	    goog.require('vk2.utils.AppLoader');
	</script>
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
    						
    							% if 'upload_id' in record:
					 				<img onerror="this.onerror=null;this.src='Dresden.jpg'" alt="hochgeladene Karte" src="Dresden.jpg'"></a>
					 			% else:
					 				<img onerror="this.onerror=null;this.src='thumbnail.png'" alt="" src="F:\workspace\maps\1f98a39f-9a6f-42f0-aea3-ebb7e28c3d23.jpeg">
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
