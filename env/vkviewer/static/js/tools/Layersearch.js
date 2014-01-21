/** 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 * 
 * @TODO Hover when SelectFeature in front!
 */
goog.require('goog.dom')
VK2.Tools.Layersearch = VK2.Class({
    
	NAME: VK2.Utils.get_I18n_String('toolname_layersearch'),
	
    // publish/subscription handler for publishing add time layer events
    _PubSubHandler: null,
    
    // timelayer fixed parameter
    _timeParameter: null,
    
    // after init this parameter is set to true
    _isInit: false,
    _isOpen: false,

    _map: null,
    _features: null,
    _timeLayer: null,
    _timestamps: [1868, 1945],
    
    /**
     * Attribute: _restrictedZoomLevel
     * {Integer}
     */
    _restrictedZoomLevel: 2,
    
    /**
     * Attribute: _isActive
     */
    _isActive: false,
    
    /**
     * Attribute: _eventListeners
     */
    _eventListeners: {          
        /**
         * Method: publishAddTimeLayerEvent
         * @param event {Event}
         */
        publishAddTimeLayerEvent: function(timeValue, pubsub, timeParams, map){
        	if(pubsub != null){
                if(timeValue.length == 4 && (typeof parseInt(timeValue) === 'number')){
                	timeParams.extent = map.getExtent();
                	timeParams.time = timeValue;  
                    pubsub.publish("addtimelayer",timeParams);
                } else {
                    alert(VK2.Utils.get_I18n_String('choose_valide_timestamp'));
                }
            } else {
                console.log("Missing publish/subscription handler")
            }
        },
    },
    
    /**
     * Method: _loadToolbar
     * This function creates the html/javascript content of the toolbar panel
     */
    _loadToolbar: function(){
        // create html elements
        var divToolbar = document.createElement("div");
        divToolbar.className = divToolbar.className + " vk2LSToolPanel vk2LSToolbar";
        divToolbar.id = "vk2LSToolbar";
        
        // html elements for slider
        var sliderLabel1 = document.createElement("div");
        sliderLabel1.className = sliderLabel1.className + " vk2TimeSliderLabel1";        
        var sliderLabel2 = document.createElement("div");
        sliderLabel2.className = sliderLabel2.className + " vk2TimeSliderLabel2";       
        var sliderDiv = document.createElement("div");
        sliderDiv.className = sliderDiv.className + " vk2TimeSliderDiv";   
        
        // html elements for adding the choosed layer
        var addLayerDiv = document.createElement("div");
        addLayerDiv.className = addLayerDiv.className + " vk2AddLayerDiv";
  
            var addLayerInput = document.createElement("input");
        addLayerInput.className = addLayerInput.className + " vk2AddLayerInput";
        addLayerInput.id = "vk2AddLayerInput";
        addLayerInput.type = "text";

        var addLayerBtn = document.createElement("div");
        addLayerBtn.id = "vk2AddLayerButton";
        addLayerBtn.innerHTML = VK2.Utils.get_I18n_String('displaytimestamp');

        addLayerDiv.appendChild(addLayerInput);
        addLayerDiv.appendChild(addLayerBtn);
        
        // append all to maind div 
        divToolbar.appendChild(sliderLabel1);
        divToolbar.appendChild(sliderLabel2);
        divToolbar.appendChild(sliderDiv);
        divToolbar.appendChild(addLayerDiv);
        
        // add behavior to the elements
        // timeSlider with jquery
        var timeSlider = $(sliderDiv).slider({
            range: true,
            min: this._timestamps[0],
            max: this._timestamps[1],
            values: this._timestamps,
            animate: 'slow',
            orientation: 'horizontal',
            step: 1,
            slide: function( event, ui ) {
                $(sliderLabel1).text( ui.values[ 0 ] );
                $(sliderLabel2).text( ui.values[ 1 ] );
            },
            change: $.proxy(function( event, ui ){
                this._updateFeatures(event, ui.values);
            }, this)
        });
        // init label of the time slider
        $(sliderLabel1).text(timeSlider.slider( "values", 0 ));
        $(sliderLabel2).text(timeSlider.slider( "values", 1 ));
        
        // adding a publish event for sending the timelayer to the main map
        $(addLayerBtn).button().click($.proxy(function( event ){
        	var timeValue = $('#vk2AddLayerInput').val();
            this._eventListeners['publishAddTimeLayerEvent'](timeValue, this._PubSubHandler, 
            		this._timeParameter, this._map );
        },this));
        return divToolbar;
    },
    
    /**
     * Method: _loadHeader
     */
    _loadHeader: function(container, headingId){
		var panelHeading = goog.dom.createDom('div', {
			'id': headingId,
			'class': 'panel-heading'
		});
		
		var panelHeadingContent = goog.dom.createDom('div', {
			'id': 'panel-heading-content',
			'class': 'content'
		});
		
		var panelHeadingLoading = goog.dom.createDom('div', {
			'class': 'loading'
		});
		
		goog.dom.appendChild(panelHeading, panelHeadingContent);
		goog.dom.appendChild(panelHeading, panelHeadingLoading);
		goog.dom.appendChild(container, panelHeading);
    },
    
    /**
     * Method: _loadContent
     * 
     * @param container - {DOMElement}
     * @param mapOptions - {Object}
     */
	_loadContent: function(container, map){
		
        // testing
        //var header = this._loadHeader();
        //container.appendChild(header);
		
		// build panel 
		var panel = goog.dom.createDom('div', {
			'id': 'panel-layersearch',
			'class': 'panel panel-default searchTablePanel'
		});
		goog.dom.appendChild(container, panel);

		
		// heading
		this._loadHeader(panel, 'panel-heading-mapsearch')
		
		// body
		var panelTable = goog.dom.createDom('div', {
			'id': 'panel-mapsearch-table',
			'class': 'panel-mapsearch-table'
		});
		
		var panelTools = goog.dom.createDom('div', {
			'id': 'panel-mapsearch-tools',
			'class': 'panel-mapsearch-tools'
		});
		
		goog.dom.appendChild(panel, panelTable);
		goog.dom.appendChild(panel, panelTools);

		this._mapsearch = new VK2.Tools.MapSearch(this._map, 305.74811309814453, [1868, 1945], 'panel-heading-mapsearch', 'panel-mapsearch-table');
		
		
        // panel which contains the elements of the LayerSearch Tool
        var toolbar = this._loadToolbar();
        goog.dom.appendChild(panelTools, toolbar);
        
        //container.appendChild(toolbar);
//        this._mainPanel = new Ext.Panel({
//            renderTo: container.getAttribute('id'),
//            id: "vk2LSMainPanel",
//            cls: "vk2LSMainPanel",
////            autoScroll: true,
////            autoHeight: true,
////            monitorResize: true,
////            width: 400,
////            height: 570,
//            items: [{
//                id: 'vk2HeaderPanel',
//                cls: 'vk2HeaderPanel',
//                height: 45,
//                contentEl: header.getAttribute('id'),
//            },{
//            		xtype: 'grid',
//                    width: 385,
//                    height: 300,
//                    store: this._featureStore, //new GeoExt.data.FeatureStore(this._featureStoreOptions),    
//                    cm: new Ext.grid.ColumnModel([
//                        {id: "time", header: VK2.Utils.get_I18n_String('timestamp'), dataIndex: "time", sortable: true},
//                        {id: "titel", header: VK2.Utils.get_I18n_String('titel'), dataIndex: "titel", sortable: true}
//                    ]),
//                    sm: new GeoExt.grid.FeatureSelectionModel({
//                        singleSelect: false
//                    }),
//                    listeners: {
//                        rowclick: $.proxy(function(grid, rowIndex, e){
//                        	// insert the timestamp in the input field for adding
//                            var feature = grid.store.data.items[rowIndex];
//                            document.getElementById('vk2AddLayerInput').setAttribute("value",feature.data.time);
//                        }, this),
//                        rowdblclick: $.proxy(function(grid, rowIndex, e){
//                        	// jumps to the feature in the map
//                        	var feature = grid.store.data.items[rowIndex];
//                        	this._map.setCenter(feature.data.feature.bounds.getCenterLonLat(),9);
//                        }, this),
//                        sortchange: function(thisGrid, sortinfo){
//                        	console.log("Sort change event!");
//                        }
//                        
//                    },
//                    autoExpandColumn: "titel",
//                    id: 'featureGridPanel',
//                    cls: 'featureGridPanel'
//            },{
//                    id: 'vk2LSToolPanel',
//                    cls: 'vk2LSToolPanel',
//                    contentEl: 'vk2LSToolbar',
//                    width: 385,
//                    height: 130
//            }],
//            listeners: {
//                afterlayout: $.proxy(function(){
//                    this._updateMapControlConfig();
//                }, this)
//            }
//        });
	},
    
    /**
     * method: _btnClickEvent
     * 
     * @param event {Event}
     */
    _btnClickEvent: function(event){
    	if(this._PubSubHandler != null){
            timeValue = $('#vk2AddLayerInput').val();
            if(timeValue.length == 4 && (typeof parseInt(timeValue) === 'number')){
                this._timeParameter.extent = this._map.getExtent();
                this._timeParameter.time = timeValue;  
                this._PubSubHandler.publish("addtimelayer",this._timeParameter);
            } else {
                alert('Wähle validien Zeitstempel');
            }
        } else {
            console.log("Missing publish/subscription handler")
        }
    },
    
	/**
	 * method: _activate
	 */
	_activate: function(){
		this._mapsearch.activate();
	},

	/**
	 * method: _deactivate
	 */
	_deactivate: function(){
		this._mapsearch.deactivate();
	},
	
	/**
	 * public methods
	 */
    initialize: function(container, map, timeParameter, PubSub){
    	// save parameter
        this._PubSubHandler = PubSub;
        this._timeParameter = timeParameter;
        this._map = map;
        
        this._loadContent(container);
        this._isInit = true;
        return this._isInit;
    },
    
    activate: function(){
    	this._activate();	
    	this._isActive = true;
    },
    
    deactivate: function(){
    	this._deactivate();
		this._isActive = false;
    },
    
    isInit: function(){
        return this._isInit;
    },
    isOpen: function(){
        return this._isOpen;
    },
    getMapObject: function(){
        return this.map;
    }
});