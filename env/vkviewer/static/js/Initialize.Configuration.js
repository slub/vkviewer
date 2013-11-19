/**
 * Attribute: initConfiguration
 * Contains the configuration options for the initialization of the application.
 */
var initConfiguration = {
    mapOptions: {
    		// OL map options
            projection: new OpenLayers.Projection("EPSG:900913"),
            displayProjection: new OpenLayers.Projection("EPSG:900913"),
            units: "m",
            maxExtent: new OpenLayers.Bounds(649298.418677,6023923.548885,2559976.222682,7538212.572142),
            restrictedExtent: new OpenLayers.Bounds(649298.418677,6023923.548885,2559976.222682,7538212.572142),
            resolutions : [4891.969810251280,2445.984905125640,1222.992452562820,611.4962262814100,305.7481131407048,152.8740565703525,76.43702828517624,38.21851414258813,19.10925707129406,9.554628535647032,4.777314267823516],
            maxResolution: 4891.96981025128025066806,
            // start extent of the OL map 
            startExtent: new OpenLayers.Bounds(1363755.5807007,6493091.556489,1669503.6937989,6737690.0469676)
    },
    // parameter of the time wms
    timeParameter: {
            extent: null,
            time: null,
            wms: "http://194.95.145.43/cgi-bin/mtbows",
            layer: "Historische Messtischblaetter",
            featureType: "Historische_Messtischblaetter_WFS",
            featurePrefix: "ms",
            featureNS: "http://mapserver.gis.umn.edu/mapserver",
            geometryName: "boundingbox",
            serviceVersion: "1.0.0",
            maxFeatures: 10000,
            srsName: "EPSG:900913"
    },
    // userid for downside compatibility
    // deprecated
    userid: ''
};