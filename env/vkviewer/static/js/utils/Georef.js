VK2.Utils.Georef = {
		
		getZoomifyUrl: function(propertiesLink){
    		url = propertiesLink.substring(0,propertiesLink.lastIndexOf("/")+1)
    		return url
    	},
    	
    	/**
    	 * Method: createZoomifyLayer
    	 * @return {OpenLayers.Layer.Zoomify}
    	 */
    	createZoomifyLayer: function(urlParams){
    		var zoomify_url = this.getZoomifyUrl(urlParams['zoomify_prop']);
    		return new OpenLayers.Layer.Zoomify(urlParams['layer'], zoomify_url,
    				new OpenLayers.Size( urlParams['zoomify_width'], urlParams['zoomify_height']));
    	},
    	
    	zommToBBoxFromWMSLayer: function(map, wms_url, layer_id) {
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
    	}, 			
    	
    	loadValidationLayer: function(map, urlParams){
    		var layerGeoref = null;
    		try {	
    			layerGeoref = new OpenLayers.Layer.WMS( urlParams['layer_id'], urlParams['wms_url'], 
    				{
    					layers: urlParams['layer_id'],
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
    	},
    	
		initializeGeoreferencerMap: function(mapContainer, urlParams){
			var zoomifyLayer = this.createZoomifyLayer(urlParams);
					
			console.log('NumberOfTiers: '+zoomifyLayer.numberOfTiers);
			// options for the georeferencer map
			var options = {
				units: "pixels",
				maxExtent: new OpenLayers.Bounds(0,0,urlParams['zoomify_width'], urlParams['zoomify_height']),
				maxResolution: Math.pow(2, zoomifyLayer.numberOfTiers-1),
				numZoomLevels: 10, //zoomifyLayer.numberOfTiers-1,
				controls: [
		                new OpenLayers.Control.Navigation(),
		                new OpenLayers.Control.PanZoomBar({zoomWorldIcon:true}),
		                new OpenLayers.Control.Attribution()]
			};
			
			var map = new OpenLayers.Map( mapContainer, options);
			map.addLayer(zoomifyLayer)
			map.setBaseLayer(zoomifyLayer);
			map.zoomToMaxExtent();
			//map.zoomTo(0);
			
			//debugger;
			return map;
		},
		
		initializeGeoreferenceResultMap: function(mapContainer, urlParams){
			
			var options = {
                	projection: new OpenLayers.Projection("EPSG:900913"),			
                	units: "m",
					maxResolution: 'auto',
					maxExtent: new OpenLayers.Bounds(-20037508.34, -20037508.34,20037508.34, 20037508.34),
                 	controls: [
                        	new OpenLayers.Control.Navigation(),
                        	new OpenLayers.Control.LayerSwitcher(),
                        	new OpenLayers.Control.PanZoomBar(),
                        	new OpenLayers.Control.Attribution(),
                        	new OpenLayers.Control.ScaleLine({geodesic:true})]
            };
			
			var map = new OpenLayers.Map(mapContainer, options);
			var layerMapnik = new OpenLayers.Layer.OSM("Mapnik");
			map.addLayer(layerMapnik);
			this.loadValidationLayer(map, urlParams);
			this.zommToBBoxFromWMSLayer(map, urlParams['wms_url'], urlParams['layer_id']);
			return map;
		}
}