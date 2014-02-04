goog.provide('VK2.Tools.Georeferencer');

goog.require('goog.dom');

/**
 * @param {Object} settings
 * @param {string} mtb_id
 * @constructor
 */
VK2.Tools.Georeferencer = function(settings, mtb_id){
	
	/**
	 * @type {Object}
	 * @private
	 */
	this._settings = {
		urlParams: null,
		container: 'vk2GeoreferenceToolsPanel',
		handler: 'vk2GeoreferenceToolsHandle',
		map: null,
		controller: VK2.Controller.GeoreferenceController,
		vectorLayer: null,
		status: 'georeference' // possible characteristics: 'georeference' or 'validate'
	} 
	
	// update settings
	for (var key in settings){
		if (settings.hasOwnProperty(key))
			this._settings[key] = settings[key];
	};
	
	this._loadHTMLContent();
	this._loadGeoreferenceTools();
	document.getElementById("mtbid").value = mtb_id;
	this._initializeGeoreferenceController();
}

/**
 * @private
 */
VK2.Tools.Georeferencer.prototype._initializeGeoreferenceController = function(){
	this._settings.controller.initialize({
		map: this._settings.map,
		vectorLayer: this._settings.vectorLayer,
		urlParams: this._settings.urlParams,
		status: this._settings.status
	});
};

/**
 * @private
 */
VK2.Tools.Georeferencer.prototype._loadHTMLContent = function(){
	
	var tool_container = goog.dom.createDom('div',{'class': 'GeoreferenceToolsContent'});
	goog.dom.appendChild(goog.dom.getElement(this._settings.container) ,tool_container);
	
	// create tool list elements
	// move map
	var divEl_MoveMap = goog.dom.createDom('div',{'class':'radio'});
	goog.dom.appendChild(tool_container ,divEl_MoveMap);
	
	var inputEl_moveMap = goog.dom.createDom('input', {
		'type': 'radio',
		'name': 'type',
		'value': 'none',
		'id': 'noneToggle',
		'checked': 'checked'
	});
	var label_moveMap = goog.dom.createDom('label',{})
	goog.dom.appendChild(label_moveMap, inputEl_moveMap);
	goog.dom.appendChild(label_moveMap, goog.dom.createDom('span',{'innerHTML':VK2.Utils.get_I18n_String('moveMap')}));
	goog.dom.appendChild(divEl_MoveMap, label_moveMap);

	// set point 	
	var divEl_setPoint = goog.dom.createDom('div',{'class':'radio'});
	goog.dom.appendChild(tool_container ,divEl_setPoint);
	
	var inputEl_setPoint = goog.dom.createDom('input', {
		'type': 'radio',
		'name': 'type',
		'value': 'point',
		'id': 'pointToggle',
	});
	var label_setPoint = goog.dom.createDom('label',{})
	goog.dom.appendChild(label_setPoint, inputEl_setPoint);
	goog.dom.appendChild(label_setPoint, goog.dom.createDom('span',{'innerHTML':VK2.Utils.get_I18n_String('setCornerPoint')}));
	goog.dom.appendChild(divEl_setPoint, label_setPoint);
	
	// drag point
	var divEl_dragPoint = goog.dom.createDom('div',{'class':'radio'});
	goog.dom.appendChild(tool_container ,divEl_dragPoint);
	
	var inputEl_dragPoint = goog.dom.createDom('input', {
		'type': 'radio',
		'name': 'type',
		'value': 'drag',
		'id': 'dragToggle',
	});
	var label_dragPoint = goog.dom.createDom('label',{})
	goog.dom.appendChild(label_dragPoint, inputEl_dragPoint);
	goog.dom.appendChild(label_dragPoint, goog.dom.createDom('span',{'innerHTML':VK2.Utils.get_I18n_String('moveCornerPoint')}));
	goog.dom.appendChild(divEl_dragPoint, label_dragPoint);
	
	// del point 
	var divEl_delPoint = goog.dom.createDom('div',{'class':'radio'});
	goog.dom.appendChild(tool_container ,divEl_delPoint);
	
	var inputEl_delPoint = goog.dom.createDom('input', {
		'type': 'radio',
		'name': 'type',
		'value': 'delete',
		'id': 'deleteToggle',
	});
	var label_delPoint = goog.dom.createDom('label',{})
	goog.dom.appendChild(label_delPoint, inputEl_delPoint);
	goog.dom.appendChild(label_delPoint, goog.dom.createDom('span',{'innerHTML':VK2.Utils.get_I18n_String('deleteCornerPoint')}));
	goog.dom.appendChild(divEl_delPoint, label_delPoint);
		
	// append further input elements
	goog.dom.appendChild(tool_container, goog.dom.createDom('br',{}));
	
	var hidden_mtbid = goog.dom.createDom('input',{
		'type':'hidden',
		'id': 'mtbid',
		'name': 'mtbid'
	});
	goog.dom.appendChild(tool_container, hidden_mtbid);

	var hidden_points = goog.dom.createDom('input',{
		'type':'hidden',
		'id': 'points',
		'name': 'points'
	});
	goog.dom.appendChild(tool_container, hidden_points);
	
	this._loadHTMLEventBtns(tool_container);
};

