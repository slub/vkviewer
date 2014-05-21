goog.provide('vk2.georeference.ToolBox');

goog.require('goog.dom');
goog.require('goog.dom.classes');
goog.require('goog.events');
goog.require('goog.events.EventType');
goog.require('goog.style');
goog.require('vk2.utils');
goog.require('vk2.utils.Styles');
goog.require('vk2.georeference.DeleteFeatureInteraction');

/**
 * @param {Element|string} parentEl
 * @param {ol.Map} unreferencedMap
 * @param {ol.Map} referencedMap
 * @constructor
 */
vk2.georeference.ToolBox = function(parentEl, unreferencedMap, referencedMap){
	
	/**
	 * @type {Element}
	 * @private
	 */
	this._parentEl = goog.isString(parentEl) ? goog.dom.getElement(parentEl) : parentEl;
	
	/**
	 * @type {ol.Map}
	 * @private
	 */
	this._unreferencedMap = unreferencedMap;
	
	/**
	 * @type {ol.Map}
	 * @private
	 */
	this._referencedMap = referencedMap;
	
	this._loadToolBoxContainer(this._parentEl);	
	this._loadGeoreferenceControls();
	
	// open toolbox
	$(this._controlElement).click();
};

/**
 * @param {Element} parentEl
 * @private
 */
vk2.georeference.ToolBox.prototype._loadToolBoxContainer = function(parentEl){
	var toolboxContainer = goog.dom.createDom('div',{
		'class':'georeference-tools-container',
		'id':'georeference-tools-container'
	});
	goog.dom.appendChild(parentEl, toolboxContainer);
	
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
	goog.dom.appendChild(toolboxContainer, this._loadInnerToolBoxContent());
	
	// load html content for loading screen
	goog.dom.appendChild(parentEl, this._loadLoadingScreenHtmlContent());
	
	// load behavior
	this._loadOpenCloseBehavior(this._controlElement);
};

/**
 * @private
 * @return {Element}
 */
vk2.georeference.ToolBox.prototype._loadInnerToolBoxContent = function(){
	
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
	goog.dom.appendChild(label_moveMap, goog.dom.createDom('span',{'innerHTML':vk2.utils.getMsg('moveMap')}));
	goog.dom.appendChild(divEl_MoveMap, label_moveMap);

	// set point 	
	var divEl_setPoint = goog.dom.createDom('div',{'class':'radio'});
	goog.dom.appendChild(this._toolContainer ,divEl_setPoint);
	var inputEl_setPoint = createInputElement('radio','addpoint','pointToggle','toggle-elements');
	var label_setPoint = goog.dom.createDom('label',{})
	goog.dom.appendChild(label_setPoint, inputEl_setPoint);
	goog.dom.appendChild(label_setPoint, goog.dom.createDom('span',{'innerHTML':vk2.utils.getMsg('setCornerPoint')}));
	goog.dom.appendChild(divEl_setPoint, label_setPoint);
	
	// drag point
	var divEl_dragPoint = goog.dom.createDom('div',{'class':'radio'});
	goog.dom.appendChild(this._toolContainer ,divEl_dragPoint);
	var inputEl_dragPoint = createInputElement('radio','dragpoint','dragToggle','toggle-elements');
	var label_dragPoint = goog.dom.createDom('label',{})
	goog.dom.appendChild(label_dragPoint, inputEl_dragPoint);
	goog.dom.appendChild(label_dragPoint, goog.dom.createDom('span',{'innerHTML':vk2.utils.getMsg('moveCornerPoint')}));
	goog.dom.appendChild(divEl_dragPoint, label_dragPoint);
	
	// del point 
	var divEl_delPoint = goog.dom.createDom('div',{'class':'radio'});
	goog.dom.appendChild(this._toolContainer ,divEl_delPoint);
	var inputEl_delPoint = createInputElement('radio','deletepoint','deleteToggle','toggle-elements');
	var label_delPoint = goog.dom.createDom('label',{})
	goog.dom.appendChild(label_delPoint, inputEl_delPoint);
	goog.dom.appendChild(label_delPoint, goog.dom.createDom('span',{'innerHTML':vk2.utils.getMsg('deleteCornerPoint')}));
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
		valueValidateBtn = vk2.utils.getMsg('validateBtn_validate');
		valueSubmitBtn = vk2.utils.getMsg('submitBtn_validate');	
	} else {
		valueValidateBtn = vk2.utils.getMsg('validateBtn_georeference');
		valueSubmitBtn = vk2.utils.getMsg('submitBtn_georeference');
	};		
		
	var validate_button = goog.dom.createDom('input',{
		'type':'button',
		'class': 'vk2GeorefToolsBtn btn btn-default btn-validate',
		'value': valueValidateBtn
	});
	goog.dom.appendChild(this._toolContainer, validate_button);
	
	// only load this html input element in case of validation state "True". 
	// @TODO add this behavior also for power user
	var submit_button = goog.dom.createDom('input',{
		'type':'button',
		'class': 'vk2GeorefToolsBtn btn btn-default btn-submit',
		'value': valueSubmitBtn
	});
	goog.dom.appendChild(this._toolContainer, submit_button);
	
	return this._toolContainer;
};

/**
 * This function just creates the html elements for the loading screen
 * @return {Element}
 */
