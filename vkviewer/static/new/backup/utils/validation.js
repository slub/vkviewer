goog.provide('vk2.validation');

goog.require('goog.dom');
goog.require('goog.dom.classes');

/**
 * Checks if a string represents a messtischblatt blattnumber
 * @param {string} string
 * @return {boolean}
 */
vk2.validation.isBlattnumber = function(string){
	var blattNrParts = [];
	
	var hasDoublePoints = (string.indexOf(':') !== -1)
	var hasUnderscore = (string.indexOf('_') !== -1)
	
	blattNrParts  = hasDoublePoints ? string.split(':') : hasUnderscore ? string.split('_') : [];
	
	if (blattNrParts.length == 2){
		areNumbers = true;
		areNumbers = areNumbers && this.isInt(blattNrParts[0]) ? true : false;
		areNumbers = areNumbers && this.isInt(blattNrParts[1]) ? true : false;
		
		areNumbers = areNumbers && blattNrParts[0].length <= 3 ? true : false;
		areNumbers = areNumbers && blattNrParts[1].length <= 3 ? true : false;
		
		//console.log(blattNrParts + " is "+areNumbers);
		return areNumbers;
	} else {
		return false;
	}
};

/**
 * Checks if a string represents a integer.
 * @param {string} string
 * @return {boolean}
 */
vk2.validation.isInt = function(string){
	isValideInteger = /^[0-9]+$/.test(string);
	return isValideInteger;
};

/**
 * Checks the length of an string
 * @param {string} string
 * @return {boolean}
 */
vk2.validation.checkLength = function( string, minLength, maxLength ){
	var isValide =  (string.length > maxLength || string.length < minLength ) ? false : true;
	return isValide;
};

/**
 * Checks if a string matchs the pattern of a regular expression
 * @param {string} string
 * @return {boolean}
 */
vk2.validation.checkRegexp = function( string, regexp ){
	var isValide = regexp.test(string) ? true : false;
	return isValide;
}

/**
 * Set error message
 * @param {string} msg
 * @param {string=} failureElementId The id of a dom element where to write the failure message
 * @param {string=} failureClass The failure class
 */
vk2.validation.setErrorMsg = function(msg, failureElementId, failureClass){
	var failureElement = goog.dom.getElement(failureElementId);
	if (goog.isDef(failureElement)){
		failureElement.innerHTML = msg;
		goog.dom.classes.add(failureElement, failureClass);
	}
};

/**
 * Checks if a string match the criteria for a validate password
 * @param {string} elementId The id of an input field which holds the password
 * @param {string=} failureElementId The id of a dom element where to write the failure message
 * @param {string=} failureClass The failure class
 * @return {boolean}
 */ 
vk2.validation.checkPassword = function( elementId, failureElementId, failureClass ){
	var password = goog.dom.getElement(elementId);
	var isValide = true;
	
	// remove old success / error class from element
	if (goog.dom.classes.has(password.parentElement, 'has-success') || goog.dom.classes.has(password.parentElement, 'has-error')){
		goog.dom.classes.remove(password.parentElement, 'has-error');
		goog.dom.classes.remove(password.parentElement, 'has-success');
	}
	
	isValide = isValide && goog.isDefAndNotNull(password);
	
	// check length
	isValide = isValide && this.checkLength( password.value, 5, 16)
	if (goog.isDef(failureElementId) && goog.isDef(failureClass) && !isValide){
		this.setErrorMsg(VK2.Utils.getMsg('password_to_short'), failureElementId, failureClass);
		goog.dom.classes.add(password.parentElement, 'has-error');
		return isValide;
	};
	
	// check tokens
	isValide = isValide && this.checkRegexp( password.value, /^([0-9a-zA-Z])+$/);
	if (goog.isDef(failureElementId) && goog.isDef(failureClass) && !isValide){
		this.setErrorMsg(VK2.Utils.getMsg('password_wrong_token'), failureElementId, failureClass);
		goog.dom.classes.add(password.parentElement, 'has-error');
		return isValide
	};

	if (goog.isDef(failureElementId) && goog.isDef(failureClass) && isValide){
		goog.dom.classes.remove(goog.dom.getElement(failureElementId), failureClass);
		goog.dom.classes.remove(password.parentElement, 'has-error');
		goog.dom.classes.add(password.parentElement, 'has-success');
	}
	
	return isValide;
}

