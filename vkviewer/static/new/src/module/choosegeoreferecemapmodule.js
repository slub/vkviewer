goog.provide('VK2.Module.ChooseGeoreferenceMapModule');

goog.require('goog.dom');
goog.require('VK2.Utils');
goog.require('VK2.Utils.Modal');
goog.require('VK2.Module.AbstractModule');

/**
 * @constructor
 * @extends {VK2.Module.AbstractModule}
 * @param {Object} settings
 */
VK2.Module.ChooseGeoreferenceMapModule = function(settings){
	
	goog.base(this, settings);
	
	/**
	 * @type {Object}
	 * @private
	 */
	this._wms_settings = {
		"url": "http://194.95.145.43/cgi-bin/mtb_grid",
        "layer": "mtb_grid_puzzle",
        "transparent": true
	};
	
	/**
	 * @type {Object}
	 * @private
	 */
	this._wfs_settings = {
		"url": "http://194.95.145.43/cgi-bin/mtb_grid",
        "geometryName": "the_geom",
        "featureNS" :  "http://mapserver.gis.umn.edu/mapserver",
		"featurePrefix": "ms",
		"featureType": "mtb_grid",
        "srsName": "EPSG:3857",
        "maxFeatures": 1000,
        "version": "1.0.0"			
	};
	
	this._layer = new ol.layer.Image({
		source: new ol.source.ImageWMS({
			url: this._wms_settings.url,
			params: {
				'LAYERS': this._wms_settings.layer,
				'TRANSPARENT': this._wms_settings.transparent
			}
		})
	});	
	
	this._selectEventHandler = function(event){
		var modal = new VK2.Utils.Modal('vk2-modal-choosegeoref',document.body, true);
		
		// parse the modal parameters
		var title = 'Choose Georef';
		var classes = 'choose-georef';
		var href = '/vkviewer/choosegeoref?blattnr=40_40'

		modal.open(title, classes, {
			'href':href,
			'classes':classes
		});
		
//		console.log('click event');
//		var source = this.getSource();
//		var viewResolution = event.map.getView().getResolution();
//		var viewProjection = event.map.getView().getProjection();
//		
//		var url = source.getGetFeatureInfoUrl(event.coordinate, viewResolution, viewProjection, {'INFO_FORMAT':'text/html'});
//		console.log(url);
	};
};
goog.inherits(VK2.Module.ChooseGeoreferenceMapModule, VK2.Module.AbstractModule);

/**
 * Should be triggered for activate the module.
 * @override
 */
VK2.Module.ChooseGeoreferenceMapModule.prototype.activate = function() {
	console.log('ChooseGeoreferenceMapModule activated.');
	if (goog.isDef(this._layer) && goog.isDef(this._map)){
		this._map.addLayer(this._layer);
		this._map.on('singleclick', this._selectEventHandler, this._layer);
	}
};

/**
 * Should be triggered for deactivate the module.
 * @override
 */
VK2.Module.ChooseGeoreferenceMapModule.prototype.deactivate = function() {
	console.log('ChooseGeoreferenceMapModule deactivated.');
	if (goog.isDef(this._layer) && goog.isDef(this._map)){
		this._map.removeLayer(this._layer);
		this._map.un('singleclick', this._selectEventHandler, this._layer);
	}
};