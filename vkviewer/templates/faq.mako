# -*- coding: utf-8 -*-
<%inherit file="basic_page.mako" />

<%block name="header_content">	 
	<style>
		.faq {
			font-family: "Helvetica Neue",Helvetica,Arial,sans-serif;
			font-size: 14px;
			line-height: 1.42857143;
			color: #333;
		}
		
		/* header styling */
		header {text-align: center; color: #fff;}
		.header-faq {
			background: rgba(255,52,52,0.9);
		}
		.header-faq > div { padding-top: 10px; padding-bottom: 10px; }
		.header-faq .logo {
			display: block;
			margin: 0 auto 20px;
		}
		.header-faq .intro-text .name {
			display: block;
			text-transform: uppercase;
			font-family: Montserrat,"Helvetica Neue",Helvetica,Arial,sans-serif;
			font-size: 2em;
			font-weight: 700;
		}
		
		/* section styling */
		section > div { position: relative; float: left; display: block;}
		p { margin: 0 0 10px;}
		h1, .h1, h2, .h2, h3, .h3, h4, .h4 { margin-top: 20px; margin-bottom: 10px; color: black;}
		h1 { color: #f33;}
		img { margin: 10px; }
		.section-header {
			padding-top: 20px;
			margin-top: 0;
			padding-bottom: 9px;
			margin: 40px 0 20px;
			border-bottom: 1px solid #eee;
			font-size: 36px;
		}
		.bs-callout{
			padding: 20px;
			margin: 20px 0;
			border: 1px solid #eee;
			border-left-width: 5px;
			border-radius: 3px;
		}
		.bs-callout-warning  { border-left-color: #f0ad4e;}
		
		/* sidebar styling */
		#faq-affix-sidebar {
			position: fixed;
		}
		
		.faq-sidebar { 
			/*position: fixed; */
			padding-left: 0;
			margin-bottom: 0;
			list-style: none;
		}
		.nav.faq-sidebar > li > a {
			display: block;
			padding: 4px 20px;
			font-size: 13px;
			font-weight: 500;
			color: #999;
		}
		
		.nav.faq-sidebar .nav {
			padding-bottom: 10px;
		}
		
		.nav.faq-sidebar .nav > li > a {
			display: block;
			padding: 4px 20px;
			padding-top: 1px;
			padding-bottom: 1px;
			padding-left: 30px;
			font-size: 12px;
			font-weight: 400;
			color: #999;
		}
	</style>
</%block>

<%block name="body_content">
	<div class="faq">

		<div class="container">
			<div class="row">
			
				<!-- content container -->
				<div class="col-md-9" role="main">
					
					<!-- Suche Karten -->
					<section id="faq-search-maps">
						<h1 class="section-header">Suche von Karten</h1>
						<p>Im Portal des Virtuellen Kartenforum 2.0 können aktuell über 2500 georeferenzierte Karten gesucht und 
						dargestellt werden. Durch die Navigation auf der Karte oder die Eingabe eines Ortsnamen bzw. einer Kartenblattnummer 
						im Suchfeld des raumzeitlichen Suchmodules (linker Bereich / Hauptseite) kann der relevante Raumausschnitt ausgewählt werden. 
						In der Liste des raumzeitlichen Suchmodules werden außerdem die für die raumzeitlichen Suchkriterien relevanten Suchergebnisse
						dargestellt. Mit Hilfe des Zeitschiebers kann außerdem die relevante Zeitperiode für die Suche eingeschränkt werden.</p>
						
						<h2 class="section-header-sub" id="faq-search-maps-spatialsearch">Raumzeitliches Suchmodule</h2>
						<!-- Ortsnamens- / Kartenblattsuche -->
						<div>
							<h4>Ortsnamens- / Kartenblattsuche</h4>
  							<a class="pull-left" href="#">
    							<img class="media-object" src="${request.static_url('vkviewer:static/images/faq/placenamesearch.png')}" alt="Ortsnamens- / Kartenblattsuche">
  							</a>
    						<p>
    							Wird in das eine Eingabefeld ein Ortsname eingetippt, bietet die Anwendung eine Auswahlliste möglicher Ortsnamen an. Wird ein Ortsname
    							aus der Liste durch die Maus oder die Tastur ausgewählt springt die Karte zu diesem Ort. Alternativ kann auch eine Kartenblattnummer wie
    							<code>49_48</code> eingegeben werden. Auch in diesem Fall springt die Karte zu dem entsprechenden Raumausschnitt.
    						</p>
						</div>
						
						<!-- Timeslider -->
						<div>
							<h4>Zeitschieber</h4>
  							<a class="pull-left" href="#">
    							<img class="media-object" src="${request.static_url('vkviewer:static/images/faq/timeslider.png')}" alt="Zeitschieber">
  							</a>
    						<p>
    							Durch den Zeitschieber lässt sich der Suchzeitraum einschränken. Aktuell bietet das Portal Karten zwischen den Jahren 
    							1868 und 1945 an. Diese Jahre bilden daher den maximalen Zeitraum ab. Das Einschränken des Suchzeitraum wirkt sich auch 
    							auf die angezeigten Ergebnisse in der Suchliste aus.
    						</p>
						</div>
						
						<!-- Suchliste -->
						<div>
							<h4>Suchliste</h4>
  							<a class="pull-left" href="#">
    							<img class="media-object" src="${request.static_url('vkviewer:static/images/faq/searchlist.png')}" alt="Suchliste">
  							</a>
    						<p>
    							In der Suchliste werden die gefunden Karten für den entsprechen Raumausschnitt und Suchzeitraum dargestellt. Im Kopf der 
    							Suchliste werden die Suchtreffer angezeigt. Darunter kann man die Ergebnisse mit Hilfe der Buttons nach "Titel" oder "Jahr"
    							sortieren. Durch das Klicken auf ein Suchergebnis, wird die entsprechende historische Karte auf der Hauptkarte dargestellt.
    							<br><br>
    							Die einzelnen Suchergebnisse werden in der Liste mit ihrem Kurztitel, ihrem Zeitstempel (Datierung) und ihrem Maßstab 
    							abgebildet. Außerdem wird ein Thumbnail der entsprechenden Karte angezeigt. Führt man den Mauszeiger über einen Sucheintrag, 
    							so wird die räumliche Ausdehnung der Karte auf der Hauptkarte mittels eines Polygon dargestellt.
    						</p>
						</div>			
						
									
						<h2 class="section-header-sub" id="faq-search-maps-mapnavigation">Kartennavigation</h2>
						<a class="pull-left" href="#">
    						<img class="media-object" src="${request.static_url('vkviewer:static/images/faq/mapnavigation.png')}" alt="Kartennavigation">
  						</a>
    					<p>
    						In der Abbildungs links werden die verschiedenen Navigation Werkzeuge für die Karte dargestellt. Durch drücken des <b>+</b>
    						oder des <b>-</b> kann in die Karte herein oder heraus gezoomt werden. Die <b>Lupe</b> aktiviert eine Kartenlupe. Fährt man 
    						mit dieser über eine historische Karte, wird für den Lupenausschnitt die aktuelle <a href="http://www.openstreetmap.org/" 
    						target="_blank">OpenStreetMap</a> Karte angezeigt. Durch das Halten der Shift-Taste sowie das parellel drücken und ziehen der 
    						der Maus auf der Karte, kann die Karte rotiert werden. Durch das Klicken auf den Button mit der <b>Nadel</b> wird die Karte
    						anschließend wieder genordet. Der letzte Button ermöglicht die Erstellung eines Linkes, mit welchem man die aktuelle Kartensicht
    						mit anderen Nutzern teilen kann.
    					</p>
					</section>
					<!-- /Suche Karten -->
					
					<!-- Verwaltung von Karten -->
					<section id="faq-control-maps">
						<h1 class="section-header">Verwaltung der eigenen Kartenauswahl</h1>
						<p>Durch die Auswahl einer Karte im raumzeitlichen Suchmodule wird diese der Hauptkarte und der Kartenverwaltung hinzugefügt. In der
						 Kartenverwaltung kann die Transparenz der Karte geändert werden, die Karte kann aktiviert und deaktiviert werden, es können andere verwandte
						 Karte hinzugefügt werden, die Karte kann von der eigenen Auswahl gelöscht werden und man kann die Reihenfolge der Darstellung der Karten auf 
						 der Hauptkarte überarbeiten. <br>
						 Außerdem kann der Nutzer durch das Klicken auf die Karte auf der Hauptkarte, die originale Ansicht dieses Blattes sowie eine kleine Auswahl an 
						 Metadaten darstellen.</p>
						
						<h2 class="section-header-sub" id="faq-control-maps-manage">Kartenverwaltung</h2>
						<!-- Kartenverwaltung -->
						<div>
							In Bearbeitung!
						</div>
					<!-- /Verwaltung von Karten -->
					
					<!-- Georeferenzierung von Karten -->
					<section id="faq-georef">
						<h1 class="section-header">Georeferenzierung von Karten (Messtischblättern)</h1>
						<p>Aktuell bietet das Virtuelle Kartenforum 2.0 den Zugriff auf über 6000 digitalisierte Messtischblätter. Für deren Georeferenzierung benötigen wir 
						Ihre Hilfe. <br>
						Ihre Aufgabe ist es dabei, die Eckpunkte des eigentlichen Karteninhaltes der Messtischblätter zu ermitteln. Mit Hilfe der Eckpunkte können wir 
						anschließend die Karten georeferenzieren. Wenn sie das erste mal im Virtuellen Kartenforum 2.0 den Georeferenzierungsclient nutzen, lesen Sie 
						sich bitte die Anleitung durch. Wir danken Ihnen für Ihre Hilfe.
						</p>
						<div class="bs-callout bs-callout-warning">
   							 <p>Bevor Sie im Virtuellen Kartenforum 2.0 georeferenzieren können, müssen Sie sich als Nutzer registrieren bzw. anmelden.</p>
  						</div> 

						<!-- Auswahl einer Karte für die Georeferenzierung -->
						<h2 class="section-header-sub" id="faq-georef-choose">Auswahl einer Karte für die Georeferenzierung</h2>
						<div>
  							<a class="pull-left" href="#">
    							<img class="media-object" src="${request.static_url('vkviewer:static/images/faq/georefchooser.png')}" alt="Aktiviere Georeferenzierung">
  							</a>
    						<p>
    							Durch einen Klick auf das Georeferenzierungsymbol in der rechten oberen Ecke, wird das Gitter der zur Verfügung stehenden Messtischblätter 
    							auf der Karte dargestellt. Die grauen Gitterzellen weisen dabei auf das vorhanden noch unreferenzierter Messtischblätter für diesen 
    							Raumausschnitt hin. Demgegenüber bedeuteten grüne Gitterzellen, dass für diesen Raumausschnitt bereits georeferenzierte Karte vorliegen. 
    							Durch einen Klick auf eine graue Gitterzelle öffnet sich ein Auswahlfenster, in welchem die entsprechenden unreferenzierten Messtischblätter
    							 für diese Gitterzelle angezeigt werden. Klickt man erneut auf eines der angezeigten Messtischblätter, wird man zur Georeferenzierungsansicht 
    							 weitergeleitet.
    						</p>
						</div>	
						
						<!-- Georeferenzierung -->
						<h2 class="section-header-sub" id="faq-georef-compute">Georeferenzierung</h2>
						<div>
  							<a class="pull-left" href="#">
    							<img class="media-object" src="${request.static_url('vkviewer:static/images/faq/uebersicht_kleiner.jpg')}" alt="Markiere Eckpunkte">
  							</a>
    						<p>
    							In der Georeferenzierungsansicht sollen die eigentlichen Eckpunkte der Karte ermittelt werden. Diese können anschließend mit den 
    							Eckpunktkoordinaten serverseitig abgeglichen werden und somit Passpunkte, welche die Basis für die Anwendung von 
    							Georeferenzierungsalgorithmen bilden erzeugt werden. Dazu finden Sie auf der linken Seite eine Toolbox, die verschiedene Werkzeuge 
    							für das setzen der Eckpunkte bereithält. Wählen Sie zuerst das Werkzeug "Eckpunkt setzen" aus und navigieren Sie anschließend
    							 zu den entsprechenden Eckpunkten auf der Karte. Durch einen Klick auf die Karte können sie die Eckpunkte markieren. 
    							 Im Falle eines falschen Klickes können Sie Ihr Ergebnis mit den Werkzeugen "Eckpunkt verschieben" 
    							 (hierzu entsprechenden Eckpunkt vor dem Bewegen durch einmaliges Klicken selektieren) oder "Eckpunkt löschen" korrigieren. 
    							 Nachdem setzen des 3 Eckpunktes wird Ihnen ein Testergebniss auf der rechten Karte angezeigt. Dieses aktualisiert sich mit jeden weiteren Punkt 
    							 oder durch das Drücken des Buttons "Vorschau aktualisieren". Haben Sie 4 Eckpunkte gesetzt können und sind mit dem Ergebnis zufrieden, können 
    							 Sie das Ergebnis absenden. Es wird anschließend zeitnah persistent georeferenziert und für andere Nutzer verfügbar gemacht.
    						</p>
						</div>	
					<!-- /Georeferenzierung von Karten -->
				</div>				
				<!-- /content container -->
				
				<!-- navigation container -->
				<div class="col-md-3">
					<div data-spy="affix" data-offset-top="210" id="faq-affix-sidebar">
						<ul class="nav faq-sidebar">
							<li>
								<a href="#faq-search-maps">Suche von Karten</a>
								<ul class="nav">
									<li><a href="#faq-search-maps-spatialsearch">Raumzeitliches Suchmodule</a></li>
									<li><a href="#faq-search-maps-mapnavigation">Kartennavigation</a></li>
								</ul>
							</li>
							<li>
								<a href="#faq-control-maps">Verwaltung der eigenen Kartenauswahl</a>
								<ul class="nav">
									<li><a href="#faq-control-maps-manage">Kartenverwaltung</a></li>
								</ul>
							</li>
							<li>
								<a href="#faq-georef">Georeferenzierung von Karten</a>
								<ul class="nav">
									<li><a href="#faq-georef-choose">Auswahl der Karte</a></li>
									<li><a href="#faq-georef-compute">Georeferenzierung</a></li>
								</ul>
							</li>
						</ul>
					</div>
				</div>				
				<!-- /navigation container -->
				
			</div>
		</div>
		
		<script>

		</script>
        
	</div>
</%block>

