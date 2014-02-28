goog.provide('VK2.Tools.SpatialSearch');

goog.require('goog.dom');

/**
 * @param {Element} parentElement Html element to which the spatial search module should be added
 * @param {Object} map OpenLayers.Map
 * @param {Object} pubsub Module for using the publish-/subscribe-pattern
 * @constructor
 */
VK2.Tools.SpatialSearch = function(parentElement, map, pubsub){
	
	/**
	 * @type {string}
	 * @public
	 */
	this.NAME = VK2.Utils.get_I18n_String('toolname_layersearch');
	
	/**
	 * @type {Object}
	 * @private
	 */
	this._timeParams = {
            extent: null,
            time: null,
            wms: "http://194.95.145.43/mapcache", //"http://194.95.145.43/cgi-bin/mtbows",
            wms_layer: "messtischblaetter", //"Historische Messtischblaetter",
            wfs: "http://194.95.145.43/cgi-bin/mtbows",
            layer: "Historische Messtischblaetter",
            featureType: "Historische_Messtischblaetter_WFS",
            featurePrefix: "ms",
            featureNS: "http://mapserver.gis.umn.edu/mapserver",
            geometryName: "boundingbox",
            serviceVersion: "1.0.0",
            maxFeatures: 10000,
            srsName: "EPSG:900913",
            maxResolution: 305.74811309814453
	};
	
	/**
	 * @type {Element}
	 * @private
	 */
	this._parentElement = parentElement;
	
	/**
	 * @type {Object}
	 * @private
	 */
	this._elementIds = {
			headerPanel: 'panel-heading-mapsearch',
			tablePanel: 'panel-spatialsearch-table',
			toolsPanel: 'panel-spatialsearch-tools'
	};
	
	/**
	 * @type {Object}
	 * @private
	 */
	this._toolElementIds = {
			slider: 'spatialsearch-tools-slider',
			label_start: 'spatialsearch-slider-label-start',
			label_end: 'spatialsearch-slider-label-end',
			btn: 'spatialsearch-tools-btn-add-layer',
			input_field: 'spatialsearch-tools-input-layer'
	}
	/**
	 * @type {Array.<number>}
	 * @private
	 */
	this._timestamps = [1868,1945];
	
	/**
	 * @type {number}
	 * @private
	 */
	this._maxResolution = 305.74811309814453;
	
	/**
	 * @type {Object}
	 * @private
	 */
	this._map = map;
	
	/**
	 * @type {Object}
	 * @private
	 */
	this._pubSubHandler = pubsub;
	
	/**
	 * @type {boolean}
	 * @private
	 */
	this._isActive = false;
	
	/**
	 * @type {Object}
	 * @private
	 */
	this._mapsearch = null;

	// call init function
	this._loadHtmlContent();
	this._loadBehavior();
}

/**
 * @private
 */