/**
 * Checks if the both passwords match each other
 * @param {string} elementId_Pw1 The id of an input field which holds the password
 * @param {string} elementId_Pw2 The id of an input field which holds the password
 * @param {string=} failureElementId The id of a dom element where to write the failure message
 * @param {string=} failureClass The failure class
 * @return {boolean}
 */ 
vk2.validation.checkPasswordMatch = function( elementId_Pw1, elementId_Pw2, failureElementId, failureClass ){
	
	var password_1 = goog.dom.getElement(elementId_Pw1);
	var password_2 = goog.dom.getElement(elementId_Pw2);
	
	// remove old success / error class from element
	if (goog.dom.classes.has(password_2.parentElement, 'has-success') || goog.dom.classes.has(password_2.parentElement, 'has-error')){
		goog.dom.classes.remove(password_2.parentElement, 'has-error');
		goog.dom.classes.remove(password_2.parentElement, 'has-success');
	}
	
	// check if password match's each other
	var isValide = true;
	isValide = isValide && goog.isDefAndNotNull(password_1) && goog.isDefAndNotNull(password_2);
	isValide = isValide && (password_1.value == password_2.value)
	if (goog.isDef(failureElementId) && goog.isDef(failureClass) && !isValide){
		this.setErrorMsg(VK2.Utils.getMsg('password_is_same'), failureElementId, failureClass);
		goog.dom.classes.add(password_2.parentElement, 'has-error');
		return isValide
	};

	if (goog.isDef(failureElementId) && goog.isDef(failureClass) && isValide){
		goog.dom.classes.remove(goog.dom.getElement(failureElementId), failureClass);
		goog.dom.classes.remove(password_2.parentElement, 'has-error');
		goog.dom.classes.add(password_2.parentElement, 'has-success');
	}
	
	return isValide
	
}

/**
 * Checks if a string match the criteria for a validate username
 * @param {string} elementId The id of an input field which holds the password
 * @param {string=} failureElementId The id of a dom element where to write the failure message
 * @param {string=} failureClass The failure class
 * @return {boolean}
 */ 
vk2.validation.checkUsername = function( elementId, failureElementId, failureClass ){
	
	var username = goog.dom.getElement(elementId);
	var isValide = true;
	
	// remove old success / error class from element
	if (goog.dom.classes.has(username.parentElement, 'has-success') || goog.dom.classes.has(username.parentElement, 'has-error')){
		goog.dom.classes.remove(username.parentElement, 'has-error');
		goog.dom.classes.remove(username.parentElement, 'has-success');
	}
	
	isValide = isValide && goog.isDefAndNotNull(username);
	
	// check length
	isValide = isValide && this.checkLength( username.value, 3, 16)
	if (goog.isDef(failureElementId) && goog.isDef(failureClass) && !isValide){
		this.setErrorMsg(VK2.Utils.getMsg('username_to_short'), failureElementId, failureClass);
		goog.dom.classes.add(username.parentElement, 'has-error');
		return isValide;
	};
	
	// check tokens
	isValide = isValide && this.checkRegexp( username.value, /^([0-9a-zA-Z])+$/);
	if (goog.isDef(failureElementId) && goog.isDef(failureClass) && !isValide){
		this.setErrorMsg(VK2.Utils.getMsg('username_wrong_token'), failureElementId, failureClass);
		goog.dom.classes.add(username.parentElement, 'has-error');
		return isValide
	};

	// update error classes for the form
	if (goog.isDef(failureElementId) && goog.isDef(failureClass) && isValide){
		goog.dom.classes.remove(goog.dom.getElement(failureElementId), failureClass);
		goog.dom.classes.remove(username.parentElement, 'has-error');
		goog.dom.classes.add(username.parentElement, 'has-success');
	}
	
	return isValide;

}