/**
 * @param {Element} container_element
 * @private
 */
VK2.Tools.Georeferencer.prototype._loadHTMLEventBtns = function(container_element){
	var valueValidateBtn, valueSubmitBtn = '';
	if (this._settings.status == 'georeference'){
		valueValidateBtn = VK2.Utils.get_I18n_String('validateBtn_georeference');
		valueSubmitBtn = VK2.Utils.get_I18n_String('submitBtn_georeference');
	} else if (this._settings.status == 'validate'){
		valueValidateBtn = VK2.Utils.get_I18n_String('validateBtn_validate');
		valueSubmitBtn = VK2.Utils.get_I18n_String('submitBtn_validate');			
	};		
		
	var validate_button = goog.dom.createDom('input',{
		'type':'button',
		'id': 'btnValidate',
		'class': 'vk2GeorefToolsBtn btn btn-default',
		'value': valueValidateBtn
	});
	goog.dom.appendChild(container_element, validate_button);
	
	var submit_button = goog.dom.createDom('input',{
		'type':'button',
		'id': 'btnSubmit',
		'class': 'vk2GeorefToolsBtn btn btn-default',
		'value': valueSubmitBtn
	});
	goog.dom.appendChild(container_element, submit_button);
};

/**
 * @private
 */
VK2.Tools.Georeferencer.prototype._loadLayerPointsFromUrl = function(){
	if (this._settings.urlParams.get('points')){		
		returnpoints = this._settings.urlParams.get('points').split(',')
		for (zaehler in returnpoints) {
			latLon = returnpoints[zaehler];
			latLon = latLon.replace (/:/g, ",");
			latLon = latLon.split(",");
			kringel = new OpenLayers.Geometry.Point(latLon[0], latLon[1]);
			this._settings.vectorLayer.addFeatures([new OpenLayers.Feature.Vector(kringel)]);
		}	
	}		
};

/**
 * @private
 */
VK2.Tools.Georeferencer.prototype._loadGeoreferenceToolLayers = function(){
		
	// load vector layer with specific stylemap amd specifc renderer
	var renderer = OpenLayers.Util.getParameters(window.location.href).renderer;
	renderer = (renderer) ? [renderer] : OpenLayers.Layer.Vector.prototype.renderers;
	
	this._settings.vectorLayer = new OpenLayers.Layer.Vector("Eckpunkte", {
		styleMap: VK2.Styles.FeatureLayerStyles._georeferenceLayerStyles,
		renderers: renderer
	});
	this._settings.map.addLayer(this._settings.vectorLayer);
	
	this._loadLayerPointsFromUrl();
};

/**
 * @private
 */
VK2.Tools.Georeferencer.prototype._loadGeoreferenceTabSlider = function(){
	$('#'+this._settings.container).tabSlideOut({
	    tabHandle: '.'+this._settings.handler,  
	    pathToTabImage: $('#'+this._settings.handler).attr('data-open'),       
	    pathToTabImageClose: $('#'+this._settings.handler).attr('data-close'),
	    imageHeight: '40px',                               
	    imageWidth: '40px',  
	    speed: 300,           
	    action: 'click',     
	    topPos: '250px',      
	    fixedPosition: false,
	    onLoadSlideOut: true
	});
};

/**
 * @private
 */
VK2.Tools.Georeferencer.prototype._loadGeoreferenceTools = function(){
	this._loadGeoreferenceToolLayers();
	this._loadGeoreferenceTabSlider();
};	
	