vk2.georeference.ToolBox.prototype._loadLoadingScreenHtmlContent = function(){

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
vk2.georeference.ToolBox.prototype._loadOpenCloseBehavior = function(controlElement){
	goog.events.listen(controlElement, goog.events.EventType.CLICK, function(event){
		var width = goog.style.getSize(event.currentTarget.parentElement).width;
		var toolContainer = this._toolContainer;
		
		if (goog.dom.classes.has(event.currentTarget, 'open')){
			$(event.currentTarget.parentElement).animate({'left': '-250px'}, 1000,	function(){
				goog.dom.classes.remove(event.currentTarget, 'open');
				goog.style.setStyle(toolContainer,'display','none');
			});
		} else {
			goog.style.setStyle(toolContainer,'display','block');
			$(event.currentTarget.parentElement).animate({'left': '-2px'}, 1000, function(){
				goog.dom.classes.add(event.currentTarget, 'open');
			});
		}
	}, undefined, this);
};

/**
 * @private
 */
vk2.georeference.ToolBox.prototype._loadGeoreferenceControls = function(){
		
	/**
	 * @type {ol.source.Vector}
	 * @private
	 */
	this._drawSource = new ol.source.Vector();
		
	this._unreferencedMap.addLayer(new ol.layer.Vector({
		  'source': this._drawSource,
		  'style': function(feature, resolution) {
			  return [vk2.utils.Styles.GEOREFERENCE_POINT];
		  }
	}));
	this._unreferencedMap.addControl(new ol.control.ZoomToExtent({
		extent: this._unreferencedMap.getView().getView2D().calculateExtent(this._unreferencedMap.getSize())
	}));
	// now create the events
	this._loadToggleControls(this._unreferencedMap, this._drawSource);
	this._loadButtonEvents()
};

/**
 * @private
 */
vk2.georeference.ToolBox.prototype._loadButtonEvents = function(){
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
			};
				
			// add new query parameter
			var parsed_data = JSON.parse(data)
			for (var key in parsed_data){
				if (parsed_data.hasOwnProperty(key))
					href = href + key + '=' + parsed_data[key] + '&';
			};
				
			window.location.href = href;
		};
		
		var errorHandler = function(event){
			goog.style.setStyle(georefLoadingScreen,'display','none');
			goog.style.setStyle(georefLoadingScreen,'z-index','0');
			alert('Something went wrong, while trying to compute validation result');
		};
		
		goog.style.setStyle(georefLoadingScreen,'display','block');
		goog.style.setStyle(georefLoadingScreen,'z-index','2000');
		console.log(georef_params);
		//VK2.Requests.Georeferencer.validate(urls.process_validation, this._objectId, georef_params, successHandler, errorHandler);
		
	}, undefined, this);
};

/**
 * @private
 * @return {string|undefined}
 */
vk2.georeference.ToolBox.prototype._validateGeorefParams = function(){
	var features = this._drawSource.getFeatures();
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
vk2.georeference.ToolBox.prototype._loadToggleControls = function(map, drawSource){
	
	/**
	 * @type {ol.interaction.Select}
	 * @private
	 */
	var select = new ol.interaction.Select({
		'style': function(feature, resolution) {
			return [vk2.utils.Styles.GEOREFERENCE_POINT_HOVER];
		}
	});
	
	var interactions = {
			'addpoint': [
			    new ol.interaction.Draw({
			    	source: drawSource,
			    	type: 'Point',
			    	'style': function(feature, resolution) {
			    		return [vk2.utils.Styles.GEOREFERENCE_POINT_HOVER]
					}
			    })
			],
			'dragpoint': [
			    select,
			    new ol.interaction.Modify({
			    	'features': select.getFeatures(),
			    	'pixelTolerance': 10,
			    	'style': function(feature, resolution) {
						return [vk2.utils.Styles.GEOREFERENCE_POINT_HOVER];
					}
			    })	    
			],
			'deletepoint': [
			   new vk2.georeference.DeleteFeatureInteraction({
			      	'source': drawSource,
			    	'pixelTolerance': 5				   
			   }, drawSource)
			]
	};
	
	var constraints = {
		'maximale_features': goog.bind(function(event){
			var allFeatures = this._drawSource.getFeatures();
			var alertMsg_counter = 0;
			//check for corner point number (<4!)
			if (allFeatures.length > 4){
				alert(vk2.utils.getMsg('checkCornerPoint_count'));
				alertMsg_counter++;
				this._drawSource.removeFeature(allFeatures[4]);
			}
		}, this),
		'corner_constraint': goog.bind(function(event){
			var alertMsg_counter = 0;
			var allFeatures = this._drawSource.getFeatures();
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
					} else{
						alert (vk2.utils.getMsg('checkCornerPoint_distance'));
						alertMsg_counter++;
						this._drawSource.removeFeature(allFeatures[allFeatures.length-1]);
					}
				}	
			}
		}, this),
	};
	

	
	// add listener event
	goog.events.listen(this._drawSource, 'addfeature', constraints['maximale_features']);
	goog.events.listen(this._drawSource, 'addfeature', constraints['corner_constraint']);
	
	// toggle controller
	var toggleElements = goog.dom.getElementsByTagNameAndClass('input','toggle-elements',this._toolContainer);
	for (var i = 0; i < toggleElements.length; i++){
		goog.events.listen(toggleElements[i], goog.events.EventType.CLICK, function(event){
			this._removeInteractions(interactions, map);
			
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
};

/**
 * @param {array<ol.interaction>} interactions
 * @param {ol.Map} map
 * @private
 */
vk2.georeference.ToolBox.prototype._removeInteractions = function(interactions, map){
	// at first remove all interactions
	for (var key in interactions){
		if (interactions.hasOwnProperty(key)){
			for (var i = 0; i < interactions[key].length; i++){
				if (interactions[key][i] instanceof ol.interaction.Select)
					interactions[key][i].getFeatures().clear();
				map.removeInteraction(interactions[key][i]);
			}
		}
	}
};

/**
 * @returns {ol.source.Vector}
 */
vk2.georeference.ToolBox.prototype.getFeatureSource = function(){
	return this._drawSource;
};