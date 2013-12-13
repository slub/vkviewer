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
    		// event behavior for deactivation welcome page
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
	   		
	   		$('#vk2WelcomePageStart').click(function(event){
	   			parent.$.fancybox.close();
	   		});	   		
	   	});
    </script>  
	<body>
		<div class="vk2WelcomePage">
			<div class="vk2WelcomePageBody">
				<div class="leftContainer">
					<div class="inner">
						<img class="logo" src="${request.static_url('vkviewer:static/images/welcome_logo.png')}" />
					</div>
				</div>
				
				<div class="rightContainer">
					<div class="inner">
						<span class="slubcolor heading"><b>Willkommen im neuen virtuellen Kartenforum.</b></span><br>
						<p>
							Hier ein Introtext der kurz erklärt was es hier zu gewinnen gibt und was wir besser können als alle Anderen.
						</p>
					</div>
				</div>
				
				<div class="footerContainer">
				
					##
					## Progress visualisation of the georeferencing
					##
					% if occurrence_mtbs and possible_mtbs and georef_rel:
					<div class="vk2GeoreferenceProgressText">
						<div class="contentContainer" style="margin-left: ${georef_rel}%;">
							<div class="content" style="margin-left: -${georef_rel}%;">Bereits <b>${occurrence_mtbs}</b> von <b>${possible_mtbs}</b> Messtischblättern georeferenziert.</div>
						</div>
					</div>
					<div class="vk2GeoreferenceProgressBar">
						<div class="done" style="width: ${georef_rel}%;"></div>
						<div class="todo" style="margin-left: ${georef_rel}%;"></div>
					</div>
					% endif
				</div>
			</div>
			
			<div class="vk2WelcomePageFooter">
				<div class="RankingContainer">
					<div class="vk2GeoreferenceRanking">
						<p>Die Top-Georeferenzierer:</p>
						
						<ol>
						
							##
		    				## List of users ranked by there georeference achievments
		    				##
		    				% if paginator.items:
		    				
		    					% for user in paginator.items:
									<li>
										<span><b>${user.vorname} ${user.nachname}:</b> ${user.bonuspunkte} Punkte</span> 
									</li>
								% endfor
								
							% endif
							<span class="furtherItems">[...]</span> 
						</ol>
					</div>
					<div class="closeContainer">
						<span id="vk2WelcomePageStart" class="vk2WelcomePageStart">Jetzt mithelfen und selbst Punkte sammeln.</span>
						<a href="${request.route_url('faq')}" class="vk2FooterLinks">So einfach geht's</a>
					</div>
				</div>
				<div class="SkipPageContainer">
					<div class="inner">
						<input type="checkbox" id="deactivateWelcomePage" name="deactivateWelcomePage"> 
		    			<span>Diese Begrüßung zukünftig nicht mehr anzeigen.</span>	    			
		    		</div>
				</div>
			</div>
		</div>    
    </body>
</html>
