# -*- coding: utf-8 -*-
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en"
      xmlns:tal="http://xml.zope.org/namespaces/tal"
      xmlns:i18n="http://xml.zope.org/namespaces/i18n"
      i18n:domain="vkviewer">
    <head>
        <META HTTP-EQUIV="Content-Type" CONTENT="text/html; CHARSET=UTF-8" />
        <META HTTP-EQUIV="cache-control" CONTENT="max-age=3600" />
        <title>Virtuelles Kartenforum 2.0 Upload Form</title>

		<!-- for development -->
		<link rel="stylesheet" href="${request.static_url('vkviewer:static/lib/css/bootstrap.min.css')}">		
		<link rel="stylesheet" type="text/css" href="${request.static_url('vkviewer:static/lib/css/jquery-ui-custom.min.css')}" media="screen" />
		<link rel="stylesheet" type="text/css" href="${request.static_url('vkviewer:static/css/styles.css')}" />
		<style>
			.thumb {
				height: 150px;
				border: 1px solid #000;
				margin: 10px 5px 0 0;
			}
			body { overflow: initial; }
			.container { margin: 30px auto 60px auto; }
			.content { margin-top: -50px; }
			h2 { border-bottom: 1px dotted #ccc; padding: 30px 0 10px 0; margin: 20px 0; clear: both; }
			h3 { font-size: 22px; color: #666; padding: 20px 0 0 0; margin: 10px 0; clear: both; }
			p { margin: 16px 0; }
			#mapdiv { width:px; height:200px; margin:10px; }
    		div.olControlAttribution { bottom:3px; }
    
   			#bbox_drag_instruction { height:1.5em; }
    		#bbox_adjust_instruction { height:1.5em; display:none;  }
		</style>
		<script src="http://www.openlayers.org/api/OpenLayers.js"></script>
		<script src="${request.static_url('vkviewer:static/lib/jquery.min.js')}"></script>
		<script src="${request.static_url('vkviewer:static/lib/bootstrap.min.js')}"></script>	
	    <script src="${request.static_url('vkviewer:static/lib/closure-library/closure/goog/base.js')}"></script>
	    <script src="${request.static_url('vkviewer:static/lib/closure-library/closure/goog/deps.js')}"></script>
	    <script src="http://svn.osgeo.org/metacrs/proj4js/trunk/lib/proj4js-combined.js"></script>
	    <script>
	    	goog.require('goog.dom');
	    	goog.require('goog.events');
	    </script>
	    <script>
	    	var vectors;
		    var box;
		    var transform;
		      
			Proj4js.defs["EPSG:4314"] = "+proj=longlat +ellps=bessel +datum=potsdam +no_defs";
	      
		      function endDrag(bbox) {
		      	var bounds = bbox.getBounds();
		        setBounds(bounds);
		        drawBox(bounds);
		        box.deactivate();
		        
		        document.getElementById("bbox_drag_instruction").style.display = 'none';
		        document.getElementById("bbox_adjust_instruction").style.display = 'block';        
		      }
		      
		      function dragNewBox() {
		        box.activate();
		        transform.deactivate(); //The remove the box with handles
		        vectors.destroyFeatures();
		        
		        document.getElementById("bbox_drag_instruction").style.display = 'block';
		        document.getElementById("bbox_adjust_instruction").style.display = 'none';
		        
		        setBounds(null); 
		      }
		      
		      function boxResize(event) {
		        setBounds(event.feature.geometry.bounds);
		      }
		      
		      function drawBox(bounds) {
		        var feature = new OpenLayers.Feature.Vector(bounds.toGeometry());
		 
		        vectors.addFeatures(feature);
		        transform.setFeature(feature);
		      }
		      
		      function toPrecision(zoom, value) {
		        var decimals = Math.pow(10, Math.floor(zoom/3));
		        return Math.round(value * decimals) / decimals;
		      }
		      
		      function setBounds(bounds) {

				
		      	if (bounds == null) {
		      	  document.getElementById("bbox_result").innerHTML = "";
		      	  
		      	} else {
		          b = bounds.clone().transform(map.getProjectionObject(), new OpenLayers.Projection("EPSG:4314"))
		          minlon = toPrecision(map.getZoom(), b.left);
		          minlat = toPrecision(map.getZoom(), b.bottom);    
		          maxlon = toPrecision(map.getZoom(), b.right);
		          maxlat = toPrecision(map.getZoom(), b.top);  
		                 
		          document.getElementById("bbox_result").innerHTML =
		                          "minlon=" + minlon + ", " +
		                          "minlat=" + minlat + ", " +
		                          "maxlon=" + maxlon + ", " +
		                          "maxlat=" + maxlat;  
		                          
		         document.getElementById("minlon").value = minlon;
		         document.getElementById("minlat").value = minlat;
		         document.getElementById("maxlon").value = maxlon;
		         document.getElementById("maxlat").value = maxlat;
		                        
		        }
		      }
		    
		      function init() {
		        map = new OpenLayers.Map({
		        	div: "mapdiv", projection: new OpenLayers.Projection("EPSG:4314"),});
		        var openstreetmap = new OpenLayers.Layer.OSM();
		        map.addLayer(openstreetmap);
		    
		
		        var lonlat = new OpenLayers.LonLat(13.57, 51.00).transform(
		            new OpenLayers.Projection("EPSG:4314"), // transform from 
		            new OpenLayers.Projection("EPSG:900913") // to Spherical Mercator
		          );
		
		        var zoom = 10;
		
		    
		        vectors = new OpenLayers.Layer.Vector("Vector Layer", {
		          displayInLayerSwitcher: false
		        });
		        map.addLayer(vectors);
		     
		        box = new OpenLayers.Control.DrawFeature(vectors, OpenLayers.Handler.RegularPolygon, {
		          handlerOptions: {
		            sides: 4,
		            snapAngle: 90,
		            irregular: true,
		            persist: true
		          }
		        });
		        box.handler.callbacks.done = endDrag;
		        map.addControl(box);
		     
		        transform = new OpenLayers.Control.TransformFeature(vectors, {
		          rotate: true,
		          irregular: true
		        });
		        transform.events.register("transformcomplete", transform, boxResize);
		        map.addControl(transform);
		        
		        map.addControl(box);
		        
		        box.activate();
		        
		        map.setCenter(lonlat, zoom);
		        
		      }
		      
		</script>
	    

    </head>
<%block name="body_content">
	<body onload="init();">

	<div class="container">	
		<div>
			<h2>Upload Service für Altkarten</h2>
			<p>Dieser Service ermöglicht es Ihnen, Altkarten hochzuladen und diese anschliessend auf unserer Webseite zu visualisieren und veröffentlichen. </p>
				<div class="panel panel-default">
					<form role="form" action="${request.route_url('upload', action='push')}" method="post" enctype="multipart/form-data" name="uploadForm">				
						## 	<div class="panel-body">
							<div class="form-group">
								<legend>Wählen Sie eine Karte aus</legend>
								<input type="hidden" name="MAX_FILE_SIZE" value="30000" /> <!-- MAX_FILE_SIZE muss vor dem Dateiupload Input Feld stehen -->
								<p><input type="file" id="file" name="file" /></p>
								<output id="list"></output>
							</div>
							
<!-------------------  BBox section----------------------------------------------------------->	
							<div class="control-label" id="bbox_drag_instruction">Bounding-Box zeichnen:</div>
    						<div class="control-label" id="bbox_adjust_instruction">BoundingBox anpassen oder neu zeichnen  <input type="button" value="neue BBox" onclick="dragNewBox();"></div>
  							<div id="mapdiv"></div>
  							<div class="form-group">
								<label for="bbox" class="control-label">Boundingbox: </label>
								<p id="bbox_result"> </p>
								<input type="text" id="minlon" name="minlon"/>
								<input type="text" id="minlat" name="minlat"/>
								<input type="text" id="maxlon" name="maxlon"/>
								<input type="text" id="maxlat" name="maxlat"/>
								<input type="hidden" id="epsg" name="epsg" value="4314"/>
							</div>
    						
    												
<!-------------------  metadata section----------------------------------------------------------->								
							<fieldset>
								<legend>Metadaten</legend>
								<div class="form-group">
									<label for="title" class="col-sm-3 control-label">Titel der Karte *</label>
									<div class="col-sm-9">
										<input type="text" name="title" class="form-control" id="title" pattern=".{3,}"
												placeholder="der Titel sollte aus mind. drei Buchstaben bestehen" required autofocus/>
									</div>
								</div>
								<div class="form-group">
									<label for="titleshort" class="col-sm-3 control-label">Kurztitel der Karte *</label>
									<div class="col-sm-9">
										<input type="text" name="titleshort" class="form-control" id="titleshort" 
												placeholder="Kurztitel" required autofocus />
									</div>
								</div>
								<div class="form-group">
									<label for="serientitle" class="col-sm-3 control-label">Serientitel</label>
									<div class="col-sm-9">
										<input type="text" name="serientitle" class="form-control" id="serientitle" 
												placeholder="Serientitel" />
									</div>
								</div>
								<div class="form-group">
									<label class="col-sm-3 control-label" value="">Kategorie </label>
									<div class="col-sm-9">
										<select id="kategorie" name="kategorie" class="form-control" required>
											<option value="">bitte auswählen</option>
											<option value="Altkarte">Altkarte</option>
											<option value="Stadtplan">Stadtplan</option>
											<option value="Ortsansicht">Ortsansicht</option>
											<option value="topographische Karte">topographische Karte</option>
											<option value="geologische Karte">geologische Karte</option>
											<option value="Gewaesserkarte">Gewässerkarte</option>
											<option value="Laenderkarte">Länderkarte</option>
											<option value="sonstige">sonstige Kategorie</option>
										</select>
									</div>	
								</div>
								<div class="form-group">
									<label for="description" class="col-sm-3 control-label">Beschreibung *</label>
									<div class="col-sm-9">
										<textarea class="form-control" rows="3" name="description" placeholder="Bitte beschreiben Sie Ihre Karte so detailliert wie möglich." id="description" required ></textarea>
									</div>
								</div>
								<div class="form-group">
									<label for="timepublish" class="col-sm-3 control-label">Datierung *</label>
									<div class="col-sm-9">
										<input type="text" name="timepublish" id="timepublish" class="form-control" pattern="^[0-9]{4}$"
												placeholder="bitte geben Sie eine Jahreszahl ein, z.B. 1815" id="jahr" required />
									</div>
								</div>	
								<div class="form-group">
									<label for="scale" class="col-sm-3 control-label">Massstab</label>
									<div class="col-sm-9">
										<input type="text" class="form-control" name="scale" id="scale" />
									</div>
								</div>
								<div class="form-group">
									<label for="imageowner" class="col-sm-3 control-label">Urheber *</label>
									<div class="col-sm-9">
										<input type="text" name="imageowner" class="form-control" id="imageowner" 
												placeholder="bitte geben Sie den Urheber der Karte ein" required />
									</div>
								</div>
								<div class="form-group">
									<label class="col-sm-3 control-label" required value="">Lizenz *</label>
									<div class="col-sm-9">
										<select id="imagelicence" name="imagelicence" class="form-control">
											<option value="CC0">CCO</option>
											<option value="CC-BY">CC-BY</option>
											<option value="CC-BY-SA">CC-BY-SA</option>
											<option value="CC-BY-ND">CC-BY-ND</option>
											<option value="CC-BY-NC">CC-BY-NC</option>
											<option value="CC-BY-SA-NC">CC-BY-SA-NC</option>
											<option value="CC-BY-NC-ND">CC-BY-NC-ND</option>
										</select>
										<span class="help-block">Informationen zu den einzelnen Lizenzen finden Sie <a href="http://creativecommons.org/licenses/" target=\"_blank\">hier.</a></span>
									</div>
								</div>
							</fieldset>
							
							<div class="form-group right">
	    						<button type="submit" id="submit" name="submit" class="btn btn-primary" value="Submit Content">Speichern</button>
	   							<button class="btn" >Abbrechen</button>
  							</div>
  							
  							
<!-------------------  error message ----------------------------------------------------------->		  							
  							<div class="error-container">
								<div class="alert alert-danger">
									% if error_msg: 
										${error_msg}
									% endif
									<br>
									<a href="${request.route_url('upload', action='form')}" class"alert-link">Laden Sie noch eine Karte hoch.</a>
								</div>		
							</div>  
							
  					</form>
    
					<b><div id="response"></div></b>
			</div>
			## end class="panel panel-default"
	</div>	
	## end "contact-formular page-container"
	</body>
</%block>		


	<!--  function to handle file upload----------------------------------------------------------->			
		## serialize the form as a JSON object
	<script type="text/javascript">
		
		
			$(document).ready(function() {			// prepare the form when the DOM is ready
				// Variable um Dateien unterzubringen
				var files;
				
				// Events hinzufuegen
				// $('input[type=file]').on('change', prepareUpload);
				$('uploadForm').on('submit', uploadFiles);
				
				// Datei holen und der files Variable hinzufuegen
				function prepareUpload(event){
					files = event.target.files;
					
					for (var i = 0, f; f = file[i]; i++){
					
						//Only process image files.
						if(!f.type.match('image.*')) {
							continue;
						}
					var reader = new FileReader();
						
						// Closure to capture the file information.
						reader.onload = (function(theFile) {
							
							return function(e) {
							//Render thumbnail.
							var span = document.createElement('span');
							span.innerHTML = ['<img class="thumb" src="', e.target.result,
                            '" title="', escape(theFile.name), '"/>'].join('');
							
							document.getElementById('list').insertBefore(span, null);
							};
						})(f);
						// Read in the image file as a data URL.
						reader.readAsDataURL(f);
					}
				}
				
				$('input[type=file]').on('change', prepareUpload);
					
				// Catch the form submit and upload the files
				function uploadFiles(event){
					event.stopPropagation(); // Stop stuff happening
					event.preventDefault(); // Totally stop stuff happening
				
				// Create a formdata object and add the files
					var data = new FormData();
					
					$.each(files, function(key, value){
						data.append(key, value);
					});
					
					$.ajax({
						url: "${request.route_url('upload',action='push')}",
						type: 'POST',
						data: data,
						cache: false,
						dataType: 'json',
						processData: false, // Don't process the files
						contentType: false, // Set content type to false as jQuery will tell the server its a query string request
						success:function(response_data, textStatus, jqXHR){
							console.log('Success');
							$("#response").text("");			//Ausgabe im response-div
							$("#response").append(response_ata);
						}
						error: function() {
									$("#response").html("<font color='red'> ERROR: unable to upload files</font>");
								}
					});
				}
		
			});
</html>
