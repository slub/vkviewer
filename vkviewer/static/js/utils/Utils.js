goog.provide('VK2.Utils');

goog.require('goog.Uri');
goog.require('goog.net.cookies');
goog.require('goog.dom.classes');
goog.require('goog.style');
goog.require('goog.events');
goog.require('goog.net.XhrIo');

/**
 * @static
 * @param className {String}
 */
VK2.Utils.initializeFancyboxForClass = function(className){
	var fancyboxLinks = goog.dom.getElementsByClass(className);
	for (var i = 0; i < fancyboxLinks.length; i++){
		var fancybox_ahref = fancyboxLinks[i];
		var className = 'vk2-fancybox-wrapper';
		
		// this parse a class for setting the wide and high of the iframe
		if (goog.isDefAndNotNull(fancyboxLinks[i].getAttribute('data-fancyclass')))
			className += ' ' + fancyboxLinks[i].getAttribute('data-fancyclass') + '-page-container';
				
		$(fancybox_ahref).fancybox({
			'type': 'iframe',
			'autoSize': false,
			'wrapCSS': className,
		});
	};
};

/**
 * Function: loadBaseMap
 * This functions initialize the main OpenLayers.Map object and adds some base layer to it!
 *
 * @param mapContainer {DOMElement}
 * @param mapConfiguration {Object} OpenLayers.Map.Configuration
 * @param mapnikConfiguration {Object} 
 * @return {OpenLayers.Map}
 */
VK2.Utils.loadBaseMap = function(mapContainer, mapConfiguration, mapnikConfiguration){
    // init the map object 
    var map = new OpenLayers.Map(mapContainer, mapConfiguration);
   
    // loads the base layers
	 //openstreetmap mapnik
    var mapnik = new OpenLayers.Layer.OSM("Mapnik", "", mapnikConfiguration);

	    
	 // add the base layers to the map
	 map.addLayers([mapnik]);       
	 //map.addControl(new OpenLayers.Control.MousePosition({element:document.getElementById("idPosition"), numDigits:3, prefix:"EPSG:900913 : "}));
	 
	 
    // zoom to startExtent 
   // map.zoomToExtent(mapConfiguration.startExtent);
	 map.setCenter(mapConfiguration.startPoint, 2);
    return map;
    
};

/**
 * Function: setGenericOpenLayersPropertys
 * @param proxyUrl - {String}
 */
VK2.Utils.setGenericOpenLayersPropertys = function(proxyUrl){
    // this is important for trying to reload tiles from wms if he pings out
    OpenLayers.IMAGE_RELOAD_ATTEMPTS = 5;
    // this is the url of the proxy host
    OpenLayers.ProxyHost = VK2.Utils.getHost(proxyUrl);
};

/**
 * Function: jumptolonlat
 * Jumps to the given longitude / latitude coordiantes
 * 
 * @param map {OpenLayers.Map}
 * @param lon {Float}
 * @param lat {Float}
 * @param zoom {Integer=}
 */
VK2.Utils.jumptolonlat = function(map,lon,lat, zoom){
    var LonLat = new OpenLayers.LonLat(lon,lat).transform(new OpenLayers.Projection("EPSG:4326"),map.getProjectionObject());
    
    if (goog.isDef(zoom)){
        map.setCenter(LonLat,zoom);
        return true;
    } else {
        map.setCenter(LonLat,12);
        return true;
    }
};
		
VK2.Utils.encode_utf8 = function(rohtext) {
    // dient der Normalisierung des Zeilenumbruchs
    rohtext = rohtext.replace(/\r\n/g,"\n");
    var utftext = "";
   for(var n=0; n<rohtext.length; n++)
        {
       // ermitteln des Unicodes des  aktuellen Zeichens
       var c=rohtext.charCodeAt(n);
       // alle Zeichen von 0-127 => 1byte
        if (c<128)
            utftext += String.fromCharCode(c);
       // alle Zeichen von 127 bis 2047 => 2byte
        else if((c>127) && (c<2048)) {
           utftext += String.fromCharCode((c>>6)|192);
            utftext += String.fromCharCode((c&63)|128);}
        // alle Zeichen von 2048 bis 66536 => 3byte
        else {
            utftext += String.fromCharCode((c>>12)|224);
            utftext += String.fromCharCode(((c>>6)&63)|128);
           utftext += String.fromCharCode((c&63)|128);}
        }
  return utftext;
};

