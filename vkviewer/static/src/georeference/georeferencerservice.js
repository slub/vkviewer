goog.provide('vk2.georeference.GeoreferencerService');

goog.require('goog.net.XhrIo');
goog.require('vk2.settings');

/**
 * @static
 * @param {Object} data
 * @param {Function=} success_callback
 * @param {Function=} error_callback
 */
vk2.georeference.GeoreferencerService.requestValidationResult = function(data, success_callback, error_callback){
	if (goog.DEBUG){
		console.log('Validation request: ');
		console.log(data);
		//return undefined;
	};
	
	var callback = function(response){
		if (response.target.getStatus() === 200){
			success_callback(response);
			return;
		};
		error_callback(response);
		return;
	};
	
	goog.net.XhrIo.send(vk2.settings.GEOREFERENCE_VALIDATION, callback, 'POST', JSON.stringify(data), {'Content-Type':'application/json;charset=UTF-8'});	
	return undefined;
};

/**
 * @static
 * @param {Object} data
 * @param {Function=} success_callback
 * @param {Function=} error_callback
 */
vk2.georeference.GeoreferencerService.requestConfirmResult = function(data, success_callback, error_callback){
	if (goog.DEBUG){
		console.log('Confirmation request: ');
		console.log(data);
		//return undefined;
	};
	
	goog.net.XhrIo.send(vk2.settings.GEOREFERENCE_CONFIRM, success_callback, 'POST', JSON.stringify(data), {'Content-Type':'application/json;charset=UTF-8'});	
	return undefined;
};

/**
 * @static
 * @param {Object} data
 * @param {Function=} success_callback
 * @param {Function=} error_callback
 */
vk2.georeference.GeoreferencerService.requestUpdateResult = function(data, success_callback, error_callback){
	if (goog.DEBUG){
		console.log('Update request: ');
		console.log(data);
		//return undefined;
	};
	
	goog.net.XhrIo.send(vk2.settings.GEOREFERENCE_UPDATE, success_callback, 'POST', JSON.stringify(data), {'Content-Type':'application/json;charset=UTF-8'});	
	return undefined;
};
