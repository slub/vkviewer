goog.provide('VK2.Layer.TimeSearchLayer');

/**
 * @param {Array.<number>} timestamps 
 * @param {number} maxRes
 * @param {Object} map OpenLayers.Map
 * @constructor
 */
VK2.Layer.TimeSearchLayer = function(timestamps, maxRes, map){
	
	var _refresh = new OpenLayers.Strategy.Refresh({force: true, active: true}); 
	 
	var _ftSource = new OpenLayers.Protocol.WFS({
        "url": "http://194.95.145.43/cgi-bin/mtbows",
        "geometryName": "boundingbox",
        "featureNS" :  "http://mapserver.gis.umn.edu/mapserver",
        "featurePrefix": "ms",
        "featureType": "Historische_Messtischblaetter_WFS",
        "srsName": "EPSG:900913",
        "maxFeatures": 10000,
        "version": "1.0.0"
    });
	
	var obj = new OpenLayers.Layer.Vector("Messtischblaetter",{
        'displayInLayerSwitcher':false,
        'maxResolution': maxRes,
        visibility: false,
        strategies: [new OpenLayers.Strategy.BBOX({ratio:2}),_refresh],
        protocol: _ftSource,
    });
	
	/**
	 * @type {Object}
	 * @private
	 */
	obj._refresh = _refresh;
	
	/**
	 * @type {Object}
	 * @private
	 */
	obj._ftSource = _ftSource
	
	/**
	 * @type {Array.<number>}
	 * @public
	 */
	obj.timestamps = timestamps;
	
	/**
	 * @type {Function}
	 * @public
	 */
	obj.refreshLayer = function(map){
		var map = map ? map : this.map;
		this.filter = this._createTimeSpatialFilter(map.getExtent(), map.projection);
		this._refresh.refresh();
	}
	
	/**
	 * @type {Function}
	 * @private
	 */
	obj._createTimeSpatialFilter = function(extent, proj){
		
		var extent = extent ? extent : this.map.getExtent();
		var projection = proj ? proj : this.map.projection;
		var startTime = this.timestamps[0]
		var endTime = this.timestamps[1] ? this.timestamps[1] : this.timestamps[0]
		
		var filter = new OpenLayers.Filter.Logical({
	        type: OpenLayers.Filter.Logical.AND,
	        filters: [
	            new OpenLayers.Filter.Spatial({
	                type: OpenLayers.Filter.Spatial.BBOX,
	                value: extent,
	                projection: projection
	            }),
	            new OpenLayers.Filter.Logical({
	                type: OpenLayers.Filter.Logical.AND,
	                filters: [ 
						new OpenLayers.Filter.Comparison({
						    type: OpenLayers.Filter.Comparison.GREATER_THAN_OR_EQUAL_TO,
						    property: "time",
						    value: startTime
						}),
	                    new OpenLayers.Filter.Comparison({
	                        type: OpenLayers.Filter.Comparison.LESS_THAN_OR_EQUAL_TO,
	                        property: "time",
	                        value: endTime
	                    })
	                ]
	            })
	        ]
	    });
		
		return filter;	
	}
	
	
	obj.filter = obj._createTimeSpatialFilter(map.getExtent(), map.projection);
	return obj;
}
