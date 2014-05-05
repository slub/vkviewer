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
