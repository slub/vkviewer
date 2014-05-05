goog.provide('VK2.Tools.Layerbar');

goog.require('goog.style');
goog.require('goog.dom');
goog.require('goog.events');
goog.require('goog.events.EventType');

/**
 * @param {Object} settings
 * @constructor
 */
VK2.Tools.Layerbar = function(settings){

	/**
	 * @type {boolean}
	 * @private
	 */
	this.ascending = true;
	
	/**
	 * @type {string}
	 * @public
	 */
	if (goog.isDef(VK2.Utils.get_I18n_String))
		this.NAME = VK2.Utils.get_I18n_String('toolname_layerbar');
	else this.NAME = 'Layerbar';
	
	/**
	 * @type {OpenLayers.Map}
	 * @private
	 */
	this._map = settings.map;
	
	/**
	 * @type {Element}
	 * @private
	 */
	this._div = settings.div;
	
	/**
	 * @type {string}
	 * @private
	 */
	this._id = settings.id;
	
	if (goog.isDef(settings.vk2featurelayer))
		this._vk2FeatureLayer = settings.vk2featurelayer;
	else this._vk2FeatureLayer = new Vk2FeatureLayer();

    /**
     * @type {array}
     * @private
     */
    this.baseLayers = [];
    
    /**
     * @type {array}
     * @private
     */
    this.overlayLayers = [];
    
    /**
     * @type {array}
     * @private
     */
    this.layerStates = [];

    this.draw();
}

/**
 * @public
 */
VK2.Tools.Layerbar.prototype.destroy = function(){
    //clear out layers info and unregister their events
    this.clearLayersArray("vk2Data");
    
    this._map.events.un({
        buttonclick: onButtonClick,
        addlayer: this.redraw,
        changelayer: this.redraw,
        removelayer: this.redraw,
        changebaselayer:this. redraw,
        scope: this
    });
};

/**
 * @public
 * @param {OpenLayers.Map}
 */
VK2.Tools.Layerbar.prototype.setMap = function(map) {
    this._map.events.on({
        addlayer: this.redraw,
        changelayer: this.redraw,
        removelayer: this.redraw,
        changebaselayer: this.redraw,
        scope: this
    });
};

/**
 * @public
 * @return {Element} A reference to the DIV DOMElement containing the
 *     switcher tabs.
 */
VK2.Tools.Layerbar.prototype.draw = function() {
    // create layout divs
    this._loadContents();

    // populate div with current info
    this.redraw();

    return this._div;
};

/**
 * @public
 * @param {string} layersType
 */
VK2.Tools.Layerbar.prototype.clearLayersArray = function(layersType) {
    this[layersType + "LayersDiv"].innerHTML = "";
    this[layersType + "Layers"] = [];
};

/**
 * Checks if the layer state has changed since the last redraw() call.
 * @public
 * @param {boolean}
 */
VK2.Tools.Layerbar.prototype.checkRedraw = function() {
    if ( !this.layerStates.length ||
            (this._map.layers.length != this.layerStates.length) ) {
           return true;
       }

       for (var i = 0, len = this.layerStates.length; i < len; i++) {
           var layerState = this.layerStates[i];
           var layer = this._map.layers[i];
           if ( (layerState.name != layer.name) ||
                (layerState.inRange != layer.inRange) ||
                (layerState.id != layer.id) ||
                (layerState.visibility != layer.visibility) ) {
               return true;
           }
       }

       return false;
};

/**
 * Goes through and takes the current state of the Map and rebuilds the
 *     control to display that state. Groups base layers into a
 *     radio-button group and lists each data layer with a checkbox.
 * @public
 * @return {Element} A reference to the DIV DOMElement containing the control
 */
