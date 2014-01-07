# -*- coding: utf-8 -*-
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en"
      xmlns:tal="http://xml.zope.org/namespaces/tal"
      xmlns:i18n="http://xml.zope.org/namespaces/i18n"
      i18n:domain="vkviewer">
    <head>
        <META HTTP-EQUIV="Content-Type" CONTENT="text/html; CHARSET=UTF-8">
        <title>Virtuelles Kartenforum 2.0</title>
        
        <link rel="stylesheet" type="text/css" href="${request.static_url('vkviewer:static/lib/jquery-ui-1.10.3/themes/base/jquery-ui.css')}" />
		<link rel="stylesheet" type="text/css" href="${request.static_url('vkviewer:static/lib/bootstrap-3.0.3/css/bootstrap.css')}"></link>
        <link rel="stylesheet" type="text/css" href="${request.static_url('vkviewer:static/css/vk2/templates/styles.css')}" /
        <link rel="stylesheet" type="text/css" href="${request.static_url('vkviewer:static/css/vk2/templates/faq.css')}" />
        <link rel="stylesheet" type="text/css" href="${request.static_url('vkviewer:static/css/vk2/templates/faqLoggedIn.css')}" />               
      	<script src="${request.static_url('vkviewer:static/lib/jquery.js')}"></script>
      	<script src="${request.static_url('vkviewer:static/lib/jquery-ui.js')}"></script>
      	<script src="${request.static_url('vkviewer:static/lib/bootstrap-3.0.3/js/bootstrap.js')}"></script>
    </head>
    
    <script>
   	
    </script>  
	<body>
	
		<div class="panel-group" id="accordion">
			<h2 class="slubcolor">${_('faq_main_heading')}</h2>
  			<br>
  			Wir freuen uns Sie im Virtuellen Kartenforum 2.0 Willkommen zu heisen und wünschen Ihnen viel Spass. Antworten auf verschiedene Fragen
  			finden Sie hier auf unserer FAQ-Seite. Im Falle weiterer Fragen schauen Sie sich nicht uns eine 
  			<a href="mailto:Jacob.Mendt@slub-dresden.de">Nachricht</a> zu kommen zu lassen.<br><br>
  			
			<div class="panel panel-default">
				<div class="panel-heading">
					<h4 class="panel-title slubcolor">
						<a data-toggle="collapse" data-parent="#accordion" href="#collapseOne">Suche von Messtischblättern</a>
					</h4>
				</div>
				<div id="collapseOne" class="panel-collapse collapse">
					<div class="panel-body">
						Comming soon!
					</div>
				</div>
			</div>

			<div class="panel panel-default">
				<div class="panel-heading">
					<h4 class="panel-title slubcolor">
						<a data-toggle="collapse" data-parent="#accordion" href="#collapseTwo">Darstellung von Messtischblättern</a>
					</h4>
				</div>
				<div id="collapseTwo" class="panel-collapse collapse">
					<div class="panel-body">
						Comming soon!
					</div>
				</div>
			</div>
						
			<!-- FAQ Georeferenzierungsprozess -->
			<div class="panel panel-default">
				<div class="panel-heading">
					<h4 class="panel-title slubcolor">
						<a data-toggle="collapse" data-parent="#accordion" href="#collapseThree">Georeferenzierung von Messtischblättern</a>
					</h4>
				</div>
				<div id="collapseThree" class="panel-collapse collapse in">
					<div class="panel-body">
					
						Aktuell bietet das Virtuelle Kartenforum 2.0 den Zugriff auf über 6000 digitalisierte Messtischblätter an. 
						Allerdings sind noch nicht alle georeferenziert, weshalb wir auf Ihre Hilfe angewiesen sind. <br>
						Bei der Georeferenzierung der Messtischblätter ermittelt Sie die Eckpunkte der Karten, auf dessen Basis
						wir die Georeferenzierung durchführen können. Bitte nehmen Sie sich etwas Zeit um die Anleitung für den Georeferenzierungsprozess
						zu studieren. Wir danken für Ihre Hilfe.<br><br>
						
						<div class="panel-group" id="accordionGeoref">
							<div class="panel panel-default">
								<div class="panel-heading">
									<h5><a data-toggle="collapse" data-parent="#accordionGeoref" href="#collapseGeorefStart">Starte Georeferenzierungsprozess</a></h5>
								</div>
								<div id="collapseGeorefStart" class="panel-collapse collapse in">
									<div class="panel-body">
										<div class="media">
											<a class="pull-left" href="${request.route_url('home_login')}?georef=on">
												<img class="media-object" src="${request.static_url('vkviewer:static/images/thumbnail.png')}" alt="...">
											</a>
											<div class="media-body">
												Durch einen Klick auf das links dargestellte Symbol wird das Gitter der zur Verfügung stehenden Messtischblätter
												auf der Karte dargestellt. Durch die Navigation auf der Karte oder einen Blattnummernsuche (beispielsweise "40_40") 
												im Kopffeld der Seite können Sie unreferenzierte Messtischblätter für Ihren gewünschten Raumausschnitt finden. Anschließend
												können Sie durch einen Klick auf die entsprechende Blattzelle einen Auswahldialog öffnen.
											</div>
										</div>
										<div class="media">
											<a class="pull-right" href="#">
												<img class="media-object" src="${request.static_url('vkviewer:static/images/faq_georefStart_1.png')}" alt="...">
											</a>
											<div class="media-body">
												Der folgende Dialog gibt Ihnen einen Auswahl an Messtischblättern, für welche zum gegebenen Zeitpunkt keine 
												Informationen zu den Eckpunkten vorhanden sind. Haben Sie sich entschlossen, für eine der Karten diese Parameter
												zu erfassen klicken Sie auf diese und Sie werden zum nächsten Arbeitsschritt weitergeführt.
											</div>
										</div>
									</div>
								</div>
							</div>
							
							<div class="panel panel-default">
								<div class="panel-heading">
									<h5><a data-toggle="collapse" data-parent="#accordionGeoref" href="#collapseGeorefCapture">Erfassung der Georeferenzierungsparameter</a></h5>
								</div>
								<div id="collapseGeorefCapture" class="panel-collapse collapse">
									<div class="panel-body">
										<div class="media">
											<a class="pull-left" href="${request.route_url('home_login')}?georef=on">
												<img class="media-object" src="${request.static_url('vkviewer:static/images/uebersicht_kleiner.jpg')}" alt="...">
											</a>
											<div class="media-body">
												In diesem Arbeitsschritt sollen Sie die eigentlichen Eckpunkte (siehe Abbildung links) der Karten ermitteln. Diese 
												können anschließend mit den Eckpunktkoordinaten serverseitig abgeglichen werden und somit Passpunkte, welche die Basis
												 für die Anwendung von Georeferenzierungsalgorithmen bilden erzeugt werden. Dazu finden Sie auf der linken Seite eine 
												Toolbox, die verschiedene Werkzeuge für das setzen der Eckpunkte bereithält. Wählen Sie zuerst das Werkzeug "Eckpunkt setzen"
												 aus und navigieren Sie anschließend zu den entsprechenden Eckpunkten auf der Karte. Durch einen
												Klick auf die Karte können sie die Eckpunkte markieren. Im Falle eines falschen Klickes können Sie Ihr Ergebnis mit den 
												Werkzeugen "Eckpunkt verschieben" oder "Eckpunkt löschen" korrigieren. Haben Sie 4 Eckpunkte gesetzt können Sie die Ergebnisse 
												entweder ohne Vorschau absenden und sich das Ergebnis zu einem späteren Zeitpunkt anschauen oder Sie können sich eine Vorschau
												der Georeferenzierung auf Basis Ihrer Parameter erzeugen lassen. In diesem Fall kommen Sie zum nächsten Schritt, der Validierung
												Ihrer Georeferenzierungsergebnisse.
												<br>
												<br><u>Tipp:</u> Durch Shift+Linksklicken (Box aufziehen) erreichen Sie ein schnelleres Hereinzoomen
												<br><u>Tipp:</u> Für die Navigation auf der Karte können Sie ebenfalls die links oben dargestellten NavigationBar nutzen.<br>						 
											</div>
										</div>
									</div>
								</div>
							</div>
							
							<div class="panel panel-default">
								<div class="panel-heading">
									<h5><a data-toggle="collapse" data-parent="#accordionGeoref" href="#collapseGeorefValidate">Validierung der Georeferenzierung</a></h5>
								</div>
								<div id="collapseGeorefValidate" class="panel-collapse collapse">
									<div class="panel-body">
										Auf der folgenden Seite finden Sie auf der Rechts das Ergebnis Ihrer Georeferenzierung. Sind Sie zufrieden mit dem Ergebnis 
										klicken Sie links in der Toolbox auf "Georeferenzierung bestätigen". Sind Sie unzufrieden mit dem Ergebnis der Georeferenzierung
										können Sie auf der linken Seite Ihre bisherige Arbeit noch einmal revidieren und sich anschließend ein neue Vorschau für
										Ihre Georeferenzierungsparameter berechnen lassen. Bleibt der Fehler bestehen können Sie durch einen Klick auf "Fehler melden"
										Ihre Problem mitteilen und wir versuchen so schnell wie möglich auf diese zu reagieren.							
									</div>
								</div>
							</div>
														
						</div>
					</div>
				</div>
			</div>
					


	    </div>
    </body>
</html>
