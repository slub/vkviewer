// generic map options
OpenLayers.ProxyHost = "http://localhost:8080/proxy/?url=";
OpenLayers.IMAGE_RELOAD_ATTEMPTS = 5;

// for routing
var domain_georef = "http://194.95.145.43/georef"
var domain_main = "./vkviewer/dev"
var domain_georef_validate = "./georef_validate.php"

// var map objects
var map_base;
var map_result;

// get parameter 
var zoomify_url;
var zoomify_hight;
var zoomify_width;
var mtbid;
var userid;
var clipParams;
var wms_url_georef;
var layer_id_georef;
var georef_id;
var vectors;
var controls;
var fields = 1;         

var init = function(){
	
	// def the used srs
	Proj4js.defs["EPSG:900913"] = "+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +wktext +over no_defs";
	Proj4js.defs["EPSG:4314"] = "+proj=longlat +ellps=bessel +towgs84=582,105,414,1.04,0.35,-3.08,8.3 +no_defs"; 
	Proj4js.defs["EPSG:31467"] = "+proj=tmerc +lat_0=0 +lon_0=9 +k=1 +x_0=3500000 +y_0=0 +ellps=bessel +datum=potsdam +units=m +no_defs";
	
	// parse Get Parameter
	parseGetParameters();

	// add the sidebars + behavior to the map
	addSidebars();
	
	// set headings
	document.getElementById("map_base_tag").innerHTML = "Unreferenziertes Messtischblatt Nr. "
			+ mtbid;
	document.getElementById("map_result_tag").innerHTML = "Referenziertes Messtischblatt Nr. "
			+ mtbid;

	// init both map objects
	initMapBase();
	initMapResult();
}	



// function find out bbox for the georef layer (right now it only supports
// EPSG:4314 layers)
// function is asynchrone why it gets as input also the map object and does than
// the zooming
function zommToBBoxFromWMSLayer(map_result) {
	wmsParser = new OpenLayers.Format.WMSCapabilities.v1_1_1();
	wmsCapaRequest = wms_url_georef
			+ "&VERSION=1.1.1&SERVICE=WMS&REQUEST=GetCapabilities";
	OpenLayers.Request.GET({
		url : wmsCapaRequest,
		success : function(data) {
			var response = wmsParser.read(data.responseText);
			var capability = response.capability;
			for ( var i = 0, len = capability.layers.length; i < len; i += 1) {
				var layerObj = capability.layers[i]
				if (layerObj.name === layer_id_georef) {
					bbox_pure = layerObj.bbox["EPSG:4314"]
					bbox = OpenLayers.Bounds.fromArray(bbox_pure.bbox)
					bbox_transformed = bbox.transform(
							new OpenLayers.Projection(bbox_pure.srs),
							map_result.getProjectionObject());
					map_result.zoomToExtent(bbox_transformed);
					break;
				}
			}

		}
	});
}
	

// parse get Parameters
function parseGetParameters() {
	mtbid = get_url_param("mtbid");
	clipParams = get_url_param("clipparams");
	zoomify_url = get_url_param("zoomify_url");
	zoomify_width = get_url_param("zoomify_width");
	zoomify_height = get_url_param("zoomify_height");
	georef_id = get_url_param("georefid");
	wms_url_georef = get_url_param("wmsurl");
	layer_id_georef = get_url_param("layerid");
}

// init map_base
function initMapBase() {

	// init zoomify layer
	var zoomify = new OpenLayers.Layer.Zoomify("Zoomify", zoomify_url,
			new OpenLayers.Size( zoomify_width, zoomify_height));

	// define map options
	var options = {
			numZoomLevels : 10,
			units : "pixels",
			maxExtent: new OpenLayers.Bounds(0,0,zoomify_width, zoomify_height),
			maxResolution: Math.pow(2, zoomify.numberOfTiers-1),
			controls : [ 
			        new OpenLayers.Control.Navigation(),
					new OpenLayers.Control.PanZoomBar({zoomWorldIcon : true}), 
					new OpenLayers.Control.Attribution()
			]
	};
	
	// init map and add layer
	map_base = new OpenLayers.Map('map_base_div', options);
	map_base.addLayer(zoomify);
	map_base.zoomToMaxExtent();

	// initialize the georef points
	var my_style = new OpenLayers.StyleMap({
		"default" : new OpenLayers.Style({
			pointRadius : 6,
			strokeColor : "#ff6103",
			fillColor : "#FF0000",
			fillOpacity : 0.4,
			strokeWidth : 2
		})
	});

	// allow testing of specific renderers via "?renderer=Canvas", etc
	var renderer = OpenLayers.Util.getParameters(window.location.href).renderer;
	renderer = (renderer) ? [ renderer ] : OpenLayers.Layer.Vector.prototype.renderers;

	vectors = new OpenLayers.Layer.Vector("Eckpunkte", {
		styleMap : my_style,
		renderers : renderer
	});

	// parse and display the clipParams
	clipArray = clipParams.split(",")
	var numberOfListItems = clipArray.length;
	for ( var i = 0; i < numberOfListItems; i++) {
		x = clipArray[i].split(":")[0];
		y = clipArray[i].split(":")[1];
		point = new OpenLayers.Geometry.Point(x, y)
		vectors.addFeatures(new OpenLayers.Feature.Vector(point));
	}
	map_base.addLayer(vectors);
	
	// behavior to the map_base
	controls = addClickPointBehavior(map_base, vectors);
}

