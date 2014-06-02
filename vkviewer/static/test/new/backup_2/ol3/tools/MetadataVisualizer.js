goog.provide('VK2.Tools.MetadataVisualizer');

goog.require('VK2.Events.ParsedCswRecordEvent');
goog.require('goog.object');
goog.require('goog.dom');
goog.require('goog.Uri');
goog.require('goog.style');

/**
 * @param {string} parentElId Id of the parent div element
 * @param {string} metadataId
 * @param {Object} settings
 * @constructor
 */
VK2.Tools.MetadataVisualizer = function(parentElId, metadataId, settings){

	/**
	 * @type {Object}
	 * @private
	 */
	this._parentEl = goog.dom.getElement(parentElId);
	
	/**
	 * @type {Object}
	 * @private
	 */
	this._settings = {
			'csw_url':'http://kartenforum.slub-dresden.de/geonetwork/srv/eng/csw',
			'thumbnail':false,
			'displayInFancybox': false
	}
	goog.object.extend(this._settings, settings);
	
	// open fancy box
	if (this._settings.displayInFancybox)
		this._initFancyBox();
	
	// get metadata content from csw
	var selfObj = this;
	var eventHandler = function(event){
		selfObj.displayCswIsoRecord(event);
	}
	var csw_parser = new VK2.Requests.CSW_GetRecordById();
	csw_parser.addEventListener(VK2.Events.EventType.PARSED_RECORD, eventHandler);
	response = csw_parser.getRecord(metadataId, this._settings.csw_url);
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
};

/**
 * @param {VK2.Events.ParsedCswRecordEvent} event
 */
VK2.Tools.MetadataVisualizer.prototype.displayCswIsoRecord = function(event){
	var parsed_content = event.parsed_content;
	
	// set page title
	this._setPageTitle(parsed_content['TITEL'][0]);
	
	// display the metadata
	this._displayMetadata(parsed_content);
};

/**
 * @param {string} title
 * @private
 */
VK2.Tools.MetadataVisualizer.prototype._setPageTitle = function(title){
	var page_header = goog.dom.getElement('singlemapview-title');
	page_header.innerHTML = title;
};

/**
 * @param {Object} metadata 
 * @private
 */
VK2.Tools.MetadataVisualizer.prototype._displayMetadata = function(metadata){
	
	var row_container = goog.dom.createDom('div', {'class':'container'});
	goog.dom.appendChild(this._parentEl, row_container);
	
	var row = goog.dom.createDom('div',{'class':'row-metadata'});
	goog.dom.appendChild(row_container, row);
	
	// this is the bootstrap grid container for further metadata
	var metadata_container = goog.dom.createDom('div',{
		'class':'col-md-8 col-lg-8 metdata-col'
	});
	goog.dom.appendChild(row, metadata_container);
	
	// this is the bootstrap grid container for thumbnail
	var thumbnail_container = goog.dom.createDom('div',{
		'class':'col-md-4 col-lg-4 thumbnail-col'
	});
	goog.dom.appendChild(row, thumbnail_container);
	
	// set title and thumbnail of metadata
	var catalog_link = VK2.Utils.Settings.geonetwork+metadata['ID'][0];
	this._setTitle(metadata_container, metadata['ABSTRACT'][0],catalog_link);
	this._setThumbnail(thumbnail_container, metadata['THUMBNAIL'][0]);
	
	// set further metadata information
	this._setCatchwords(metadata_container, VK2.Utils.get_I18n_String('mdrecord_keyword'), 'Messtischblätter Messtischblatt');
	this._setLanguage(metadata_container, VK2.Utils.get_I18n_String('mdrecord_language'),'German');
	
	for (var i = 0; i < metadata['REFERENCE_SYSTEM'].length; i++){
		this._setCrsIdentifier(metadata_container, VK2.Utils.get_I18n_String('mdrecord_referencesystem'),metadata['REFERENCE_SYSTEM'][i]);
	};
	
	for (var i = 0; i < metadata['ONLINE_RESSOURCE'].length; i++){
		this._setOnlineRessource(metadata_container, VK2.Utils.get_I18n_String('mdrecord_onlineresource'),metadata['ONLINE_RESSOURCE'][i]);
	};
	
	this._setResolution(metadata_container, VK2.Utils.get_I18n_String('mdrecord_spatialresolution'), metadata['DENOMINATOR'][0]);
	this._setUniqueId(metadata_container, metadata['ID'][0]);
};

/**
 * @param {Element} container
 * @param {string} description
 * @param {string} catalog_link
 * @private
 */
