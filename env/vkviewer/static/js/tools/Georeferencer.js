VK2.Tools.Georeferencer = VK2.Class({
	
	_settings: {
		urlParams: null,
		container: 'vk2GeoreferenceToolsPanel',
		handler: 'vk2GeoreferenceToolsHandle',
		map: null,
		controller: VK2.Controller.GeoreferenceController,
		vectorLayer: null,
		status: 'georeference' // possible characteristics: 'georeference' or 'validate'
	},
	
	_loadHTMLContent: function(){
		var toolContainer = $('<div/>', {
			'class': 'GeoreferenceToolsContent'
		}).appendTo('#vk2GeoreferenceToolsPanel');
		
		var unorderedList = $('<ul/>', {
			'id': 'controlsList',
			'class': 'controlsList'
		}).appendTo(toolContainer);
		
		// create tool list elements
		var moveMapEl = $('<li/>').appendTo(unorderedList);
		$('<input/>', {
			'type': 'radio',
			'name': 'type',
			'value': 'none',
			'id': 'noneToggle',
			'checked': 'checked'
		}).appendTo(moveMapEl);
		$('<label/>', {
			'for': 'noneToggle',
			'html': VK2.Utils.get_I18n_String('moveMap')	
		}).appendTo(moveMapEl);
		
		var setPointEl = $('<li/>').appendTo(unorderedList);
		$('<input/>', {
			'type': 'radio',
			'name': 'type',
			'value': 'point',
			'id': 'pointToggle'
		}).appendTo(setPointEl);
		$('<label/>', {
			'for': 'pointToggle',
			'html': VK2.Utils.get_I18n_String('setCornerPoint')	
		}).appendTo(setPointEl);
		
		var movePointEl = $('<li/>').appendTo(unorderedList);
		$('<input/>', {
			'type': 'radio',
			'name': 'type',
			'value': 'drag',
			'id': 'dragToggle'
		}).appendTo(movePointEl);
		$('<label/>', {
			'for': 'dragToggle',
			'html': VK2.Utils.get_I18n_String('moveCornerPoint')	
		}).appendTo(movePointEl);
		
		var delPointEl = $('<li/>').appendTo(unorderedList);
		$('<input/>', {
			'type': 'radio',
			'name': 'type',
			'value': 'delete',
			'id': 'deleteToggle'
		}).appendTo(delPointEl);
		$('<label/>', {
			'for': 'deleteToggle',
			'html': VK2.Utils.get_I18n_String('deleteCornerPoint')
		}).appendTo(delPointEl);
		
		// append further input elements
		$('<br/>').appendTo(unorderedList);
		$('<input/>', {
			'type':'hidden',
			'id': 'mtbid',
			'name': 'mtbid'
		}).appendTo(unorderedList);
		
		$('<input/>', {
			'type':'hidden',
			'id': 'points',
			'name': 'points'
		}).appendTo(unorderedList);
		
		this._loadHTMLEventBtns(unorderedList);
	},
	
	_loadHTMLEventBtns: function(unorderedList){
		var valueValidateBtn, valueSubmitBtn = '';
		if (this._settings.status == 'georeference'){
			valueValidateBtn = VK2.Utils.get_I18n_String('validateBtn_georeference');
			valueSubmitBtn = VK2.Utils.get_I18n_String('submitBtn_georeference');
		} else if (this._settings.status == 'validate'){
			valueValidateBtn = VK2.Utils.get_I18n_String('validateBtn_validate');
			valueSubmitBtn = VK2.Utils.get_I18n_String('submitBtn_validate');			
		};		
			
		$('<input/>', {
			'type':'button',
			'id': 'btnValidate',
			'class': 'vk2GeorefToolsBtn',
			'value': valueValidateBtn
		}).appendTo(unorderedList);
		
		$('<input/>', {
			'type':'button',
			'id': 'btnSubmit',
			'class': 'vk2GeorefToolsBtn',
			'value': valueSubmitBtn
		}).appendTo(unorderedList);		
	}, 
	
	_loadLayerPointsFromUrl: function(){
		if ('points' in this._settings.urlParams){		
			returnpoints = this._settings.urlParams['points'].split(',')
			for (zaehler in returnpoints) {
				latLon = returnpoints[zaehler];
				latLon = latLon.replace (/:/g, ",");
				latLon = latLon.split(",");
				kringel = new OpenLayers.Geometry.Point(latLon[0], latLon[1]);
				this._settings.vectorLayer.addFeatures([new OpenLayers.Feature.Vector(kringel)]);
			}	
		}		
	},
	
	_loadGeoreferenceToolLayers: function(){
		
		// load vector layer with specific stylemap amd specifc renderer
		var renderer = OpenLayers.Util.getParameters(window.location.href).renderer;
		renderer = (renderer) ? [renderer] : OpenLayers.Layer.Vector.prototype.renderers;
		
		this._settings.vectorLayer = new OpenLayers.Layer.Vector("Eckpunkte", {
			styleMap: VK2.Styles.FeatureLayerStyles._georeferenceLayerStyles,
			renderers: renderer
		});
		this._settings.map.addLayer(this._settings.vectorLayer);
		
		this._loadLayerPointsFromUrl();
	},
	
	_loadGeoreferenceTabSlider: function(){
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
	},
	
	_loadGeoreferenceTools: function(){
		this._loadGeoreferenceToolLayers();
		this._loadGeoreferenceTabSlider();
	},	
	
	_updateSettings: function(settings){
		for (var key in settings){
			this._settings[key] = settings[key];
		}		
	},
	
	_initializeGeoreferenceController: function(){
		this._settings.controller.initialize({
			map: this._settings.map,
			vectorLayer: this._settings.vectorLayer,
			urlParams: this._settings.urlParams,
			status: this._settings.status
		});
	},
	
	initialize: function(settings){
		this._updateSettings(settings);	
		this._loadHTMLContent();
		this._loadGeoreferenceTools();
		document.getElementById("mtbid").value = VK2.Utils.get_url_param('mtbid');
		this._initializeGeoreferenceController();
	}

});
	

