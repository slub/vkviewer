goog.provide('vk2.utils');

goog.require('goog.Uri');
goog.require('goog.dom');
goog.require('goog.dom.classes');
goog.require('goog.style');

/**
 * @static
 * @param {ol.Map} map
 * @return {Array.<number>}
 */
vk2.utils.calculateMapExtentForPixelViewport = function(map){
	var padding = 50;
	var offsetTop = 85;
	var offsetBottom = 25;
	
	// this is a premise
	var spatialsearchSize = goog.style.getSize(goog.dom.getElement('spatialsearch-container'));
	var mapSize = goog.style.getSize(goog.dom.getElement('mapdiv'));
	
	// calculate pixelextent
	var lowX = 0 + spatialsearchSize.width + padding;
	var lowY = mapSize.height - offsetBottom - padding;
	var highX = mapSize.width - padding;
	var highY = offsetTop + padding;
	
	// get equivalent coordinates
	var llc = map.getCoordinateFromPixel([lowX, lowY]);
	var urc = map.getCoordinateFromPixel([highX, highY]);
	return [llc[0],llc[1],urc[0],urc[1]];
};

/**
 * This function checks if cookies are enabled
 * @static
 */
vk2.utils.checkIfCookiesAreEnabble = function(){
	if (!navigator.cookieEnabled){
		alert('This page needs cookies for correct behavior. So please activate them in your browser.');
	} else if (goog.DEBUG) {
		console.log('Cookies are enabled');		
	}
};

/**
 * @param {string} dateiname
 * @return {string}
 */
vk2.utils.generateMesstischblattThumbnailLink = function(dateiname){
	return vk2.settings.THUMBNAIL_URL+dateiname+'.jpg';
};

/**
 * This function parse the query parameters of the given href. If href is undefined it tooks the actual window.location.href 
 * @param {string|undefined} href
 * @return {goog.Uri.QueryData}
 * @static
 */
vk2.utils.getAllQueryParams = function(href){
	if (goog.isDef(href)){
		var url = new goog.Uri(href);
	} else {
		var url = new goog.Uri(window.location.href);
	}

	return url.getQueryData();
};

/**
 * @param {Element} element
 * @param {string} className
 */
vk2.utils.getClosestParentElementForClass = function(element, className){
	var element = goog.dom.classes.has(element, className) ? element : 
		this.getClosestParentElementForClass(goog.dom.getParentElement(element), className);
	return element;
};

/**
 * 
 * This function encapsulate the json lang_dictionary from the locale javascript folder.
 * @static
 * @param key - {String}
 * @return {String}
 */
vk2.utils.getMsg = function(key){
	try{
		if (goog.isDef(window['lang_dictionary'])) return window['lang_dictionary'][key];
	} catch (ReferenceError){
		console.log('Could not found dictionary.');
		return '';
	}
};

/**
 * @param {Array.<number>} extent
 * @return {Array.<Array.<number>>}
 */
vk2.utils.getPolygonFromExtent = function(extent){
	return [[extent[0],extent[1]], [extent[0],extent[3]], [extent[2],extent[3]], [extent[2],extent[1]]];
};

/**
 * This function parse for the given href the query parameter with the given name. If href is undefined it tooks the 
 * actual window.location.href
 * @param {string} name
 * @param {string|undefined} href
 * @return {string}
 * @static
 */
vk2.utils.getQueryParam = function(name, href){
	if (goog.isDef(href)){
		return this.getAllQueryParams(href).get(name);
	} else {
		return this.getAllQueryParams().get(name);
	}
};

/**
 * @param {string} map_container
 * @static
 */
vk2.utils.overwriteOlTitles = function(map_container){
	var elements = goog.dom.getElementByClass('ol-overlaycontainer-stopevent', goog.dom.getElement(map_container));
	for (var i = 0; i < elements.children.length; i++){
		var childElement = elements.children[i];
		if (goog.dom.classes.has(childElement.children[0], 'ol-has-tooltip')){
			var tooltipEls = goog.dom.getElementsByClass('ol-has-tooltip', childElement);
			for (var j = 0; j < tooltipEls.length; j++){
				var tooltipText = tooltipEls[j].children[0].innerHTML;
				tooltipEls[j].setAttribute('title', tooltipText);
			};
		};
	};
};

/**
 * @static
 */
vk2.utils.setProxyUrl = function(){
	var origin = window.location.origin;
	// for opera 
	if (!window.location.origin)
		origin = window.location.protocol+'//'+window.location.host;
	
	vk2.settings.PROXY_URL = origin+'/vkviewer/proxy/?url=';
	
	if (goog.DEBUG)
		console.log('Proxy url is: '+vk2.settings.PROXY_URL);
};

/**
 * @param {Element} parentEl
 * @param {number} points
 * @static
 */
vk2.utils.showAchievedPoints = function(parentEl, points){
	var container = goog.dom.createDom('div',{
		'class':'georef-point-container alert alert-warning',
		'style':'display:none;'
	});
	goog.dom.appendChild(parentEl, container);
	
	container.innerHTML = '+' + points + ' ' + vk2.utils.getMsg('georef_points')
	$(container).fadeIn(1000).effect('puff', {}, 3000, function(){
		container.innerHTML = '';
	});
};