VK2.Utils.decode_utf8 = function(utftext) {
    var plaintext = ""; var i=0; var c=c1=c2=0;
    // while-Schleife, weil einige Zeichen uebersprungen werden
     while(i<utftext.length)
         {
         c = utftext.charCodeAt(i);
        if (c<128) {
             plaintext += String.fromCharCode(c);
             i++;}
         else if((c>191) && (c<224)) {
             c2 = utftext.charCodeAt(i+1);
             plaintext += String.fromCharCode(((c&31)<<6) | (c2&63));
             i+=2;}
         else {
             c2 = utftext.charCodeAt(i+1); c3 = utftext.charCodeAt(i+2);
             plaintext += String.fromCharCode(((c&15)<<12) | ((c2&63)<<6) | (c3&63));
             i+=3;}
         }
     return plaintext;
};

VK2.Utils.getAllUrlParams = function(){ 
	var queryString = window.location.search.substring(1);
	var vars = queryString.split('&');
	var queryDict = {}
	for (var i = 0; i < vars.length; i++){
		var pair = vars[i].split('=');
		queryDict[pair[0]] = decodeURIComponent(pair.slice(1).join('='))
	}
	return queryDict;
};

/**
 * Function: get_url_param
 * This function parse the value for a given query parameter from get request
 * 
 * @param {String} name
 * @returns {String}
 * @deprecated
 */
VK2.Utils.get_url_param = function( name ){
	name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");

	var regexS = "[\\?&]"+name+"=([^&#]*)";
	var regex = new RegExp( regexS );
	var results = regex.exec( window.location.href );

	if ( results == null )
		return "";
	else
	return results[1];
};

/**
 * Function: getHost
 * 
 * @params {String} subdomain
 * @returns {String} - host domain + port + subdomain
 */
VK2.Utils.getHost = function(subdomain){
	var host = location.protocol+'//'+location.hostname+(location.port ? ':'+location.port: '');
	if (subdomain.charAt(0) == "/")
		return host+subdomain;
	else
		return host + "/" + subdomain;
};

/**
 * function: routeToTop
 * 
 * @param {String} url
 */
VK2.Utils.routeToTop = function(url){
	var a = document.createElement('a');
	a.href = url;
	a.target = '_top';
	document.body.appendChild(a);
	a.click();
};

/** 
 * function: fixControlConflictsOnOLMap
 * 
 * @param - event {OpenLayers.Event}
 */
VK2.Utils.fixControlConflictsOnOLMap = function(control){
    // this two rows are important for allowing click and drag the main map 
    // on a selection
    if (typeof(control.handlers) != "undefined") { // OL 2.7
    	control.handlers.feature.stopDown = false;
     } else if (typeof(control.handler) != "undefined") { // OL < 2.7
    	 control.handler.stopDown = false; 
    	 control.handler.stopUp = false; 
     }
};

/**
 * function: getDictionaryValues
 *
 * @param - dict {Object}
 */ 
VK2.Utils.getDictionaryValues = function(dictionary){
	list =  [];
	for (var key in dictionary){
		list.push(dictionary[key]);
		return list;
	}
};

/**
 * Function: get_I18n_String
 * This function encapsulate the json lang_dictionary from the locale javascript folder.
 * 
 * @param key - {String}
 * @return {String}
 */
VK2.Utils.get_I18n_String = function(key){
	try{
		if (goog.isDef(lang_dictionary))
			return lang_dictionary[key];
	} catch (ReferenceError){
		console.log('Could not found dictionary.')
	}
};

/**
 * @param {string} name
 * @param {string} value
 */
VK2.Utils.setCookie = function(name, value){
	goog.net.cookies.set(name, value);
}

/**
 * @param {element} element Represents dom element for which class should be removed
 * @param {string} className 
 */
VK2.Utils.removeClass = function(element, className){
	if (goog.dom.classes.has(element, className))
		goog.dom.classes.remove(element,className);
}

/**
 * This function parse the query parameters of the given href. If href is undefined it tooks the actual window.location.href 
 * @param {string|undefined} href
 * @return {goog.Uri.QueryData}
 * @static
 */
