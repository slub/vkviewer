goog.provide('VK2.Module.ChooseGeoreferenceMapModule');

goog.require('goog.dom');
goog.require('goog.net.XhrIo');
goog.require('VK2.Settings');
goog.require('VK2.Utils');
goog.require('VK2.Utils.Modal');
goog.require('VK2.Request.WFS');
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
		// get blattnr for click
		var click_coords = event.map.getCoordinateFromPixel(event.pixel);
		
		// get request and request blattnr
		var featureType = VK2.Settings.WFS_PARSER_CONFIG['mtb_grid_puzzle']['featurePrefix']+':'+VK2.Settings.WFS_PARSER_CONFIG['mtb_grid_puzzle']['featureType'];
		var bbox = [click_coords[0],click_coords[1],click_coords[0]+1,click_coords[1]+1];
		var request = VK2.Request.WFS.getFeatureRequest_IntersectBBox(featureType, bbox)
		var url = VK2.Settings.PROXY_URL+VK2.Settings.WFS_GRID_URL;
		goog.net.XhrIo.send(url, goog.bind(function(e){
				var xhr = /** @type {goog.net.XhrIo} */ (e.target);
		    	var data = xhr.getResponseXml() ? xhr.getResponseXml() : xhr.getResponseText();
		    	xhr.dispose();
		    	var parser =  new ol.format.WFS(VK2.Settings.WFS_PARSER_CONFIG['mtb_grid_puzzle'])
		    	var features = parser.readFeatures(data);
		    	if (features.length > 0 && features[0] instanceof ol.Feature && this._collectionHasUnreferencedFeatures(features)){
		    		// check if there are features with no georef params
		    		var blattnr = features[0].get('blattnr');
		    		if (goog.isDefAndNotNull(blattnr))
		    			this._showChooseGeoreferencePage(blattnr);
		    	} else {
		    		alert(VK2.Utils.getMsg('clickout'));
		    	};
			}, this), "POST", request, {'Content-Type':'application/xml;charset=UTF-8'}
		);
	};
};
goog.inherits(VK2.Module.ChooseGeoreferenceMapModule, VK2.Module.AbstractModule);

/**
 * @param {Array.<ol.Feature>} features
 * @private
 * @return {boolean}
 */
VK2.Module.ChooseGeoreferenceMapModule.prototype._collectionHasUnreferencedFeatures = function(features){
	for (var i = 0; i < features.length; i ++){
		var hasgeorefparams = parseInt(features[i].get('hasgeorefparams'));
		if (hasgeorefparams === 0)
			return true; 
	};
	return false;
};

/**
 * Should display the choose georeference source in a modal
 * @param {string} blattnr
 * @private
 */
VK2.Module.ChooseGeoreferenceMapModule.prototype._showChooseGeoreferencePage = function(blattnr){
	var modal = new VK2.Utils.Modal('vk2-modal-choosegeoref',document.body, true);
	
	// parse the modal parameters
	var title = 'Choose Georef';
	var classes = 'choose-georef';
	var href = '/vkviewer/choosegeoref?blattnr='+blattnr

	modal.open(title, classes, {
		'href':href,
		'classes':classes
	});
};

/**
 * Should be triggered for activate the module.
 * @override
 */
VK2.Module.ChooseGeoreferenceMapModule.prototype.activate = function() {
	console.log('ChooseGeoreferenceMapModule activated.');
	if (goog.isDef(this._layer) && goog.isDef(this._map)){
		this._map.addLayer(this._layer);
		this._map.on('singleclick', this._selectEventHandler, this);
	};
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
	};
};