VK2.Tools.Layerbar.prototype.redraw = function() {
    //if the state hasn't changed since last redraw, no need
    // to do anything. Just return the existing div.
    if (!this.checkRedraw()) {
        return this._div;
    }

    //clear out previous layers
    this.clearLayersArray("overlay");

    var containsOverlays = false;
    var containsBaseLayers = false;

    // Save state -- for checking layer if the map state changed.
    // We save this before redrawing, because in the process of redrawing
    // we will trigger more visibility changes, and we want to not redraw
    // and enter an infinite loop.
    var len = this._map.layers.length;
    this.layerStates = new Array(len);
    for (var i=0; i <len; i++) {
        var layer = this._map.layers[i];
        this.layerStates[i] = {
            'name': layer.name,
            'visibility': layer.visibility,
            'inRange': layer.inRange,
            'id': layer.id
        };
    }

    var layers = this._map.layers.slice();
    if (!this.ascending) { layers.reverse(); }
    var badgeCounter = 0;
    for(var i=0, len=layers.length; i<len; i++) {
        var layer = layers[i];
        var baseLayer = layer.isBaseLayer;

        if (layer.displayInLayerSwitcher) {
            if (!baseLayer) {            
                // create own overlay elements
                this.overlayLayersDiv.appendChild(this._createLayerElement(layer));
                this.overlayLayers.push(layer);
                badgeCounter += 1;
            }
        }
    }
    
    if (goog.dom.getElement('vk2-layerbar-badge-counter')){
		var badgeSpan = goog.dom.getElement('vk2-layerbar-badge-counter');
	    badgeSpan.innerHTML = badgeCounter > 0 ? badgeCounter : '';
    }
    
    return this._div;
};

/**
 * Cycles through the loaded data and base layer input arrays and makes
 *     the necessary calls to the Map object such that that the map's
 *     visual state corresponds to what the user has selected in
 *     the control.
 * @public
 */
VK2.Tools.Layerbar.prototype.updateMap = function() {

    // set the newly selected base layer
    for(var i=0, len=this.baseLayers.length; i<len; i++) {
        var layerEntry = this.baseLayers[i];
        if (layerEntry.inputElem.checked) {
            this._map.setBaseLayer(layerEntry.layer, false);
        }
    }

    // set the correct visibilities for the vk2 overlays
    for(var i=0, len=this.overlayLayers.length; i<len; i++) {
        var layerEntry = this.overlayLayers[i];
        var isVisibile = document.getElementById(layerEntry.id).checked;
        layerEntry.setVisibility(isVisibile);          
    }
};

/**
 * @public
 * @param {Event} e
 */
VK2.Tools.Layerbar.prototype.onButtonClick = function(e) {
    var button = e.currentTarget;
    if (button === this.minimizeDiv) {
        this.minimizeControl();
    } else if (button === this.maximizeDiv) {
        this.maximizeControl();
    } else if (button._layerSwitcher === this._id) {
        if (button["for"]) {
            button = document.getElementById(button["for"]);
        }
        if (!button.disabled) {
            if (button.type == "radio") {
                button.checked = true;
                this._map.setBaseLayer(this._map.getLayer(button._layer));
            } else {
                this.updateMap();
            }
        }
    }
};

/**
 * Set up the labels and divs for the control
 * @param {Event} e
 */
VK2.Tools.Layerbar.prototype.maximizeControl = function(e) {

    // set the div's width and height to empty values, so
    // the div dimensions can be controlled by CSS
    this._div.style.width = "";
    this._div.style.height = "";

    this.showControls(false);
};

/**
 * Hide all the contents of the control, shrink the size,
 *     add the maximize icon
 * @param {Event} e
 */
VK2.Tools.Layerbar.prototype.minimizeControl = function(e) {

    // to minimize the control we set its div's width
    // and height to 0px, we cannot just set "display"
    // to "none" because it would hide the maximize
    // div
    this._div.style.width = "0px";
    this._div.style.height = "0px";

    this.showControls(true);
};

/**
 * Hide/Show all LayerSwitcher controls depending on whether we are
 *     minimized or not
 * @param {boolean} minimize
 */
VK2.Tools.Layerbar.prototype.showControls = function(minimize) {

    this.maximizeDiv.style.display = minimize ? "" : "none";
    this.minimizeDiv.style.display = minimize ? "none" : "";

    this.layersDiv.style.display = minimize ? "none" : "";
};

/**
 * Event changes the opactiy of the connected layer
 * @param {Event} e
 * @param {Object} ui
 */
VK2.Tools.Layerbar.prototype._opacitySliderEvent = function(event, ui){
    // get new opacity value and layerElem
    var newOpacityValue = ui.value/100;
    var layer = this._getLayerToEvent(event);
    
    // change the opacity the raster layer
    layer.setOpacity(newOpacityValue);
    
    return null;
};

/**
 * Handles the time slider events on the layer level
 * @param {Event} e
 * @param {Object} ui
 */
