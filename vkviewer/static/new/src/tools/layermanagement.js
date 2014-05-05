goog.provide('VK2.Tools.LayerManagement');

goog.require('goog.dom');
goog.require('goog.events');
goog.require('goog.events.EventType');

/**
 * @param {Element} parent_element
 * @param {VK2.Layer.HistoricMap} layer
 * @param {ol.Map} map
 * @constructor
 */
VK2.Tools.LayerManagement = function(parent_element, layer, map){
	
	// build html skeleton
	var parentListEl = goog.dom.createDom('li',{'class':'overlayElem'});
	goog.dom.appendChild(parent_element, parentListEl);
	
	var containerEl = goog.dom.createDom('div',{'class':'overlayElemDiv'});
	goog.dom.appendChild(parentListEl,containerEl);
	
	// add different views
	var minimize_view = this._createMinimizeOverlayView(layer, map);
	goog.dom.appendChild(containerEl, minimize_view);
	
	var maximize_view  = this._createMaximizeOverlayView(layer);
	goog.dom.appendChild(containerEl, maximize_view)
	
	// append toggle view behavior
    $(maximize_view).hide();
    $(minimize_view).find('.vk2Label').click(function(event){
        $(containerEl).find('ul').slideToggle();
    });
    
    // create opacity slider behavior
    var opacity_slider = goog.dom.getElementByClass('slider-inner', 
    		goog.dom.getElementByClass('opacity', maximize_view));
    this._addSliderBehavior({
	    	sliderDiv: opacity_slider,
	        value: 100,
	        min: 0,
	        max: 100,
	        step: 1
	}, goog.partial(function(layer, event, ui){
	    var newOpacityValue = ui.value/100;
	    layer.setOpacity(newOpacityValue);
	}, layer));
    
    // create time slider behavior
    var time_slider = goog.dom.getElementByClass('slider-inner', 
    		goog.dom.getElementByClass('time', maximize_view));
    this._addSliderBehavior({
    	sliderDiv: time_slider,
        value: layer.getTime(),
        min: 1868,
        max: 1945,
        step: 1
    }, goog.partial(function(layer, event, ui){
        layer.setTime(ui.value);
        
        // change layer label in the layerswitcher and time value of the layer object
//        var tmpLblDivs = $(document).find('div.vk2Label');
//        for(var i = 0; i < tmpLblDivs.length; i++){
//            if (tmpLblDivs[i].value == event.target.value){
//                tmpLblDivs[i].innerHTML = layer.name + " " + newTimeValue;
//                layer.oldTime = layer.params.TIME;
//                layer.params.TIME = newTimeValue;
//                layer.timeFtLayer.updateFeatures();
//                layer.redraw(true);
//            }
//        } 
	}, layer));
        
//    // change label to time label in the minimize view;
//    var layerLbl = layer.name+" "+layer.params.TIME;
//    $(overlayElem).find('.minimize').find('.vk2Label').html(layerLbl);
//    }
};

/**
 * Cycles Creates an default body for a layer element
 * @param {Object} settings Contains different arguments for the configuration
 *              of the slider
 * @param {function(object, object)} eventHandler 
 */
VK2.Tools.LayerManagement.prototype._addSliderBehavior = function(sliderSettings, eventHandler){  
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
};

/**
 * This simply creates the dom element which are representing the minimize view of a layer element in 
 *    the layer management object.
 * @param {VK2.Layer.HistoricMap} layer
 * @param {ol.Map}
 * @private
 */
VK2.Tools.LayerManagement.prototype._createMinimizeOverlayView = function(layer){
	// create the header with div (which should be clickable later) and checkbox
    var minimizeView = goog.dom.createDom('div', {'class':'minimize'});
    
    // add checkbox
    var minimizeViewChBox = goog.dom.createDom('input', {
    	'checked': layer.getVisible(),
    	'defaultChecked': layer.getVisible(),
    	'class': 'olButton',
    	'type': 'checkbox'
    });
    goog.dom.appendChild(minimizeView, minimizeViewChBox);
    
    // append behavior to checkbox
    goog.events.listen(minimizeViewChBox, goog.events.EventType.CLICK, function(event){
    	var checked = event.target.hasOwnProperty('checked') ? event.target.checked : true;
    	layer.setVisible(checked);
    });
 
    
    // label of the layer encapsulate in div
    var minimizeViewLbl = goog.dom.createDom('div',{
    	'text': layer.getName(),
    	'class': 'vk2Label',
    	'innerHTML': layer.getName()
    })
    goog.dom.appendChild(minimizeView, minimizeViewLbl);
    

  
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
    
    // append behavior to remove button
    goog.events.listen(removeButton, goog.events.EventType.CLICK, function(event){
    	map.removeLayer(layer);
    });
    
    return minimizeView; 
};

/**
 * This simply creates the dom element which are representing the minimize view of a layer element in 
 *   the layer management object.
 * @param {VK2.Layer.HistoricMap} layer
 * @private
 */
VK2.Tools.LayerManagement.prototype._createMaximizeOverlayView = function(layer){
	
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
    	'src': layer.getThumbnail()
    })
    goog.dom.appendChild(innerContainer, thumbnail);
    

    // creates the slider div
    // one slider for the opacity and one for the time
    var sliderContainer = goog.dom.createDom('div',{'class':'media-body slider-container'});
    goog.dom.appendChild(innerContainer, sliderContainer);

    // opacity slider
    goog.dom.appendChild(sliderContainer, this._createSliderView('Transparency', 'opacity'));
            
    // add time slider if it is a time supported layer and also overwrite the label name
    goog.dom.appendChild(sliderContainer, this._createSliderView(VK2.Utils.getMsg('layerbar_choosetime'), 'time'));
   
    return maximizeViewUnorderedList;
};

/**
 * @param {string} lbl Label of the slider
 * @param {string} className Class name of the slider
 * @return {Element}
 */
VK2.Tools.LayerManagement.prototype._createSliderView = function(lbl, className){
	var container = goog.dom.createDom('div',{'class': className});
	var innerContainer = goog.dom.createDom('div',{'class': 'slider-outer'});
	goog.dom.appendChild(container, innerContainer);
	
	var label = goog.dom.createDom('div',{'class':'label','innerHTML':lbl+':'});
	goog.dom.appendChild(innerContainer, label);
	
	var sliderContainer = goog.dom.createDom('div',{'class':'slider-inner'});
	goog.dom.appendChild(innerContainer, sliderContainer);
	
	var tooltip = goog.dom.createDom('div',{'class':'tooltip top in fade'});
	var tooltipArrow = goog.dom.createDom('div',{'class':'tooltip-arrow'});
	var tooltipInner = goog.dom.createDom('div',{'class':'tooltip-inner'});
	goog.dom.appendChild(tooltip, tooltipArrow);
	goog.dom.appendChild(tooltip, tooltipInner);
	goog.dom.appendChild(sliderContainer, tooltip);

	return container;
};