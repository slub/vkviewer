/* 
 * Dependencies: overlay.js
 * 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

VK2.Tools.LayerManagement = VK2.Class({
    
    /*
     * {DOMElements}
     */
     layersDiv: null,
     minimizeDiv: null,
     maximizeDiv: null,
     overlayLayersDiv: null,
    
    /*
     * other settings attributes
     */
     displayBtn: null,
     layerStates: null, 
     map: null,
     id: null,
     div: null,
     ascending: true,
     baseLayers: [],
     overlayLayers: [], // include the overlay layers
     _mapController: null,
     _vk2FeatureLayer: null, // should be moved to initalization
                                           
    /**
     * Constructor: OpenLayers.Control.LayerSwitcher
     *
     * Parameters:
     * arguments - {Object} they have to contain a {<OpenLayers.Map>}, a div container 
     *              and an id. 
     */
    initialize: function(arguments){
        this.map = arguments.map;
        this.div = arguments.div;
        this.id = arguments.id;
        
        if (arguments.vk2featurelayer){
        	this._vk2FeatureLayer = arguments.vk2featurelayer
        } else {
        	this._vk2FeatureLayer = new Vk2FeatureLayer();
        }
        
        
        // this displayBtn is set to true the class assumes that there is an
        // extern control of the minimize maximaze behavior
        if (arguments.displayBtn)
            this.displayBtn = arguments.displayBtn;
        else this.displayBtn = false;

        this.layerStates = [];

        this.draw();
    },
            
    /**
     * Destroys this module
     */
    destroy: function(){
        //clear out layers info and unregister their events
        this.clearLayersArray("vk2Data");
        
        this.map.events.un({
            buttonclick: onButtonClick,
            addlayer: this.redraw,
            changelayer: this.redraw,
            removelayer: this.redraw,
            changebaselayer:this. redraw,
            scope: this
        });
    },
    
    /**
     * Method: setMap
     *
     * Properties:
     * map - {<OpenLayers.Map>}
     */
    setMap: function(map) {
        this.map.events.on({
            addlayer: this.redraw,
            changelayer: this.redraw,
            removelayer: this.redraw,
            changebaselayer: this.redraw,
            scope: this
        });
    },
    
    /**
     * Method: draw
     *
     * Returns:
     * {DOMElement} A reference to the DIV DOMElement containing the
     *     switcher tabs.
     */
    draw: function() {
        // create layout divs
        this._loadContents();

        // populate div with current info
        this.redraw();

        return this.div;
    },
            
    /**
     * Method: clearLayersArray
     * User specifies either "base" or "data". we then clear all the
     *     corresponding listeners, the div, and reinitialize a new array.
     *
     * Parameters:
     * layersType - {String}
     */
    clearLayersArray: function(layersType) {
        this[layersType + "LayersDiv"].innerHTML = "";
        this[layersType + "Layers"] = [];
    },
           
       /**
     * Method: checkRedraw
     * Checks if the layer state has changed since the last redraw() call.
     *
     * Returns:
     * {Boolean} The layer state changed since the last redraw() call.
     */
     checkRedraw: function() {
        if ( !this.layerStates.length ||
             (this.map.layers.length != this.layerStates.length) ) {
            return true;
        }

        for (var i = 0, len = this.layerStates.length; i < len; i++) {
            var layerState = this.layerStates[i];
            var layer = this.map.layers[i];
            if ( (layerState.name != layer.name) ||
                 (layerState.inRange != layer.inRange) ||
                 (layerState.id != layer.id) ||
                 (layerState.visibility != layer.visibility) ) {
                return true;
            }
        }

        return false;
    },
    
    /**
     * Method: redraw
     * Goes through and takes the current state of the Map and rebuilds the
     *     control to display that state. Groups base layers into a
     *     radio-button group and lists each data layer with a checkbox.
     *
     * Returns:
     * {DOMElement} A reference to the DIV DOMElement containing the control
     */
    redraw: function() {
        //if the state hasn't changed since last redraw, no need
        // to do anything. Just return the existing div.
        if (!this.checkRedraw()) {
            return this.div;
        }

        //clear out previous layers
        this.clearLayersArray("overlay");

        var containsOverlays = false;
        var containsBaseLayers = false;

        // Save state -- for checking layer if the map state changed.
        // We save this before redrawing, because in the process of redrawing
        // we will trigger more visibility changes, and we want to not redraw
        // and enter an infinite loop.
        var len = this.map.layers.length;
        this.layerStates = new Array(len);
        for (var i=0; i <len; i++) {
            var layer = this.map.layers[i];
            this.layerStates[i] = {
                'name': layer.name,
                'visibility': layer.visibility,
                'inRange': layer.inRange,
                'id': layer.id
            };
        }

        var layers = this.map.layers.slice();
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
        return this.div;
    },
            
    /**
     * Method: onButtonClick
     *
     * Parameters:
     * evt - {Event}
     */
    onButtonClick: function(evt) {
        var button = evt.currentTarget;
        if (button === this.minimizeDiv) {
            this.minimizeControl();
        } else if (button === this.maximizeDiv) {
            this.maximizeControl();
        } else if (button._layerSwitcher === this.id) {
            if (button["for"]) {
                button = document.getElementById(button["for"]);
            }
            if (!button.disabled) {
                if (button.type == "radio") {
                    button.checked = true;
                    this.map.setBaseLayer(this.map.getLayer(button._layer));
                } else {
                    this.updateMap();
                }
            }
        }
    },
    
    /**
     * Method: updateMap
     * Cycles through the loaded data and base layer input arrays and makes
     *     the necessary calls to the Map object such that that the map's
     *     visual state corresponds to what the user has selected in
     *     the control.
     */
    updateMap: function() {

        // set the newly selected base layer
        for(var i=0, len=this.baseLayers.length; i<len; i++) {
            var layerEntry = this.baseLayers[i];
            if (layerEntry.inputElem.checked) {
                this.map.setBaseLayer(layerEntry.layer, false);
            }
        }

        // set the correct visibilities for the vk2 overlays
        for(var i=0, len=this.overlayLayers.length; i<len; i++) {
            var layerEntry = this.overlayLayers[i];
            var isVisibile = document.getElementById(layerEntry.id).checked;
            layerEntry.setVisibility(isVisibile);          
            
            // update the feature layer
            this._updateVk2FeatureLayer(layerEntry);
        }
    },
          
    /**
     * Method: updateVk2FeatureLayer
     * 
     * layer - {Vk2Layer}
     * 
     * Update the FeatureLayer which is connect to the raster or time layers
     * and which contains further information. For managing the FeatureLayer 
     * methods of the Vk2FeatureLayer object are used. 
     */
    _updateVk2FeatureLayer: function(layer){
        if(layer.getVisibility()){
            this._vk2FeatureLayer.addFeaturesFromTimeLayer(layer, this.map);
        } else {
            this._vk2FeatureLayer.removeFeaturesFromTimeLayer(layer, this.map);
        }
    },

    /**
     * Method: maximizeControl
     * Set up the labels and divs for the control
     *
     * Parameters:
     * e - {Event}
     */
    maximizeControl: function(e) {

        // set the div's width and height to empty values, so
        // the div dimensions can be controlled by CSS
        this.div.style.width = "";
        this.div.style.height = "";

        this.showControls(false);

        if (e != null) {
        }
    },

    /**
     * Method: minimizeControl
     * Hide all the contents of the control, shrink the size,
     *     add the maximize icon
     *
     * Parameters:
     * e - {Event}
     */
     minimizeControl: function(e) {

        // to minimize the control we set its div's width
        // and height to 0px, we cannot just set "display"
        // to "none" because it would hide the maximize
        // div
        this.div.style.width = "0px";
        this.div.style.height = "0px";

        this.showControls(true);

        if (e != null) {
        }
    },

    /**
     * Method: showControls
     * Hide/Show all LayerSwitcher controls depending on whether we are
     *     minimized or not
     *
     * Parameters:
     * minimize - {Boolean}
     */
    showControls: function(minimize) {

        this.maximizeDiv.style.display = minimize ? "" : "none";
        this.minimizeDiv.style.display = minimize ? "none" : "";

        this.layersDiv.style.display = minimize ? "none" : "";
    },
       
    /**
     * method: _opacitySliderEvent
     * 
     * event - {Event}
     * ui - {JQueryObject}
     * 
     * Event changes the opactiy of the connected layer
     */
    _opacitySliderEvent: function(event, ui){
        // get new opacity value and layerElem
        var newOpacityValue = ui.value/100;
        var layer = this._getLayerToEvent(event);
        
        // change the opacity the raster layer
        layer.setOpacity(newOpacityValue);
        
        return null;
    },
            
    /**
     * method: _timeSliderEvent
     * 
     * event - {Event}
     * ui - {JQueryObject}
     * 
     * This function handles the time slider events on the layer level
     */
    _timeSliderEvent: function(event, ui){
        var newTimeValue = ui.value;
        var layer = this._getLayerToEvent(event);
        
        // change layer label in the layerswitcher and time value of the layer object
        var tmpLblDivs = $(document).find('div.label');
        for(var i = 0; i < tmpLblDivs.length; i++){
            if (tmpLblDivs[i].value == event.target.value){
                tmpLblDivs[i].innerHTML = layer.params.LAYERS + " " + newTimeValue;
                layer.oldTime = layer.params.TIME;
                layer.params.TIME = newTimeValue;  
                layer.redraw(true);
                
                // if this layer is visible change features
                this._updateVk2FeatureLayer(layer);
            }
        }    
    },
    
    /**
     * Method: _createLayerElement
     * 
     * @param layer - {Vk2Layer}
     * @return {DOMElement}
     */
    _createLayerElement: function(layer){
    	var overlayElem = this._createLayerDomElement(layer);
    	this._createEventBehaviorToLayerElem(overlayElem, layer);
    	return overlayElem;
    },
    
    /**
     * Method: _createEventBehaviorToLayerElem
     * 
     * @param layer - {Vk2Layer}
     * @param {DOMElement}
     */
    _createEventBehaviorToLayerElem: function(overlayElem, layer){
        // add events and behavior to the list elements
        $(overlayElem).find('ul').hide();
        $(overlayElem).find('.minimize').find('.label').click(function(event){
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
            $(overlayElem).find('.minimize').find('.label').html(layerLbl);
        }
        
        return layer;
    },
    
    /**
     * Method: _createLayerDomElement
     * This method creates an list element and returns it.
     * 
     * @param layer - {Vk2Layer} contains a object which attributes represent the 
     *                      input layer object
     * @return {DOMElement}                     
     */
    _createLayerDomElement: function(layer) {  
    	   	
    	// dom container elements for a view of a overlay
        var overlayElem = document.createElement("li");
        overlayElem.className = overlayElem.className + " overlayElem";
        
        var overlayElemOuterContainer = document.createElement('div');
        overlayElemOuterContainer.className = overlayElemOuterContainer.className + " overlayElemDiv";
     
        // get minimize view which returns a layerElemt object which contains ids of relevant dom elements
        overlayElemOuterContainer.appendChild(this._createMinimizeView_forOverlay(layer, this.id));
        overlayElemOuterContainer.appendChild(this._createMaximizeView_forOverlay(layer));
        overlayElem.appendChild(overlayElemOuterContainer);       
        return overlayElem;
    },


    
    /**
     * Method: _addSliderBehaviour
     * 
     * arguments - {Object} contains different arguments for the configuration
     *              of the slider
     * eventHandler - {Object} function which is called in case of a event
     *  
     * Cycles Creates an default body for a layer element
     */
     
    _addSliderBehaviour: function(arguments, eventHandler){
        // initialize tooltip 
        var tooltipTime = $(arguments.tooltipDiv);
        tooltipTime.hide();
        
        // initialize timeslider
        var timeSlider = $(arguments.sliderDiv).slider({
            min: arguments.min,
            max: arguments.max,
            value: arguments.value,
            animate: 'slow',
            orientation: 'horizontal',
            step: 1,
            // the next three events are managing the tooltip
            start: function(event, ui){
                tooltipTime.fadeIn('fast');
            },
            slide: function(event, ui){
                var value = timeSlider.slider('value');
                var valueCss = (arguments.min - value)*-1;
                tooltipTime.css('left',valueCss).text(ui.value);
            },
            stop: function(event, ui){
                tooltipTime.fadeOut('fast');
            },
            change: $.proxy(eventHandler, this)
        });
        return true;
    },
    
    /**
     * method: _getElemToEvent
     * 
     * event - {Event}
     * return {Vk2Layer}
     */
    _getLayerToEvent: function(event){
        // get layer which the event is attached to 
        for(var i = 0; i < this.map.layers.length; i++){
            if (this.map.layers[i].id === event.target.value){
                return this.map.layers[i];
            }               
        };
        return null;
    },
    


    /**
     * Method: _loadContents
     * Set up the labels and divs for the control
     */
    _loadContents: function() {
        // layers list div
        this.layersDiv = document.createElement("div");
        this.layersDiv.id = this.id + "_layersDiv";
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

        this.div.appendChild(this.layersDiv);

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
            this.div.appendChild(this.maximizeDiv);

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

            this.div.appendChild(this.minimizeDiv);
        }
    },
    
    /**
     * Function: _createMinimizeView_forOverlay
     * This simply creates the dom element which are representing the minimize view of a layer element in 
     * the layer management object.
     * 
     * @param layer - {Vk2Layer}
     * @param id - {String} Id of the layer management object
     * @return {DOMElement}
     */
    _createMinimizeView_forOverlay: function(layer, id){
    	
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
        minimizeViewLbl.className = minimizeViewLbl.className + " label";
        minimizeViewLbl.innerHTML =  layer.name;

        // add the header elements to parent container
        minimizeView.appendChild(minimizeViewChBox);
        minimizeView.appendChild(minimizeViewLbl);    
        return minimizeView; 
    },

    /**
     * Function: _createMaximizeView_forOverlay
     * This simply creates the dom element which are representing the minimize view of a layer element in 
     * the layer management object.
     * 
     * @param layer {Vk2Layers}
     * @return {DOMElement}
     */
    _createMaximizeView_forOverlay: function(layer){
    	
    	function _createSliderElements(id, lbl, classname){
    		var container = document.createElement('div');
    		container.className = container.className + " " +classname;
    		
    	    var toolTip = document.createElement("span");
    	    toolTip.className = toolTip.className + " toolTip";
    	    container.appendChild(toolTip);
    	    
    	    var label = document.createElement("div");
    	    label.innerHTML = lbl + ":";
    	    label.className = label.className + " label";
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
    },
            
    /**
     * Method: addLayer
     * 
     * @param layer - {Vk2Layer} a OpenLayers.Layer object enriched with further attributes
     * @return {Boolean} 
     */
    
    addLayer: function(layer){
        // adds the map to the layer
        this.map.addLayer(layer);
        
        // if it is not a base layer it push the layer to the vk2DataInputs
        // and if it is visible it adds the layer element to the vk2FeatureLayer
        if (!layer.isBaseLayer){                       
            // checks if the layer is visible
            if(layer.getVisibility()){
                this._vk2FeatureLayer.addFeaturesFromTimeLayer(layer, this.map);
            }
        }
  
        this.redraw();

        return true;
    },  
    
    activate: function(){
    	//this._addTimeSearchLayer();
    },
    
    deactivate: function(){
    	//this._removeTimeSearchLayer();
    },
            
    CLASS_NAME: "Vk2.LayerManagement"
});

