goog.provide('vk2.georeference.GeoreferencerChooser');

goog.require('goog.dom');
goog.require('goog.dom.classes');
goog.require('goog.events');
goog.require('vk2.settings');
goog.require('vk2.utils');
goog.require('vk2.utils.Modal');
goog.require('vk2.request.WFS');

/**
 * @param {Element} parentEl
 * @param {ol.Map} map
 * @constructor
 */
vk2.georeference.GeoreferencerChooser = function(parentEl, map){
	
	/**
	 * @type {Element}
	 * @private
	 */
	this._parentEl = goog.isString(parentEl) ? goog.dom.getElement(parentEl) : parentEl;
	
	/**
	 * @type {ol.Map}
	 * @private
	 */
	this._map = map;
	
	/**
	 * @type {ol.layer.Image}
	 * @private
	 */
	this._layer = new ol.layer.Image({
		'source': new ol.source.ImageWMS({
			'url': vk2.settings.GEOREFERENCECHOOSER_WMS,
			'params': {
				'LAYERS': vk2.settings.GEOREFERENCECHOOSER_LAYERID,
				'TRANSPARENT': true
			}
		})
	});	
	
	this._selectEventHandler = function(event){
		// get blattnr for click
		var click_coords = event.map.getCoordinateFromPixel(event.pixel);
		
		// get request and request blattnr
		var featureType = vk2.settings.WFS_PARSER_CONFIG[vk2.settings.GEOREFERENCECHOOSER_LAYERID]['featureType'];
		var bbox = [click_coords[0],click_coords[1],click_coords[0]+1,click_coords[1]+1];
		var request = vk2.request.WFS.getFeatureRequest_IntersectBBox(vk2.settings.WFS_GRID_URL, featureType, bbox)
		goog.net.XhrIo.send(request, goog.bind(function(e){
				var xhr = /** @type {goog.net.XhrIo} */ (e.target);
		    	var data = xhr.getResponseJson() ? xhr.getResponseJson() : xhr.getResponseText();
		    	xhr.dispose();
		    	var parser =  new ol.format.GeoJSON();
		    	var features = parser.readFeatures(data);
		    	if (features.length > 0 && features[0] instanceof ol.Feature && this._collectionHasUnreferencedFeatures(features)){
		    		// check if there are features with no georef params
		    		var blattnr = features[0].get('blattnr');
		    		if (goog.isDefAndNotNull(blattnr))
		    			this._showChooseGeoreferencePage(blattnr, map.getTarget());
		    	} else {
		    		alert(vk2.utils.getMsg('clickout'));
		    	};
			}, this), "GET", request);
	};
	
	this._loadControlElement(this._parentEl);
};

/**
 * @param {Element} parentEl
 * @private
 */
vk2.georeference.GeoreferencerChooser.prototype._loadControlElement = function(parentEl){
	
	// append html elements
	this._anchorElement = goog.dom.createDom('a',{
		'id': 'georeference-chooser-control',
		'class': 'georeference-chooser-control',
		'innerHTML': '<span class="glyphicon glyphicon-map-marker"></span> '+vk2.utils.getMsg('georeference'),
		'href':'#'
	});
	goog.dom.appendChild(parentEl, this._anchorElement);
	
	goog.events.listen(this._anchorElement, 'click', function(event){
		if (goog.dom.classes.has(this._anchorElement, 'open')){
			this.deactivate();
		} else {
			this.activate();
		}
	}, undefined, this);
};

/**
 * @param {Array.<ol.Feature>} features
 * @private
 * @return {boolean}
 */
vk2.georeference.GeoreferencerChooser.prototype._collectionHasUnreferencedFeatures = function(features){
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
 * @param {string} opt_parentEl
 * @private
 */
vk2.georeference.GeoreferencerChooser.prototype._showChooseGeoreferencePage = function(blattnr, opt_parentEl){
	var parentEl = goog.isDef(opt_parentEl) && goog.dom.getElement(opt_parentEl) ? goog.dom.getElement(opt_parentEl) : document.body;
	var modal = new vk2.utils.Modal('vk2-modal-choosegeoref',parentEl, true);
	
	// parse the modal parameters
	var classes = 'choose-georef';
	var href = '/vkviewer/choosegeoref?blattnr='+blattnr

	modal.open(undefined, classes, {
		'href':href,
		'classes':classes
	});
};

/**
 * Should be triggered for activate the module.
 * @override
 */
vk2.georeference.GeoreferencerChooser.prototype.activate = function() {
	if (goog.DEBUG)
		console.log('GeoreferencerChooser activated.');
	
	if (goog.isDef(this._layer) && goog.isDef(this._map)){
		this._map.addLayer(this._layer);
		this._map.on('singleclick', this._selectEventHandler, this);
	};
	

	goog.dom.classes.add(this._anchorElement, 'open');
};

/**
 * Should be triggered for deactivate the module.
 * @override
 */
vk2.georeference.GeoreferencerChooser.prototype.deactivate = function() {
	if (goog.DEBUG)
		console.log('GeoreferencerChooser deactivated.');
	
	if (goog.isDef(this._layer) && goog.isDef(this._map)){
		this._map.removeLayer(this._layer);
		this._map.un('singleclick', this._selectEventHandler, this);
	};
	
	goog.dom.classes.remove(this._anchorElement, 'open');
};