var validateDialogForm = function(username, email){
	var validationTipObj = $(document.getElementById('forgetDialogValidationTips'));
        		
    var isValide = true;
    isValide = isValide && checkUsername(username, validationTipObj);
    isValide = isValide && checkEmail(email, validationTipObj);
   		
    return isValide;
};
        	
var validateLoginForm = function(){
	var validationTipObj = $(document.getElementById('validationTips'))
	var username = $(document.getElementById('loginUsername'));
	var password = $(document.getElementById('loginPassword'));       		
	
	var isValide = true;
	isValide = isValide && checkUsername(username, validationTipObj);
	isValide = isValide && checkPassword(password, validationTipObj);
	
	return isValide;
};

var validateNewLoginForm = function(){
	var validationTipObj = $(document.getElementById('validationTips'))
	var username = $(document.getElementById('loginNewUsername'));
	var email = $(document.getElementById('loginNewEmail'));   
	var surname = $(document.getElementById('loginNewVorname'));
	var familyname = $(document.getElementById('loginNewNachname'));   
	var password = $(document.getElementById('loginNewPassword'));   

	var isValide = true;
	isValide = isValide && checkUsername(username, validationTipObj);
	isValide = isValide && checkEmail(email, validationTipObj);
	isValide = isValide && checkName(surname, validationTipObj, 'Vorname');
	isValide = isValide && checkName(familyname, validationTipObj, 'Nachname');
	isValide = isValide && checkPassword(password, validationTipObj);
	
	return isValide;
};

/**
 * The next code blog contains different functions for evaluation of the login form values
 * 
 * It is based on http://jqueryui.com/dialog/#modal-form
 */
var updateTips = function(validationTipObj, msg){
	validationTipObj.text( msg ).addClass( 'ui-state-highlight' );
	setTimeout(function(){
		validationTipObj.removeClass( 'ui-state-highlight', 1500);
	}, 500);
};

var checkLength = function( object, minLength, maxLength, validationTipObj, msg ){
	if (object.val().length > maxLength || object.val().length < minLength ){
		object.addClass( 'ui-state-error' );
		updateTips( validationTipObj, msg );
		return false;
	} else {
		if (object.hasClass( 'ui-state-error' ))
			object.removeClass( 'ui-state-error' );
		return true;
	}
};

var checkRegexp = function( object, regexp, validationTipObj, validationMsg ){
	if ( !( regexp.test( object.val() ))){
		object.addClass( 'ui-state-error' );
		updateTips( validationTipObj, validationMsg );
		return false;
	} else {
		if (object.hasClass( 'ui-state-error' ))
			object.removeClass( 'ui-state-error' );
		return true;
	}
};

var checkName = function( object, validationTipObj, tagName ){
	var isValide = true;
	
	isValide = isValide && checkLength( object, 3, 16, validationTipObj, "Der "+ tagName + " sollte zwischen" +
			" 3 und 16 Zeichen umfassen");
	isValide = isValide && checkRegexp( object, /^([a-zA-Z])+$/, validationTipObj, "Der Name sollte sich aus Buchstaben des Alphabets zusammensetzen");
	
	return isValide;
}

var checkUsername = function( object, validationTipObj ){
	var isValide = true;
	
	isValide = isValide && checkLength( object, 3, 16, validationTipObj, "Der Benutzername sollte zwischen" +
			" 3 und 16 Zeichen umfassen");
	isValide = isValide && checkRegexp( object, /^([0-9a-zA-Z])+$/, validationTipObj, "Der Benutzername sollte sich aus des Alphabets oder Zahlen zwischen 0 und 9 zusammensetzen");
	
	return isValide;
}

var checkPassword = function( object, validationTipObj ){
	var isValide = true;
	
	isValide = isValide && checkLength( object, 5, 16, validationTipObj, "Das Passwort sollte zwischen" +
			" 5 und 16 Zeichen umfassen");
	isValide = isValide && checkRegexp( object, /^([0-9a-zA-Z])+$/, validationTipObj, "Das Passwort sollte sich aus des Alphabets oder Zahlen zwischen 0 und 9 zusammensetzen");
	
	return isValide;
}

var checkEmail = function( object, validationTipObj ){
	var isValide = true;
	
	isValide = isValide && checkLength( object, 6, 80, validationTipObj, "Die Email sollte zwischen" +
			" 6 und 80 Zeichen umfassen");
	isValide = isValide && checkRegexp( object, /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i, validationTipObj, "z.B. Max.Mustermann@slub-dresden.de");
	
	return isValide;
}
