VK2.Controller.GeoreferenceController = (function(){
	
	// define DeleteFeature
	var DeleteFeature = OpenLayers.Class(OpenLayers.Control, {
		initialize: function(layer, options) {
			OpenLayers.Control.prototype.initialize.apply(this, [options]);
			this.layer = layer;
			this.handler = new OpenLayers.Handler.Feature(
			this, layer, {click: this.clickFeature}
			);
		},
		clickFeature: function(feature) {
		// if feature doesn't have a fid, destroy it
			if(feature.fid == undefined) {
				this.layer.destroyFeatures([feature]);
			} else {
				this.layer.drawFeature(feature,{display: "none"}) ;
				this.layer.removeFeatures(feature)
				//feature.state = OpenLayers.State.DELETE;
				this.layer.events.triggerEvent("afterfeaturemodified", {feature: feature});
				//feature.renderIntent = "select";
			}
		},
		setMap: function(map) {
			this.handler.setMap(map);
			OpenLayers.Control.prototype.setMap.apply(this, arguments);
		},
		CLASS_NAME: "OpenLayers.Control.DeleteFeature"
	});
	
	var _settings = {
			map: null,
			vectorLayer: null,
			toggleElements: {
				moveMap: 'noneToggle',
				drawPoint: 'pointToggle',
				movePoint: 'dragToggle',
				deletePoint: 'deleteToggle'
			},
			formElements: {
				hiddenPoints: 'points',
				hiddenMtbId: 'mtbid',
				btnValidate: 'btnValidate',
				btnSubmit: 'btnSubmit'
			},
			loadingScreen: 'georefLoadingScreen',
			urls: {
				validate: '/validates',
				submit: '/submits'
			}
			
	};
	
	var _controls = {};

	
	var _loadOLControls = function(){
		_controls = {
			point: new OpenLayers.Control.DrawFeature(_settings.vectorLayer,
						OpenLayers.Handler.Point, {
							eventListeners: { 
								"featureadded": function(){
									if (this.layer.features.length > 4)
										alert('Nur 4 Eckpunkte zulässig');
									this.layer.removeFeatures(this.layer.features[4]);
								}
							}
			}),
			drag: new OpenLayers.Control.DragFeature(_settings.vectorLayer),
			modify: new OpenLayers.Control.ModifyFeature(_settings.vectorLayer),
			"delete": new DeleteFeature(_settings.vectorLayer)			
		};
		
		for (var key in _controls){
			_settings.map.addControl(_controls[key]);
		}
	};
	
	/**
	 * Method: _loadToggleEvents
	 * Before this method is run the _loadOLControls() has to be exectued.
	 */
	var _loadToggleEvents = function(){
		var controls = _controls;
		for (var key in _settings.toggleElements){
			$('#'+_settings.toggleElements[key]).click(function(event){
				for (var key in controls){
					var control = controls[key];
					if (event.currentTarget.value == key && event.currentTarget.checked) {
						control.activate();
					} else {
						control.deactivate();
					}
				}
			})
		}
	};
	
	var _loadBtnClickEvents = function(){
		var vectorLayer = _settings.vectorLayer;
		
		// event for computing validation result
		$('#'+_settings.formElements.btnValidate).click(function(event){
			if (_validateInputs(vectorLayer)){
				var mtbid = document.getElementById(_settings.formElements.hiddenMtbId).value;
				var clipParams = document.getElementById(_settings.formElements.hiddenPoints).value;
				console.log(mtbid);
				console.log(clipParams);
				
				// set loading screen
				$('#'+_settings.loadingScreen).css({'display':'block','z-index': '2000'});
				
				// send ajax request 
				$.ajax({
					'url': _settings.urls.validate,
					'type': 'GET',
					'data': {
						'mtbid': mtbid,
						'points': clipParams
					},
					success: function(data){
						$('#'+_settings.loadingScreen).css({'display':'none','z-index': '0'});
						console.log(data);
					},
					error: function(data){
						$('#'+_settings.loadingScreen).css({'display':'none','z-index': '0'});
						alert('Es konnte keine Validierung berechnet werden');
					},
					complete: function(data){
						$('#'+_settings.loadingScreen).css({'display':'none','z-index': '0'});
					}
				})
			} else {
				console.log('inputs are not valide');
			}
		})
	};
	
	var _loadClickEvents = function(){
		_loadToggleEvents();
		_loadBtnClickEvents();
	};
	
	var _validateInputs = function(vectorLayer){
		if (vectorLayer.features.length < 4){
			alert('4 Eckpunkte benötigt');
			return false;
		} else {
			var hiddenElement = document.getElementById(_settings.formElements.hiddenPoints);
			for (var i in vectorLayer.features) {
				hiddenElement.value = hiddenElement.value + vectorLayer.features[i].geometry.x + ":" +
					vectorLayer.features[i].geometry.y; 
				hiddenElement.value = (i < (vectorLayer.features.length - 1)) ? hiddenElement.value +
						"," : hiddenElement.value + "";
			}
			return true;
			
		}
	};
	
	return {
		
		initialize: function(settings){
			// update settings
			for (var key in settings){
				_settings[key] = settings[key];
			}
			
			_loadOLControls();
			_loadClickEvents();
			//_loadOLMapEventListeners();
		},
		
		getMap: function(settings){
			return _settings.map;
		}
	}
}());