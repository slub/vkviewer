goog.provide('vk2.georeference.Georeferencer');

goog.require('goog.dom');
goog.require('goog.dom.classes');
goog.require('goog.events');
goog.require('goog.events.EventType');
goog.require('goog.style');
goog.require('vk2.utils');
goog.require('vk2.utils.Styles');
goog.require('vk2.georeference.ZoomifyViewer');
goog.require('vk2.georeference.GeoreferencerService');

/**
 * @param {Element|string} parentEl
 * @param {Object} settings
 * @constructor
 */
vk2.georeference.Georeferencer = function(parentEl, settings){
	
	/**
	 * @type {string}
	 * @private
	 */
	this._objectId = goog.isDef(settings['objectid']) ? settings['objectid'] : undefined;
	
	/**
	 * @type {Element}
	 * @private
	 */
	this._parentEl = goog.isString(parentEl) ? goog.dom.getElement(parentEl) : parentEl;
	
	/**
	 * @type {vk2.georeference.ZoomifyViewer}
	 * @private
	 */
	this._zoomifyViewer = goog.isDef(settings['unreferencedviewer']) ? settings['unreferencedviewer'] : undefined;
	
	/**
	 * @type {vk2.georeference.ResultViewer}
	 * @private
	 */
	this._resultViewer = goog.isDef(settings['referenceviewer']) ? settings['referenceviewer'] : undefined;
	
	/**
	 * @type {vk2.georeference.MesstischblattGcpHandler}
	 * @privat
	 */
	this._gcpHandler = goog.isDef(settings['gcphandler']) ? settings['gcphandler'] : undefined;
	
	// loads the toolbox
	var toolboxContainer = goog.dom.createDom('div',{
		'class':'georeference-tools-container',
		'id':'georeference-tools-container'
	});
	goog.dom.appendChild(this._parentEl, toolboxContainer);	
	this._loadOpenCloseHandler(toolboxContainer);
	
	/**
	 * @type {Element}
	 * @private
	 */
	this._toolContainer = this._loadGcpControls(toolboxContainer);
	this._loadSubmitControls(this._toolContainer);
	
	if (this._gcpHandler.isUpdateState()){
		this.updateHeader('update');	
	} else {
		this.updateHeader('confirm');
	}
	
		
};

/**
 * This function needs jquery-ui to run.
 * @param {Element} parentEl
 * @private
 */