VK2.Tools.Layerbar.prototype._timeSliderEvent = function(event, ui){
    var newTimeValue = ui.value;
    var layer = this._getLayerToEvent(event);
    
    // change layer label in the layerswitcher and time value of the layer object
    var tmpLblDivs = $(document).find('div.vk2Label');
    for(var i = 0; i < tmpLblDivs.length; i++){
        if (tmpLblDivs[i].value == event.target.value){
            tmpLblDivs[i].innerHTML = layer.name + " " + newTimeValue;
            layer.oldTime = layer.params.TIME;
            layer.params.TIME = newTimeValue;
            layer.timeFtLayer.updateFeatures();
            layer.redraw(true);
        }
    }    
};

/**
 * @param {VK2.Layer.VK2Layer} layer
 * @return {Element}
 * @private
 */
VK2.Tools.Layerbar.prototype._createLayerElement = function(layer){
	var overlayElem = this.createLayerControllerView(layer, this._id);
	this._addEventBehaviorToLayerControlView(overlayElem, layer);
	return overlayElem;
};

/**
 * @param {Element} overlayElem
 * @param {VK2.Layer.VK2Layer} layer
 * @private
 */
VK2.Tools.Layerbar.prototype._addEventBehaviorToLayerControlView = function(overlayElem, layer){
    // add events and behavior to the list elements
    $(overlayElem).find('ul').hide();
    $(overlayElem).find('.minimize').find('.vk2Label').click(function(event){
        $(overlayElem).find('ul').slideToggle();
    }); 
    
    // add event to this element
    $(overlayElem).find('.olButton').click($.proxy(this.onButtonClick, this));
       	
    // create opacity slider
    this._addSliderBehaviour({
	    	sliderDiv: $(overlayElem).find('.opacity').find('.slider-inner'),
	        value: 100,
	        min: 0,
	        max: 100,
	        step: 1
	    }, this._opacitySliderEvent);
            
    //
    // add time slider if it is a time supported layer and also overwrite the
    // label name
    //
    if (layer.isTime){
        // add time slider behavior
        this._addSliderBehaviour({
                sliderDiv: $(overlayElem).find('.time').find('.slider-inner'),
                value: layer.params.TIME,
                min: 1868,
                max: 1945,
                step: 1
            }, this._timeSliderEvent);
        
        // change label to time label in the minimize view;
        var layerLbl = layer.name+" "+layer.params.TIME;
        $(overlayElem).find('.minimize').find('.vk2Label').html(layerLbl);
    }
    
    return layer;
};



/**
 * Cycles Creates an default body for a layer element
 * @param {Object} sliderSettings Contains different arguments for the configuration
 *              of the slider
 * @param {Object} eventHandler Function which is called in case of a event
 */
VK2.Tools.Layerbar.prototype._addSliderBehaviour = function(sliderSettings, eventHandler){  
	var offset_y = -15;
	
    // initialize timeslider
    var timeSlider = $(sliderSettings.sliderDiv).slider({
        min: sliderSettings.min,
        max: sliderSettings.max,
        value: sliderSettings.value,
        animate: 'slow',
        orientation: 'horizontal',
        step: 1,
        // the next three events are managing the tooltip
        start: function(event, ui){
        	$(this.parentElement).find('.tooltip').fadeIn('fast');
        },
        slide: function(event, ui){
        	var tooltip = $(this.parentElement).find('.tooltip');
        	var shift_left = (sliderSettings.min - ui.value - offset_y) * -1 ;
        	tooltip.css('left', shift_left + 'px');
			tooltip.find('.tooltip-inner').html(ui.value);
        },
        stop: function(event, ui){
        	$(this.parentElement).find('.tooltip').fadeOut('fast');
        },
        change: $.proxy(eventHandler, this)
    });
    return true;
};

/**
 * @param {Event} event
 * @return {VK2.Layer.Vk2Layer}
 */
VK2.Tools.Layerbar.prototype._getLayerToEvent = function(event){
    // get layer which the event is attached to 
    for(var i = 0; i < this._map.layers.length; i++){
        if (this._map.layers[i].id === event.target.value){
            return this._map.layers[i];
        }               
    };
    return null;
};

/**
 * Set up the labels and divs for the control
 */
