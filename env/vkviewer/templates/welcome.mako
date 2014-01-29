<%inherit file="basic_page.mako" />

<%block name="header_content">
        <link rel="stylesheet" type="text/css" href="${request.static_url('vkviewer:static/css/vk2/templates/styles.css')}" /> 
        <link rel="stylesheet" type="text/css" href="${request.static_url('vkviewer:static/css/vk2/templates/welcome.css')}" />
</%block>

<%block name="body_content">
	<div class="welcome-page">
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
	</div>
		

</%block>

<%block name="js_content">
    <script>
    	$(document).ready(function(){
    		// event behavior for deactivation welcome page
			$('#deactivateWelcomePage').change(function(){				
				var welcomePageStatus = $(this).prop('checked') ? 'off' : 'on';
				VK2.Utils.setCookie('welcomepage', welcomePageStatus);
	   		});
	   		
	   		$('#vk2WelcomePageStart').click(function(event){
	   			parent.$.fancybox.close();
	   		});	   		
	   	});
    </script> 
</%block>