VK2.Tools.SpatialSearch.prototype._loadHtmlContent = function(){
	// build panel 
	var panel = goog.dom.createDom('div', {
		'id': 'panel-layersearch',
		'class': 'panel panel-default searchTablePanel'
	});
	goog.dom.appendChild(this._parentElement, panel);	
	
	//
	// heading
	//
	var panelHeading = goog.dom.createDom('div', {
		'id': this._elementIds.headerPanel,
		'class': 'panel-heading'
	});
	
	var panelHeadingContent = goog.dom.createDom('div', {
		'id': 'panel-heading-content',
		'class': 'content',
		'innerHTML':VK2.Utils.get_I18n_String('change_zoomlevel')
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
		'id': this._elementIds.tablePanel,
		'class': 'panel-mapsearch-table'
	});
	goog.dom.appendChild(panel, panelTable);
	
	//
	// tools
	//
	var panelTools = goog.dom.createDom('div', {
		'id': this._elementIds.toolsPanel,
		'class': 'panel-spatialsearch-tools'
	});
	goog.dom.appendChild(panel, panelTools);
	
	// label for time-sldier
	var labelTimeSlider = goog.dom.createDom('label', {'innerHTML':VK2.Utils.get_I18n_String('change_timeperiod')});
	goog.dom.appendChild(panelTools, labelTimeSlider);
	
	// container
	var toolsContainer = goog.dom.createDom('div',{
		'class': 'time-slider-container'
	});
	
	// slider elements
	var sliderLabelStart = goog.dom.createDom('div',{
		'id': this._toolElementIds.label_start,
		'class': 'slider-label slider-label-start'
	});
	
	var sliderLabelEnd = goog.dom.createDom('div',{
		'id': this._toolElementIds.label_end,
		'class': 'slider-label slider-label-end'
	})
	
	var sliderContainer = goog.dom.createDom('div',{
		'id': this._toolElementIds.slider,
		'class': 'slider'
	});
	
	goog.dom.appendChild(toolsContainer, sliderLabelStart);
	goog.dom.appendChild(toolsContainer, sliderContainer);
	goog.dom.appendChild(toolsContainer, sliderLabelEnd);
	goog.dom.appendChild(panelTools, toolsContainer);
		
	// choose layer elements
	var layerChooserContainer = goog.dom.createDom('div',{
		'class': 'layer-chooser-container'
	});
	
	var layerChooserInput = goog.dom.createDom('input',{
		'id': this._toolElementIds.input_field,
		'class': 'layer-chooser-input',
		'type': 'text'
	});
	
	var layerChooserBtn = goog.dom.createDom('button',{
		'id': this._toolElementIds.btn,
		'class': 'layer-chooser-btn',
		'innerHTML': VK2.Utils.get_I18n_String('displaytimestamp')
	});
	
	goog.dom.appendChild(layerChooserContainer, layerChooserInput);
	goog.dom.appendChild(layerChooserContainer, layerChooserBtn);
	goog.dom.appendChild(panelTools, layerChooserContainer);

	// container for minimize messtischblatt view
	var minimzeMtbView = goog.dom.createDom('div', {
		'id': 'panel-spatialsearch-mtbview',
		'class':'panel-spatialsearch-mtbview'
	});
	goog.dom.appendChild(panel, minimzeMtbView);
	
}

/**
 * @private
 */
VK2.Tools.SpatialSearch.prototype._loadBehavior = function(){
		
	/**
	 * @type {VK2.Tools.MinimizeMesstischblattView}
	 * @private
	 */
	this._minimizeMtbView = new VK2.Tools.MinimizeMesstischblattView('panel-spatialsearch-mtbview', this._pubSubHandler);
	
	// load mapsearch
	this._mapsearch = new VK2.Tools.MapSearch(this._map, this._maxResolution, this._timestamps, 
			this._elementIds.headerPanel, this._elementIds.tablePanel, this._minimizeMtbView);
	
	// load toolbar behavior
	var sliderContainer = document.getElementById(this._toolElementIds.slider);
	var label_start = document.getElementById(this._toolElementIds.label_start);
	var label_end = document.getElementById(this._toolElementIds.label_end);
	
	var timeSlider = $(sliderContainer).slider({
        range: true,
        min: this._timestamps[0],
        max: this._timestamps[1],
        values: this._timestamps,
        animate: 'slow',
        orientation: 'horizontal',
        step: 1,
        slide: function( event, ui ) {
            $(label_start).text( ui.values[ 0 ] );
            $(label_end).text( ui.values[ 1 ] );
        },
        change: $.proxy(function( event, ui ){
            this._mapsearch.updateTimestamp(event, ui.values);
        }, this)
    });
	
    // init label of the time slider
    $(label_start).text(timeSlider.slider( "values", 0 ));
    $(label_end).text(timeSlider.slider( "values", 1 ));
    
    // adding a publish event for sending the timelayer to the main map
    var layerChooserBtn = document.getElementById(this._toolElementIds.btn);
    $(layerChooserBtn).button().click($.proxy(function( event ){
    	var timeValue = $(document.getElementById(this._toolElementIds.input_field)).val();
    	
    	if (this._pubSubHandler != null){
            if(timeValue.length == 4 && (typeof parseInt(timeValue) === 'number')){
            	this._timeParams.extent = this._map.getExtent();
            	this._timeParams.time = timeValue;  
                this._pubSubHandler.publish("addtimelayer",this._timeParams);
            } else {
                alert(VK2.Utils.get_I18n_String('choose_valide_timestamp'));
            }
    	}
    },this));
}

/**
 * @public
 */
VK2.Tools.SpatialSearch.prototype.activate = function(){
	this._mapsearch.activate();
	this._isActive = true;
}

/**
 * @public
 */
VK2.Tools.SpatialSearch.prototype.deactivate = function(){
	this._mapsearch.deactivate();
	this._isActive = false;
}
