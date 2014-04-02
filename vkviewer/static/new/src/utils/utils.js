goog.provide('VK2.Utils');

/**
 * This function encapsulate the json lang_dictionary from the locale javascript folder.
 * @static
 * @param key - {String}
 * @return {String}
 */
VK2.Utils.getMsg = function(key){
	try{
		if (goog.isDef(lang_dictionary)) return lang_dictionary[key];
	} catch (ReferenceError){
		console.log('Could not found dictionary.');
		return '';
	}
};