VK2.Tools.Layerbar.prototype._loadContents = function() {
	
	// layerbar container
	this.layersDiv = goog.dom.createDom('div',{
		'id': this._id + '_layersDiv',
		'class': 'layersDiv'
	});
	goog.dom.appendChild(this._div, this.layersDiv);
	
	// label for overlays and add layer button
	var headerContainer = goog.dom.createDom('div', {'class':'layerbar-header-container'});
	this._loadHeaderContent(headerContainer);
	
	// content container
	this.overlayLayersDiv = goog.dom.createDom('div',{'class':'overlayDivs'});
            
    if (this.ascending) {
    	goog.dom.appendChild(this.layersDiv,headerContainer);
    	goog.dom.appendChild(this.layersDiv,this.overlayLayersDiv);
    } else {
    	goog.dom.appendChild(this.layersDiv,this.overlayLayersDiv);
    	goog.dom.appendChild(this.layersDiv,headerContainer);
    }

    this._div.appendChild(this.layersDiv);
};

/**
 * @param {Element} parent_element
 * @private
 */
VK2.Tools.Layerbar.prototype._loadHeaderContent = function(parent_element){
	
	// label
	this.vk2DataLayersLbl = goog.dom.createDom('div',{
		'class':'overlayLbls',
		'innerHTML':'Overlays'
	});
	goog.dom.appendChild(parent_element, this.vk2DataLayersLbl);
	
	// add layer button
	var addLayerBtn = goog.dom.createDom('div',{'class':'add-layer'});
	goog.dom.appendChild(parent_element, addLayerBtn);
	
	goog.events.listen(addLayerBtn, goog.events.EventType.CLICK, function(event){
		var timeParameter = goog.object.clone(VK2.Utils.Settings.timeWmsWfsOptions);
		timeParameter.extent = this._map.getExtent();
		timeParameter.time = 1912;  
		this.addLayer(new VK2.Layer.Vk2Layer(timeParameter));
	}, undefined, this);
};

/**
 * @public
 * @param {VK2.Layer.Vk2Layer} layer
 * @return {boolean}
 */
VK2.Tools.Layerbar.prototype.addLayer = function(layer){
    // adds the map to the layer
    this._map.addLayer(layer);

    this.redraw();

    return true;
};
	
/**
 * @public
 */
VK2.Tools.Layerbar.prototype.activate = function(){
	this._vk2FeatureLayer.activate(this._map)
};

/**
 * @public
 */
VK2.Tools.Layerbar.prototype.deactivate = function(){
	this._vk2FeatureLayer.deactivate(this._map)
};

/**
 * @public
 */
VK2.Tools.Layerbar.prototype.hideOverlayLayers = function(){
	for (var i = 0; i < this.overlayLayers.length; i++){
		this.overlayLayers[i].setVisibility(false);
	}
}

/**
 * @public
 */
VK2.Tools.Layerbar.prototype.showOverlayLayers = function(){
	for (var i = 0; i < this.overlayLayers.length; i++){
		this.overlayLayers[i].setVisibility(true);
	}
}

/**
 * ================
 * Functions for building the single layer control part
 * ================
 */

/**
 * @param {OpenLayers.Layer|undefined} layer
 * @return {Element}
 */
VK2.Tools.Layerbar.prototype.createLayerControllerView = function(layer, id){
	
	if (!goog.isDefAndNotNull(layer))
		return undefined;
	
	var overlayElem = goog.dom.createDom('li',{'class':'overlayElem'});
	var overlayElemContainer = goog.dom.createDom('div',{'class':'overlayElemDiv'});
	goog.dom.appendChild(overlayElem,overlayElemContainer);
	
	goog.dom.appendChild(overlayElemContainer, this._createMinimizeOverlayView(layer, id));
	goog.dom.appendChild(overlayElemContainer, this._createMaximizeOverlayView(layer));
	
	return overlayElem;
};

/**
 * This simply creates the dom element which are representing the minimize view of a layer element in 
 *    the layer management object.
 * @param {OpenLayers.Layer} layer
 * @param {string} id
 * @private
 */
