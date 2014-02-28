goog.provide('VK2.Tools.Georeferencer');

goog.require('goog.object');
goog.require('goog.dom');
goog.require('goog.dom.classes');
goog.require('goog.events');
goog.require('goog.events.EventType');
goog.require('goog.net.XhrIo');
goog.require('goog.net.EventType');

/**
 * extension for ol.FeatureOverlay
 */
ol.FeatureOverlay.prototype.removeAllFeatures = function(){
	this.getFeatures().clear();
};

/**
 * @param {string} mapContainerId
 * @param {number|string} objectid
 * @param {Object} settings
 * @constructor
 */
VK2.Tools.Georeferencer = function(mapContainerId, objectId, settings){
	
	/**
	 * @type {Object}
	 * @private
	 */
	this._settings = {
		'width': null,
		'height': null,
		'url': '',
		'zoomify': true,
		'georef_params': '',
		'georef_id': undefined
	};
	goog.object.extend(this._settings, settings);
	
	/**
	 * @type {Object}
	 * @private
	 */
	this._urls = {
			'process_submit':'/vkviewer/georef/confirm',
			'process_validation':'/vkviewer/georef/validate',
			'display_validation': '/vkviewer/georeference/validate',
			'main_page':'/vkviewer/auth?georef=on&points=20',
			'proxy': '/vkviewer/proxy/?url='
	};
	if (goog.isDef(settings.urls)) goog.object.extend(this._urls, settings.urls);
	
	/**
	 * @type {boolean}
	 * @private
	 */
	this._isValidationState = goog.isDef(this._settings.georef_id) && goog.isDef(this._settings.georef_params) 
	
	/**
	 * @type {string}
	 * @private
	 */
	this._mapContainerId = mapContainerId;
	
	/**
	 * @type {string}
	 * @private
	 */
	this._objectId = objectId;
	
	/**
	 * @type {Object.<string>}
	 * @private
	 */
	this._defaultStyles = {
			'point': [
			    new ol.style.Style({
			    	image: new ol.style.Circle({
			    		radius: 7,
			    		fill: new ol.style.Fill({
			    			color: 'rgba(255, 255, 255, 0.6)'
			    		}),
			    		stroke: new ol.style.Stroke({
			    			color: '#319FD3',
			    			width: 1.5
			    		})
			    	})
			  })],
			 'hover': [
			    new ol.style.Style({
			    	image: new ol.style.Circle({
			    		radius: 7,
					    fill: new ol.style.Fill({
					    	color: 'rgba(255,0,0,0.1)'
					    }),
					    stroke: new ol.style.Stroke({
					    	color: '#f00',
					    	width: 1
					    })
			    	}),
			    	zIndex: 100000
			 })]
	}
	
	// init zoomify layer 
	if (this._settings.zoomify) {
		this._loadZoomifyLayer();
	}
	
	this._loadToolbox();
	this._loadGeoreferenceControls();
	
	// open toolbox
	$(this._controlElement).click();
	
	if (goog.isDef(this._settings.georef_params) && this._settings.georef_params != ''){
		this._loadGeorefParams(this._drawSource, this._settings.georef_params);
	}
};

/**
 * @param {ol.source.Vector} source
 * @param {string}
 * @private
 */
VK2.Tools.Georeferencer.prototype._loadGeorefParams = function(source, georef_params){
	var points = georef_params.split(',')
	for (var i = 0; i < points.length; i++) {
		var latLon = points[i];
		latLon = latLon.replace (/:/g, ",");
		latLon = latLon.split(",");
		
		// recalculate longitute value and parse Int
		latLon[0] = parseInt(latLon[0]);
		latLon[1] = parseInt(latLon[1]) - parseInt(this._settings.height);
		var point = new ol.Feature(new ol.geom.Point(latLon));
		source.addFeatures([point]);
	}	
};

/**
 * @private
 */
