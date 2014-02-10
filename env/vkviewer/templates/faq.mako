<%inherit file="basic_page_slim.mako" />

<%block name="header_content">
  		<link rel="stylesheet" type="text/css" href="${request.static_url('vkviewer:static/lib/min/css/vkviewer-libarys.min.css')}" media="screen" />
		<link rel="stylesheet" type="text/css" href="${request.static_url('vkviewer:static/css/vk2/templates/template_pages.css')}" />   	
</%block>

<%block name="body_content">
	<div class="faq page-container">
		<div class="panel-group faq" id="accordion">
			<h2 class="slubcolor">${_('faq_main_heading')}</h2>
  			<br>
  			Wir freuen uns Sie im Virtuellen Kartenforum 2.0 Willkommen zu heisen und wünschen Ihnen viel Spass. Antworten auf verschiedene Fragen
  			finden Sie hier auf unserer FAQ-Seite. Im Falle weiterer Fragen schauen Sie sich nicht uns eine 
  			<a href="mailto:Jacob.Mendt@slub-dresden.de">Nachricht</a> zu kommen zu lassen.<br><br>
  			
  			<!-- FAQ search messtischblatt -->
			<div class="panel panel-default">
				<div class="panel-heading">
					<h4 class="panel-title slubcolor">
						<a data-toggle="collapse" data-parent="#accordion" href="#collapse-search">Suche von Messtischblättern</a>
					</h4>
				</div>
				<div id="collapse-search" class="panel-collapse collapse">
					<div class="panel-body">
					
						Im Portal des Virtuellen Kartenforum 2.0 können aktuell über 1000 georeferenzierte Karten gesucht und 
						visiualisiert werden. Die Suche ist dabei sowohl über eine Navigation in der Karte als auch die Nutzung
						der Ortsnamenssuche in der Kopfzeile möglich. <br><br>
						
						<div class="panel-group" id="accordionSearch">
						
							<!-- Search georeference maps over map navigation -->
							<div class="panel panel-default">
								<div class="panel-heading">
									<h5><a data-toggle="collapse" data-parent="#accordionSearch" href="#collapse-search-map-navigation">Suche über Kartennavigation</a></h5>
								</div>	
								<div id="collapse-search-map-navigation" class="panel-collapse collapse in">
									<div class="panel-body">
										<div class="media">
											<a class="pull-left" href="${request.route_url('home_login')}?georef=on">
												<img class="media-object" src="${request.static_url('vkviewer:static/images/thumbnail.png')}" alt="...">
											</a>
											<div class="media-body">
												Durch das Drücken und Halten der linken Maustaste können Sie die Karte verschieben. Außerdem können Sie in die Karte hinein- oder
												herauszoomen, indem Sie das Mausrad verwenden oder auf das "+" oder "-" Zeichen am oberen linken Kartenrand klicken. Haben Sie 
												einen gewünschten Raumausschnitt gewählt, können Sie durch ein Klicken auf das Suchsymbol (siehe Abbildung) die Messtischblatt suche aktivieren.
												Diese zeigt die Messtischblätter an, die für den ausgewählten Raumausschnitt georeferenziert vorliegen. Außerdem wird die räumliche
												Ausdehnung der Messtischblätter auf der Karte angezeigt. Führt man die Maus über ein Messtischblätteintrag in der Tabelle, so wird dessen 
												Raumausschnitt in der Karte hervorgehoben. Klickt man auf das Messtischblatt wird es in der Karte fokussiert.
											</div>
										</div>
										<div class="media">
											<a class="pull-right" href="${request.route_url('home_login')}?georef=on">
												<img class="media-object" src="${request.static_url('vkviewer:static/images/thumbnail.png')}" alt="...">
											</a>
											<div class="media-body">
												Durch Betätigung der Zeitleiste im Suchbereich unten (siehe Abbildung) kann außerdem der Zeitbereich, 
												für welchen Messtischblätter angezeigt werden sollen, eingeschränkt werden. Standardmäßig ist dieser 
												auf den Maximalbereich eingestellt. 
											</div>
										</div>
									</div>
								</div>
							</div>
							
							<!-- Search georeference maps over placename -->
							<div class="panel panel-default">
								<div class="panel-heading">
									<h5><a data-toggle="collapse" data-parent="#accordionSearch" href="#collapse-search-placename">Ortsnamenssuche</a></h5>
								</div>	
								<div id="collapse-search-placename" class="panel-collapse collapse">
									<div class="panel-body">
										<div class="media">
											<a class="pull-left" href="${request.route_url('home_login')}?georef=on">
												<img class="media-object" src="${request.static_url('vkviewer:static/images/thumbnail.png')}" alt="...">
											</a>
											<div class="media-body">
												In der Suchleiste (oben mittig) kann ein Ortsname eingegeben werden, zu welchem man Messtischblätter finden
												möchte. Dieser wird anschließend mit einer Ortsnamensdatenbank abgeglichen und verschiedene Vorschläge von 
												zutreffenden Ortsnamen gegeben. Nach Auswahl eines Vorschlages, wird der entsprechende Ort in der Karte fokussiert.
												Anschließend können die vorhandenen Messtischblätter wie <a data-toggle="collapse" data-parent="#accordionSearch" 
												href="#collapse-search-map-navigation">oben dargestellt</a> ermittelt werden.
											</div>
										</div>
									</div>
								</div>
							</div>
							
						</div>
						
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
						
						Die Darstellung von georeferenzierten Messtischblättern erfolgt über ihren räumlichen und zeitlichen Bezug. Mit Hilfe der <a data-toggle="collapse" 
						data-parent="#accordion" href="#collapseOne">Suche-Werkzeuge</a> kann der entsprechende räumliche Ausschnitt und die zeitliche Ausdehnung ermittelt werden.<br>
						Auf der Karte werden die georeferenzierten Messtischblätter als Layer dargestellt die sich im Layer-Menu steuern lassen. Dabei umfasst ein Layer immer alle 
						georeferenzierten Messtischblätter eines Zeitschnittes. Dargestellt werden auf der Karte allerdings nur jene Messtischblätter die den aktuellen Kartenausschnitt
						beschreiben.
						<br><br>
						
						<div class="panel-group" id="accordion-display">
						
							<!-- add layer to map -->
							<div class="panel panel-default">
								<div class="panel-heading">
									<h5><a data-toggle="collapse" data-parent="#accordionSearch" href="#collapse-add-layer">Layer zu Karte hinzufügen.</a></h5>
								</div>	
								<div id="collapse-add-layer" class="panel-collapse collapse in">
									<div class="panel-body">
										<div class="media">
											<a class="pull-left" href="${request.route_url('home_login')}?georef=on">
												<img class="media-object" src="${request.static_url('vkviewer:static/images/thumbnail.png')}" alt="...">
											</a>
											<div class="media-body">
												Im Such-Menu können durch Eingabe eines entsprechenden Zeitstempels (siehe Abbildung) und anschließenden 
												Klicken auf den Button "Zeitschnitt darstellen", Layer zur Karte hinzugefügt werden. Aktuell sind nur 
												Jahreszahlen als Zeitstempel valide.
											</div>
										</div>
									</div>
								</div>
							</div>
							
							<!-- layer menu -->
							<div class="panel panel-default">
								<div class="panel-heading">
									<h5><a data-toggle="collapse" data-parent="#accordionSearch" href="#collapse-layer-menu">Layer-Menu</a></h5>
								</div>	
								<div id="collapse-layer-menu" class="panel-collapse collapse">
									<div class="panel-body">
										<div class="media">
											<a class="pull-left" href="${request.route_url('home_login')}?georef=on">
												<img class="media-object" src="${request.static_url('vkviewer:static/images/thumbnail.png')}" alt="...">
											</a>
											<div class="media-body">
												Klickt man auf den in der Abbildung dargestellten Button, wird das Layer-Menu aktiviert. In diesem werden 
												die Layer angezeigt, die über das Such-Menu zur Karte hinzugefügt wurden. Durch Betätigen der Checkbox können
												die Layer aktiviert oder deaktiviert werden. Klickt man auf den Layer-Namen werden weitere Optionen angezeigt. 
												So kann der Zeitstempel des Layer verändert werden und die Transparenz (Opacity).
											</div>
										</div>
										<div class="media">
											<a class="pull-right" href="${request.route_url('home_login')}?georef=on">
												<img class="media-object" src="${request.static_url('vkviewer:static/images/thumbnail.png')}" alt="...">
											</a>
											<div class="media-body">
												Klickt man auf der Karte auf ein Messtischblatt so wird sein digitales Original dargestellt. Dieses kann als JPG heruntergeladen 
												werden oder man kann im <a href="http://kartenforum.deutschefotothek.de">Kartenforum</a> weitere Informationen dazu erhalten
											</div>
										</div>
									</div>
								</div>
							</div>							
							
														
						</div>
					</div>
				</div>
			</div>
						
			<!-- FAQ Georeferenzierungsprozess -->
			<div class="panel panel-default">
				<div class="panel-heading">
					<h4 class="panel-title slubcolor">
						<a data-toggle="collapse" data-parent="#accordion" href="#collapse-georef">Georeferenzierung von Messtischblättern</a>
					</h4>
				</div>
				<div id="collapse-georef" class="panel-collapse collapse">
					<div class="panel-body">
					
						Aktuell bietet das Virtuelle Kartenforum 2.0 den Zugriff auf über 6000 digitalisierte Messtischblätter an. 
						Allerdings sind noch nicht alle georeferenziert, weshalb wir auf Ihre Hilfe angewiesen sind. <br>
						Bei der Georeferenzierung der Messtischblätter ermittelt Sie die Eckpunkte der Karten, auf dessen Basis
						wir die Georeferenzierung durchführen können. Bitte nehmen Sie sich etwas Zeit um die Anleitung für den Georeferenzierungsprozess
						zu studieren. Wir danken für Ihre Hilfe.<br><br>
						
						Für die Georeferenzierung von Messtischblättern müssen Sie im Virtuellen Kartenforum 2.0 als Nutzer registriert sein.
						
						<br><br>
						
						<div class="panel-group" id="accordionGeoref">
							<div class="panel panel-default">
								<div class="panel-heading">
									<h5><a data-toggle="collapse" data-parent="#accordionGeoref" href="#collapse-georef-start">Starte Georeferenzierungsprozess</a></h5>
								</div>
								<div id="collapse-georef-start" class="panel-collapse collapse">
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
									<h5><a data-toggle="collapse" data-parent="#accordionGeoref" href="#collapse-georef-process">Erfassung der Georeferenzierungsparameter</a></h5>
								</div>
								<div id="collapse-georef-process" class="panel-collapse collapse">
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
									<h5><a data-toggle="collapse" data-parent="#accordionGeoref" href="#collapse-georef-validate">Validierung der Georeferenzierung</a></h5>
								</div>
								<div id="collapse-georef-validate" class="panel-collapse collapse">
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
	    
	   	<!-- js librarys via cdn -->    
      	<script src="//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>
      	<script src="//netdna.bootstrapcdn.com/bootstrap/3.0.3/js/bootstrap.min.js"></script>   
      	
	   	<!-- js code -->
        <%block name="js_content" /> 
        ${next.body()}
        
	</div>
</%block>

