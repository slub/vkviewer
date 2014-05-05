goog.provide('VK2.Request.WFS');

VK2.Request.WFS.transformStringToXml = function(text){
	var xmlDoc;
	if (window.DOMParser) {
		parser=new DOMParser();
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
VK2.Request.WFS.getFeatureRequest = function(extent, time){
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
}