VK2.Tools.Georeferencer.prototype._loadToolbox = function(){
	var toolboxContainer = goog.dom.createDom('div',{
		'class':'georeference-tools-container',
		'id':'georeference-tools-container'
	});
	goog.dom.appendChild(goog.dom.getElement(this._mapContainerId), toolboxContainer);
	
	// append anchor element
	/**
	 * @type {Element}
	 * @private
	 */
	this._controlElement = goog.dom.createDom('div',{
		'class': 'georeference-tools-handler'
	});
	goog.dom.appendChild(toolboxContainer, this._controlElement);
	goog.dom.appendChild(this._controlElement, goog.dom.createDom('span',{'class':'icon'}));
	
	// load html content 
	goog.dom.appendChild(toolboxContainer, this._loadToolHtmlContent());
	
	// load html content for loading screen
	goog.dom.appendChild(goog.dom.getElement(this._mapContainerId), this._loadLoadingScreenHtmlContent());
	
	// load behavior
	this._loadOpenCloseBehavior(this._controlElement);
};

/**
 * This function just creates the html elements for the loading screen
 * @return {Element}
 */
VK2.Tools.Georeferencer.prototype._loadLoadingScreenHtmlContent = function(){

	var loadingScreenContainer = goog.dom.createDom('div',{
		'id': 'georefLoadingScreen',
		'class': 'georefLoadingScreen'
	});
	
	var centerContainer = goog.dom.createDom('div',{'class':'centerLoading'});
	goog.dom.appendChild(loadingScreenContainer, centerContainer)
	
	var progressBarContainer = goog.dom.createDom('div',{'class':'progress progress-striped active'});
	goog.dom.appendChild(centerContainer, progressBarContainer);
	
	var progressBar = goog.dom.createDom('div',{
		'class':'progress-bar',
		'role':'progressbar',
		'aria-valuenow':'100',
		'aria-valuemin':'0',
		'aria-valuemax':'100',
		'style':'width:100%'		
	});
	goog.dom.appendChild(progressBarContainer, progressBar);
	
	return loadingScreenContainer;
};

/**
 * This function needs jquery-ui to run.
 * @param {Element} controlElement
 * @private
 */
VK2.Tools.Georeferencer.prototype._loadOpenCloseBehavior = function(controlElement){
	goog.events.listen(controlElement, goog.events.EventType.CLICK, function(event){
		var width = goog.style.getSize(event.target.parentElement).width;
		var toolContainer = this._toolContainer;
		
		if (goog.dom.classes.has(event.target, 'open')){
			$(event.target.parentElement).animate({'left': '-250px'}, 1000,	function(){
				goog.dom.classes.remove(event.target, 'open');
				goog.style.setStyle(toolContainer,'display','none');
			});
		} else {
			goog.style.setStyle(toolContainer,'display','block');
			$(event.target.parentElement).animate({'left': '-2px'}, 1000, function(){
				goog.dom.classes.add(event.target, 'open');
			});
		}
	}, undefined, this);
};

/**
 * @private
 * @return {Element}
 */
