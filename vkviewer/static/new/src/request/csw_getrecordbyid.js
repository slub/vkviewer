goog.provide('VK2.Requests.CSW_GetRecordById');

goog.require('goog.net.XhrIo');
goog.require('goog.net.EventType');
goog.require('goog.events');
goog.require('goog.events.EventTarget');
goog.require('goog.dom');
goog.require('goog.array');
goog.require('goog.object');
goog.require('VK2.Settings');
goog.require('VK2.Events.ParsedCswRecordEvent');

/**
 * @constructor
 * @extends {goog.events.EventTarget}
 */
VK2.Requests.CSW_GetRecordById = function(){
	goog.events.EventTarget.call(this);
}
goog.inherits(VK2.Requests.CSW_GetRecordById, goog.events.EventTarget);

/**
 * @param {string}
 * @static
 */
VK2.Requests.CSW_GetRecordById._parentElement = 'gmd:MD_Metadata';

/**
 * @param {Object} 
 * @static
 */
VK2.Requests.CSW_GetRecordById.SearchPaths = {
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
 */
VK2.Requests.CSW_GetRecordById.prototype.getRecord = function(record_id, service_url){
	requestUrl = VK2.Settings.PROXY_URL + service_url; 
		
	xmlRequest = '<?xml version="1.0"?><csw:GetRecordById xmlns:csw="http://www.opengis.net/cat/csw/2.0.2" service="CSW" version="2.0.2" outputSchema="csw:IsoRecord">' +
			'<csw:Id>' + record_id + '</csw:Id></csw:GetRecordById>';
	
	// create request object
	var xhr = new goog.net.XhrIo();
	
	// add listener to request object
	goog.events.listenOnce(xhr, goog.net.EventType.SUCCESS, function(e){
		var xhr = /** @type {goog.net.XhrIo} */ (e.target);
		var responseXml = xhr.getResponseXml();
		var parsedResponse = VK2.Requests.CSW_GetRecordById._parseGetRecordResponse(responseXml);
		this.dispatchEvent(new VK2.Events.ParsedCswRecordEvent(this, parsedResponse));
		xhr.dispose();
	}, false, this);
	
	// send request
	xhr.send(requestUrl, 'POST', xmlRequest, {'Content-Type':'application/xml;charset=UTF-8'});	
};

/**
 * @param {string} xml_document
 * @static
 */
VK2.Requests.CSW_GetRecordById._parseGetRecordResponse = function(xml_document){
	
	var parentNodeString = this._parentElement;
	var parentNode = goog.dom.findNode(xml_document, function(n){
		return n.nodeType == goog.dom.NodeType.ELEMENT && n.tagName == parentNodeString;
	});
	
	var response = {}
	
	for (var key in this.SearchPaths){
		if (this.SearchPaths.hasOwnProperty(key)){
			response[key] = this._getChildNode(parentNode, this.SearchPaths[key]);
		}
	}

	return response;
};

/**
 * @param {Node} root_node
 * @param {array} rest_path
 * @static
 */
VK2.Requests.CSW_GetRecordById._getChildNode = function(root_node, rest_path){
	
	var response = [];
	
	var nodes = goog.dom.findNodes(root_node, function(n){
		return n.nodeType == goog.dom.NodeType.ELEMENT && n.tagName == rest_path[0];
	})
	
	var new_path = goog.array.slice(rest_path, 1);
	if (new_path.length > 0){
		for (var i = 0; i < nodes.length; i++){
			goog.array.extend(response, this._getChildNode(nodes[i], new_path));
		}
	} else {
		for (var i = 0; i < nodes.length; i++){
			goog.array.insert(response, nodes[i].textContent);
		}
	}
	
	return response;
}
