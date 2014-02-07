goog.provide('VK2.Tools.GeoreferencerChooser')

goog.require('goog.object');

/**
 * @param {Object} settings
 * @param {VK2.Tools.Layerbar|undefined} layerbar
 * @constructor
 */
VK2.Tools.GeoreferencerChooser = function(settings, layerbar){

	/**
	 * @type {Object}
	 * @private
	 */
	this._settings = {
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
	};
	goog.object.extend(this._settings, settings);
	
	/**
	 * @type {VK2.Layer.GeoreferencerSearchLayer}
	 * @private
	 */
	this._georefLayer = new VK2.Layer.GeoreferencerSearchLayer({
			wmsLayer: this._settings.wmsLayer,
			requestWfs:  this._settings.requestWfs,
			map: this._settings.map			
	});
	
	/**
	 * @type {VK2.Tools.Layerbar}
	 * @private
	 */
	if (goog.isDefAndNotNull(layerbar))
		this._layerbar = layerbar;
	
	/**
	 * @type {boolean}
	 * @private
	 */
	this._isActive = false;
};

/**
 * @public
 */
VK2.Tools.GeoreferencerChooser.prototype.activate = function(){
	
	// check if a layerbar is registered and if yes hide the overlay layers
	if (goog.isDef(this._layerbar) && !this._isActive)
		this._layerbar.hideOverlayLayers();
	
	this._georefLayer.activate();
	
	this._isActive = true;
};

/**
 * @public
 */
VK2.Tools.GeoreferencerChooser.prototype.deactivate = function(){

	// check if a layerbar is registered and if yes hide the overlay layers
	if (goog.isDef(this._layerbar) && this._isActive)
		this._layerbar.showOverlayLayers();
	
	this._georefLayer.deactivate();
	
	this._isActive = false;
};