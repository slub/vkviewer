goog.provide('vk2.georeference.ToolBox');

goog.require('goog.dom');
goog.require('goog.dom.classes');
goog.require('goog.events');
goog.require('goog.events.EventType');
goog.require('goog.style');
goog.require('vk2.utils');
goog.require('vk2.utils.Styles');
goog.require('vk2.georeference.ZoomifyViewer');
goog.require('vk2.georeference.GeoreferencerService');
goog.require('vk2.georeference.gcp.AbstractGcpControl');
goog.require('vk2.georeference.gcp.AddMesstischblattGcpControl');
goog.require('vk2.georeference.gcp.DragGcpControl');
goog.require('vk2.georeference.gcp.DeleteGcpControl');
goog.require('vk2.georeference.gcp.GcpHandler');

/**
 * @param {Element|string} parentEl
 * @param {ol.source.Zoomify} zoomifyViewer
 * @param {vk2.georeference.ResultViewer} resultViewer
 * @param {string} objectId
 * @constructor
 */
vk2.georeference.ToolBox = function(parentEl, zoomifyViewer, resultViewer, objectId){
	
	/**
	 * @type {string}
	 * @private
	 */
	this._objectId = objectId;
	
	/**
	 * @type {Element}
	 * @private
	 */
	this._parentEl = goog.isString(parentEl) ? goog.dom.getElement(parentEl) : parentEl;
	
	/**
	 * @type {ol.Map}
	 * @private
	 */
	this._zoomifyViewer = zoomifyViewer;
	
	/**
	 * @type {vk2.georeference.ResultViewer}
	 * @private
	 */
	this._resultViewer = resultViewer;
	
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
	//this._loadToolBoxContainer(this._parentEl);	
	//this._loadGeoreferenceControls();
	

};

/**
 * This function needs jquery-ui to run.
 * @param {Element} parentEl
 * @private
 */
vk2.georeference.ToolBox.prototype._loadOpenCloseHandler = function(parentEl){
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
vk2.georeference.ToolBox.prototype._loadGcpControls = function(parentEl){
	
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
vk2.georeference.ToolBox.prototype._loadGcpControlsBehavior = function(toggleControlElements){
	
	var addMesstischblattGcpControl = new vk2.georeference.gcp.AddMesstischblattGcpControl(this._zoomifyViewer, this._resultViewer);
	var gcp_controls = {
			'addpoint': addMesstischblattGcpControl,
			'dragpoint': new vk2.georeference.gcp.DragGcpControl(this._zoomifyViewer, this._resultViewer),
			'deletepoint': new vk2.georeference.gcp.DeleteGcpControl(this._zoomifyViewer, this._resultViewer,
					addMesstischblattGcpControl.getUnrefSource())
	};
	
	/**
	 * @type {vk2.georeference.gcp.GcpHandler}
	 * @privat
	 */
	this._gcpHandler = new vk2.georeference.gcp.GcpHandler(this._zoomifyViewer, addMesstischblattGcpControl.getUnrefSource(), true);
	
	/**
	 * @param {Object} gcp_controls
	 * @private
	 */
	var removeInteraction =  function(gcp_controls){
		// at first remove all interactions
		for (var key in gcp_controls){
			if (gcp_controls.hasOwnProperty(key) && gcp_controls[key] instanceof vk2.georeference.gcp.AbstractGcpControl){
					gcp_controls[key].deactivate();
			};
		};
	};
		
	// toggle controller
	for (var i = 0; i < toggleControlElements.length; i++){
		goog.events.listen(toggleControlElements[i], 'click', function(event){
			removeInteraction(gcp_controls);
			
			// add choosen interaction
			var control_key = goog.isDef(event.target.value) ? event.target.value : '';
			if (control_key != ''){
				if (gcp_controls.hasOwnProperty(control_key)){
					gcp_controls[control_key].activate();
				}
			}				
		}, undefined, this);
	};
};

/**
 * @param {Element} toolContainer 
 * @private
 */
vk2.georeference.ToolBox.prototype._loadSubmitControls = function(toolContainer){
		
	var submitHandler = function(event){
		if (!this._gcpHandler.isValide()){
			alert('Please check your georeference params! Are there 4 points?');
			return undefined;
		}
		
		var request = {
			'id': this._objectId,
			'georeference': {
				'source':'pixel',
				'target':'EPSG:4314',
				'gcps':this._gcpHandler.getGcps()
			}
		};
		

		var successHandler = goog.bind(function(event){
			var response = event.target.getResponseJson();
			this._resultViewer.displayValidationMap(response['wms_url'], response['layer_id'], response['extent']);
		}, this);
		
		var errorHandler = function(event){
			console.log(event);
		};
		
		vk2.georeference.GeoreferencerService.requestValidationResult(request, successHandler, errorHandler);
	};
	
	var submitHandler1 = function(event){		
		var request = {
			'id': this._objectId,
			'georeference': {
				'source':'pixel',
				'target':'EPSG:4314',
				'gcps':this._gcpHandler.getGcps()
			}
		};
		

		var successHandler = goog.bind(function(event){
			var response = event.target.getResponseJson();
			this._resultViewer.displayValidationMap(response['wms_url'], response['layer_id'], response['extent']);
		}, this);
		
		var errorHandler = function(event){
			console.log(event);
		};
		
		vk2.georeference.GeoreferencerService.requestValidationResult(request, successHandler, errorHandler);
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
	goog.events.listen(validate_button, goog.events.EventType.CLICK, submitHandler, undefined, this);
	goog.events.listen(this._gcpHandler, 'update', submitHandler1 , undefined, this);
};

/**
 * Opens the toolbox by simulating a click event
 */
vk2.georeference.ToolBox.prototype.open = function(){
	$(this._controlElement).click();
};