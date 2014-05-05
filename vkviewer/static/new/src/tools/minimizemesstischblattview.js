goog.provide('VK2.Tools.MinimizeMesstischblattView');

goog.require('goog.dom');
goog.require('goog.events');
goog.require('goog.events.EventType');
goog.require('goog.object');
goog.require('goog.style');
goog.require('VK2.Utils');
goog.require('VK2.Utils.Modal');

/**
 * @param {string} parent_container
 * @param {VK2.Controller.MapController} mapController
 * @constructor
 */
VK2.Tools.MinimizeMesstischblattView = function(parent_container){
	
	/**
	 * @type {Element}
	 * @private
	 */
	this._parentContainer = goog.isDef(parent_container) ? parent_container : undefined;
		
	if (goog.isDef(this._parentContainer))
		this._loadHtmlContent(this._parentContainer);
};

/**
 * @param {Element} parentContainer
 * @private
 */
VK2.Tools.MinimizeMesstischblattView.prototype._loadHtmlContent = function(parentContainer){
	
	/**
	 * @type {Element}
	 * @private
	 */
	this._panel = goog.dom.createDom('div',{'class':'minimize-messtischblatt-view', 'style':'display:none'});
	goog.dom.appendChild(parentContainer, this._panel);
	
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
		'innerHTML': VK2.Utils.getMsg('timestamp')
	});
	goog.dom.appendChild(col_headers, col_time);
	
	var col_titel = goog.dom.createDom('th',{
		'class':'header-col col-titel',
		'id':'mmv-header-col-titel',
		'innerHTML': VK2.Utils.getMsg('titel')
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
 * @param {ol.Feature} feature
 * @param {ol.Map} map
 * @public
 */
VK2.Tools.MinimizeMesstischblattView.prototype._appendRow = function(feature){
	
	var row = goog.dom.createDom('tr');
	goog.dom.appendChild(this._tbody, row);
	
	var time = goog.dom.createDom('td',{'class':'col-time','innerHTML':feature.get('time')});
	goog.dom.appendChild(row, time);
	
	var title = goog.dom.createDom('td',{'class':'col-titel', 'innerHTML':feature.get('titel')});
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
	this._addShowTimestampBehavior(anchor_showTimestamp, feature.get('time'), map);

	
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
	this._addShowMetadataBehavior(anchor_showMetadata, feature.get('dateiname'));
};

/**
 * @param {Array.<ol.Feature} features
 * @param {ol.Map} map
 * @public
 */
VK2.Tools.MinimizeMesstischblattView.prototype.updateView = function(features, map){
	
	// delete all child elements
	goog.dom.removeChildren(this._tbody);
	
	// set heading
	this._label.innerHTML = VK2.Utils.getMsg('mmv_label_blattnr') + ' ' + features[0].get('blattnr');
	
	for (var i = 0; i < features.length; i++){
		this._appendRow(features[i], map);
	};
	
	goog.style.showElement(this._panel, true);
	
	// show puff effect
	$(this._tbody).effect('highlight', {}, 3000);
};

/** 
 * Function which appends behavior for displaying a timestamp in the layer management menu
 * @param {Element} parentElement
 * @param {string} time
 * @param {ol.Map} map
 * @private
 */
VK2.Tools.MinimizeMesstischblattView.prototype._addShowTimestampBehavior = function(parentElement, time, map){
	
	goog.events.listen(parentElement, goog.events.EventType.CLICK, function(event){
		map.addLayer(new VK2.Layer.HistoricMap({
			'time':time,
			'projection':'EPSG:900913'
		}));
	}, undefined, this);
};

/**
 * The function appends the behavior to the anchor element for opening the single map view in a fancybox overlay
 * @param {Element} parentElement
 * @param {OpenLayers.Feature} feature
 * @private
 */
VK2.Tools.MinimizeMesstischblattView.prototype._addShowSingleMapBehavior = function(parentElement, feature){
	//debugger;
	//var extent = feature.geometry.bounds.left + ',' + feature.geometry.bounds.bottom + ',' + feature.geometry.bounds.right + ',' + feature.geometry.bounds.top;
	var href = '/vkviewer/profile/mtb?extent='+feature.getGeometry().getExtent().join()+'&time='+feature.get('time')+'&id='+feature.get('mtbid');
	// default behavior
	parentElement.href = href;
	parentElement.target = '_blank';
	
	// add modal behavior
	parentElement.setAttribute('data-src', href);
	parentElement.setAttribute('data-classes', 'single-map-view');
	VK2.Utils.loadLinkInModal('vk2-overlay-modal', parentElement);
};

/**
 * The function appends the behavior to the anchor element for linking to the csw
 * @param {Element} parentElement
 * @param {string} catalogue_key
 * @private 
 */
VK2.Tools.MinimizeMesstischblattView.prototype._addShowMetadataBehavior = function(parentElement, catalogue_key){	
	var href = VK2.Settings.GEONETWORK;
	parentElement.href = href + catalogue_key;
	parentElement.target = '_blank';
};

/**
 * @public
 */
VK2.Tools.MinimizeMesstischblattView.prototype.deactivate = function(){
	goog.style.showElement(this._panel, false);
}