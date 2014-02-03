goog.provide('VK2.Tools.MetadataVisualizer');

goog.require('VK2.Events.ParsedCswRecordEvent');
goog.require('goog.dom');
goog.require('goog.Uri');
goog.require('goog.style');
goog.require('goog.events');

/**
 * @param {string} parentElId Id of the parent div element
 * @param {string} metadataId
 * @param {string} csw_url
 * @constructor
 */
VK2.Tools.MetadataVisualizer = function(parentElId, metadataId, csw_url){
	
	/**
	 * @type {Object}
	 * @private
	 */
	this._parentEl = goog.dom.getElement(parentElId);
	
	// open fancy box
	this._initFancyBox();
	
	// get metadata content from csw
	var selfObj = this;
	var eventHandler = function(event){
		selfObj.displayCswIsoRecord(event);
	}
	var csw_parser = new VK2.Requests.CSW_GetRecordById();
	csw_parser.addEventListener(VK2.Events.EventType.PARSED_RECORD, eventHandler);
	response = csw_parser.getRecord(metadataId, csw_url);
};

/**
 * @private
 */
VK2.Tools.MetadataVisualizer.prototype._initFancyBox = function(){
	$(this._parentEl).fancybox({
		parentEl: this._parentEl,
		parentObj: this,
		maxWidth	: 800,
		maxHeight	: 600,
		fitToView	: false,
		autoSize	: false,
		width: '100%',
		height: '100%',
		closeClick: false,
		closeEffect	: 'none',
		'beforeShow': function(){
			// size
			var size = goog.style.getSize(this.parentEl);
			
			// set width
			var targetWidth = goog.object.get(size, 'width') + 20;
			this.width = goog.isDef(targetWidth) ? targetWidth + 'px': '100%';
			
			// set height
			var targetHeight = goog.object.get(size, 'height');
			this.height = goog.isDef(targetHeight) ? targetHeight + 'px' : '100%';
		},
		'afterShow': function(){
			goog.style.setStyle(this.parentEl, 'display', 'block');
		},
		'afterClose': function(){
			goog.style.setStyle(this.parentEl, 'display', 'none');
			this.parentObj._clearHtmlContent();
			// delete MetadataVisualizer Object
			this.parentObj = null;
			delete this.parentObj;
		}
	}).click();
	
	this._fixCloseClick();
};

/**
 * @param {VK2.Events.ParsedCswRecordEvent} event
 */
VK2.Tools.MetadataVisualizer.prototype.displayCswIsoRecord = function(event){
	var parsed_content = event.parsed_content;
	this._createTable();
	this._createHeader(parsed_content['TITEL'][0],parsed_content['ABSTRACT'][0],parsed_content['THUMBNAIL'][0]);
	this._createContent(parsed_content, this._tBody);
	this._fixLinks();
};


/**
 * private
 */
VK2.Tools.MetadataVisualizer.prototype._createTable = function(){
	
	var table = goog.dom.createDom('table',{'class': 'metadata-record-table'});
	
	/**
	 * @type {Element}
	 * @private
	 */
	this._tBody = goog.dom.createDom('tbody',{});

	goog.dom.appendChild(table ,this._tBody);
	goog.dom.appendChild(this._parentEl ,table);
};

/**
 * @param {string} title
 * @param {string} description
 * @param {string} thumbnail
 * @private
 */
VK2.Tools.MetadataVisualizer.prototype._createHeader = function(title, description, thumbnail){
	this._createHeaderTitel(title, this._tBody);
	this._createHeaderContent(description, thumbnail, this._tBody);
};

/**
 * @param {string} title
 * @param {Element} parentEl
 * @private
 */
VK2.Tools.MetadataVisualizer.prototype._createHeaderTitel = function(title, parentEl){
	var row = goog.dom.createDom('tr',{});
	var col = goog.dom.createDom('td',{'colspan':'2', 'class':'col-header-titel'});
	var span = goog.dom.createDom('span',{'class':'metadata-title','innerHTML':title});
	goog.dom.appendChild(col, span);
	goog.dom.appendChild(row, col);
	goog.dom.appendChild(parentEl, row);
};

/**
 * @param {string} description
 * @param {string} thumbnail
 * @param {Element} parentEl
 * @private
 */
VK2.Tools.MetadataVisualizer.prototype._createHeaderContent = function(description, thumbnail, parentEl){
	var row = goog.dom.createDom('tr',{});
	
	// description
	var col = goog.dom.createDom('td',{'innerHTML':description});
	goog.dom.appendChild(row, col);
	
	// thumbnail
	var col = goog.dom.createDom('td',{'class':'right'});
	var thumbnail = goog.dom.createDom('img', {
		'src': thumbnail, 'alt': 'thumbnail', 'class': 'thumbnail'});
	goog.dom.appendChild(col, thumbnail);
	goog.dom.appendChild(row, col);
	
	goog.dom.appendChild(parentEl, row);
};

/**
 * @param {Object} parsed_content
 * @param {Element} parentElement
 * @private
 */
VK2.Tools.MetadataVisualizer.prototype._createContent = function(parsed_content, parentElement){
	this._createContentContainer(parsed_content['ID'][0], parentElement);
	this._slimContentRow(VK2.Utils.get_I18n_String('mdrecord_keyword'),'Messtischblätter, Messtischblatt', this._tBodyContent);
	this._slimContentRow(VK2.Utils.get_I18n_String('mdrecord_language'),'German', this._tBodyContent);
	for (var i = 0; i < parsed_content['REFERENCE_SYSTEM'].length; i++){
		this._slimContentRow(VK2.Utils.get_I18n_String('mdrecord_referencesystem'),parsed_content['REFERENCE_SYSTEM'][i], this._tBodyContent)};
	for (var i = 0; i < parsed_content['ONLINE_RESSOURCE'].length; i++){
		this._anchorContentRow(VK2.Utils.get_I18n_String('mdrecord_onlineresource'),parsed_content['ONLINE_RESSOURCE'][i], this._tBodyContent)};
	this._fatContentRow(VK2.Utils.get_I18n_String('mdrecord_spatialresolution'), parsed_content['DENOMINATOR'][0], 'Denominator', this._tBodyContent);
};

