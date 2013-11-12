/**
 * function: addGeoreferencer
 * 
 * This functions adds a sidebar panel + behavior for getting into the georeference process 
 * on the front page.
 */
var addGeoreferencer = function(linkElement, map){
	
	var _removeGeorefLayer = function(map){
		console.log("Remove Layer!");
		
		// remove the layergrid and select
		var layerGrid = map.getLayersByName("georeferencer_wms_1")[0];
		var select = map.getLayersByName("georeferencer_select_1")[0];
		map.removeLayer(layerGrid);
		map.removeLayer(select);
		
		// remove controls
		var control = map.getControlsBy('name','georeferencer_control_1')[0]
		map.removeControl(control);
	};
	
	var _addGeorefLayer = function(map){
		console.log("Add Layer!");
		
		// add the grid as wms 
		var layerGrid = new OpenLayers.Layer.WMS("georeferencer_wms_1",
                "http://194.95.145.43/cgi-bin/mtb_grid",{
					layers: "mtb_grid_puzzle", 
					transparent: true
				}, {
					"isBaseLayer" : false, 
					"displayInLayerSwitcher": true,
					singleTile: true
		});

		// add selectlayer to the map
		var select = new OpenLayers.Layer.Vector("georeferencer_select_1",{
			styleMap: new OpenLayers.Style(OpenLayers.Feature.Vector.style["select"])
		});
		map.addLayers([layerGrid,select]);
		
		// create and register control for handling select feature events
		var control = new OpenLayers.Control.GetFeature({
			name: "georeferencer_control_1",
            protocol: new OpenLayers.Protocol.WFS({
				"url": "http://194.95.145.43/cgi-bin/mtb_grid",
                "geometryName": "the_geom",
                "featureNS" :  "http://mapserver.gis.umn.edu/mapserver",
				"featurePrefix": "ms",
				"featureType": "mtb_grid",
                "srsName": "EPSG:3857",
                "maxFeatures": 1000,
                "version": "1.0.0"
            })	
		});
		
		control.events.register("featureselected", this, function(e){
			select.addFeatures([e.feature]);
			console.log("MTB "+e.feature.attributes.blattnr+", ID "+e.feature.attributes.id+" holen und anzeigen");

            // display data in fancybox
			var targetHref = getHost('vkviewer/static/georeference_start.html?blattnr=') + e.feature.attributes.blattnr;
            $.fancybox.open([
                { 
                    'href': targetHref,
        			'width': '95%',
        			'height': '95%',
        			'type': 'iframe'
                }
            ]);
		});
		
		control.events.register("featureunselected", this, function(e) {
			select.removeFeatures([e.feature]);
			console.log("Feature unselected!");
		});
		
		map.addControl(control);
		control.activate();
	};
	
	// on initialize set the status of the linkElement to disabled
	$(linkElement).attr('status','disabled');
	
	// add start and stop georeferencer behavior to the georeferencer sidebar element
	$(linkElement).click(function(){
		var status = $(this).attr('status');
		
		if (status == 'disabled'){
			_addGeorefLayer(map);
			$(this).attr('status','enabled');
		} else if (status == 'enabled'){
			_removeGeorefLayer(map);
			$(this).attr('status','disabled');
		}
	});
}

var initializeGeoreferencerMap = function(){
	
	// options for the georeferencer map
	var options = {
		numZoomLevels: 9,
		units: "m",
		projection: new OpenLayers.Projection("EPSG:31467"),
		displayProjection: new OpenLayers.Projection("EPSG:31467"),
		maxExtent: new OpenLayers.Bounds(0,0,8574,9545),
        resolutions : [12,6,3,1.5,0.75,0.375,0.1875,0.09375],
        maxResolution: 12,
		controls: [
                new OpenLayers.Control.Navigation(),
                new OpenLayers.Control.LayerSwitcher(),
                new OpenLayers.Control.PanZoomBar({zoomWorldIcon:true}),
                new OpenLayers.Control.Attribution(),
                new OpenLayers.Control.MousePosition()]
	};
      
	var my_style = new OpenLayers.StyleMap({ 
		"default": new OpenLayers.Style( 
			{ 
				pointRadius: 6, 
				strokeColor: "#ff6103", 
				fillColor: "#FF0000", 
				fillOpacity: 0.4, 
				strokeWidth: 2 
			}) 
	});
  
	map = new OpenLayers.Map( 'map', options);  

 	// allow testing of specific renderers via "?renderer=Canvas", etc
    var renderer = OpenLayers.Util.getParameters(window.location.href).renderer;
    renderer = (renderer) ? [renderer] : OpenLayers.Layer.Vector.prototype.renderers;

		vectors = new OpenLayers.Layer.Vector("Eckpunkte", {
		styleMap: my_style,
        renderers: renderer
    });
	
	// parse the query parameter from the page call
	var wms_url = get_url_param('wms');
	var layer_name = get_url_param('layer');
}
///**
// * Object: GeoreferenceMesstischblatt
// * 
// * This object encapsulte the funcionality and the behavior of georeference site for the mtbs.
// */
//var GeoreferenceMesstischblatt = Class({
//	
//	initialize: function(){
//		
//	}
//})
	