VK2.Tools.Georeferencer.prototype._loadToolHtmlContent = function(){
	
	var createInputElement = function(type, value, id, className, checked){
		var checked = goog.isDef(checked) ? checked : '';
		var className = goog.isDef(className) ? className : '';
		
		var inputElement = goog.dom.createDom('input',{
			'type': type,
			'name': 'type',
			'value': value,
			'id': id,
			'class': className,
			'checked': checked			
		});
		return inputElement;
	};
	
	/**
	 * @type {Element}
	 * @private
	 */
	this._toolContainer = goog.dom.createDom('div',{
		'class': 'georeference-tools-inner-container',
		'id': 'georeference-tools-inner-container'
	});
	
	// create tool list elements
	// move map
	var divEl_MoveMap = goog.dom.createDom('div',{'class':'radio'});
	goog.dom.appendChild(this._toolContainer ,divEl_MoveMap);
	
	var inputEl_moveMap = createInputElement('radio','none','noneToggle','toggle-elements','checked');
	var label_moveMap = goog.dom.createDom('label',{})
	goog.dom.appendChild(label_moveMap, inputEl_moveMap);
	goog.dom.appendChild(label_moveMap, goog.dom.createDom('span',{'innerHTML':VK2.Utils.get_I18n_String('moveMap')}));
	goog.dom.appendChild(divEl_MoveMap, label_moveMap);

	// set point 	
	var divEl_setPoint = goog.dom.createDom('div',{'class':'radio'});
	goog.dom.appendChild(this._toolContainer ,divEl_setPoint);
	var inputEl_setPoint = createInputElement('radio','addpoint','pointToggle','toggle-elements');
	var label_setPoint = goog.dom.createDom('label',{})
	goog.dom.appendChild(label_setPoint, inputEl_setPoint);
	goog.dom.appendChild(label_setPoint, goog.dom.createDom('span',{'innerHTML':VK2.Utils.get_I18n_String('setCornerPoint')}));
	goog.dom.appendChild(divEl_setPoint, label_setPoint);
	
	// drag point
	var divEl_dragPoint = goog.dom.createDom('div',{'class':'radio'});
	goog.dom.appendChild(this._toolContainer ,divEl_dragPoint);
	var inputEl_dragPoint = createInputElement('radio','dragpoint','dragToggle','toggle-elements');
	var label_dragPoint = goog.dom.createDom('label',{})
	goog.dom.appendChild(label_dragPoint, inputEl_dragPoint);
	goog.dom.appendChild(label_dragPoint, goog.dom.createDom('span',{'innerHTML':VK2.Utils.get_I18n_String('moveCornerPoint')}));
	goog.dom.appendChild(divEl_dragPoint, label_dragPoint);
	
	// del point 
	var divEl_delPoint = goog.dom.createDom('div',{'class':'radio'});
	goog.dom.appendChild(this._toolContainer ,divEl_delPoint);
	var inputEl_delPoint = createInputElement('radio','deletepoint','deleteToggle','toggle-elements');
	var label_delPoint = goog.dom.createDom('label',{})
	goog.dom.appendChild(label_delPoint, inputEl_delPoint);
	goog.dom.appendChild(label_delPoint, goog.dom.createDom('span',{'innerHTML':VK2.Utils.get_I18n_String('deleteCornerPoint')}));
	goog.dom.appendChild(divEl_delPoint, label_delPoint);
		
	// append further input elements
	goog.dom.appendChild(this._toolContainer, goog.dom.createDom('br',{}));
	
	var hidden_mtbid = goog.dom.createDom('input',{'type':'hidden','id': 'mtbid','name': 'mtbid'});
	goog.dom.appendChild(this._toolContainer, hidden_mtbid);

	var hidden_points = goog.dom.createDom('input',{'type':'hidden','id': 'points','name': 'points'});
	goog.dom.appendChild(this._toolContainer, hidden_points);
	
	// submit buttons
	var valueValidateBtn, valueSubmitBtn = '';
	if (this._isValidationState){
		valueValidateBtn = VK2.Utils.get_I18n_String('validateBtn_validate');
		valueSubmitBtn = VK2.Utils.get_I18n_String('submitBtn_validate');	
	} else {
		valueValidateBtn = VK2.Utils.get_I18n_String('validateBtn_georeference');
		valueSubmitBtn = VK2.Utils.get_I18n_String('submitBtn_georeference');
	};		
		
	var validate_button = goog.dom.createDom('input',{
		'type':'button',
		'class': 'vk2GeorefToolsBtn btn btn-default btn-validate',
		'value': valueValidateBtn
	});
	goog.dom.appendChild(this._toolContainer, validate_button);
	
	var submit_button = goog.dom.createDom('input',{
		'type':'button',
		'class': 'vk2GeorefToolsBtn btn btn-default btn-submit',
		'value': valueSubmitBtn
	});
	goog.dom.appendChild(this._toolContainer, submit_button);
	
	return this._toolContainer;
};

/**
 * @private
 */
