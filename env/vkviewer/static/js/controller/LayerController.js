goog.provide('VK2.Controller.LayerController');

goog.require('goog.dom');
/**
 * @param {OpenLayers.Layer} layer
 */
VK2.Controller.LayerController = function(layer){
	
	/**
	 * @type {OpenLayers.Layer} 
	 * @private
	 */
	this._layer = layer;
	
	var overlayElem = this._createLayerDomElement(layer);
	this._createEventBehaviorToLayerElem(overlayElem, layer);
	return overlayElem;
	
}

/**
 * @param {OpenLayers.Layer|undefined} layer
 * @return {Element}
 * @static
 */
VK2.Controller.LayerController.createLayerControllerView = function(layer, id){
	
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
 * @static
 */
VK2.Controller.LayerController._createMinimizeOverlayView = function(layer, id){
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
   
    return minimizeView; 
};

/**
 * This simply creates the dom element which are representing the minimize view of a layer element in 
 *   the layer management object.
 * @param {OpenLayers.Layer} layer
 * @private
 * @static
 */
VK2.Controller.LayerController._createMaximizeOverlayView = function(layer){
	
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
    	goog.dom.appendChild(sliderContainer, this._createSliderView(layer.id, 'Time', 'time'));
    }
   
    return maximizeViewUnorderedList;
};

/**
 * @param {string} id Layer id 
 * @param {string} lbl Label of the slider
 * @param {string} className Class name of the slider
 * @return {Element}
 * @static
 */
VK2.Controller.LayerController._createSliderView = function(id, lbl, className){
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

