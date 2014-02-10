goog.provide('VK2.Tools.Layerbar');

/**
 * @param {Object} settings
 * @constructor
 */
VK2.Tools.Layerbar = function(settings){

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
	
    // this displayBtn is set to true the class assumes that there is an
    // extern control of the minimize maximaze behavior
	/**
	 * @type {boolean}
	 * @private
	 */
    if (goog.isDef(settings.displayBtn))
        this.displayBtn = settings.displayBtn;
    else this.displayBtn = false;

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
    for(var i=0, len=layers.length; i<len; i++) {
        var layer = layers[i];
        var baseLayer = layer.isBaseLayer;

        if (layer.displayInLayerSwitcher) {
            if (!baseLayer) {            
                // create own overlay elements
                this.overlayLayersDiv.appendChild(this._createLayerElement(layer));
                this.overlayLayers.push(layer);
            }
        }
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
            tmpLblDivs[i].innerHTML = layer.params.LAYERS + " " + newTimeValue;
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
	var overlayElem = this._createLayerDomElement(layer);
	this._createEventBehaviorToLayerElem(overlayElem, layer);
	return overlayElem;
};

/**
 * @param {Element} overlayElem
 * @param {VK2.Layer.VK2Layer} layer
 * @private
 */
VK2.Tools.Layerbar.prototype._createEventBehaviorToLayerElem = function(overlayElem, layer){
    // add events and behavior to the list elements
    $(overlayElem).find('ul').hide();
    $(overlayElem).find('.minimize').find('.vk2Label').click(function(event){
        $(overlayElem).find('ul').slideToggle();
    }); 
    
    // add event to this element
    $(overlayElem).find('.olButton').click($.proxy(this.onButtonClick, this));
       	
    // create opacity slider
    var arguments = {
        tooltipDiv: $(overlayElem).find('.opacity').find('.toolTip'),
        sliderDiv: $(overlayElem).find('.opacity').find('.sliderContainer'),
        value: 100,
        min: 0,
        max: 100,
        step: 1
    };
    this._addSliderBehaviour(arguments, this._opacitySliderEvent);
            
    //
    // add time slider if it is a time supported layer and also overwrite the
    // label name
    //
    if (layer.isTime){
        // add time slider behavior
        var arguments = {
            tooltipDiv: $(overlayElem).find('.time').find('.toolTip'),
            sliderDiv: $(overlayElem).find('.time').find('.sliderContainer'),
            value: layer.params.TIME,
            min: 1868,
            max: 1945,
            step: 1
        };
        this._addSliderBehaviour(arguments, this._timeSliderEvent);
        
        // change label to time labe in the minimize view;
        var layerLbl = layer.name+" "+layer.params.TIME;
        $(overlayElem).find('.minimize').find('.vk2Label').html(layerLbl);
    }
    
    return layer;
};

/**
 * This method creates an list element and returns it.
 * @param {VK2.Layer.VK2Layer} layer contains a object which attributes represent the 
 *     input layer object
 * @return {Element}         
 */
VK2.Tools.Layerbar.prototype._createLayerDomElement =  function(layer) {  
   	
	// dom container elements for a view of a overlay
    var overlayElem = document.createElement("li");
    overlayElem.className = overlayElem.className + " overlayElem";
    
    var overlayElemOuterContainer = document.createElement('div');
    overlayElemOuterContainer.className = overlayElemOuterContainer.className + " overlayElemDiv";
 
    // get minimize view which returns a layerElemt object which contains ids of relevant dom elements
    overlayElemOuterContainer.appendChild(this._createMinimizeView_forOverlay(layer, this._id));
    overlayElemOuterContainer.appendChild(this._createMaximizeView_forOverlay(layer));
    overlayElem.appendChild(overlayElemOuterContainer);       
    return overlayElem;
};

/**
 * Cycles Creates an default body for a layer element
 * @param {Object} sliderSettings Contains different arguments for the configuration
 *              of the slider
 * @param {Object} eventHandler Function which is called in case of a event
 */
VK2.Tools.Layerbar.prototype._addSliderBehaviour = function(sliderSettings, eventHandler){
    // initialize tooltip 
    var tooltipTime = $(sliderSettings.tooltipDiv);
    tooltipTime.hide();
    
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
            tooltipTime.fadeIn('fast');
        },
        slide: function(event, ui){
            var value = timeSlider.slider('value');
            var valueCss = (sliderSettings.min - value)*-1;
            tooltipTime.css('left',valueCss).text(ui.value);
        },
        stop: function(event, ui){
            tooltipTime.fadeOut('fast');
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
    // layers list div
    this.layersDiv = document.createElement("div");
    this.layersDiv.id = this._id + "_layersDiv";
    // for OL2 styles the class has to be layersDiv
    this.layersDiv.className = this.layersDiv.className + " layersDiv";

    this.vk2DataLayersLbl = document.createElement("div");
    this.vk2DataLayersLbl.innerHTML = "Overlays";
    this.vk2DataLayersLbl.className = this.vk2DataLayersLbl.className + " overlayLbls";
    
    this.overlayLayersDiv = document.createElement("div");
    this.overlayLayersDiv.className = this.overlayLayersDiv.className + " overlayDivs";
            
    if (this.ascending) {
        this.layersDiv.appendChild(this.vk2DataLayersLbl);
        this.layersDiv.appendChild(this.overlayLayersDiv);
    } else {
        this.layersDiv.appendChild(this.vk2DataLayersLbl);
        this.layersDiv.appendChild(this.overlayLayersDiv);
    }

    this._div.appendChild(this.layersDiv);

    // maximize button div
    if (this.displayBtn != false){
        var img = OpenLayers.Util.getImageLocation('layer-switcher-maximize.png');
        this.maximizeDiv = OpenLayers.Util.createAlphaImageDiv(
                                    "OpenLayers_Control_MaximizeDiv",
                                    null,
                                    null,
                                    img,
                                    "absolute");
        OpenLayers.Element.addClass(this.maximizeDiv, "maximizeDiv");
        this.maximizeDiv.style.display = "none";
        $(this.maximizeDiv).click($.proxy(this.onButtonClick, this));
        this._div.appendChild(this.maximizeDiv);

        // minimize button div
        var img = OpenLayers.Util.getImageLocation('layer-switcher-minimize.png');
        this.minimizeDiv = OpenLayers.Util.createAlphaImageDiv(
                                    "OpenLayers_Control_MinimizeDiv",
                                    null,
                                    null,
                                    img,
                                    "absolute");
        OpenLayers.Element.addClass(this.minimizeDiv, "minimizeDiv");
        this.minimizeDiv.style.display = "";
        $(this.minimizeDiv).click($.proxy(this.onButtonClick, this));

        this._div.appendChild(this.minimizeDiv);
    }
};

/**
 * This simply creates the dom element which are representing the minimize view of a layer element in 
 *    the layer management object.
 * @param {VK2.Layer.Vk2Layer} layer
 * @param {string} id Id of the layer bar object
 * @return {Element}
 */
VK2.Tools.Layerbar.prototype._createMinimizeView_forOverlay = function(layer, id){
	
	// create the header with div (which should be clickable later) and checkbox
    var minimizeView = document.createElement("div");
    minimizeView.value = layer.id;
    minimizeView.className = minimizeView.className + " minimize";
    
    // this checkbox has to be further styled
    var minimizeViewChBox = document.createElement("input");
    minimizeViewChBox.id = layer.id;
    minimizeViewChBox.name = layer.name;
    minimizeViewChBox.value = layer.name;
    minimizeViewChBox.checked = layer.getVisibility();
    minimizeViewChBox.defaultChecked = layer.getVisibility();
    minimizeViewChBox.className = "olButton";
    minimizeViewChBox._layer = layer.id;
    minimizeViewChBox._layerSwitcher = id;
    minimizeViewChBox.type = "checkbox";

    // disable checkbox if layer is out of view
    if(!layer.inRange){
        minimizeViewChBox.disabled = true;
    }

    // label of the layer encapsulate in div
    var minimizeViewLbl = document.createElement("div");
    minimizeViewLbl.value = layer.id;
    minimizeViewLbl.text = layer.name;
    minimizeViewLbl.className = minimizeViewLbl.className + " vk2Label";
    minimizeViewLbl.innerHTML =  layer.name;

    // add the header elements to parent container
    minimizeView.appendChild(minimizeViewChBox);
    minimizeView.appendChild(minimizeViewLbl);    
    return minimizeView; 
};

/**
 * This simply creates the dom element which are representing the minimize view of a layer element in 
 *   the layer management object.
 * @param {VK2.Layer.Vk2Layer} layer
 * @return {Element}
 */
VK2.Tools.Layerbar.prototype._createMaximizeView_forOverlay = function(layer){
	
	function _createSliderElements(id, lbl, classname){
		var container = document.createElement('div');
		container.className = container.className + " " +classname;
		
	    var toolTip = document.createElement("span");
	    toolTip.className = toolTip.className + " toolTip";
	    container.appendChild(toolTip);
	    
	    var label = document.createElement("div");
	    label.innerHTML = lbl + ":";
	    label.className = label.className + " vk2Label";
	    container.appendChild(label);
	    
	    // the div for the query slider, the value field has to be set with the
	    // id of the connected layerElem, otherwise the events won't work correct
	    var sliderContainer = document.createElement("div");
	    sliderContainer.className = sliderContainer.className + " sliderContainer";
	    sliderContainer.value = layer.id;
	    container.appendChild(sliderContainer);    
	    return container;
	};
	
	 // creates the body of the layer for more control as list element
    // right now only if it is a time layer
    var maximizeViewUnorderedList = document.createElement("ul");
    maximizeViewUnorderedList.className = maximizeViewUnorderedList.className + " maximize";
    var maximizeViewContainer = document.createElement("div");
    maximizeViewContainer.className = maximizeViewContainer.className + " container";
    
    // creates an thumbnail container an adds the image which is refered 
    // through the layer element
    var thumbDiv = document.createElement("div");
    thumbDiv.className = thumbDiv.className + " thumbnail";

    var thumbImg = document.createElement("img");
    thumbImg.alt = "Noimage";
    thumbImg.src = layer.thumbnail;
    thumbDiv.appendChild(thumbImg);
    
    // creates the slider div
    // one slider for the opacity and one for the time
    var sliderDiv = document.createElement("div");
    sliderDiv.className = sliderDiv.className + " slider";

    //
    // opacity slider
    //
    sliderDiv.appendChild(_createSliderElements(layer.id, 'Opacity', 'opacity'));
            
    //
    // add time slider if it is a time supported layer and also overwrite the
    // label name
    //
    if (layer.isTime){
    	sliderDiv.appendChild(_createSliderElements(layer.id, 'Time', 'time'));
    }
    
    maximizeViewContainer.appendChild(thumbDiv);
    maximizeViewContainer.appendChild(sliderDiv);
    maximizeViewUnorderedList.appendChild(maximizeViewContainer);
    return maximizeViewUnorderedList;
};

/**
 * @public
 * @param {VK2.Layer.Vk2Layer} layer
 * @return {boolean}
 */
VK2.Tools.Layerbar.prototype.addLayer = function(layer){
    // adds the map to the layer
    this._map.addLayer(layer);
    
    // if it is not a base layer it push the layer to the vk2DataInputs
    // and if it is visible it adds the layer element to the vk2FeatureLayer
    if (!layer.isBaseLayer){                       
        // checks if the layer is visible
        if(layer.getVisibility()){
        	//layer.timeFtLayer.display(this._map);
        	//var timeFtlayer = new VK2.Layer.TimeFeatureLayer(this._map, layer.wfsLayer, layer.params.TIME) 
            //this._vk2FeatureLayer.addFeaturesFromTimeLayer(layer, this._map);
        }
    }

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
