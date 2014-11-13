goog.provide('vk2.georeference.Georeferencer');

goog.require('goog.dom');
goog.require('goog.dom.classes');
goog.require('goog.events');
goog.require('goog.events.EventType');
goog.require('goog.style');
goog.require('vk2.utils');
goog.require('vk2.utils.Styles');
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
	 * @type {vk2.viewer.ZoomifyViewer}
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
	 * @private
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
	this._loadSubmitControls(goog.dom.getElementByClass(settings['validate_menu_container']));
	
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
	var controlElement = this._controlElement;
	$('#georeference-tools-inner-container').slideToggle(300, function() {
		$(controlElement).toggleClass('open');
	});
	
	// change toolsnav state by click
	$(controlElement).click(function() {
		$('#georeference-tools-inner-container').slideToggle(300, function() {
			$(controlElement).toggleClass('open');
		});      
	});
};

/**
 * @param {Element} parentEl
 * @private
 */
vk2.georeference.Georeferencer.prototype._loadGcpControls = function(parentEl){
	
	var toolContainer = goog.dom.createDom('div',{
		'class': 'georeference-tools-inner-container',
		'id': 'georeference-tools-inner-container'
	});
	goog.dom.appendChild(parentEl, toolContainer);
	
	// create tool list elements
	// move map
	var divEl_MoveMap = goog.dom.createDom('div',{'class':'tool'});
	goog.dom.appendChild(toolContainer ,divEl_MoveMap);	
	var toggleControlMoveMap = goog.dom.createDom('div',{
		'id':'noneToggle',
		'class':'tool-move toggle-elements',
		'value':'none',
		'innerHTML':'<span class="tool-title">' + vk2.utils.getMsg('moveMap') + '</span>'
	});
	goog.dom.appendChild(divEl_MoveMap, toggleControlMoveMap);

	// set point 	
	var divEl_setPoint = goog.dom.createDom('div',{'class':'tool'});
	goog.dom.appendChild(toolContainer ,divEl_setPoint);
	var toggleControlSetPoint = goog.dom.createDom('div',{
		'id':'pointToggle',
		'class':'tool-move toggle-elements',
		'value':'addpoint',
		'innerHTML':'<span class="tool-title">' + vk2.utils.getMsg('setCornerPoint') + '</span>'
	});
	goog.dom.appendChild(divEl_setPoint, toggleControlSetPoint);
	
	// drag point
	var divEl_dragPoint = goog.dom.createDom('div',{'class':'tool'});
	goog.dom.appendChild(toolContainer ,divEl_dragPoint);
	var toggleControlDragPoint = goog.dom.createDom('div',{
		'id':'dragToggle',
		'class':'tool-move toggle-elements',
		'value':'dragpoint',
		'innerHTML':'<span class="tool-title">' + vk2.utils.getMsg('moveCornerPoint') + '</span>'
	});
	goog.dom.appendChild(divEl_dragPoint, toggleControlDragPoint);

	// del point 
	var divEl_delPoint = goog.dom.createDom('div',{'class':'tool'});
	goog.dom.appendChild(toolContainer ,divEl_delPoint);
	var divEl_dragPoint = goog.dom.createDom('div',{'class':'tool'});
	goog.dom.appendChild(toolContainer ,divEl_dragPoint);
	var toggleControlDelPoint = goog.dom.createDom('div',{
		'id':'deleteToggle',
		'class':'tool-move toggle-elements',
		'value':'deletepoint',
		'innerHTML':'<span class="tool-title">' + vk2.utils.getMsg('deleteCornerPoint') + '</span>'
	});
	goog.dom.appendChild(divEl_delPoint, toggleControlDelPoint);
		
	this._loadGcpControlsBehavior('toggle-elements');

	return toolContainer;
};

/**
 * @param {string} toggleControlClassName
 * @private
 */
