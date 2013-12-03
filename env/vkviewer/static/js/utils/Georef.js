VK2.Utils.Georef = {
		getZoomifyUrl: function(propertiesLink){
    		url = propertiesLink.substring(0,propertiesLink.lastIndexOf("/")+1)
    		return url
    	},
    	
    	/**
    	 * Method: createZoomifyLayer
    	 * @return {OpenLayers.Layer.Zoomify}
    	 */
    	createZoomifyLayer: function(layername, zoomifyUrl, zoomifyWidth, zoomifyHeight){
			return new OpenLayers.Layer.Zoomify(layername, zoomifyUrl,
					new OpenLayers.Size( zoomifyWidth, zoomifyHeight));
    	},
    	
    	parseZoomifyParamsFromUrl: function(){
    		var params = {};
    		
			// parse the query parameter from the page call and add a wms to the map
			// via zoomify
    		params['zoomify_prop'] = VK2.Utils.get_url_param('zoomify_prop');
    		params['zoomify_url'] = VK2.Utils.Georef.getZoomifyUrl(params['zoomify_prop']);
    		params['zoomify_width'] = VK2.Utils.get_url_param('zoomify_width');
    		params['zoomify_height'] = VK2.Utils.get_url_param('zoomify_height');
    		params['layer_name'] = VK2.Utils.get_url_param('layer');
    		return params
    	}
}