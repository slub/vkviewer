goog.provide('VK2.Utils.Georef');

/**
 * 
 * @param {goog.Uri.QueryData} query_param
 * @return {OpenLayers.Layer.Zoomify}
 * @static
 */
VK2.Utils.Georef.createZoomifyLayer = function(query_param){
	var zoomify_url = query_param.get('zoomify_prop').substring(0,query_param.get('zoomify_prop').lastIndexOf("/")+1);
	return new OpenLayers.Layer.Zoomify(query_param.get('layer'), zoomify_url,
			new OpenLayers.Size( query_param.get('zoomify_width'), query_param.get('zoomify_height'))
	);
};

/**
 * 
 * @param {goog.Uri.QueryData} query_param
 * @return {OpenLayers.Layer.Zoomify}
 * @static
 */
VK2.Utils.Georef.createZoomifyOverviewLayer = function(query_param, zoomify_layer){
	// create overviewLevel for zoomify overlay
	var zoomifyImageUrl = query_param.get('zoomify_prop').substring(0,query_param.get('zoomify_prop').lastIndexOf("/")+1)
			+ 'TileGroup0/0-0-0.jpg';
	var zoomifyOverviewMap = new OpenLayers.Layer.Image( 
            'zoomifyOverviewMap', 
            zoomifyImageUrl, 
            new OpenLayers.Bounds(0, 0, query_param.get('zoomify_width'), query_param.get('zoomify_height')), 
            new OpenLayers.Size(150, 110), 
            { numZoomLevels: 1, 
            	maxExtent: new OpenLayers.Bounds(0,0,query_param.get('zoomify_width'), query_param.get('zoomify_height'))     
            } 
    ); 
	
	return overviewMapControl = new OpenLayers.Control.OverviewMap({
    	size: new OpenLayers.Size(150, 110),
    	layers: [zoomifyOverviewMap],
    	maximized: true
    });
};

/**
 * @static
 */
VK2.Utils.Georef.zommToBBoxFromWMSLayer = function(map, wms_url, layer_id) {
	wmsParser = new OpenLayers.Format.WMSCapabilities.v1_1_1();
	wmsCapaRequest = wms_url + "&VERSION=1.1.1&SERVICE=WMS&REQUEST=GetCapabilities";
	OpenLayers.Request.GET({
		url : wmsCapaRequest,
		success : function(data) {
			var response = wmsParser.read(data.responseText);
			var capability = response.capability;
			for ( var i = 0, len = capability.layers.length; i < len; i += 1) {
				var layerObj = capability.layers[i]
				if (layerObj.name === layer_id) {
					bbox_pure = layerObj.bbox["EPSG:4314"]
					bbox = OpenLayers.Bounds.fromArray(bbox_pure.bbox)
					bbox_transformed = bbox.transform( new OpenLayers.Projection(bbox_pure.srs),
							map.getProjectionObject());
					map.zoomToExtent(bbox_transformed);
					break;
				}
			}
		}
	});
};

/**
 * @param {OpenLayers.Map} map
 * @param {Object} query_param
 * @static
 */
VK2.Utils.Georef.loadValidationLayer = function(map, query_param){
	var layerGeoref = null;
	try {	
		layerGeoref = new OpenLayers.Layer.WMS( query_param.get('layer_id'), query_param.get('wms_url'), 
			{
				layers: query_param.get('layer_id'),
				type:	"png",
				format: "image/png",
				transparent: 'true'
			},{
				isBaseLayer: false,
				opacity: 0.75,
				visibility: true
			}
		);
	} catch (e) { 
		layerGeoref = new OpenLayers.Layer.Image(
			'Default MTB',
			'mtb_default.jpg',
			new OpenLayers.Bounds(0,0,1797,2001),
			new OpenLayers.Size(1000,1000),
			{numZoomLevels: 3}
		);
	};    		
	map.addLayer(layerGeoref);
};

/**
 * @param {string} mapContainerId
 * @param {goog.Uri.QueryData} query_param
 * @param {boolean|undefined} withOverview
 * @static
 */
VK2.Utils.Georef.initializeGeoreferencerMap = function(mapContainerId, query_param, withOverview){
	
	var zoomifyLayer = this.createZoomifyLayer(query_param);
	
	// options for the georeferencer map
	var options = {
		units: "pixels",
		maxExtent: new OpenLayers.Bounds(0,0,query_param.get('zoomify_width'), query_param.get('zoomify_height')),
		maxResolution: Math.pow(2, zoomifyLayer.numberOfTiers-1),
		numZoomLevels: 10,
		controls: [
		    new OpenLayers.Control.Attribution(),
		    new OpenLayers.Control.Navigation(),
		    new OpenLayers.Control.Zoom()
		]
	};
	
	var map = new OpenLayers.Map( mapContainerId, options);
	
	if (withOverview){
		var overlayControl = this.createZoomifyOverviewLayer(query_param,zoomifyLayer);
		map.addControls([overlayControl]);
	};
	
	map.addLayer(zoomifyLayer)
	map.setBaseLayer(zoomifyLayer);
	map.zoomToMaxExtent();

	return map;
};

/**
 * @param {string} mapContainerId
 * @param {goog.Uri.QueryData} query_param
 * @static
 */
VK2.Utils.Georef.initializeGeoreferenceResultMap = function(mapContainerId, query_param){
	
	var options = {
        	projection: new OpenLayers.Projection("EPSG:900913"),			
        	units: "m",
			maxResolution: 'auto',
			maxExtent: new OpenLayers.Bounds(-20037508.34, -20037508.34,20037508.34, 20037508.34),
         	controls: [
                	new OpenLayers.Control.Navigation(),
                	new OpenLayers.Control.LayerSwitcher(),
                	new OpenLayers.Control.Zoom(),
                	new OpenLayers.Control.Attribution(),
                	new OpenLayers.Control.ScaleLine({geodesic:true})]
    };
	
	var map = new OpenLayers.Map(mapContainerId, options);
	var layerMapnik = new OpenLayers.Layer.OSM("Mapnik");
	map.addLayer(layerMapnik);
	this.loadValidationLayer(map, query_param);
	this.zommToBBoxFromWMSLayer(map, query_param.get('wms_url'), query_param.get('layer_id'));
	return map;
};

/**
 * @param {Element} container
 * @param {number} points
 * @static
 */
VK2.Utils.Georef.showGeorefPoints = function(container, points){
	container.innerHTML = '+' + points + ' ' + VK2.Utils.get_I18n_String('georef_points')
	$(container).fadeIn(1000).effect('puff', {}, 3000, function(){
		container.innerHTML = '';
	});
};
