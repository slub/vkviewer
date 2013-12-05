VK2.Layer.GeoreferenceSearchLayer = VK2.Class({
	
	_settings: {
		wmsLayer: null,
		selectLayer: null,
		requestWfs: null,
		map: null,
		controls: {
			getfeature: null
		}, 
		eventListeners: {
			featureselected: function(e){
				this._settings.selectLayer.addFeatures([e.feature]);
				console.log("Feature selected - MTB "+e.feature.attributes.blattnr+", ID "+e.feature.attributes.id);

	            // display data in fancybox
				var targetHref = VK2.Utils.getHost('vkviewer/choosegeoref?blattnr=') + e.feature.attributes.blattnr;
	            $.fancybox.open([
	                { 
	                    'href': targetHref,
	        			'width': '100%',
	        			'height': '100%',
	        			'type': 'iframe'
	                }
	            ]);
			},
			featureunselected: function(e){
				this._settings.selectLayer.removeFeatures([e.feature]);
				console.log("Feature unselected!");
			}
		}
	},

	_addLayersToMap: function(){
		this._settings.map.addLayers([this._settings.wmsLayer, this._settings.selectLayer]);
	},
	
	_addGetFeaturesControlToMap: function(){
		this._settings.map.addControl(this._settings.controls.getfeature);
		this._settings.controls.getfeature.activate();
	},

	_removeLayersToMap: function(){
		this._settings.map.removeLayer(this._settings.wmsLayer);
		this._settings.map.removeLayer(this._settings.selectLayer);
	},
	
	_removeGetFeaturesControlToMap: function(){
		this._settings.map.removeControl(this._settings.controls.getfeature);
		this._settings.controls.getfeature.deactivate();
	},
	
	_loadOLElements: function(){
		this._settings.selectLayer = new OpenLayers.Layer.Vector("georeferencer_select_1",{
			styleMap: new OpenLayers.Style(OpenLayers.Feature.Vector.style["select"])
		});
		
		this._settings.controls.getfeature = new OpenLayers.Control.GetFeature({
			name: "georeferencer_control_1",
            protocol: this._settings.requestWfs	
		});
		
		for (var key in this._settings.eventListeners){
			this._settings.controls.getfeature.events.register(key, this, this._settings.eventListeners[key]);
		}
		
	},
	
	_updateSettings: function(settings){
		for (var key in settings){
			this._settings[key] = settings[key];
		}		
	},
	
	initialize: function(settings){
		this._updateSettings(settings);
		this._loadOLElements()
	},
	
	activate: function(){
		this._addLayersToMap();
		this._addGetFeaturesControlToMap();
	},
	
	deactivate: function(){
		this._removeLayersToMap();
		this._removeGetFeaturesControlToMap();
	}
	
})