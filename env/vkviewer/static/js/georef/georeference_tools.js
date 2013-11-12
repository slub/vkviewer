/**
 * function: addClickPointBehavior
 * 
 * @param - map {OpenLayers.Map}
 * @param - vectors {Openlayers.Layer.Vectors}
 * 
 * Map adds the behavior for adding vector points as georeference utilities to the map object.
 */
var addClickPointBehavior = function(map, vectors){
	
	if (map.getCenter())
		var controls = {
			point : new OpenLayers.Control.DrawFeature(vectors,
				OpenLayers.Handler.Point, {
					eventListeners : {
						"featureadded" : pointAdded(vectors)
					}
				}
			),
			line : new OpenLayers.Control.DrawFeature(vectors,
					OpenLayers.Handler.Path),
			polygon : new OpenLayers.Control.DrawFeature(vectors,
					OpenLayers.Handler.Polygon),
			drag : new OpenLayers.Control.DragFeature(vectors),
			modify : new OpenLayers.Control.ModifyFeature(vectors),
			"delete" : new DeleteFeature(vectors)
	};

	for ( var key in controls) {
		map.addControl(controls[key]);
	}
	
	// add pixel event
	map.events.register("click", map, function(e) {
		var opx = map.getLayerPxFromViewPortPx(e.xy);
		var lonlat = map.getLonLatFromPixel(opx);
		getRelativPixelValues(opx, lonlat);
	});
	
	return controls;
}

/**
 * function: addVectorLayer
 *
 * @param map {OpenLayers.Map}
 * @return vectors {OpenLayers.Layer.Vector}
 *
 * Functions initialize the vector layer for composing the ground control points 
 * and also looks if there are as input query parameter in the page call already
 * some points.
 */
var addVectorLayer = function(map){
	// computes and adds the style for georeference points
	var my_style = new OpenLayers.StyleMap({ 
		"default": new OpenLayers.Style({ 
				pointRadius: 6, 
				strokeColor: "#ff6103", 
				fillColor: "#FF0000", 
				fillOpacity: 0.4, 
				strokeWidth: 2 
		}) 
	});
 
 	// allow testing of specific renderers via "?renderer=Canvas", etc
    var renderer = OpenLayers.Util.getParameters(window.location.href).renderer;
    renderer = (renderer) ? [renderer] : OpenLayers.Layer.Vector.prototype.renderers;
	var vectors = new OpenLayers.Layer.Vector("Eckpunkte", {
		styleMap: my_style,
        renderers: renderer
    });
	
	// check if points params in the side call
	if (get_url_param('points') !== ""){
		returnpoints = get_url_param('points').split(",");
		for(zaehler in returnpoints)
		{
			
			latLon = returnpoints[zaehler];
			latLon = latLon.replace (/:/g, ",");
			latLon = latLon.split(",");
			kringel = new OpenLayers.Geometry.Point(latLon[0], latLon[1]);
			vectors.addFeatures([new OpenLayers.Feature.Vector(kringel)]);
		}	
	}
	
	map.addLayer(vectors);
	return vectors
}

/**
 * function: toggleControl
 * 
 * @param element
 * 
 * activate/deactive the right control in dependence to the select tools list
 */
function toggleControl(element) {
	for(key in controls) {
		var control = controls[key];
		if(element.value == key && element.checked) {
			control.activate();
		} else {
			control.deactivate();
		}
	}
}

/** own control element **/
var DeleteFeature = OpenLayers.Class(OpenLayers.Control, {
	initialize: function(layer, options) {
		OpenLayers.Control.prototype.initialize.apply(this, [options]);
		this.layer = layer;
		this.handler = new OpenLayers.Handler.Feature(
			this, layer, {click: this.clickFeature}
		);
	},
	
	clickFeature: function(feature) {
		// if feature doesn't have a fid, destroy it
		if(feature.fid == undefined) {
    		this.layer.destroyFeatures([feature]);
	    } else {
	        this.layer.drawFeature(feature,{display: "none"}) ;
			this.layer.removeFeatures(feature)
	        //feature.state = OpenLayers.State.DELETE;
	        this.layer.events.triggerEvent("afterfeaturemodified", {feature: feature});
	        //feature.renderIntent = "select";
	    }
	},
	
	setMap: function(map) {
		this.handler.setMap(map);
		OpenLayers.Control.prototype.setMap.apply(this, arguments);
	},
	
	CLASS_NAME: "OpenLayers.Control.DeleteFeature"
});

