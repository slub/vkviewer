VK2.Tools.GeoreferencerChooser = VK2.Class({

	_settings: {
		wmsLayer: new OpenLayers.Layer.WMS("georeferencer_wms_1",
                "http://194.95.145.43/cgi-bin/mtb_grid",{
			layers: "mtb_grid_puzzle", 
			transparent: true
		}, {
			"isBaseLayer" : false, 
			"displayInLayerSwitcher": true,
			singleTile: true
		}),
		requestWfs: new OpenLayers.Protocol.WFS({
			"url": "http://194.95.145.43/cgi-bin/mtb_grid",
            "geometryName": "the_geom",
            "featureNS" :  "http://mapserver.gis.umn.edu/mapserver",
			"featurePrefix": "ms",
			"featureType": "mtb_grid",
            "srsName": "EPSG:3857",
            "maxFeatures": 1000,
            "version": "1.0.0"
        }),
        map: null
	},
	
	_georefLayer: null,
	
	_loadGeoreferenceSearchLayer: function(){
		this._georefLayer = new VK2.Layer.GeoreferencerSearchLayer({
			wmsLayer: this._settings.wmsLayer,
			requestWfs:  this._settings.requestWfs,
			map: this._settings.map			
		});
	},
	
	_updateSettings: function(settings){
		for (var key in settings){
			this._settings[key] = settings[key];
		}	
	},
	
	initialize: function(settings){
		this._updateSettings(settings);
		this._loadGeoreferenceSearchLayer();
	},
	
	activate: function(){
		this._georefLayer.activate();
	},
	
	deactivate: function(){
		this._georefLayer.deactivate();
	}
});