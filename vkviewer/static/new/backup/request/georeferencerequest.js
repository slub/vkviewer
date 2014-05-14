goog.provide('VK2.Requests.Georeferencer');

goog.require('goog.net.XhrIo');
goog.require("goog.Uri.QueryData");

/**
 * @static
 * @param {number} mtbid
 * @param {string|undefined} georef_params
 * @param {number|undefined} georefid
 * @param {function|undefined} callback
 */
VK2.Requests.Georeferencer.submit = function(mtbid, georef_params, georefid, callback){
	
	if (goog.isDef(mtbid) && goog.isDef(georef_params)){
		console.log('Pure submit.');
	} else if (goog.isDef(mtbid) && goog.isDef(georefid)){
		console.log('Submit validation.');
	}
}

/**
 * @static
 * @param {string} url
 * @param {number} mtbid
 * @param {string} georef_params
 * @param {Function=} success_callback
 * @param {Function=} error_callback
 */
VK2.Requests.Georeferencer.validate = function(url, mtbid, georef_params, success_callback, error_callback){

	
	var url = url + '?mtbid='+mtbid+'&points='+georef_params;
	this._sendRequest(url, success_callback, error_callback);
	return undefined;
};

/**
 * @static
 * @param {string} url
 * @param {number} mtbid
 * @param {string|undefined} georef_params
 * @param {string|undefined} georef_id
 * @param {Function=} success_callback
 * @param {Function=} error_callback
 */
VK2.Requests.Georeferencer.submit = function(url, mtbid, georef_params, georef_id, success_callback, error_callback){

	if (goog.isDef(georef_params)){
		var url = url + '?mtbid='+mtbid+'&points='+georef_params;
		this._sendRequest(url, success_callback, error_callback);
		return undefined;
	} else if (goog.isDef(georef_id)){
		var url = url + '?mtbid='+mtbid+'&georefid='+georef_id;
		this._sendRequest(url, success_callback, error_callback);
		return undefined;
	}
};

/**
 * @param {string} url
 * @param {Function=} success_callback
 * @param {Function=} error_callback
 * @static
 */
VK2.Requests.Georeferencer.getExtentForWMS = function(wms_url, success_callback, error_callback){
	
	var url = wms_url + "&VERSION=1.1.1&SERVICE=WMS&REQUEST=GetCapabilities";
	this._sendRequest(url, success_callback, error_callback);
	return undefined;
};

/**
 * @static
 * @param {string} url
 * @param {Function=} success_callback
 * @param {Function=} error_callback
 */
VK2.Requests.Georeferencer._sendRequest = function(url,success_callback, error_callback){
	
	// create request object
	var xhr = new goog.net.XhrIo();
	
	// add listener to request object
	goog.events.listenOnce(xhr, 'success', function(e){
		var xhr = /** @type {goog.net.XhrIo} */ (e.target);
		var data = xhr.getResponseText() ? xhr.getResponseText() : '';
		xhr.dispose();
		
		if (goog.isDef(success_callback))
			success_callback(data);
	}, false, this);
	
	goog.events.listenOnce(xhr, 'error', function(e){
		var xhr = /** @type {goog.net.XhrIo} */ (e.target);
		if (goog.isDef(error_callback))
			error_callback(e);
	}, false, this);
	
	// send request
	xhr.send(url);	
};