VK2.Utils.getAllQueryParams = function(href){
	if (goog.isDef(href)){
		var url = new goog.Uri(href);
	} else {
		var url = new goog.Uri(window.location.href);
	}

	return url.getQueryData();
};

/**
 * This function parse for the given href the query parameter with the given name. If href is undefined it tooks the 
 * actual window.location.href
 * @param {string} name
 * @param {string|undefined} href
 * @return {string}
 * @static
 */
VK2.Utils.getQueryParam = function(name, href){
	if (goog.isDef(href)){
		return this.getAllQueryParams(href).get(name);
	} else {
		return this.getAllQueryParams().get(name);
	}
}

/**
 * @param {Element} container
 * @param {number} points
 * @static
 */
VK2.Utils.showAchievedPoints = function(container, points){
	container.innerHTML = '+' + points + ' ' + VK2.Utils.get_I18n_String('georef_points')
	$(container).fadeIn(1000).effect('puff', {}, 3000, function(){
		container.innerHTML = '';
	});
};

/**
 * @param {NodeList} nodelist
 * @return {Array} 
 */
VK2.Utils.castNodeListToArray = function(nodelist){
	var arr = [];
	for (var i = 0; i < nodelist.length; i++){
		arr.push(nodelist[i]);
	}
	return arr;
};

/**
 * @param {Array.<Element>} elements
 * @param {string} src_tag
 * @param {string} img_tag
 * @return {Function}
 */
VK2.Utils.getLazyImageLoadingFn = function(elements, src_tag, img_tag){

	var isScrolledInView = function(elem){
	    var docViewTop = goog.dom.getDocumentScroll().y;
	    var docViewBottom = docViewTop + goog.dom.getDocumentHeight();

	    var elemTop = goog.style.getPageOffsetTop(elem);
	    var elemHeight = goog.style.getSize(elem).height;
	    var elemBottom = elemTop + elemHeight

	    return ((elemBottom <= (docViewBottom + elemHeight)) && (elemTop >= (docViewTop - elemHeight))); // for defining tolerance ranges
	};
	
	var lazyLoading = function(){
		console.log('Lazy loading triggered!');
		var elements_ = elements;
		// loop through array from the back
		for (var i = elements_.length-1; i >= 0; i--){
			if (isScrolledInView(elements_[i])){
				elements_[i].setAttribute(src_tag, elements_[i].getAttribute(img_tag));
				elements_.splice(i, 1);
			}
		};
	};
	
	return lazyLoading;
};

/**
 * This functions does a get request for a given url_string and calls, if given, the success_callback or error_callback
 * @param {string} url_string
 * @param {Function=} success_callback
 * @param {Function=} error_callback
 * @static
 */
VK2.Utils.sendReport = function(url_string, success_callback, error_callback){
	
	// create request object
	var xhr = new goog.net.XhrIo();
	
	// add listener to request object
	goog.events.listenOnce(xhr, 'success', function(e){
		var xhr = /** @type {goog.net.XhrIo} */ (e.target);
		if (goog.isDef(success_callback))
			success_callback(xhr);
		xhr.dispose();

	}, false, this);
	
	goog.events.listenOnce(xhr, 'error', function(e){
		var xhr = /** @type {goog.net.XhrIo} */ (e.target);
		if (goog.isDef(error_callback))
			error_callback(xhr);
	}, false, this);
	
	// send request
	xhr.send(url_string);	
};

/**
 * This function calculates the lon, lat values for a center point with an extent object
 * @param {Array.<number>} extent
 */
VK2.Utils.getCenterPointForExtent = function(extent){
	var lon = extent[0] + (extent[2] - extent[0])/2;
	var lat = extent[1] + (extent[3] - extent[1])/2;
	return [lon, lat];
};

/**
 * @param {Array.<number>} extent
 * @return {Array.<Array.<number>>}
 */
VK2.Utils.getPolygonFromExtent = function(extent){
	return [[extent[0],extent[1]], [extent[0],extent[3]], [extent[2],extent[3]], [extent[2],extent[1]]];
};

/**
 * Overwrite or prototype basic javascript functions
 */
String.prototype.replaceAll = function(search, replacement){
	var target = this;
	return target.split(search).join(replacement);
};




