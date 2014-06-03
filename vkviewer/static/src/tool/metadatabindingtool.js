goog.provide('vk2.tool.MetadataBinding');

goog.require('goog.object');
goog.require('goog.dom');
goog.require('goog.Uri');
goog.require('goog.style');
goog.require('vk2.settings');
goog.require('vk2.utils');
goog.require('vk2.request.CSW');
/**
 * @param {Element|string} parentEl 
 * @param {string} metadataId
 * @constructor
 */
vk2.tool.MetadataBinding = function(parentEl, metadataId){

	/**
	 * @type {Object}
	 * @private
	 */
	this._parentEl = goog.isString(parentEl) ? goog.dom.getElement(parentEl) : parentEl;;
	
	response = vk2.request.CSW.getRecord(metadataId, vk2.settings.CSW_URL, goog.bind(function(data){
		this.displayCswIsoRecord(data);
	}, this));
};

/**
 * @param {Object} data
 */
vk2.tool.MetadataBinding.prototype.displayCswIsoRecord = function(data){
	// set page title
	this._setPageTitle(data['TITEL'][0]);
	
	// display the metadata
	this._displayMetadata(data);
};

/**
 * @param {string} title
 * @private
 */
vk2.tool.MetadataBinding.prototype._setPageTitle = function(title){
	var page_header = goog.dom.getElement('singlemapview-title');
	page_header.innerHTML = title;
};

/**
 * @param {Object} metadata 
 * @private
 */
vk2.tool.MetadataBinding.prototype._displayMetadata = function(metadata){
	
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
	var catalog_link = vk2.settings.GEONETWORK+metadata['ID'][0];
	this._setTitle(metadata_container, metadata['ABSTRACT'][0],catalog_link);
	this._setThumbnail(thumbnail_container, metadata['THUMBNAIL'][0]);
	
	// set further metadata information
	this._setCatchwords(metadata_container, vk2.utils.getMsg('mdrecord_keyword'), 'Messtischblätter Messtischblatt');
	this._setLanguage(metadata_container, vk2.utils.getMsg('mdrecord_language'),'German');
	
	for (var i = 0; i < metadata['REFERENCE_SYSTEM'].length; i++){
		this._setCrsIdentifier(metadata_container, vk2.utils.getMsg('mdrecord_referencesystem'),metadata['REFERENCE_SYSTEM'][i]);
	};
	
	for (var i = 0; i < metadata['ONLINE_RESSOURCE'].length; i++){
		this._setOnlineRessource(metadata_container, vk2.utils.getMsg('mdrecord_onlineresource'),metadata['ONLINE_RESSOURCE'][i]);
	};
	
	this._setResolution(metadata_container, vk2.utils.getMsg('mdrecord_spatialresolution'), metadata['DENOMINATOR'][0]);
	this._setUniqueId(metadata_container, metadata['ID'][0]);
};

/**
 * @param {Element} container
 * @param {string} description
 * @param {string} catalog_link
 * @private
 */
vk2.tool.MetadataBinding.prototype._setTitle = function(container, description, catalog_link){
	
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
		'innerHTML': vk2.utils.getMsg('mdrecord_moremetadata'),
		'target': '_blank'
	})
	goog.dom.appendChild(descr_div, catalog_anchor);
	

};

/**
 * @param {Element} container
 * @param {string} container
 * @private
 */
vk2.tool.MetadataBinding.prototype._setThumbnail = function(container, thumbnail_link){
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
vk2.tool.MetadataBinding.prototype._setCatchwords = function(container, label_name, catchwords){
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
vk2.tool.MetadataBinding.prototype._setLanguage = function(container, label_name, language){
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
vk2.tool.MetadataBinding.prototype._setCrsIdentifier = function(container, label_name, identifier){
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
vk2.tool.MetadataBinding.prototype._setOnlineRessource = function(container, label_name, ahref){
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
vk2.tool.MetadataBinding.prototype._setResolution = function(container, label_name, resolution){
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
vk2.tool.MetadataBinding.prototype._setUniqueId = function(container, dataset_id){
	var span = goog.dom.createDom('span', {'class':'unique-id','innerHTML':vk2.utils.getMsg('mdrecord_uniqueid') + ' | ' + dataset_id});
	goog.dom.appendChild(container, span);
};

/**
 * @param {Element} container
 * @return {Element}
 * @private
 */
vk2.tool.MetadataBinding.prototype._createMetadataRow = function(container){
	var new_row = goog.dom.createDom('div', {'class':'metadata-content-row'});
	goog.dom.appendChild(container, new_row);
	return new_row;
}


