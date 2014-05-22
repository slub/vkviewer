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
	goog.net.XhrIo.send(vk2.settings.GEOREFERENCE_VALIDATION, success_callback, 'POST', JSON.stringify(data), {'Content-Type':'application/json;charset=UTF-8'});	
	return undefined;
};