VK2.Tools.Georeferencer.prototype._loadZoomifyLayer = function(){
	var imgCenter = [this._settings.width / 2, - this._settings.height / 2];
	var extent = [0, 0, this._settings.width, this._settings.height];
	
	// Maps always need a projection, but Zoomify layers are not geo-referenced, and
	// are only measured in pixels.  So, we create a fake projection that the map
	// can use to properly display the layer.
	var proj = new ol.proj.Projection({
		code: 'ZOOMIFY',
		units: 'pixels',
		extent: extent
	});
	
	/**
	 * @type {ol.source.Zoomify}
	 * @private
	 */
	this._zoomifySource = new ol.source.Zoomify({
		  url: this._settings.url,
		  size: [this._settings.width, this._settings.height]
	});
	
	/**
	 * @type {ol.control.FullScreen}
	 * @private
	 */
	this._fullscreenControl = new ol.control.FullScreen();
	
	/**
	 * @type {ol.Map}
	 * @private
	 */
	this._map = new ol.Map({
	  layers: [
		    new ol.layer.Tile({
		    	source: this._zoomifySource
		    })
	  ],
	  interactions: ol.interaction.defaults().extend([
            new ol.interaction.DragZoom()
	  ]),
	  controls: [
	   	    this._fullscreenControl,
		    new ol.control.Zoom()
	  ],
	  renderer: 'canvas',
	  target: this._mapContainerId,
	  view: new ol.View2D({
		    projection: proj,
		    center: imgCenter,
		    //adjust initial and max zoom level here
			zoom: 2,
			maxZoom: 9
	  })
	}); 
};

/**
 * @private
 */
VK2.Tools.Georeferencer.prototype._loadGeoreferenceControls = function(){
	
	var styleArrayPoint = this._defaultStyles['point'];
	
	/**
	 * @type {ol.source.Vector}
	 * @private
	 */
	this._drawSource = new ol.source.Vector();
	
	/**
	 * @type {ol.layer.Vector}
	 * @private
	 */
	
	this._drawLayer = new ol.layer.Vector({
		  source: this._drawSource,
		  styleFunction: function(feature, resolution) {
			  return styleArrayPoint;
		  }
	});
	
	this._map.addLayer(this._drawLayer);
	
	// now create the events
	this._loadToggleControls(this._map, this._drawSource);
	this._loadButtonEvents()
}

VK2.Tools.Georeferencer.prototype._loadButtonEvents = function(){
	var validateBtn = goog.dom.getElementByClass('btn-validate', this._toolContainer);
	var submitBtn = goog.dom.getElementByClass('btn-submit', this._toolContainer);
	
	// for showing loading screen
	var loadingPanel = goog.dom.getElement('georefLoadingScreen');
	var urls = this._urls;
	
	// event for validate button
	goog.events.listen(validateBtn, goog.events.EventType.CLICK, function(event){
		var georef_params = this._validateGeorefParams();
		if (!goog.isDef(georef_params)){
			alert('Please check your georeference params! Are there 4 points?');
			return undefined;
		};		
		
		var fullscreen = this._fullscreenControl;
		var successHandler = function(data){
			// for preventing strange fullscreen behavior in new loaded page
			fullscreen.element.children[0].click()

			var href = urls.display_validation + '?points=' + georef_params + "&";
				
			// add old query parameter
			var url = new goog.Uri(window.location.href);
			var keys =  url.getQueryData().getKeys()
			for (var i = 0; i < keys.length; i++){
				if (keys[i] != 'points' && keys[i] != 'layer_id' && keys[i] != 'wms_url' && keys[i] != 'georefid')
					href = href + keys[i] + '=' + url.getQueryData().get(keys[i]) + '&';
			}
				
			// add new query parameter
			var parsed_data = JSON.parse(data)
			for (var key in parsed_data){
				if (parsed_data.hasOwnProperty(key))
					href = href + key + '=' + parsed_data[key] + '&';
			}
				
			window.location.href = href;
		};
		
		var errorHandler = function(event){
			goog.style.setStyle(georefLoadingScreen,'display','none');
			goog.style.setStyle(georefLoadingScreen,'z-index','0');
			alert('Something went wrong, while trying to compute validation result');
		};
		
		goog.style.setStyle(georefLoadingScreen,'display','block');
		goog.style.setStyle(georefLoadingScreen,'z-index','2000');
		VK2.Requests.Georeferencer.validate(urls.process_validation, this._objectId, georef_params, successHandler, errorHandler);
		
	}, undefined, this);
	
	goog.events.listen(submitBtn, goog.events.EventType.CLICK, function(event){
		
		var georef_params = this._validateGeorefParams();
		var georefid = this._settings.georef_id;
		if (!goog.isDef(georef_params)){
			alert('Please check your georeference params! Are there 4 points?');
			return undefined;
		};		
		
		var successHandler = function(data){
			var anchor = goog.dom.createDom('a', {'href':urls.main_page,'target':'_top'});
			goog.dom.appendChild(document.body, anchor);
			anchor.click();
		};
		
		var errorHandler = function(event){
			goog.style.setStyle(georefLoadingScreen,'display','none');
			goog.style.setStyle(georefLoadingScreen,'z-index','0');
			alert('Something went wrong, while trying to submit georeference parameter');
		};
		
		if (this._isValidationState){
			goog.style.setStyle(georefLoadingScreen,'display','block');
			goog.style.setStyle(georefLoadingScreen,'z-index','2000');
			VK2.Requests.Georeferencer.submit(urls.process_submit, this._objectId, undefined, georefid, successHandler, errorHandler);
		} else {
			goog.style.setStyle(georefLoadingScreen,'display','block');
			goog.style.setStyle(georefLoadingScreen,'z-index','2000');
			VK2.Requests.Georeferencer.submit(urls.process_submit, this._objectId, georef_params, undefined, successHandler, errorHandler);
		}
	}, undefined, this);
};