/**
 * @param {string} datasetId
 * @param {Element} parentEl
 * @private
 */
VK2.Tools.MetadataVisualizer.prototype._createContentContainer = function(datasetId, parentEl){
	
	var row = goog.dom.createDom('tr',{});
	goog.dom.appendChild(parentEl, row);
	
	var col = goog.dom.createDom('td',{'colspan':'2'});
	goog.dom.appendChild(row, col);
	
	var fieldset = goog.dom.createDom('fieldset',{'class':'content'});
	goog.dom.appendChild(col, fieldset);
	
	// legend
	var legend = goog.dom.createDom('legend',{});
	goog.dom.appendChild(fieldset, legend);	
	
	var span = goog.dom.createDom('span',{'innerHTML':VK2.Utils.get_I18n_String('metadata_overview')});
	goog.dom.appendChild(legend, span);	
	
	var a = goog.dom.createDom('a',{
		'href': 'http://kartenforum.slub-dresden.de/geonetwork/srv/eng/search#|'+datasetId,
		'innerHTML': VK2.Utils.get_I18n_String('mdrecord_moremetadata'),
		'target': '_top'
	});
	goog.dom.appendChild(legend, a);	
	
	// body container
	var table = goog.dom.createDom('table',{'class':'metadata-record-table-content'});
	goog.dom.appendChild(fieldset, table);	
	
	/**
	 * @type {Element}
	 * @private
	 */
	this._tBodyContent = goog.dom.createDom('tbody',{});
	goog.dom.appendChild(table ,this._tBodyContent);
	
	// footer
	var footer = goog.dom.createDom('span',{'class':'metadata-record-footer','innerHTML':VK2.Utils.get_I18n_String('mdrecord_uniqueid') + ' | ' + datasetId});
	goog.dom.appendChild(fieldset, footer);	
};

/**
 * @param {string} label
 * @param {string} content
 * @param {Element} parentElement
 */
VK2.Tools.MetadataVisualizer.prototype._slimContentRow = function(label, content, parentElement){
	var row = goog.dom.createDom('tr',{});

	var colLabel = goog.dom.createDom('th',{'innerHTML':label});
	goog.dom.appendChild(row, colLabel);
	
	var colContent = goog.dom.createDom('td',{'innerHTML':content});
	goog.dom.appendChild(row, colContent);
	
	goog.dom.appendChild(parentElement, row);
}

/**
 * @param {string} label
 * @param {string} content
 * @param {Element} parentElement
 */
VK2.Tools.MetadataVisualizer.prototype._anchorContentRow = function(label, content, parentElement){
	var row = goog.dom.createDom('tr',{});

	var colLabel = goog.dom.createDom('th',{'innerHTML':label});
	goog.dom.appendChild(row, colLabel);
	
	var colContent = goog.dom.createDom('td',{});
	goog.dom.appendChild(row, colContent);
	
	// for preventing to large innerHTML in the anchor element remove 
	// the query data
	url = new goog.Uri(content);
	url.setQuery('');	
	var anchor = goog.dom.createDom('a',{
		'innerHTML': url.toString(),
		'href':content,
		'target': '_top',
		'style': 'z-index:10000;'
	});
	goog.dom.appendChild(colContent, anchor);
	
	goog.dom.appendChild(parentElement, row);
} 

/**
 * @param {string} label
 * @param {string} content
 * @param {string} unit
 * @param {Element} parentElement
 */
VK2.Tools.MetadataVisualizer.prototype._fatContentRow = function(label, content, unit, parentElement){
	var row = goog.dom.createDom('tr',{});

	var colLabel = goog.dom.createDom('th',{'innerHTML':label});
	goog.dom.appendChild(row, colLabel);
	
	var colContent = goog.dom.createDom('td',{});
	goog.dom.appendChild(row, colContent);
	
	var div = goog.dom.createDom('div',{'class':'el'});
	goog.dom.appendChild(colContent, div);	
	
	var label = goog.dom.createDom('label',{'innerHTML':unit});
	goog.dom.appendChild(div, label);	
	
	var div1 = goog.dom.createDom('div',{'innerHTML':content});
	goog.dom.appendChild(div, div1);	
	
	goog.dom.appendChild(parentElement, row);
}

/**
 * @private
 */
VK2.Tools.MetadataVisualizer.prototype._clearHtmlContent = function(){
	goog.dom.removeChildren(this._parentEl);
	goog.dom.removeNode(this._parentEl);
}

/**
 * This method has to be run to fix the link behavior of inline content who is displayed 
 * within a fancybox
 * @private
 */
VK2.Tools.MetadataVisualizer.prototype._fixLinks = function(){
	var anchors = goog.dom.getElementsByTagNameAndClass('a', undefined, this._parentEl);
	for (var i = 0; i < anchors.length; i++){
		goog.events.listen(anchors[i], 'click', function(e){			
			var href = event.target.href;
			window.location = href;
		});
	};
}

/**
 * This method has to be run to fix the closeClick behavior off fancybox
 * within a fancybox
 * @private
 */
VK2.Tools.MetadataVisualizer.prototype._fixCloseClick = function(){
	goog.events.listen(this._parentEl, 'click', function(e){
		e.stopPropagation();
	}, true)

}