vk2.georeference.Georeferencer.prototype._loadOpenCloseHandler = function(parentEl){
	/**
	 * @type {Element}
	 * @private
	 */
	this._controlElement = goog.dom.createDom('div',{
		'class': 'georeference-tools-handler'
	});
	goog.dom.appendChild(parentEl, this._controlElement);
	goog.dom.appendChild(this._controlElement, goog.dom.createDom('span',{'class':'icon'}));
	
	// append event behavior (slidein/slideout)
	goog.events.listen(this._controlElement, goog.events.EventType.CLICK, function(event){
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
 * @param {Element} parentEl
 * @private
 */
vk2.georeference.Georeferencer.prototype._loadGcpControls = function(parentEl){
	
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
	
	var toolContainer = goog.dom.createDom('div',{
		'class': 'georeference-tools-inner-container',
		'id': 'georeference-tools-inner-container'
	});
	goog.dom.appendChild(parentEl, toolContainer);
	
	var toggleControlElements = [];
	
	// create tool list elements
	// move map
	var divEl_MoveMap = goog.dom.createDom('div',{'class':'radio'});
	goog.dom.appendChild(toolContainer ,divEl_MoveMap);
	
	var inputEl_moveMap = createInputElement('radio','none','noneToggle','toggle-elements','checked');
	toggleControlElements.push(inputEl_moveMap);
	var label_moveMap = goog.dom.createDom('label',{})
	goog.dom.appendChild(label_moveMap, inputEl_moveMap);
	goog.dom.appendChild(label_moveMap, goog.dom.createDom('span',{'innerHTML':vk2.utils.getMsg('moveMap')}));
	goog.dom.appendChild(divEl_MoveMap, label_moveMap);

	// set point 	
	var divEl_setPoint = goog.dom.createDom('div',{'class':'radio'});
	goog.dom.appendChild(toolContainer ,divEl_setPoint);
	var inputEl_setPoint = createInputElement('radio','addpoint','pointToggle','toggle-elements');
	toggleControlElements.push(inputEl_setPoint);
	var label_setPoint = goog.dom.createDom('label',{})
	goog.dom.appendChild(label_setPoint, inputEl_setPoint);
	goog.dom.appendChild(label_setPoint, goog.dom.createDom('span',{'innerHTML':vk2.utils.getMsg('setCornerPoint')}));
	goog.dom.appendChild(divEl_setPoint, label_setPoint);
	
	// drag point
	var divEl_dragPoint = goog.dom.createDom('div',{'class':'radio'});
	goog.dom.appendChild(toolContainer ,divEl_dragPoint);
	var inputEl_dragPoint = createInputElement('radio','dragpoint','dragToggle','toggle-elements');
	toggleControlElements.push(inputEl_dragPoint);
	var label_dragPoint = goog.dom.createDom('label',{})
	goog.dom.appendChild(label_dragPoint, inputEl_dragPoint);
	goog.dom.appendChild(label_dragPoint, goog.dom.createDom('span',{'innerHTML':vk2.utils.getMsg('moveCornerPoint')}));
	goog.dom.appendChild(divEl_dragPoint, label_dragPoint);
	
	// del point 
	var divEl_delPoint = goog.dom.createDom('div',{'class':'radio'});
	goog.dom.appendChild(toolContainer ,divEl_delPoint);
	var inputEl_delPoint = createInputElement('radio','deletepoint','deleteToggle','toggle-elements');
	toggleControlElements.push(inputEl_delPoint);
	var label_delPoint = goog.dom.createDom('label',{})
	goog.dom.appendChild(label_delPoint, inputEl_delPoint);
	goog.dom.appendChild(label_delPoint, goog.dom.createDom('span',{'innerHTML':vk2.utils.getMsg('deleteCornerPoint')}));
	goog.dom.appendChild(divEl_delPoint, label_delPoint);
		
	// append further input elements
	goog.dom.appendChild(toolContainer, goog.dom.createDom('br',{}));
	
	// append behavior
	
	this._loadGcpControlsBehavior(toggleControlElements);
	
	return toolContainer;
};

/**
 * @param {Array.<Element>}
 * @private
 */
vk2.georeference.Georeferencer.prototype._loadGcpControlsBehavior = function(toggleControlElements){
	
	var drawSource = this._gcpHandler.getFeatureSource();
	var map = this._zoomifyViewer.getMap()
	map.addLayer(new ol.layer.Vector({
		  source: drawSource,
		  styleFunction: function(feature, resolution) {
			  return styleArrayPoint;
		  }
	}));
	
	/**
	 * @type {ol.interaction.Select}
	 * @private
	 */
	var select = new ol.interaction.Select({
		style: function(feature, resolution) {
			return [vk2.utils.Styles.GEOREFERENCE_POINT_HOVER];
		}
	});
	
	var interactions = {
			'addpoint': [
				/**
				 * @type {ol.interaction.Draw}
				 * @private
				 */
			    new ol.interaction.Draw({
			    	source: drawSource,
			    	type: 'Point',
			    	style: function(feature, resolution) {
			    		return [vk2.utils.Styles.GEOREFERENCE_POINT_HOVER]
					}
			    })
			],
			'dragpoint': [
			    select,       
				/**
				 * @type {ol.interaction.Modify}
				 * @private
				 */
				new ol.interaction.Modify({
			    	features: select.getFeatures(),
			    	pixelTolerance: 10,
			    	style: function(feature, resolution) {
						return [vk2.utils.Styles.GEOREFERENCE_POINT_HOVER];
			    	}
				})	    
			],
			'deletepoint': [        
			   /**
			    * @type {ol.interaction.Select}
			    * @private
			    */
			   new ol.interaction.Select({
				   style: function(feature, resolution) {
					   return [vk2.utils.Styles.GEOREFERENCE_POINT_HOVER];
				   },
				   'condition': goog.bind(function(event){
					   if (event.type === 'click'){
						   map.forEachFeatureAtPixel(event.pixel, function(feature){
							   drawSource.removeFeature(feature); 
						   });
					   }
					   return false;
				   })
			   })
		   ]
	};
	
	/**
	 * @param {array<ol.interaction>} interactions
	 * @param {ol.Map} map
	 * @private
	 */
	var removeInteraction =  function(interactions, map){
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
		
	// toggle controller
	for (var i = 0; i < toggleControlElements.length; i++){
		goog.events.listen(toggleControlElements[i], goog.events.EventType.CLICK, function(event){
			removeInteraction(interactions, map);
			
			// add choosen interaction
			if (goog.isDef(event.target.value) && event.target.value != ''){
				if (interactions.hasOwnProperty(event.target.value)){
					for (var i = 0; i < interactions[event.target.value].length; i++){
						map.addInteraction(interactions[event.target.value][i]);
					}
				}
			}				
		}, undefined, this);
	};
};

/**
 * @param {Element} toolContainer 
 * @private
 */
vk2.georeference.Georeferencer.prototype._loadSubmitControls = function(toolContainer){
	var goBackToMainPage = function(points){
		var href = vk2.settings.MAIN_PAGE + '?georef=on&points='+points;
		window.location.href = href;
	};
		
	/**
	 * @type {Function}
	 * This function is a callback for handling the response of a validation request
	 */
	var validationHandler = goog.bind(function(event){
		if (event.target.getStatus() != 200){
			alert('Something went wrong, while trying to process a georeference result. Please try again or contact the administrator.');
		};
		
		var response = event.target.getResponseJson();
		
		if (goog.DEBUG)
			console.log(response);
		
		this._resultViewer.displayValidationMap(response['wms_url'], response['layer_id'], 
				ol.proj.transform(response['extent'], 'EPSG:4314', vk2.settings.DISPLAY_SRS ));
	});
	
	/**
	 * @type {Function}
	 * This function is a callback for handling the response of a confirmation request
	 */
	var confirmationHandler = goog.bind(function(event){
		if (event.target.getStatus() != 200){
			alert('Something went wrong, while trying to confirm the georeference parameter. Please try again or contact the administrator.');
		};
		
		var response = event.target.getResponseJson();
		this._gcpHandler.registerGcps(response['gcps']);
		
		if (goog.DEBUG)
			console.log(response);
		
		goBackToMainPage(response['points']);
	}, this);
	
	/**
	 * @type {Function}
	 * This function is a callback for handling the response of a confirmation request
	 */
	var updateHandler = goog.bind(function(event){
		if (event.target.getStatus() != 200){
			alert('Something went wrong, while trying to update the georeference parameter. Please try again or contact the administrator.');
		};
		
		var response = event.target.getResponseJson();
		this._gcpHandler.registerGcps(response['gcps']);
		
		if (goog.DEBUG)
			console.log(response);
		
		goBackToMainPage(response['points']);
	}, this);
	
	/**
	 * @type {Function}
	 * Handles error
	 */
	var errorHandler = function(event){
		var errorHandler = function(event){
			alert('Something went wrong, while trying to process a georeference result. Please try again or contact the administrator.');
		};
	};
	
	var submitHandler = {
			'update': goog.bind(function(event){
				var request = {
						'id': this._objectId,
						'georeference': this._gcpHandler.getGcps()
				};
				vk2.georeference.GeoreferencerService.requestValidationResult(request, validationHandler, errorHandler);
			}, this),
			'confirm': goog.bind(function(event){
				if (!this._gcpHandler.isValide()){
					alert('Please check your georeference params! Are there 4 points?');
					return undefined;
				};
				
				if (!this._gcpHandler.isUpdateState()){
					var request = {
							'id': this._objectId,
							'georeference': this._gcpHandler.getGcps()
					};
					vk2.georeference.GeoreferencerService.requestConfirmResult(request, confirmationHandler, errorHandler);
				} else {
					var request = {
							'id': this._objectId,
							'georeference': this._gcpHandler.getUpdateGcps()
					};
					vk2.georeference.GeoreferencerService.requestUpdateResult(request, updateHandler, errorHandler);
				};				
			}, this)
	};

	
	var validate_button = goog.dom.createDom('input',{
		'type':'button',
		'class': 'vk2GeorefToolsBtn btn btn-default btn-validate',
		'value': vk2.utils.getMsg('validateBtn_validate')
	});
	goog.dom.appendChild(toolContainer, validate_button);
	
	// only load this html input element in case of validation state "True". 
	var submit_button = goog.dom.createDom('input',{
		'type':'button',
		'class': 'vk2GeorefToolsBtn btn btn-default btn-submit deactivate',
		'value': vk2.utils.getMsg('submitBtn_validate')
	});
	goog.dom.appendChild(toolContainer, submit_button);	
		
	// event for validate button
	goog.events.listen(validate_button, goog.events.EventType.CLICK, submitHandler['update'], undefined, this);
	goog.events.listen(this._gcpHandler, 'update', submitHandler['update'] , undefined, this);
	goog.events.listen(submit_button, goog.events.EventType.CLICK, submitHandler['confirm'] , undefined, this);
};

/**
 * @param {string} type
 */
vk2.georeference.Georeferencer.prototype.updateHeader = function(type){
	var headerEl = goog.dom.getFirstElementChild(goog.dom.getElementByClass('georeference-header-container'));
	var headerContent = type == 'update' ? 'VK2-Georeferenzierer - Update' : 'VK2-Georeferenzierer - Neue Georeferenzierung';
	headerEl.innerHTML = headerContent;
};

/**
 * Opens the toolbox by simulating a click event
 */
vk2.georeference.Georeferencer.prototype.open = function(){
	$(this._controlElement).click();
};

/**
 * @return {vk2.georeference.GcpHandler}
 */
vk2.georeference.Georeferencer.prototype.getGcpHandler = function(){
	return this._gcpHandler;
};