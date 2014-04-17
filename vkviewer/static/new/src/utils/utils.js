goog.provide('VK2.Utils');

goog.require('goog.dom');

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

