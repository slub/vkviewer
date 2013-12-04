/**
 * function: addGeoreferencer
 * 
 * This functions adds a sidebar panel + behavior for getting into the georeference process 
 * on the front page.
 */
VK2.Tools.Georeferencer = VK2.Class({
	
	_settings: {
		urlParams: null,
		container: 'vk2GeoreferenceToolsPanel',
		handler: 'vk2GeoreferenceToolsHandle',
		map: null,
		controller: VK2.Controller.GeoreferenceController,
		vectorLayer: null,
		status: 'georeference'
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
		this._loadGeoreferenceTools();
		document.getElementById("mtbid").value = VK2.Utils.get_url_param('mtbid');
		this._initializeGeoreferenceController();
	}

});
	

