/** 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 * 
 * @TODO Hover when SelectFeature in front!
 */

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
     * attribute: refresh
     * {OpenLayers.Strategy.Refresh} - used for dynamic updating vector layer
     */
    _refresh: new OpenLayers.Strategy.Refresh({force: true, active: true}),
    
    /**
     * attribute: featureStore
     * used by GeoExt
     */
    _featureStore: null,
        
    /**
     * attribute: _mainPanel
     * {Ext.Panel}
     */
    _mainPanel: null,
    
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
        /*
         * Method: _showSearchResultNumber
         * The scope of this event has to be the a OpenLayers.Layer.Vector object
         */
        showSearchResultNumber: function(e){  
        	console.log('Type: '+e.type);
        	console.log('Features: '+this.features.length);
        	var headerContentDiv = $('#vk2LSHeaderContent');
        	var headerContainerDiv = $('#vk2LSHeaderContainer')
        	if (this.map.getZoom() >= 2 && this.getVisibility()){        	
	        	headerContentDiv.html(this.features.length+" "+VK2.Utils.get_I18n_String('found_mtb'))
	        	if (headerContainerDiv.hasClass( 'ui-state-error' ))
	        		headerContainerDiv.removeClass( 'ui-state-error' );
	        	
	        	// this is important for triggering a layer refresh if the layer change it visibility
	        	if (e.type == 'visibilitychanged')
	        		this.refresh({force:true});
        	} else {
        		headerContentDiv.html(VK2.Utils.get_I18n_String('change_zoomlevel'))
    			headerContainerDiv.addClass( 'ui-state-error' );
        	} 	
        },	
        
        loadStarts: function(e){
        	console.log('Loadstarts');
        	$('#vk2LSHeaderLoadingContainer').addClass('loading');
        },
        
        loadEnds: function(e){
        	console.log('Loadends');
        	if ($('#vk2LSHeaderLoadingContainer').hasClass('loading'))
        		$('#vk2LSHeaderLoadingContainer').removeClass('loading');
        },
        
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
    _loadHeader: function(){
        var divHeaderContainer = document.createElement("div");
        divHeaderContainer.className = divHeaderContainer.className + " vk2LSHeaderContainer ui-state-error";
        divHeaderContainer.id = "vk2LSHeaderContainer";
        
        // div container for the header label
        var  divHeaderContent = document.createElement("div");
        divHeaderContent.className = divHeaderContent.className + " vk2LSHeaderContent";
        divHeaderContent.id = "vk2LSHeaderContent";
        divHeaderContent.innerHTML = "Bitte wählen Sie eine höhere Zoomstufe!";
        divHeaderContainer.appendChild(divHeaderContent);
        
        // div container for loading picture
        var divHeaderLoading = document.createElement('div');
        divHeaderLoading.className = divHeaderLoading.className + " vk2LSHeaderLoadingContainer";
        divHeaderLoading.id = "vk2LSHeaderLoadingContainer";
        divHeaderContainer.appendChild(divHeaderLoading);
        return divHeaderContainer;
    },
    
    /**
     * Method: _loadContent
     * 
     * @param container - {DOMElement}
     * @param mapOptions - {Object}
     */
	_loadContent: function(container, map){
		// init map object
		this._addTimeSearchLayer();
		
        // initalize the featurestore
        this._featureStore = new GeoExt.data.FeatureStore({
            layer: this._timeLayer,
            features: this._features,
            fields: [
                {name: "mtbid", type: "string"},
                {name: "time", type: "string"},
                {name: "titel", type: "string"}
            ]
        });
        
        // testing
        var header = this._loadHeader();
        container.appendChild(header);
        
        // panel which contains the elements of the LayerSearch Tool
        var toolbar = this._loadToolbar();
        container.appendChild(toolbar);
        this._mainPanel = new Ext.Panel({
            renderTo: container.getAttribute('id'),
            id: "vk2LSMainPanel",
            cls: "vk2LSMainPanel",
//            autoScroll: true,
//            autoHeight: true,
//            monitorResize: true,
//            width: 400,
//            height: 570,
            items: [{
                id: 'vk2HeaderPanel',
                cls: 'vk2HeaderPanel',
                height: 45,
                contentEl: header.getAttribute('id'),
            },{
            		xtype: 'grid',
                    width: 385,
                    height: 300,
                    store: this._featureStore, //new GeoExt.data.FeatureStore(this._featureStoreOptions),    
                    cm: new Ext.grid.ColumnModel([
                        {id: "time", header: VK2.Utils.get_I18n_String('timestamp'), dataIndex: "time", sortable: true},
                        {id: "titel", header: VK2.Utils.get_I18n_String('titel'), dataIndex: "titel", sortable: true}
                    ]),
                    sm: new GeoExt.grid.FeatureSelectionModel({
                        singleSelect: false
                    }),
                    listeners: {
                        rowclick: $.proxy(function(grid, rowIndex, e){
                        	// insert the timestamp in the input field for adding
                            var feature = grid.store.data.items[rowIndex];
                            document.getElementById('vk2AddLayerInput').setAttribute("value",feature.data.time);
                        }, this),
                        rowdblclick: $.proxy(function(grid, rowIndex, e){
                        	// jumps to the feature in the map
                        	var feature = grid.store.data.items[rowIndex];
                        	this._map.setCenter(feature.data.feature.bounds.getCenterLonLat(),9);
                        }, this),
                        sortchange: function(thisGrid, sortinfo){
                        	console.log("Sort change event!");
                        }
                        
                    },
                    autoExpandColumn: "titel",
                    id: 'featureGridPanel',
                    cls: 'featureGridPanel'
            },{
                    id: 'vk2LSToolPanel',
                    cls: 'vk2LSToolPanel',
                    contentEl: 'vk2LSToolbar',
                    width: 385,
                    height: 130
            }],
            listeners: {
                afterlayout: $.proxy(function(){
                    this._updateMapControlConfig();
                }, this)
            }
        });
	},
	
	/**
	 * method: _addTimeSearchLayer
	 * 
	 * This method adds a vector layer which represents the search features to the map
	 * and also adds events to the main layer
	 */
	_addTimeSearchLayer: function(){        
        // add overlay vector layer for displaying where are reference mtbs
        this._features = new OpenLayers.Protocol.WFS({
            "url": this._timeParameter.wfs,
            "geometryName": this._timeParameter.geometryName,
            "featureNS" :  this._timeParameter.featureNS,
            "featurePrefix": this._timeParameter.featurePrefix,
            "featureType": this._timeParameter.featureType,
            "srsName": this._timeParameter.srsName,
            "maxFeatures": this._timeParameter.maxFeatures,
            "version": this._timeParameter.serviceVersion
        });
        
        this._timeLayer = new OpenLayers.Layer.Vector("Messtischblaetter",{
            'displayInLayerSwitcher':false,
            'maxResolution': this._timeParameter.maxResolution,
            visibility: false,
            strategies: [new OpenLayers.Strategy.BBOX({ratio:2}),this._refresh],
            protocol: this._features,
        });
        this._map.filter = VK2.Filter.getBoundingBoxFilter(this._map.getExtent(),"EPSG:900913")
        this._map.addLayer(this._timeLayer);
        this._addHeaderContentEvent();
	},


	
	/**
	 * method: _removeTimeSearchLayer
	 * 
	 * This method removes a vector layer which represents the search features to the map
	 * and also removes events to the main layer
	 */
	_removeTimeSearchLayer: function(){
		this._map.removeLayer(this._timeLayer);
	},
    
   /**
     * method: _updateMapControlConfig
     * 
     * this two rows are important for allowing click and drag the main map 
     * on a selection
     */
    _updateMapControlConfig: function(){
        // get the correct control object
        var control = null;
        controlId = this._map.getControlsByClass("OpenLayers.Control.SelectFeature")[0].id;
        for (var i = 0; i<this._map.controls.length;i++){
            if(this._map.controls[i].id == controlId)
                control = this._map.controls[i];
        }
        
        // modify the handler
        VK2.Utils.fixControlConflictsOnOLMap(control);
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
	 * Method: _addHeaderContentEvent
	 */
	_addHeaderContentEvent: function(){
		this._timeLayer.events.register('visibilitychanged', this._timeLayer, this._eventListeners['showSearchResultNumber']);
		this._timeLayer.events.register('featuresadded', this._timeLayer, this._eventListeners['showSearchResultNumber']);
		this._timeLayer.events.register('featuresremoved', this._timeLayer, this._eventListeners['showSearchResultNumber']);
		this._timeLayer.events.register('moveend', this._timeLayer, this._eventListeners['showSearchResultNumber']);
		
		this._timeLayer.events.register('loadstart', this._timeLayer, this._eventListeners['loadStarts']);
		this._timeLayer.events.register('loadend', this._timeLayer, this._eventListeners['loadEnds']);
	},

	
	/**
	 * Method: _isMtbSearchActive
	 */
	_isMtbSearchActive: function(){
		if (this._map.getZoom() >= this._restrictedZoomLevel)
			return true;
		return false;
	}, 
	
    /**
     * method: _updateFeatures
     * 
     * event - {Event}
     * timestamps - {String}
     * 
     * This function updates the filter of the wfs features for only
     * displaying features which are conform with the time and spatial 
     * parameter
     */
    _updateFeatures: function(event, timestamps){
        if (typeof timestamps != 'undefined' && event.type == "slidechange"){
            // is called after new timestamps are defined
            this._timestamps = timestamps;

            this._timeLayer.filter = VK2.Filter.getTimeFilter(this._map.getExtent(), 'EPSG:900913',
            		timestamps[0], timestamps[1]);
            this._refresh.refresh();  
        } else {
            // is called after timestamps where defined in the past
            // but the event is only triggered by an map extent change
            this._timeLayer.filter = VK2.Filter.getTimeFilter(this._map.getExtent(), 'EPSG:900913',
            		this._timestamps[0], this._timestamps[1]);
            this._refresh.refresh({forc: true});
        }
    },  

    /**
     * Method: _refreshFeatureGrid
     */
    _refreshFeatureGrid: function(){
		// redraw the grid panel
        var gridPanel = this._mainPanel.getComponent('featureGridPanel');
        gridPanel.getView().refresh();   	
    },
    
	/**
	 * method: _activate
	 */
	_activate: function(){
		if (this._isMtbSearchActive()){
			this._timeLayer.setVisibility(true);
			this._featureStore.bind(this._timeLayer);
			//this._refreshFeatureGrid();
		} else {
    		this._deactivate();
		}
	},

	/**
	 * method: _deactivate
	 */
	_deactivate: function(){
		// removes the timelayer
		this._timeLayer.setVisibility(false);
			        
	    // unbinds and clear the featurestore
	    this._featureStore.unbind(this._timeLayer);
	    this._featureStore.removeAll();
	    
	    // set default error help
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
    
    updateFeatureStore: function(event){
    	console.log("Update FeatureStore and is activate "+this._isActive)
    	if (this._isActive){
    		this._updateFeatures(event);
    		this._activate();
    	}
    },
    
    activate: function(){
    	this._updateFeatures();
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