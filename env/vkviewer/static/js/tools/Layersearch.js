/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 * 
 * @TODO Hover when SelectFeature in front!
 */

VK2.Tools.LayerSearch = VK2.Class({
    
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
    _timestamps: [],
    
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
     * attribute: _updateFeatureEvent
     * {Object}
     */
    _updateFeatureEvent: null,
    
	/**
	 * method: _addTimeSearchLayer
	 * 
	 * This method adds a vector layer which represents the search features to the map
	 * and also adds events to the main layer
	 */
	_addTimeSearchLayer: function(){        
        // add overlay vector layer for displaying where are reference mtbs
        this._features = new OpenLayers.Protocol.WFS({
            "url": this._timeParameter.wms,
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
            visibility: false,
            strategies: [new OpenLayers.Strategy.BBOX({ratio:2}),this._refresh],
            protocol: this._features,
            filters: [
                new OpenLayers.Filter.Spatial({
                    type: OpenLayers.Filter.Spatial.BBOX,
                    value: this._map.getExtent(),
                    projection: this._timeParameter.srsName
                })
            ]
        });
        this._map.addLayer(this._timeLayer);
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
     * method: _buildTimeFilter
     * 
     * timestamps -  {Array}
     * extent - {OpenLayers.Bounds}
     */
    _buildTimeFilter: function(timestamps, extent){
        var newFilter = new OpenLayers.Filter.Logical({
            type: OpenLayers.Filter.Logical.AND,
            filters: [
                new OpenLayers.Filter.Spatial({
                    type: OpenLayers.Filter.Spatial.BBOX,
                    value: extent,
                    projection: "EPSG:900913"
                }),
                new OpenLayers.Filter.Logical({
                    type: OpenLayers.Filter.Logical.AND,
                    filters: [         
                        new OpenLayers.Filter.Comparison({
                            type: OpenLayers.Filter.Comparison.LESS_THAN_OR_EQUAL_TO,
                            property: "time",
                            value: timestamps[1]
                        }),
                        new OpenLayers.Filter.Comparison({
                            type: OpenLayers.Filter.Comparison.GREATER_THAN_OR_EQUAL_TO,
                            property: "time",
                            value: timestamps[0]
                        })
                    ]
                })
            ]
        });
        return newFilter;
    },
      
    /**
     * method: _computeExtent
     * 
     * Dirty solution for computing a reasonable extent in case of tiling stuff
     * 
     * return {OpenLayers.Bounds}
     */
    _computeExtent: function(){
        var extent = this._map.calculateBounds(this._map.getCenter(),
        		this._map.getResolutionForZoom(this._map.getZoom()+1));
        return extent;
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
        if (typeof timestamps === 'undefined' && this._timestamps.length == 0){
            // is called on init when there are no timestamps defined
            this._refresh.refresh(); 
        } else{
            if (typeof timestamps != 'undefined' && event.type == "slidechange"){
                // is called after new timestamps are defined
                this._timestamps = timestamps;

                this._timeLayer.filter = this._buildTimeFilter(this._timestamps, 
                		this._map.getExtent());
                this._refresh.refresh();  
            } else {
                // is called after timestamps where defined in the past
                // but the event is only triggered by an map extent change
                this._timeLayer.filter = this._buildTimeFilter(this._timestamps, 
                		this._map.getExtent());
                this._refresh.refresh();
            }
        }
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
     * method: _loadToolbar
     * 
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
            min: 1868,
            max: 1945,
            values: [1868, 1945],
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
            this._btnClickEvent(event);
        },this));
        return divToolbar;
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
     * method: _loadContent
     * 
     * container - {DOMElement}
     * mapOptions - {Object}
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
        
        // panel which contains the elements of the LayerSearch Tool
        var toolbar = this._loadToolbar();
        container.appendChild(toolbar);
        this._mainPanel = new Ext.Panel({
            renderTo: container.getAttribute('id'),
            height: 520,
            width: 520,
            id: "vk2LSMainPanel",
            cls: "vk2LSMainPanel",
            items: [{
            		xtype: 'grid',
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
                    height: 400,
                    width: 520  
            },{
                    id: 'vk2LSToolPanel',
                    cls: 'vk2LSToolPanel',
                    contentEl: 'vk2LSToolbar',
                    height: 120,
                    width: 520
            }],
            listeners: {
                afterlayout: $.proxy(function(){
                    this._updateMapControlConfig();
                }, this)
            }
        });
	},
	
	/**
	 * method: _activate
	 */
	_activate: function(){
        this._featureStore.bind(this._timeLayer);   
        this._timeLayer.setVisibility(true);
        var gridPanel = this._mainPanel.getComponent('featureGridPanel');
        gridPanel.getView().refresh();
        gridPanel.getStore().sort('titel', 'DESC');
	},

	/**
	 * method: _deactivate
	 */
	_deactivate: function(){
		// removes the timelayer
		this._timeLayer.setVisibility(false);
		
		// remove the events	
        this._map.events.unregister("move", this._map, this._updateFeatureEvent);
        
        // unbinds and clear the featurestore
    	this._featureStore.unbind(this._timeLayer);
    	//var gridPanel = this._mainPanel.getComponent('featureGridPanel');
    	//gridPanel.store.loadData([], false);
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
    	this._updateFeatures(event)
    },
    
    activate: function(){
    	this._activate();
    },
    
    deactivate: function(){
    	this._deactivate();
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