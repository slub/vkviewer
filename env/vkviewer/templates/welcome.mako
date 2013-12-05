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
        <link rel="stylesheet" type="text/css" href="${request.static_url('vkviewer:static/css/vk2/templates/welcome.css')}" />
      	<script src="${request.static_url('vkviewer:static/lib/jquery.js')}"></script>
      	<script src="${request.static_url('vkviewer:static/lib/jquery-ui.js')}"></script>
    </head>
    
    <script>
    	$(document).ready(function(){
			$('#deactivateWelcomePage').change(function(){
				var queryValue = $(this).prop('checked') ? 'off' : 'on';
	   			$.ajax({
        			url: '/vkviewer/welcomeoff',
        			type: 'GET',
        			data: {
        				'welcomepage': queryValue
        			},
        			success: function( data ){  
						console.log(data);
        			},
        			statusCode: {
        				400: function(){
        					alert( 'bad request' );
        				}
        			}
	   			});
	   		});
	   	});
    </script>  
	<body>
		<div class="vk2WelcomePage">
		    <h2 class="slubcolor">Willkommen im Virtuellen Kartenforum 2.0</h2>
		    <br>
		    <div class="vk2GeorefOverview">
		    	
		    	###
		    	### Occurrence georeferenced messtischblaetter
		    	###
		    	
		    	<div class="vk2GeorefResultsOverviewContainer">
			    	<h4>Aktuelle Georeferenzierungsprojekt</h4>
			    	<p>
			    		Aktuell werden ca. 6000 Messtischblätter des historischen Deutschlands georeferenziert. Von diesen sind bisher ${occurrence_mtbs} georeferenziert.
			    		Helfen Sie mit damit es noch mehr werden. 
			    	</p>
		    	</div>
		    	% endif
		    	
		    	##
		    	## List of users ranked by there georeference achievments
		    	##
		    	% if paginator.items:
		    	
		    	
		    	<div class="vk2GeorefUserRankingContainer">
			    	<h4>Aktivste Georeferenzierer</h4>
			    	
			    	<ol class="vk2GeorefUserRanking">
							
							% for user in paginator.items:
				    		<li>
				    			<span class="name">${user.vorname} ${user.nachname}</span>
				    			<span class="points">${user.bonuspunkte}</span>
				    		</li>
				    		% endfor
			    	</ol>	
			    </div>   
			    % endif
			     		
		    </div>
		    <div>
		    	<span>Willkommensseite in Zukunft nicht mehr anzeigen</span>
		    	<input type="checkbox" id="deactivateWelcomePage" name="deactivateWelcomePage"> 
		    </div>
		</div>
    </body>
</html>
