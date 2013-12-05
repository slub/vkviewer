/**
 * Attribute: initConfiguration
 * Contains the configuration options for the initialization of the application.
 */

var initConfiguration = {
    mapOptions: {
    		// OL Map options
	        maxExtent: new OpenLayers.Bounds(640161.933,5958026.134,2661768.457,7817626.892),
	        restrictedExtent: new OpenLayers.Bounds(640161.933,5958026.134,2661768.457,7817626.892),
			projection: new OpenLayers.Projection("EPSG:900913"),
	        displayProjection: new OpenLayers.Projection("EPSG:900913"),
	        units: "m",
            // start extent of the OL map 
            startPoint: new OpenLayers.LonLat(1528150, 6630500)
    },
    
    mapnikOptions: {
    		resolutions: [1222.9924523925781,611.4962261962891,305.74811309814453,152.87405654907226,76.43702827453613,
           			  38.218514137268066,19.109257068634033,9.554628534317017,4.777314267158508,2.388657133579254,1.194328566789627
            ],
            serverResolutions : [156543.03390625,78271.516953125,39135.7584765625,19567.87923828125,9783.939619140625,4891.9698095703125,
                        2445.9849047851562,1222.9924523925781,611.4962261962891,305.74811309814453,152.87405654907226,76.43702827453613,
                        38.218514137268066,19.109257068634033,9.554628534317017,4.777314267158508,2.388657133579254,1.194328566789627,
                        0.5971642833948135
            ]

    },
    
    // parameter of the time wms
    timeParameter: {
            extent: null,
            time: null,
            wms: "http://194.95.145.43/mapcache", //"http://194.95.145.43/cgi-bin/mtbows",
            wms_layer: "messtischblaetter", //"Historische Messtischblaetter",
            wfs: "http://194.95.145.43/cgi-bin/mtbows",
            layer: "Historische Messtischblaetter",
            featureType: "Historische_Messtischblaetter_WFS",
            featurePrefix: "ms",
            featureNS: "http://mapserver.gis.umn.edu/mapserver",
            geometryName: "boundingbox",
            serviceVersion: "1.0.0",
            maxFeatures: 10000,
            srsName: "EPSG:900913"
    },
    georeference_grid: {
    	wms: new OpenLayers.Layer.WMS("georeferencer_wms_1",
                "http://194.95.145.43/cgi-bin/mtb_grid",{
			layers: "mtb_grid_puzzle", 
			transparent: true
		}, {
			"isBaseLayer" : false, 
			"displayInLayerSwitcher": true,
			singleTile: true
		}),
		wfs: new OpenLayers.Protocol.WFS({
			"url": "http://194.95.145.43/cgi-bin/mtb_grid",
            "geometryName": "the_geom",
            "featureNS" :  "http://mapserver.gis.umn.edu/mapserver",
			"featurePrefix": "ms",
			"featureType": "mtb_grid",
            "srsName": "EPSG:3857",
            "maxFeatures": 1000,
            "version": "1.0.0"
        })
    },
    // userid for downside compatibility
    // deprecated
    userid: ''
};