/**
 * Checks if a string match the criteria for a validate person name
 * @param {string} elementId The id of an input field which holds the password
 * @param {string=} failureElementId The id of a dom element where to write the failure message
 * @param {string=} failureClass The failure class
 * @return {boolean}
 */ 
vk2.validation.checkPersonName = function( elementId, failureElementId, failureClass ){
	
	var name = goog.dom.getElement(elementId);
	var isValide = true;
	
	// remove old success / error class from element
	if (goog.dom.classes.has(name.parentElement, 'has-success') || goog.dom.classes.has(name.parentElement, 'has-error')){
		goog.dom.classes.remove(name.parentElement, 'has-error');
		goog.dom.classes.remove(name.parentElement, 'has-success');
	}
	
	isValide = isValide && goog.isDefAndNotNull(name);
	
	// check length
	isValide = isValide && this.checkLength( name.value, 3, 16)
	if (goog.isDef(failureElementId) && goog.isDef(failureClass) && !isValide){
		this.setErrorMsg(VK2.Utils.getMsg('personname_to_short'), failureElementId, failureClass);
		goog.dom.classes.add(name.parentElement, 'has-error');
		return isValide;
	};
	
	// check tokens
	isValide = isValide && this.checkRegexp( name.value, /^([a-zA-Z])+$/);
	if (goog.isDef(failureElementId) && goog.isDef(failureClass) && !isValide){
		this.setErrorMsg(VK2.Utils.getMsg('personname_wrong_token'), failureElementId, failureClass);
		goog.dom.classes.add(name.parentElement, 'has-error');
		return isValide
	};

	// update error classes for the form
	if (goog.isDef(failureElementId) && goog.isDef(failureClass) && isValide){
		goog.dom.classes.remove(goog.dom.getElement(failureElementId), failureClass);
		goog.dom.classes.remove(name.parentElement, 'has-error');
		goog.dom.classes.add(name.parentElement, 'has-success');
	}
	
	return isValide;
}

/**
 * Checks if a string match the criteria for a validate email adress
 * @param {string} elementId The id of an input field which holds the password
 * @param {string=} failureElementId The id of a dom element where to write the failure message
 * @param {string=} failureClass The failure class
 * @return {boolean}
 */ 
vk2.validation.checkEmailAdress = function( elementId, failureElementId, failureClass ){
	
	var email = goog.dom.getElement(elementId);
	var isValide = true;
	
	// remove old success / error class from element
	if (goog.dom.classes.has(email.parentElement, 'has-success') || goog.dom.classes.has(email.parentElement, 'has-error')){
		goog.dom.classes.remove(email.parentElement, 'has-error');
		goog.dom.classes.remove(email.parentElement, 'has-success');
	}
	
	isValide = isValide && goog.isDefAndNotNull(email);
	
	// check length
	isValide = isValide && this.checkLength( email.value, 6, 80)
	if (goog.isDef(failureElementId) && goog.isDef(failureClass) && !isValide){
		this.setErrorMsg(VK2.Utils.getMsg('email_to_short'), failureElementId, failureClass);
		goog.dom.classes.add(email.parentElement, 'has-error');
		return isValide;
	};
	
	// check tokens
	regexp_email = /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i;
	isValide = isValide && this.checkRegexp( email.value, regexp_email);
	if (goog.isDef(failureElementId) && goog.isDef(failureClass) && !isValide){
		this.setErrorMsg(VK2.Utils.getMsg('email_wrong_token'), failureElementId, failureClass);
		goog.dom.classes.add(email.parentElement, 'has-error');
		return isValide
	};

	// update error classes for the form
	if (goog.isDef(failureElementId) && goog.isDef(failureClass) && isValide){
		goog.dom.classes.remove(goog.dom.getElement(failureElementId), failureClass);
		goog.dom.classes.remove(email.parentElement, 'has-error');
		goog.dom.classes.add(email.parentElement, 'has-success');
	}
	
	return isValide;
}