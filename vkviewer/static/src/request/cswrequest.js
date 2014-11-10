goog.provide('vk2.request.CSW');

goog.require('goog.net.XhrIo');
goog.require('goog.net.EventType');
goog.require('goog.events');
goog.require('goog.events.EventTarget');
goog.require('goog.dom');
goog.require('goog.array');
goog.require('goog.object');
goog.require('vk2.settings');

/**
 * @param {string}
 * @static
 */
vk2.request.CSW.METADATA_PARENT_NODE = 'gmd:MD_Metadata';

/**
 * @param {Object} 
 * @static
 */
vk2.request.CSW.SEARCH_PATHS = {
		'ONLINE_RESSOURCE':		['gmd:distributionInfo','gmd:MD_Distribution','gmd:transferOptions','gmd:MD_DigitalTransferOptions','gmd:onLine',
			            		 	'gmd:CI_OnlineResource','gmd:linkage','gmd:URL'],
		'ID':				['gmd:fileIdentifier','gco:CharacterString'],
		'LANGUAGE':			['gmd:language','gco:CharacterString'],
		'PARENT_ID':		['gmd:parentIdentifier','gco:CharacterString'],
		'LAST_UPDATE':		['gmd:dateStamp','gco:Date'],
		'REFERENCE_SYSTEM':	['gmd:referenceSystemInfo','gmd:MD_ReferenceSystem','gmd:referenceSystemIdentifier','gmd:RS_Identifier',
		                   	 	'gmd:code','gco:CharacterString'],
		'TITEL':			['gmd:identificationInfo','gmd:MD_DataIdentification','gmd:citation','gmd:CI_Citation','gmd:title','gco:CharacterString'],
		'ABSTRACT':			['gmd:identificationInfo','gmd:MD_DataIdentification','gmd:abstract','gco:CharacterString'],
		'DENOMINATOR':		['gmd:identificationInfo','gmd:MD_DataIdentification','gmd:spatialResolution','gmd:MD_Resolution',
		              		 	'gmd:equivalentScale','gmd:MD_RepresentativeFraction','gmd:denominator','gco:Integer'],
		'THUMBNAIL':		['gmd:identificationInfo','gmd:MD_DataIdentification','gmd:graphicOverview','gmd:MD_BrowseGraphic','gmd:fileName','gco:CharacterString']
};

/**
 * @param {string} record_id
 * @param {string} service_url
 * @param {Function} callback
 */
vk2.request.CSW.getRecord = function(record_id, service_url, callback){
	requestUrl = vk2.settings.PROXY_URL + service_url; 
		
	xmlRequest = '<?xml version="1.0"?><csw:GetRecordById xmlns:csw="http://www.opengis.net/cat/csw/2.0.2" service="CSW" version="2.0.2" outputSchema="csw:IsoRecord">' +
			'<csw:Id>' + record_id + '</csw:Id></csw:GetRecordById>';
	
	// create request object
	var xhr = new goog.net.XhrIo();
	
	// add listener to request object
	goog.events.listenOnce(xhr, goog.net.EventType.SUCCESS, function(e){
		var xhr = /** @type {goog.net.XhrIo} */ (e.target);
		var responseXml = xhr.getResponseXml();
		var parsedResponse = vk2.request.CSW.parseGetRecordResponse(responseXml, callback);
		xhr.dispose();
	});
	
	// send request
	xhr.send(requestUrl, 'POST', xmlRequest, {'Content-Type':'application/xml;charset=UTF-8'});	
};

/**
 * @param {string} xml_document
 * @param {Function=} opt_callback
 * @static
 */
vk2.request.CSW.parseGetRecordResponse = function(xml_document, opt_callback){
	
	var parentNode = goog.dom.findNode(xml_document, function(n){
		return n.nodeType == goog.dom.NodeType.ELEMENT && n.tagName == vk2.request.CSW.METADATA_PARENT_NODE;
	});
	
	var response = {}
	
	for (var key in vk2.request.CSW.SEARCH_PATHS){
		if (vk2.request.CSW.SEARCH_PATHS.hasOwnProperty(key)){
			response[key] = vk2.request.CSW._getChildNode(parentNode, vk2.request.CSW.SEARCH_PATHS[key]);
		}
	}

	if (goog.isDef(opt_callback)){
		opt_callback(response);
		return undefined;
	};		
	return response;
};

/**
 * @param {Node} root_node
 * @param {array} rest_path
 * @static
 */
vk2.request.CSW._getChildNode = function(root_node, rest_path){
	
	var response = [];
	
	var nodes = goog.dom.findNodes(root_node, function(n){
		return n.nodeType == goog.dom.NodeType.ELEMENT && n.tagName == rest_path[0];
	})
	
	var new_path = goog.array.slice(rest_path, 1);
	if (new_path.length > 0){
		for (var i = 0; i < nodes.length; i++){
			goog.array.extend(response, vk2.request.CSW._getChildNode(nodes[i], new_path));
		}
	} else {
		for (var i = 0; i < nodes.length; i++){
			goog.array.insert(response, nodes[i].textContent);
		}
	}
	
	return response;
}
