goog.provide('VK2.Tools.MinimizeMesstischblattView');

goog.require('goog.dom');
goog.require('goog.events');
goog.require('goog.events.EventType');
goog.require('goog.object');
goog.require('goog.style');

/**
 * @param {string} parent_container
 * @param {VK2.Controller.MapController} mapController
 * @constructor
 */
VK2.Tools.MinimizeMesstischblattView = function(parent_container, mapController){
	
	/**
	 * @type {Element}
	 * @private
	 */
	this._parentContainer = goog.dom.getElement(parent_container);
	
	/**
	 * @type {VK2.Controller.MapController}
	 * @private
	 */
	this._mapController = mapController;
	
	this._loadHtmlContent();
};

/**
 * @private
 */
VK2.Tools.MinimizeMesstischblattView.prototype._loadHtmlContent = function(){
	
	/**
	 * @type {Element}
	 * @private
	 */
	this._panel = goog.dom.createDom('div',{'class':'minimize-messtischblatt-view', 'style':'display:none'});
	goog.dom.appendChild(this._parentContainer, this._panel);
	
	/**
	 * @type {Element}
	 * @private
	 */
	this._label = goog.dom.createDom('label');
	goog.dom.appendChild(this._panel, this._label);
	
	var table = goog.dom.createDom('table',{'class':'table'});
	goog.dom.appendChild(this._panel, table);
	
	// create table heading
	var table_heading = goog.dom.createDom('thead',{'class':'table-heading'});
	goog.dom.appendChild(table, table_heading);
	
	var col_headers = goog.dom.createDom('tr',{'class':'table-heading-row'});
	goog.dom.appendChild(table_heading, col_headers);
	
	var col_time = goog.dom.createDom('th',{
		'class':'header-col col-time',
		'id':'mmv-header-col-time',
		'innerHTML': VK2.Utils.get_I18n_String('timestamp')
	});
	goog.dom.appendChild(col_headers, col_time);
	
	var col_titel = goog.dom.createDom('th',{
		'class':'header-col col-titel',
		'id':'mmv-header-col-titel',
		'innerHTML': VK2.Utils.get_I18n_String('titel')
	});
	goog.dom.appendChild(col_headers, col_titel);
	
	/**
	 * @type {Element}
	 * @private 
	 */
	this._tbody = goog.dom.createDom('tbody',{'class':'table-body mmv-table-body'});
	goog.dom.appendChild(table, this._tbody);
	
	// mtb tools
	var tool_container = goog.dom.createDom('div', {'class':'mmv-tools-container'});
	goog.dom.appendChild(this._panel, tool_container);
};

/**
 * @param {OpenLayers.Feature} feature
 * @public
 */
VK2.Tools.MinimizeMesstischblattView.prototype._appendRow = function(feature){
	
	var row = goog.dom.createDom('tr');
	goog.dom.appendChild(this._tbody, row);
	
	var time = goog.dom.createDom('td',{'class':'col-time','innerHTML':feature.data.time});
	goog.dom.appendChild(row, time);
	
	var title = goog.dom.createDom('td',{'class':'col-titel', 'innerHTML':feature.data.titel});
	goog.dom.appendChild(row, title);
	
	var tools_container = goog.dom.createDom('div',{'class':'mmv-tools-container'});
	goog.dom.appendChild(title, tools_container);
	
	// show timestamp
	var anchor_showTimestamp = goog.dom.createDom('a',{
		'class':'mmv-tool-anchor show-timestamp'
	});
	goog.dom.appendChild(tools_container, anchor_showTimestamp);
	
	var icon_showTimestamp = goog.dom.createDom('span',{'class':'mmv-tool-icon','innerHTML':'T'});
	goog.dom.appendChild(anchor_showTimestamp, icon_showTimestamp);
	this._addShowTimestampBehavior(anchor_showTimestamp, feature.data.time);

	
	// show single map view
	var anchor_showSingleMap = goog.dom.createDom('a',{
		'class':'mmv-tool-anchor show-single-map'
	});
	goog.dom.appendChild(tools_container, anchor_showSingleMap);
	
	var icon_showSingleMap = goog.dom.createDom('span',{'class':'mmv-tool-icon','innerHTML':'S'});
	goog.dom.appendChild(anchor_showSingleMap, icon_showSingleMap);
	this._addShowSingleMapBehavior(anchor_showSingleMap, feature);
	
	// show metadata
	var anchor_showMetadata = goog.dom.createDom('a',{
		'class':'mmv-tool-anchor show-metadata'
	});
	goog.dom.appendChild(tools_container, anchor_showMetadata);
	
	var icon_showMetadata = goog.dom.createDom('span',{'class':'mmv-tool-icon','innerHTML':'M'});
	goog.dom.appendChild(anchor_showMetadata, icon_showMetadata);
	this._addShowMetadataBehavior(anchor_showMetadata, feature.data.dateiname);
};

/**
 * @param {Array.<OpenLayers.Feature} arr_features
 * @public
 */
VK2.Tools.MinimizeMesstischblattView.prototype.updateView = function(arr_features){
	
	// delete all child elements
	goog.dom.removeChildren(this._tbody);
	
	// set heading
	this._label.innerHTML = VK2.Utils.get_I18n_String('mmv_label_blattnr') + ' ' + arr_features[0].data.blattnr;
	
	for (var i = 0; i < arr_features.length; i++){
		this._appendRow(arr_features[i]);
	};
	
	goog.style.showElement(this._panel, true);
	
	// show puff effect
	$(this._tbody).effect('highlight', {}, 3000);
};

/** 
 * Function which appends behavior for displaying a timestamp in the layer management menu
 * @param {Element} parentElement
 * @param {string} time
 * @private
 */
VK2.Tools.MinimizeMesstischblattView.prototype._addShowTimestampBehavior = function(parentElement, time){
	
	goog.events.listen(parentElement, goog.events.EventType.CLICK, function(event){
		var timeParameter = goog.object.clone(VK2.Utils.Settings.timeWmsWfsOptions);
		timeParameter.extent = this._mapController.getMap().getExtent();
		timeParameter.time = time;  
		this._mapController.publish("addtimelayer", timeParameter);
	}, undefined, this);
};

/**
 * The function appends the behavior to the anchor element for opening the single map view in a fancybox overlay
 * @param {Element} parentElement
 * @param {OpenLayers.Feature} feature
 * @private
 */
VK2.Tools.MinimizeMesstischblattView.prototype._addShowSingleMapBehavior = function(parentElement, feature){
	var extent = feature.geometry.bounds.left + ',' + feature.geometry.bounds.bottom + ',' + feature.geometry.bounds.right + ',' + feature.geometry.bounds.top;
	var href = '/vkviewer/profile/mtb?extent='+extent+'&time='+feature.data.time+'&id='+feature.data.mtbid;
	parentElement.href = href;
	
	// append fancybox behavior
	$(parentElement).fancybox({
		'type': 'iframe',
		'width': '100%',
		'height': '100%'
	});
};

/**
 * The function appends the behavior to the anchor element for linking to the csw
 * @param {Element} parentElement
 * @param {string} catalogue_key
 * @private 
 */
VK2.Tools.MinimizeMesstischblattView.prototype._addShowMetadataBehavior = function(parentElement, catalogue_key){
	
	var href = VK2.Utils.Settings.geonetwork;
	if (goog.isDef(catalogue_key))
		href = href + catalogue_key;
	parentElement.href = href;
	parentElement.target = '_blank';
};

/**
 * @public
 */
VK2.Tools.MinimizeMesstischblattView.prototype.deactivate = function(){
	goog.style.showElement(this._panel, false);
}