VK2.Tools.Layerbar.prototype._createMinimizeOverlayView = function(layer, id){
	// create the header with div (which should be clickable later) and checkbox
    var minimizeView = goog.dom.createDom('div', {'value':id, 'class':'minimize'});
    
    // this checkbox has to be further styled
    var minimizeViewChBox = goog.dom.createDom('input', {
    	'id': layer.id,
    	'name': layer.name,
    	'value': layer.name,
    	'checked': layer.getVisibility(),
    	'defaultChecked': layer.getVisibility(),
    	'class': 'olButton',
    	'_layer': layer.id,
    	'_layerSwitcher': id,
    	'type': 'checkbox'
    });

    // disable checkbox if layer is out of view
    if(!layer.inRange){
        minimizeViewChBox.disabled = true;
    }
    goog.dom.appendChild(minimizeView, minimizeViewChBox);
    
    // label of the layer encapsulate in div
    var minimizeViewLbl = goog.dom.createDom('div',{
    	'value': layer.id,
    	'text': layer.name,
    	'class': 'vk2Label',
    	'innerHTML': layer.name
    })
    goog.dom.appendChild(minimizeView, minimizeViewLbl);
    // add the header elements to parent container
   
    // add remove button to layer 
    var removeContainer = goog.dom.createDom('div',{'class':'layer-remove'});
    goog.dom.appendChild(minimizeView, removeContainer);
    
    var removeButton = goog.dom.createDom('button',{
    	'type':'button',
    	'aria-hidden':'true',
    	'class':'close layerbar-remove-layer',
    	'innerHTML':'x'
    });
    goog.dom.appendChild(removeContainer, removeButton);
    goog.events.listen(removeButton, goog.events.EventType.CLICK, function(event){
    	layer.map.removeLayer(layer);
    	this.redraw();
    }, undefined, this);
    return minimizeView; 
};

/**
 * This simply creates the dom element which are representing the minimize view of a layer element in 
 *   the layer management object.
 * @param {OpenLayers.Layer} layer
 * @private
 */
VK2.Tools.Layerbar.prototype._createMaximizeOverlayView = function(layer){
	
	// creates the body of the layer for more control as list element
    // right now only if it is a time layer
    var maximizeViewUnorderedList = goog.dom.createDom('ul',{'class':'maximize'});
    var maximizeViewContainer = goog.dom.createDom('div',{'class':'layer-max-container'});
    goog.dom.appendChild(maximizeViewUnorderedList, maximizeViewContainer);
    
    var innerContainer = goog.dom.createDom('div',{'class':'media'});
    goog.dom.appendChild(maximizeViewContainer, innerContainer);
    
    // creates an thumbnail container an adds the image which is refered 
    // through the layer element
    var thumbnail = goog.dom.createDom('img', {
    	'alt': '...',
    	'class': 'thumbnail pull-left media-object',
    	'src': layer.thumbnail
    })
    goog.dom.appendChild(innerContainer, thumbnail);
    

    // creates the slider div
    // one slider for the opacity and one for the time
    var sliderContainer = goog.dom.createDom('div',{'class':'media-body slider-container'});
    goog.dom.appendChild(innerContainer, sliderContainer);

    // opacity slider
    goog.dom.appendChild(sliderContainer, this._createSliderView(layer.id, 'Opacity', 'opacity'));
            
    // add time slider if it is a time supported layer and also overwrite the
    // label name
    if (layer.isTime){
    	goog.dom.appendChild(sliderContainer, this._createSliderView(layer.id, VK2.Utils.get_I18n_String('layerbar_choosetime'), 'time'));
    }
   
    return maximizeViewUnorderedList;
};

/**
 * @param {string} id Layer id 
 * @param {string} lbl Label of the slider
 * @param {string} className Class name of the slider
 * @return {Element}
 */
VK2.Tools.Layerbar.prototype._createSliderView = function(id, lbl, className){
	var container = goog.dom.createDom('div',{'class': className});
	var innerContainer = goog.dom.createDom('div',{'class': 'slider-outer'});
	goog.dom.appendChild(container, innerContainer);
	
	var label = goog.dom.createDom('div',{'class':'label','innerHTML':lbl+':'});
	goog.dom.appendChild(innerContainer, label);
	
	var sliderContainer = goog.dom.createDom('div',{
		'class':'slider-inner',
		'value': id
			
	});
	goog.dom.appendChild(innerContainer, sliderContainer);
	
	var tooltip = goog.dom.createDom('div',{'class':'tooltip top in fade'});
	var tooltipArrow = goog.dom.createDom('div',{'class':'tooltip-arrow'});
	var tooltipInner = goog.dom.createDom('div',{'class':'tooltip-inner'});
	goog.dom.appendChild(tooltip, tooltipArrow);
	goog.dom.appendChild(tooltip, tooltipInner);
	goog.dom.appendChild(sliderContainer, tooltip);

	return container;
};
