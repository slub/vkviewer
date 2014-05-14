goog.provide('VK2.Utils');

goog.require('goog.dom');
goog.require('goog.dom.classes');

/**
 * 
 * This function encapsulate the json lang_dictionary from the locale javascript folder.
 * @static
 * @param key - {String}
 * @return {String}
 */
VK2.Utils.getMsg = function(key){
	try{
		if (goog.isDef(window['lang_dictionary'])) return window['lang_dictionary'][key];
	} catch (ReferenceError){
		console.log('Could not found dictionary.');
		return '';
	}
};

/**
 * This function checks if cookies are enabled
 * @static
 */
VK2.Utils.checkIfCookiesAreEnabble = function(){
	if (!navigator.cookieEnabled){
		alert('This page needs cookies for correct behavior. So please activate them in your browser.');
	} else if (goog.DEBUG) {
		console.log('Cookies are enabled');		
	}
};

/**
 * Opens a link in a modal
 * @param {string} modal_className
 * @param {Element} anchor_element
 */
VK2.Utils.loadLinkInModal = function(modal_className, anchor_element){
	var modal = new VK2.Utils.Modal(modal_className, document.body, true);
	
	// iteratore over modal_anchors and init the behavior for them
	goog.events.listen(anchor_element, goog.events.EventType.CLICK, function(e){
		try {	
			// parse the modal parameters
			var title = this.getAttribute('data-title');
			var classes = this.getAttribute('data-classes');
			var href = this.getAttribute('data-src');
	
			modal.open(title, classes, {
				'href':href,
				'classes':classes
			});
				
			// stopping the default behavior of the anchor 
			e.preventDefault();
		} catch (e) {
			if (goog.DEBUG){
				console.log('Error while trying to load remote page in modal.');
			}
		};
	});
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
 * @param {Element} element
 * @param {string} className
 */
VK2.Utils.getClosestParentElementForClass = function(element, className){
	var element = goog.dom.classes.has(element, className) ? element : 
		this.getClosestParentElementForClass(goog.dom.getParentElement(element), className);
	return element;
};