/**
 * @private
 * @return {string|undefined}
 */
VK2.Tools.Georeferencer.prototype._validateGeorefParams = function(){
	var features = this._drawSource.getAllFeatures();
	if (features.length < 4){
		return undefined;
	} else {
		var georef_params = '';
		for (var i = 0; i < features.length; i++) {
			var coordinates = features[i].getGeometry().getCoordinates();
			georef_params = georef_params + Math.round(coordinates[0]) + ":" + Math.round(parseInt(this._settings.height) + coordinates[1]); 
			georef_params = (i < (features.length - 1)) ? georef_params +
				"," : georef_params + "";
		}
		return georef_params;
	};
}

/**
 * @param {ol.Map} map
 * @param {ol.source.Vector} drawSource;
 * @private
 */
VK2.Tools.Georeferencer.prototype._loadToggleControls = function(map, drawSource){

	var styleArrayHover = this._defaultStyles['hover'];

	// append overlay style
	var overlay = new ol.FeatureOverlay({
		styleFunction: function(feature, resolution) {
			  return styleArrayHover;
		  }
	});
	
	var interactions = {
			'addpoint': [
			    new ol.interaction.Draw({
			    	source: drawSource,
			    	type: 'Point',
			    	styleFunction: function(feature, resolution) {
			    		return styleArrayHover
					}
			    })
			],
			'dragpoint': [
			    new ol.interaction.Modify({
			    	featureOverlay: overlay,
			    	pixelTolerance: 10
			    }),
			    new ol.interaction.Select({
			    	featureOverlay: overlay,
			    	pixelTolerance: 5
				})
			],
			'deletepoint': [
			   new ol.interaction.DeleteFeature({
			      	featureOverlay: overlay,
			    	pixelTolerance: 5				   
			   }, drawSource)
			]
	};
	
	// add listener event
	goog.events.listen(this._drawSource, 'addfeature', function(e){
		var allFeatures = this._drawSource.getAllFeatures()
		var alertMsg_counter = 0;
		//check for corner point number (<4!)
		if (allFeatures.length > 4){
			alert(VK2.Utils.get_I18n_String('checkCornerPoint_count'));
			alertMsg_counter++;
			this._drawSource.removeFeature(allFeatures[4]);
		}
		//check if corner points are too close together
		console.log (allFeatures[allFeatures.length - 1].getGeometry().getCoordinates()+" (Zuletzt gesetzt)");
		var lastFeature_coords = allFeatures[allFeatures.length - 1].getGeometry().getCoordinates();		
		for (var x = 0; x < allFeatures.length-1; x++){
			var tempFeature_coords = allFeatures[x].getGeometry().getCoordinates();
			var distX = (Math.round(lastFeature_coords[0]) - Math.round(tempFeature_coords[0])).toString(); 
			var distY = (Math.round(lastFeature_coords[1]) - Math.round(tempFeature_coords[1])).toString();
			distX = distX.replace(/\-/g, "");
			distY = distY.replace(/\-/g, "");
			//change distance buffer here
			if ((parseInt(distX) < 3000) & (parseInt(distY) < 3000))  {
				if(alertMsg_counter > 0){
					return;
				}else{
					alert (VK2.Utils.get_I18n_String('checkCornerPoint_distance'));
					alertMsg_counter++;
					this._drawSource.removeFeature(allFeatures[allFeatures.length-1]);
				}
			}
		
		}
	}, undefined, this);

	
	// toggle controller
	var toggleElements = goog.dom.getElementsByTagNameAndClass('input','toggle-elements',this._toolContainer);
	for (var i = 0; i < toggleElements.length; i++){
		goog.events.listen(toggleElements[i], goog.events.EventType.CLICK, function(event){
			this._removeInteractions(interactions, map, overlay)
			
			
			// add choosen interaction
			if (goog.isDef(event.target.value) && event.target.value != ''){
				if (interactions.hasOwnProperty(event.target.value)){
					for (var i = 0; i < interactions[event.target.value].length; i++){
						map.addInteraction(interactions[event.target.value][i]);
					}
				}
			}				
		}, undefined, this);
	}
}

