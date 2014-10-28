goog.provide('vk2.request.WFS');

goog.require('vk2.settings');

//vk2.request.WFS.transformStringToXml = function(text){
//	var xmlDoc;
//	if (window.DOMParser) {
//		var parser = new DOMParser();
//		xmlDoc=parser.parseFromString(text,"text/xml");
//	} else {
//		// code for IE
//		xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
//		xmlDoc.async=false;
//		xmlDoc.loadXML(text); 
//	};
//	return xmlDoc
//};
//
///**
// * @param {Array.<number>} extent
// * @param {string|number} time
// */
//vk2.request.WFS.getFeatureRequest = function(extent, time){
//	var extent = ""+extent[0]+","+extent[1]+" "+extent[2]+","+extent[3];
//	var request = "<?xml version=\"1.0\"?><wfs:GetFeature xmlns:wfs=\"http://www.opengis.net/wfs\" service=\"WFS\" version=\"1.1.0\""+
//		"maxFeatures=\"10000\" xsi:schemaLocation=\"http://www.opengis.net/wfs http://schemas.opengis.net/wfs/1.0.0/WFS-transaction.xsd\""+
//		"xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\"><wfs:Query typeName=\"ms:Historische_Messtischblaetter_WFS\""+
//		"xmlns:ms=\"http://mapserver.gis.umn.edu/mapserver\"><ogc:Filter xmlns:ogc=\"http://www.opengis.net/ogc\">"+
//		"<ogc:And><ogc:And><ogc:BBOX><ogc:PropertyName>boundingbox</ogc:PropertyName><gml:Box xmlns:gml=\"http://www.opengis.net/gml\""+
//		"srsName=\"EPSG:900913\"><gml:coordinates decimal=\".\" cs=\",\" ts=\" \">" + extent +
//		"</gml:coordinates></gml:Box></ogc:BBOX><ogc:And><ogc:PropertyIsGreaterThanOrEqualTo><ogc:PropertyName>time</ogc:PropertyName>"+
//		"<ogc:Literal>" + time + "</ogc:Literal></ogc:PropertyIsGreaterThanOrEqualTo><ogc:PropertyIsLessThanOrEqualTo><ogc:PropertyName>"+
//		"time</ogc:PropertyName><ogc:Literal>" + time +"</ogc:Literal></ogc:PropertyIsLessThanOrEqualTo></ogc:And></ogc:And><ogc:BBOX>"+
//		"<ogc:PropertyName>boundingbox</ogc:PropertyName><gml:Box xmlns:gml=\"http://www.opengis.net/gml\" srsName=\"EPSG:900913\">"+
//		"<gml:coordinates decimal=\".\" cs=\",\" ts=\" \">" + extent + "</gml:coordinates></gml:Box></ogc:BBOX></ogc:And>"+
//		"</ogc:Filter></wfs:Query></wfs:GetFeature>";
//	return request;
//};
//
///**
// * @param {Array.<number>} extent
// * @param {string} projection
// */
//vk2.request.WFS.getSimpleFeatureRequest = function(extent, projection){
//	var request = vk2.settings.PROXY_URL+vk2.settings.WFS_URL+'?SERVICE=WFS&' +
//		'VERSION=1.1.0&REQUEST=getfeature&TYPENAME=mapsearch&MAXFEATURES=10000&srsname='+projection+'&' +
//		'bbox=' + extent.join(',');
//	return request;
//};

/**
 * @param {string} ows_url
 * @param {string} featureName
 * @param {Array.<number>} bbox
 * @static
 */
vk2.request.WFS.getFeatureRequest_IntersectBBox = function(ows_url, featureName, bbox){
	var request = vk2.settings.PROXY_URL + ows_url + '?' + 'SERVICE=WFS&VERSION=1.1.0&REQUEST=getfeature&TYPENAME=' + featureName + '&outputformat=geojson&format=application/json;%20subtype=geojson';
	request += '&Filter=<Filter><Intersects><PropertyName>boundingbox</PropertyName><Box srsName="EPSG:900913"><coord><X>' + bbox[0] + '</X><Y>' +
		bbox[1] + '</Y></coord><coord><X>' + bbox[2] + '</X><Y>' + bbox[3] + '</Y></coord></Box></Intersects></Filter>';
	return request;
};

/**
 * @param {Array.<string>} objectids
 * @return {string}
 * @static
 */
vk2.request.WFS.getFeatureRequestForObjectIds = function(objectids){
	var request = vk2.settings.PROXY_URL + vk2.settings.WFS_GEOSERVER_URL + '?' + 'SERVICE=WFS&VERSION=1.1.0&REQUEST=getfeature&TYPENAME=' + 
		vk2.settings.WFS_GEOSERVER_SEARCHLAYER + '&outputformat=application/json';
	
	if (objectids.length > 1){
		// use OR filter
		request += '&Filter=<Filter><Or>';
		for (var i = 0; i < objectids.length; i++){
			request += '<PropertyIsEqualTo><PropertyName>id</PropertyName><Literal>' + objectids[i] + '</Literal></PropertyIsEqualTo>';
		};
		request += '</Or></Filter>';
	} else {
		request += '&Filter=<Filter><PropertyIsEqualTo><PropertyName>id</PropertyName><Literal>' + objectids[0] + '</Literal></PropertyIsEqualTo></Filter>';
	};
	
	return request;
};

/**
 * @param {string} projection
 * @param {Array.<number>} extent
 * @param {Enum.<number>} timeFilter - START|END
 * @param {string} sortBy
 * @param {number} startIndex
 * @param {number} maxFeatures
 * @return {string}
 * @static
 */
vk2.request.WFS.getFeatureForBBoxTimeFilter = function(projection, extent, timeFilter, sortBy, startIndex, maxFeatures){
	var extent_ = extent[0] + ',' + extent[1] + ' ' + extent[2] + ',' + extent[3];
	var url = vk2.settings.PROXY_URL + vk2.settings.WFS_GEOSERVER_URL +'?service=WFS' +
		'&version=1.0.0&request=GetFeature&typeName=' + vk2.settings.WFS_GEOSERVER_SEARCHLAYER + 
		'&outputFormat=application/json&srsname=' + projection + '&Filter=<Filter><And>' +
		'<BBOX><PropertyName>boundingbox</PropertyName><Box srsName="' + projection +'">' + 
		'<coordinates decimal="." cs="," ts=" ">' + extent_ + '</coordinates></Box>' +
		'</BBOX><And><PropertyIsGreaterThanOrEqualTo><PropertyName>time</PropertyName>' +
		'<Literal>' + timeFilter.START + '</Literal></PropertyIsGreaterThanOrEqualTo>' + 
		'<PropertyIsLessThanOrEqualTo><PropertyName>time</PropertyName><Literal>' + timeFilter.END +
		'</Literal></PropertyIsLessThanOrEqualTo></And></And></Filter>&sortBy=' + sortBy
		+	'&startIndex=' + startIndex + '&maxFeatures=' + maxFeatures;
	return url;
};