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

/**
 * @param {string} modal_id
 * @static
 * @TODO replace css names
 */
VK2.Utils.loadModalOverlayBehavior = function(className){
	var modal = goog.dom.getElement('vk2-modal');
	
	$(modal).on('hidden.bs.modal', function(e){
		console.log('Modal is closed!');
	})

	
//	var modals = goog.dom.getElementsByClass(className);
//	for (var i = 0; i < modals.length; i++){
//		var modal_ahref = modals[i];
//		var className = 'vk2-fancybox-wrapper';
//		
//		// this parse a class for setting the wide and high of the iframe
//		if (goog.isDefAndNotNull(modals[i].getAttribute('data-fancyclass')))
//			className += ' ' + modals[i].getAttribute('data-fancyclass') + '-page-container';
				
//		$(fancybox_ahref).fancybox({
//			'type': 'iframe',
//			'autoSize': false,
//			'wrapCSS': className,
//		});
//	};
};