/**
 * @param {array<ol.interaction>} interactions
 * @param {ol.Map} map
 * @param {ol.FeatureOverlay} overlay
 * @private
 */
VK2.Tools.Georeferencer.prototype._removeInteractions = function(interactions, map, overlay){
	// at first remove all interactions
	for (var key in interactions){
		if (interactions.hasOwnProperty(key)){
			for (var i = 0; i < interactions[key].length; i++){
				map.removeInteraction(interactions[key][i]);
				overlay.removeAllFeatures();
			}
		}
	}
}

/**
 * @param {string} mapContainerId
 * @param {string} wms_url Url to the web mapping service which publish the validation file
 * @param {string} layer_id
 * @static
 */
VK2.Tools.Georeferencer.prototype.loadValidationMap = function(map_container_id, wms_url, layer_id){
	
	/**
	 * @type {ol.layer.Tile}
	 * @private
	 */
	var osm_layer = new ol.layer.Tile({
		source: new ol.source.OSM()
	});
	
	/**
	 * @type {ol.source.TileWMS}
	 * @private
	 */
	var validation_layer = new ol.layer.Tile({
			source: new ol.source.TileWMS({
				url: wms_url,
				params: {
					'LAYERS':layer_id,
					'VERSION': '1.1.1'
				},
				projection: 'EPSG:900913'
			})
	});

	/**
	 * @type {ol.Map}
	 * @private
	 */
	var map = new ol.Map({
	  layers: [ osm_layer, validation_layer ],
	  interactions: ol.interaction.defaults().extend([
	      new ol.interaction.DragZoom()
	  ]),
	  renderer: 'canvas',
	  target: map_container_id,
	  view: new ol.View2D({
		  	projection: 'EPSG:900913',
		    center: [0, 0],
		    zoom: 2
	  }),
	  controls: [
	       new ol.control.FullScreen(),
	       new ol.control.Zoom(),
	       new ol.control.Attribution()	       
	  ]
	});
	// zoom to extent by parsing getcapabilites request from wms
	var successHandler = function(data){
		var parser = new ol.parser.ogc.WMSCapabilities();
		var result = parser.read(data);
		var extent = [];
		for (var i = 0; i < result.capability.layers.length; i++){
			var bbox = result.capability.layers[i].bbox;
			if (bbox.hasOwnProperty('EPSG:4314')){
				bbox_4314 = result.capability.layers[i].bbox['EPSG:4314'].bbox;
				Proj4js.defs["EPSG:4314"] = "+proj=longlat +ellps=bessel +towgs84=582,105,414,1.04,0.35,-3.08,8.3 +no_defs"; 
				bbox_900913 = ol.proj.transform(bbox_4314, 'EPSG:4314', 'EPSG:900913');
				map.getView().fitExtent(bbox_900913, map.getSize());
			}
		}
	}
	
	var errorHandler = function(e){
		alert('Problems while parsing wms capabilities.');
	}
	
	var url = this._urls.proxy + wms_url;	
	VK2.Requests.Georeferencer.getExtentForWMS(url, successHandler, errorHandler)

	// load layerspy tool for validation map
	map.addControl(
		new ol3.control.LayerSpy({
			'spyLayer':new ol.layer.Tile({
				source: new ol.source.OSM(),
			}),
			'radius': 50
		})	 
	)
};