function getRelativPixelValues(pixelObj, lonlatObj){
	console.log("Pure pixelObj: "+pixelObj)
	console.log("Pure lonlatObj: "+lonlatObj)
}


function pointAdded(vectors){
	if (vectors.features.length > 4) 
		alert('Nur 4 Ecktpunkte zulässig');
	vectors.removeFeatures(vectors.features[4]);
}

function validateInput(){
	if (vectors.features.length < 4){
		  alert("4 Eckpunkte benötigt");
		  return false;
		}
	else{
		for(i in vectors.features) 	{
			console.log(vectors.features[i].geometry.x);
			console.log(vectors.features[i].geometry.y);
		}
		document.getElementById("points").value = vectors.features[0].geometry.x + ":" +
			vectors.features[0].geometry.y + "," +
			vectors.features[1].geometry.x + ":" +
			vectors.features[1].geometry.y + "," +
			vectors.features[2].geometry.x + ":" +
			vectors.features[2].geometry.y + "," +
			vectors.features[3].geometry.x + ":" +
			vectors.features[3].geometry.y;
		return true;
		
		}
}

function toggle() {
	var ele = document.getElementById("toggleAnleitung");
	var text = document.getElementById("displayText");
	if(ele.style.display == "block") {
			ele.style.display = "none";
		text.innerHTML = "Anleitung anzeigen";
	}
	else {
		ele.style.display = "block";
		text.innerHTML = "Anleitung ausblenden";
	}
} 

function sendGeorefParams(){
	if (validateInput()){
		// build request
		mtbid = document.getElementById("mtbid").value;
		//userid = document.getElementById("userid").value;
	
		clipParams = document.getElementById("points").value;

		$.ajax({
			'url' : getHost('vkviewer/georef/confirm'),
			'type' : 'GET',
			'data' : {
				'mtbid' : mtbid,
				'userid' : 'jm',
				'points' : clipParams
			},
			'success' : function(data){
				// parse json response
				jsonObj = $.parseJSON(data)
				georef_id = jsonObj.georef_id;
				
				try{
					check = parseInt(georef_id);
					routeToTop(getHost('vkviewer?georef=active'));
				} catch (e) {
					console.log("Error while parsing response form georef request!");
				}
			}
		});
	} else {
		return false;
	}
}

function startValidierung(){
	if (validateInput()){
		// shows a loading image
		//var overlay = new ItpOverlay("bodyid");
		//overlay.show();
		// build request
		mtbid = document.getElementById("mtbid").value;
		//userid = document.getElementById("userid").value;
		clipParams = document.getElementById("points").value;

		$.ajax({
			'url' : getHost('/vkviewer/georef/validate'),
			'type' : 'GET',
			'data' : {
				'mtbid' : mtbid,
				'userid' : 'jm',
				'points' : clipParams
			},
			'success' : function(data){
				// parse json response
				jsonObj = $.parseJSON(data)
				georef_id = jsonObj.georef_id;
				wms_url = jsonObj.wms_url;				
				layer_id = jsonObj.layer_id;	
				
				// get zoomify stuff 
				zoomify_url = document.getElementById("zoomify_url").value;
				zoomify_width = document.getElementById("zoomify_width").value;
				zoomify_height = document.getElementById("zoomify_height").value;
				
				//build url 
				url = getHost('vkviewer/static/georeference_validate.html')+'?clipparams='+clipParams+'&mtbid='+mtbid+
						'&wmsurl='+wms_url+'&layerid='+layer_id+'&georefid='+georef_id+'&zoomify_url='+
						zoomify_url+'&zoomify_width='+zoomify_width+"&zoomify_height="+zoomify_height;
				window.location.href = 	url;	
			}
		});
	} else {
		return false;
	}
}

var GeorefTools = Class({
	
	initialize: function(){
		console.log('Initialize');
	},

	activate: function(){
		console.log('activate');
	},
	
	deactivate: function(){
		console.log('deactivate');
	}
})