vk2.georeference.Georeferencer.prototype._loadGcpControlsBehavior = function(toggleControlClassName){
	var drawSource = this._gcpHandler.getFeatureSource();
	var map = this._zoomifyViewer.getMap()
	map.addLayer(new ol.layer.Vector({
		  'source': drawSource,
		  'style': function(feature, resolution) {
			  return [vk2.utils.Styles.GEOREFERENCE_POINT];
		  }
	}));
	
	var select = new ol.interaction.Select({
		'style': function(feature, resolution) {
			return [vk2.utils.Styles.GEOREFERENCE_POINT_HOVER];
		}
	});
	
	var interactions = {};
	interactions['addpoint'] = [
	    new ol.interaction.Draw({
	    	'source': drawSource,
	    	'type': 'Point',
	    	'style': function(feature, resolution) {
	    		return [vk2.utils.Styles.GEOREFERENCE_POINT_HOVER]
			}
	    })
	];
	interactions['dragpoint'] = [
	    select,       
		new ol.interaction.Modify({
	    	'features': select.getFeatures(),
	    	'pixelTolerance': 10,
	    	'style': function(feature, resolution) {
				return [vk2.utils.Styles.GEOREFERENCE_POINT_HOVER];
	    	}
		})	    
	];
	interactions['deletepoint'] = [        
	   new ol.interaction.Select({
		   'style': function(feature, resolution) {
			   return [vk2.utils.Styles.GEOREFERENCE_POINT_HOVER];
		   },
		   'condition': goog.bind(function(event){
			   if (event.type === 'click'){
				   map.forEachFeatureAtPixel(event['pixel'], function(feature){
					   drawSource.removeFeature(feature); 
				   });
			   }
			   return false;
		   }, this)
	   })
   ];
	
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
	
	var setActive = function(active_element){
		var toggleControlElements = goog.dom.getElementsByClass(toggleControlClassName);
		for (var i = 0; i < toggleControlElements.length; i++){
			if (goog.dom.classes.has(toggleControlElements[i],'active'))
				goog.dom.classes.remove(toggleControlElements[i],'active')
		};
		goog.dom.classes.add(active_element,'active')
	};
		
	var clickHandler = function(event){
		removeInteraction(interactions, map);
		
		// add choosen interaction
		if (goog.isDef(event.currentTarget.value) && event.currentTarget.value != ''){
			setActive(event.currentTarget);
			if (interactions.hasOwnProperty(event.currentTarget.value)){
				for (var i = 0; i < interactions[event.currentTarget.value].length; i++){
					map.addInteraction(interactions[event.currentTarget.value][i]);
				}
			}
		}				
	};
	
	// toggle controller
	var toggleControlElements = goog.dom.getElementsByClass(toggleControlClassName);
	for (var i = 0; i < toggleControlElements.length; i++){
		var element = toggleControlElements[i];
		goog.events.listen(element, goog.events.EventType.CLICK, clickHandler, undefined, this);
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
				ol.proj.transformExtent(response['extent'], 'EPSG:4314', vk2.settings.DISPLAY_SRS ));
	}, this);
	
	/**
	 * @type {Function}
	 * This function is a callback for handling the response of a confirmation request
	 */
	var confirmationHandler = goog.bind(function(event){
		if (event.target.getStatus() != 200){
			alert('Something went wrong, while trying to confirm the georeference parameter. Please try again or contact the administrator.');
		};
		
		var response = event.target.getResponseJson();
		
		if (goog.isDef(response['gcps'])){
			this._gcpHandler.registerGcps(response['gcps']);
			goBackToMainPage(response['points']);
		} else {
			alert(response['text']);
		}
		
		
		if (goog.DEBUG)
			console.log(response);
		
		
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
		
		this._gcpHandler.registerGcps(response['gcps'], response['type']);
		
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

	
	var validate_button = goog.dom.createDom('div',{
		'class': 'vk2GeorefToolsBtn btn btn-default btn-validate',
		'innerHTML': '<span class="glyphicon glyphicon-refresh"></span> ' + vk2.utils.getMsg('validateBtn_validate')
	});
	goog.dom.appendChild(toolContainer, validate_button);
	
	// only load this html input element in case of validation state "True". 
	var submit_button = goog.dom.createDom('div',{
		'class': 'vk2GeorefToolsBtn btn btn-default btn-submit deactivate',
		'innerHTML': '<span class="glyphicon glyphicon-ok"></span> ' + vk2.utils.getMsg('submitBtn_validate')
	});
	goog.dom.appendChild(toolContainer, submit_button);	
		
	// event for validate button
	goog.events.listen(validate_button, goog.events.EventType.CLICK, submitHandler['update'], undefined, this);
	goog.events.listen(this._gcpHandler, 'update', submitHandler['update'] , undefined, this);
	var submitCallback = goog.partial(vk2.utils.getConfirmationDialog, vk2.utils.getMsg('submitBtn_validate'), 
			vk2.utils.getMsg('georef_validate_msg'), submitHandler['confirm']);
	goog.events.listen(submit_button, goog.events.EventType.CLICK, submitCallback, undefined, this);
};

/**
 * @param {string} type
 */
vk2.georeference.Georeferencer.prototype.updateHeader = function(type){
	var headerEl = goog.dom.getFirstElementChild(goog.dom.getElementByClass('georeference-header-container'));
	var headerContent = type == 'update' ? 'Update' : 'Neue Georeferenzierung';
	headerEl.innerHTML = '<span class="vk2georef-brand">VK2-Georeferenzierer</span> - ' + headerContent;
};

/**
 * Opens the toolbox by simulating a click event
 */
vk2.georeference.Georeferencer.prototype.open = function(){
	$(this._controlElement).click();
};

/**
 * @return {vk2.georeference.MesstischblattGcpHandler}
 */
vk2.georeference.Georeferencer.prototype.getGcpHandler = function(){
	return this._gcpHandler;
};