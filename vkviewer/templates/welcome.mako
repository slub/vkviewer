# -*- coding: utf-8 -*-
<%inherit file="basic_page.mako" />

<%block name="header_content">
	<style>
		.vk2WelcomePageBody .vk2GeoreferenceProgressText .content:after { left: ${georef_rel}%; }
	</style>
	<script>
		goog.require('vk2.utils');
	</script>
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
						<span class="slubcolor heading"><b>Willkommen im neuen Portal<br> des virtuellen Kartenforum 2.0.</b></span><br>
						<p>
							Das Portal des virtuellen Kartenforums 2.0. wird im Rahmen des gleichnamigen DFG Projektes entwickelt. 
							Aktuell befindet es sich in der Beta-Phase. Es soll einen Zugriff auf georeferenzierte sowie Werkzeuge 
							zur Georeferenzierung von Messtischblättern bieten. Sie sind herzlich eingeladen an der Georeferenzierung
							von Messtischblättern mit zuarbeiten.
						</p>
					</div>
				</div>
				
				<div class="footerContainer">
				
					##
					## Progress visualisation of the georeferencing
					##
					% if occurrence_mtbs and possible_mtbs and georef_rel:
					<div class="vk2GeoreferenceProgressText">
						## if georef_rel > 72 set 72 as max value
						% if georef_rel > 72:
						<div class="contentContainer" style="margin-left: 72%;">
							<div class="content" style="margin-left: -35%;">Bereits <b>${occurrence_mtbs}</b> von <b>${possible_mtbs}</b> Messtischblättern georeferenziert.</div>
						</div>
						% else:
						<div class="contentContainer" style="margin-left: ${georef_rel}%;">
							<div class="content" style="margin-left: -${georef_rel}%;">Bereits <b>${occurrence_mtbs}</b> von <b>${possible_mtbs}</b> Messtischblättern georeferenziert.</div>
						</div>
						% endif
						
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
		    			<label for="deactivateWelcomePage">Diese Begrüßung zukünftig nicht mehr anzeigen.</label>	    			
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
				vk2.utils.setCookie('welcomepage', welcomePageStatus);
	   		});
	   		
	   		$('#vk2WelcomePageStart').click(function(event){
	   			parent.$.fancybox.close();
	   		});	   		
	   	});
    </script> 
</%block>
