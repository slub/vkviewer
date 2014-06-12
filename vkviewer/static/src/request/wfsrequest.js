goog.provide('vk2.request.WFS');

goog.require('vk2.settings');

vk2.request.WFS.transformStringToXml = function(text){
	var xmlDoc;
	if (window.DOMParser) {
		var parser = new DOMParser();
		xmlDoc=parser.parseFromString(text,"text/xml");
	} else {
		// code for IE
		xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
		xmlDoc.async=false;
		xmlDoc.loadXML(text); 
	};
	return xmlDoc
};

/**
 * @param {Array.<number>} extent
 * @param {string|number} time
 */
vk2.request.WFS.getFeatureRequest = function(extent, time){
	var extent = ""+extent[0]+","+extent[1]+" "+extent[2]+","+extent[3];
	var request = "<?xml version=\"1.0\"?><wfs:GetFeature xmlns:wfs=\"http://www.opengis.net/wfs\" service=\"WFS\" version=\"1.1.0\""+
		"maxFeatures=\"10000\" xsi:schemaLocation=\"http://www.opengis.net/wfs http://schemas.opengis.net/wfs/1.0.0/WFS-transaction.xsd\""+
		"xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\"><wfs:Query typeName=\"ms:Historische_Messtischblaetter_WFS\""+
		"xmlns:ms=\"http://mapserver.gis.umn.edu/mapserver\"><ogc:Filter xmlns:ogc=\"http://www.opengis.net/ogc\">"+
		"<ogc:And><ogc:And><ogc:BBOX><ogc:PropertyName>boundingbox</ogc:PropertyName><gml:Box xmlns:gml=\"http://www.opengis.net/gml\""+
		"srsName=\"EPSG:900913\"><gml:coordinates decimal=\".\" cs=\",\" ts=\" \">" + extent +
		"</gml:coordinates></gml:Box></ogc:BBOX><ogc:And><ogc:PropertyIsGreaterThanOrEqualTo><ogc:PropertyName>time</ogc:PropertyName>"+
		"<ogc:Literal>" + time + "</ogc:Literal></ogc:PropertyIsGreaterThanOrEqualTo><ogc:PropertyIsLessThanOrEqualTo><ogc:PropertyName>"+
		"time</ogc:PropertyName><ogc:Literal>" + time +"</ogc:Literal></ogc:PropertyIsLessThanOrEqualTo></ogc:And></ogc:And><ogc:BBOX>"+
		"<ogc:PropertyName>boundingbox</ogc:PropertyName><gml:Box xmlns:gml=\"http://www.opengis.net/gml\" srsName=\"EPSG:900913\">"+
		"<gml:coordinates decimal=\".\" cs=\",\" ts=\" \">" + extent + "</gml:coordinates></gml:Box></ogc:BBOX></ogc:And>"+
		"</ogc:Filter></wfs:Query></wfs:GetFeature>";
	return request;
};

/**
 * @param {string} featureName
 * @param {Array.<number>} bbox
 */
vk2.request.WFS.getFeatureRequest_IntersectBBox = function(featureName, bbox){
	var request = "<?xml version=\"1.0\"?><wfs:GetFeature xmlns:wfs=\"http://www.opengis.net/wfs\" service=\"WFS\" version=\"1.1.0\""+
	"maxFeatures=\"10000\" xsi:schemaLocation=\"http://www.opengis.net/wfs http://schemas.opengis.net/wfs/1.0.0/WFS-transaction.xsd\""+
	"xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\"><wfs:Query typeName=\""+featureName+"\" "+
	"xmlns:ms=\"http://mapserver.gis.umn.edu/mapserver\"><ogc:Filter xmlns:ogc=\"http://www.opengis.net/ogc\">"+
	"<ogc:Intersects><ogc:PropertyName>boundingbox</ogc:PropertyName><gml:Box srsName=\"EPSG:900913\"><gml:coord><gml:X>"+bbox[0]+"</gml:X>"+
	"<gml:Y>"+bbox[1]+"</gml:Y></gml:coord><gml:coord><gml:X>"+bbox[2]+"</gml:X><gml:Y>"+bbox[3]+"</gml:Y></gml:coord></gml:Box></ogc:Intersects>"+
	"</ogc:Filter></wfs:Query></wfs:GetFeature>";
	return request;
};

/**
 * @param {Array.<string>} objectids
 * @return {string}
 */
vk2.request.WFS.getFeatureRequestForObjectIds = function(objectids){
	var request = vk2.settings.PROXY_URL + vk2.settings.WFS_URL + '?' + 'SERVICE=WFS&VERSION=1.1.0&REQUEST=getfeature&TYPENAME=Historische_Messtischblaetter_WFS';
	
	if (objectids.length > 1){
		// use OR filter
		request += '&Filter=<Filter><OR>';
		for (var i = 0; i < objectids.length; i++){
			request += '<PropertyIsEqualTo><PropertyName>mtbid</PropertyName><Literal>' + objectids[i] + '</Literal></PropertyIsEqualTo>';
		};
		request += '</OR></Filter>';
	} else {
		request += '&Filter=<Filter><PropertyIsEqualTo><PropertyName>mtbid</PropertyName><Literal>' + objectids[0] + '</Literal></PropertyIsEqualTo></Filter>';
	};
	
	return request;
};