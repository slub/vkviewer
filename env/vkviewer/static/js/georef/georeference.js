var map;
var vectors;
var controls;

var init = function() {

	map = initializeGeoreferencerMap('map')
	map.zoomToMaxExtent();

	// add vector layer to the map for composing the ground control points
	vectors = addVectorLayer(map);
	
	// add the sidebars + behavior to the map
	addSidebars();
	controls = addClickPointBehavior(map, vectors);


	// add behavior for blocking in case of ajax request
	$(document).ajaxStart($.blockUI).ajaxStop($.unblockUI);

	// set value of mtbid value container
	document.getElementById("mtbid").value = get_url_param('mtbid');
	document.getElementById("zoomify_url").value = get_url_param('zoomify_url');
	document.getElementById("zoomify_width").value = get_url_param('zoomify_width');
	document.getElementById("zoomify_height").value = get_url_param('zoomify_height');
}
/**
 * function:
 * 
 * @param mapDiv
 *            {String}
 * 
 * This function initialize the map object for
 */
var initializeGeoreferencerMap = function(){
	
	// parse the query parameter from the page call and add a wms to the map
	// via zoomify
	var zoomify_url = get_url_param('zoomify_url');
	var zoomify_width = get_url_param('zoomify_width');
	var zoomify_height = get_url_param('zoomify_height');
	var layer_name = get_url_param('layer');
	var zoomify = new OpenLayers.Layer.Zoomify("Zoomify", zoomify_url,
			new OpenLayers.Size( zoomify_width, zoomify_height));
	
	// options for the georeferencer map
	var options = {
		units: "pixels",
		maxExtent: new OpenLayers.Bounds(0,0,zoomify_width, zoomify_height),
		maxResolution: Math.pow(2, zoomify.numberOfTiers-1),
		numZoomLevels: 10, //zoomify.numberOfTiers,
        //resolutions : [12,6,3,1.5,0.75,0.375,0.1875,0.09375],
        //maxResolution: 12,
		controls: [
                new OpenLayers.Control.Navigation(),
                new OpenLayers.Control.PanZoomBar({zoomWorldIcon:true}),
                new OpenLayers.Control.Attribution()]
	};
	
	var map = new OpenLayers.Map( 'map', options);
	map.addLayer(zoomify)
	map.zoomToMaxExtent();
	

	
	// parse the query parameter from the page call and add a wms to the map

	// old version
	//var wms_url = get_url_param('wms');
	//var layer_name = get_url_param('layer');
	//console.log("WMS-URL: "+wms_url +", Layer-Name: "+layer_name);
	//var layer = new OpenLayers.Layer.WMS( layer_name, wms_url, 
	//		{layers: layer_name});
	//map.addLayer(layer);



	return map;
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
		    fixedPosition: false,
		    onLoadSlideOut: true,
		    activateCallback: $.proxy(georefTools.activate,georefTools),
		    deactivateCallback: $.proxy(georefTools.deactivate,georefTools) 
		});				
	}
}