// init map 2
function initMapResult() {
	
	var options = {
			projection : new OpenLayers.Projection("EPSG:900913"),
			units : "m",
            maxExtent: new OpenLayers.Bounds(649298.418677,6023923.548885,2559976.222682,7538212.572142),
			controls : [ 
			        new OpenLayers.Control.Navigation(),
					new OpenLayers.Control.LayerSwitcher(),
					new OpenLayers.Control.PanZoomBar(),
					new OpenLayers.Control.Attribution(),
					new OpenLayers.Control.ScaleLine({geodesic : true}) 
			]
	};
	
	map_result = new OpenLayers.Map('map_result_div', options);
	layerMapnik = new OpenLayers.Layer.OSM("Mapnik");
	map_result.addLayer(layerMapnik);
	layerPlaces = new OpenLayers.Layer.WMS("OSM Ortsnamen",
			"http://194.95.145.43/cgi-bin/mtb_grid", {
				layers : "mtb_grid_osmplaces",
				transparent : true
			}, {
				"isBaseLayer" : false,
				singleTile : true
			});
	var layerGeoref;

	try {
		layerGeoref = new OpenLayers.Layer.WMS(layer_id_georef, wms_url_georef,
				{
					layers : layer_id_georef,
					type : "png",
					format : "image/png",
					transparent : 'true'
				}, {
					isBaseLayer : false,
					opacity : 0.75,
					visibility : true
				});
	} catch (e) {
		layerGeoref = new OpenLayers.Layer.Image('Default MTB',
				'mtb_default.jpg', new OpenLayers.Bounds(0, 0, 1797, 2001),
				new OpenLayers.Size(1000, 1000), {
					numZoomLevels : 3
				});
	}
	;

	var select = new OpenLayers.Layer.Vector("Auswahl Ort", {
		styleMap : new OpenLayers.Style(
				OpenLayers.Feature.Vector.style["select"])
	});
	// map_result.addLayer(layerGeoref)
	map_result.addLayers([ layerGeoref, layerPlaces, select ])
	zommToBBoxFromWMSLayer(map_result)

	var control = new OpenLayers.Control.GetFeature({
		protocol : new OpenLayers.Protocol.WFS({
			"url" : "http://194.95.145.43/cgi-bin/mtb_grid",
			"geometryName" : "the_geom",
			"featureNS" : "http://mapserver.gis.umn.edu/mapserver",
			"featurePrefix" : "ms",
			"featureType" : "mtb_grid_osmplaces",
			"srsName" : "EPSG:3857",
			"maxFeatures" : 1000,
			"version" : "1.0.0"
		}),
		clickTolerance : 10
	});

	control.events
			.register(
					"featureselected",
					this,
					function(e) {
						select.addFeatures([ e.feature ]);
						document.getElementById("selection").value = e.feature.attributes.name;
						document.getElementById("selectionID").value = e.feature.attributes.osm_id;
						// document.getElementById("mtbid").value =
						// e.feature.attributes.id;
						// console.log("MTB "+e.feature.attributes.blattnr+", ID
						// "+e.feature.attributes.id+" holen und anzeigen");
					});

	control.events.register("featureunselected", this, function(e) {
		select.removeFeatures([ e.feature ]);
		document.getElementById("selection").value = null;
	});

	map_result.addControl(control);
	control.activate();
}

var addSidebars = function(){
	
	// add sidebar for georef tools
	if (document.getElementById('vk2GeorefToolsPanel')){
		var georefTlsPanel = document.getElementById('vk2GeorefToolsPanel');
		
		// init georef tools
		var georefTools = new GeorefTools();
		
		// init the sidebarpanel for the layerbar
		$(georefTlsPanel).tabSlideOut({
		    tabHandle: '.vk2GeorefToolsHandle',  
		    pathToTabImage: './images/georef.png',       
		    pathToTabImageClose: './images/close.png',
		    imageHeight: '40px',                               
		    imageWidth: '40px',     
		    tabLocation: 'right', 
		    speed: 300,           
		    action: 'click',     
		    topPos: '50px',  
		    leftPos: '500px',
		    fixedPosition: false,
		    onLoadSlideOut: true,
		    activateCallback: $.proxy(georefTools.activate,georefTools),
		    deactivateCallback: $.proxy(georefTools.deactivate,georefTools) 
		});				
	}
}

