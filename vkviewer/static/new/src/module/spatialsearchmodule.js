goog.provide('VK2.Module.SpatialSearchModule');

goog.require('VK2.Utils');
goog.require('VK2.Module.AbstractModule');

/**
 * @constructor
 * @extends {VK2.Module.AbstractModule}
 * @param {Object} settings
 */
VK2.Module.SpatialSearchModule = function(settings){
	
	/**
	 * @type {string}
	 * @protected
	 */
	settings.NAME = VK2.Utils.getMsg('toolname_layersearch');
	goog.base(this, settings);
	
	// for testing purpose
	this.vectorLayer;
	if (goog.DEBUG){
		this.vectorLayer = new VK2.Layer.MapSearch({
			'projection':'EPSG:900913'
		});
	};
	
	this._loadHtmlContent(this._parentEl);
	this._loadBehavior();
};
goog.inherits(VK2.Module.SpatialSearchModule, VK2.Module.AbstractModule);

/**
 * @param {Element} parent_element
 * @private
 */
VK2.Module.SpatialSearchModule.prototype._loadHtmlContent = function(parent_element){
	// build panel 
	var panel = goog.dom.createDom('div', {
		'id': 'panel-layersearch',
		'class': 'panel panel-default searchTablePanel'
	});
	goog.dom.appendChild(parent_element, panel);	
	
	//
	// heading
	//
	var panelHeading = goog.dom.createDom('div', {
		'id': 'panel-heading-mapsearch',
		'class': 'panel-heading'
	});
	
	var panelHeadingContent = goog.dom.createDom('div', {
		'id': 'panel-heading-content',
		'class': 'content',
		'innerHTML':VK2.Utils.getMsg('change_zoomlevel')
	});
	
	var panelHeadingLoading = goog.dom.createDom('div', {
		'class': 'loading'
	});
	
	goog.dom.appendChild(panelHeading, panelHeadingContent);
	goog.dom.appendChild(panelHeading, panelHeadingLoading);
	goog.dom.appendChild(panel, panelHeading);
	
	//
	// table
	//
	var panelTable = goog.dom.createDom('div', {
		'id': 'panel-spatialsearch-table',
		'class': 'panel-mapsearch-table'
	});
	goog.dom.appendChild(panel, panelTable);
	
	//
	// tools
	//
	var panelTools = goog.dom.createDom('div', {
		'id': 'panel-spatialsearch-tools',
		'class': 'panel-spatialsearch-tools'
	});
	goog.dom.appendChild(panel, panelTools);
	
	// label for time-sldier
	var labelTimeSlider = goog.dom.createDom('label', {'innerHTML':VK2.Utils.getMsg('change_timeperiod')});
	goog.dom.appendChild(panelTools, labelTimeSlider);
	
	// container
	var toolsContainer = goog.dom.createDom('div',{
		'class': 'time-slider-container'
	});
	
	// slider elements
	var sliderLabelStart = goog.dom.createDom('div',{
		'id': 'spatialsearch-slider-label-start',
		'class': 'slider-label slider-label-start'
	});
	
	var sliderLabelEnd = goog.dom.createDom('div',{
		'id': 'spatialsearch-slider-label-end',
		'class': 'slider-label slider-label-end'
	})
	
	var sliderContainer = goog.dom.createDom('div',{
		'id': 'spatialsearch-tools-slider',
		'class': 'slider'
	});
	
	goog.dom.appendChild(toolsContainer, sliderLabelStart);
	goog.dom.appendChild(toolsContainer, sliderContainer);
	goog.dom.appendChild(toolsContainer, sliderLabelEnd);
	goog.dom.appendChild(panelTools, toolsContainer);
};

/**
 * @private
 */
VK2.Module.SpatialSearchModule.prototype._loadBehavior = function(){
		
	// load toolbar behavior
	var sliderContainer = goog.dom.getElement('spatialsearch-tools-slider');
	var label_start = goog.dom.getElement('spatialsearch-slider-label-start');
	var label_end = goog.dom.getElement('spatialsearch-slider-label-end');
	
	var timeSlider = $(sliderContainer).slider({
        'range': true,
        'min': 1868,
        'max': 1945,
        'values': [1868, 1945],
        'animate': 'slow',
        'orientation': 'horizontal',
        'step': 1,
        'slide': function( event, ui ) {
            $(label_start).text( ui.values[ 0 ] );
            $(label_end).text( ui.values[ 1 ] );
        },
        'change': $.proxy(function( event, ui ){
        	this.vectorLayer.setTimeFilter(ui.values[0],ui.values[1]);
            //this._mapsearch.updateTimestamp(event, ui.values);
        }, this)
    });
	
    // init label of the time slider
    $(label_start).text(timeSlider.slider( "values", 0 ));
    $(label_end).text(timeSlider.slider( "values", 1 ));
};

/**
 * Should be triggered for activate the module.
 * @override
 */
VK2.Module.SpatialSearchModule.prototype.activate = function() {
	console.log('SpatialSearchModule activated.');
	this._map.addLayer(this.vectorLayer);
};

/**
 * Should be triggered for deactivate the module.
 * @override
 */
VK2.Module.SpatialSearchModule.prototype.deactivate = function() {
	console.log('SpatialSearchModule deactivated.');
	this._map.removeLayer(this.vectorLayer);
};