VK2.Tools.MetadataVisualizer.prototype._setTitle = function(container, description, catalog_link){
	
	// now add description
	var descr_div = goog.dom.createDom('div',{
		'class': 'description'
	});
	goog.dom.appendChild(container, descr_div);
	
	var descr_h3 = goog.dom.createDom('h3',{
		'innerHTML': description
	});
	goog.dom.appendChild(descr_div, descr_h3);
	
	var catalog_anchor = goog.dom.createDom('a',{
		'href': catalog_link,
		'innerHTML': VK2.Utils.get_I18n_String('mdrecord_moremetadata'),
		'target': '_blank'
	})
	goog.dom.appendChild(descr_div, catalog_anchor);
	

};

/**
 * @param {Element} container
 * @param {string} container
 * @private
 */
VK2.Tools.MetadataVisualizer.prototype._setThumbnail = function(container, thumbnail_link){
	var thumbnail_img = goog.dom.createDom('img', {
		'class': 'thumbnail',
		'src': thumbnail_link
	});
	goog.dom.appendChild(container, thumbnail_img);
};

/**
 * @param {Element} container
 * @param {string} label_name
 * @param {string} catchwords
 * @private
 */
VK2.Tools.MetadataVisualizer.prototype._setCatchwords = function(container, label_name, catchwords){
	var row = this._createMetadataRow(container);
	
	var label = goog.dom.createDom('div', {'class':'label', 'innerHTML':label_name});
	goog.dom.appendChild(row, label);
	
	var content = goog.dom.createDom('div', {'innerHTML':catchwords});
	goog.dom.appendChild(row, content);	
};

/**
 * @param {Element} container
 * @param {string} label_name
 * @param {string} language
 * @private
 */
VK2.Tools.MetadataVisualizer.prototype._setLanguage = function(container, label_name, language){
	var row = this._createMetadataRow(container);
	
	var label = goog.dom.createDom('div', {'class':'label', 'innerHTML':label_name});
	goog.dom.appendChild(row, label);
	
	var content = goog.dom.createDom('div', {'innerHTML':language});
	goog.dom.appendChild(row, content);	
};

/**
 * @param {Element} container
 * @param {string} label_name
 * @param {string} identifier
 * @private
 */
VK2.Tools.MetadataVisualizer.prototype._setCrsIdentifier = function(container, label_name, identifier){
	var row = this._createMetadataRow(container);
	
	var label = goog.dom.createDom('div', {'class':'label', 'innerHTML':label_name});
	goog.dom.appendChild(row, label);
	
	var content = goog.dom.createDom('div', {'innerHTML':identifier});
	goog.dom.appendChild(row, content);	
};

/**
 * @param {Element} container
 * @param {string} label_name
 * @param {string} ahref
 * @private
 */
VK2.Tools.MetadataVisualizer.prototype._setOnlineRessource = function(container, label_name, ahref){
	var row = this._createMetadataRow(container);
	
	var label = goog.dom.createDom('div', {'class':'label', 'innerHTML':label_name});
	goog.dom.appendChild(row, label);
	
	var content_container = goog.dom.createDom('div');
	goog.dom.appendChild(row, content_container);	
	
	// for preventing to long urls cut query
	url = new goog.Uri(ahref);
	url.setQuery('');
	var content = goog.dom.createDom('a', {'target':'_blank','href':ahref,'innerHTML':url.toString()});
	goog.dom.appendChild(content_container, content);
};

/**
 * @param {Element} container
 * @param {string} label_name
 * @param {string} resolution
 * @private
 */
VK2.Tools.MetadataVisualizer.prototype._setResolution = function(container, label_name, resolution){
	var row = this._createMetadataRow(container);
	
	var label = goog.dom.createDom('div', {'class':'label', 'innerHTML':label_name});
	goog.dom.appendChild(row, label);
	
	var content_container = goog.dom.createDom('div');
	goog.dom.appendChild(row, content_container);	
	
	var content_label = goog.dom.createDom('label', {'innerHTML':'Denominator'});
	goog.dom.appendChild(content_container, content_label);
	
	var content = goog.dom.createDom('span',{'innerHTML':resolution});
	goog.dom.appendChild(content_container, content);
};

/**
 * @param {Element} container
 * @param {string} dataset_id
 * @private
 */
VK2.Tools.MetadataVisualizer.prototype._setUniqueId = function(container, dataset_id){
	var span = goog.dom.createDom('span', {'class':'unique-id','innerHTML':VK2.Utils.get_I18n_String('mdrecord_uniqueid') + ' | ' + dataset_id});
	goog.dom.appendChild(container, span);
};

/**
 * @param {Element} container
 * @return {Element}
 * @private
 */
VK2.Tools.MetadataVisualizer.prototype._createMetadataRow = function(container){
	var new_row = goog.dom.createDom('div', {'class':'metadata-content-row'});
	goog.dom.appendChild(container, new_row);
	return new_row;
}


