/*
vk20-georef-wms.js

Library which contains a couple of functions and operations for communication with the backend side and for giving usefuls tools to the user.

Author: Jacob Mendt

*/
////////////////////////////////////////////////
// Functions for user controlling
// 

////////////////////////////////////////////////
// Functions for parsing and displaying data
//
/* jump to point (lon/lat) on map */
function jumptolonlat(map,lon,lat){
       var LonLat = new OpenLayers.LonLat(lon,lat).transform(new OpenLayers.Projection("EPSG:4326"),map.getProjectionObject());
       map.setCenter(LonLat,12);
       return true;
}

/* javascript functions from selfhtml */
function encode_utf8(rohtext) {
     // dient der Normalisierung des Zeilenumbruchs
     rohtext = rohtext.replace(/\r\n/g,"\n");
     var utftext = "";
    for(var n=0; n<rohtext.length; n++)
         {
        // ermitteln des Unicodes des  aktuellen Zeichens
        var c=rohtext.charCodeAt(n);
        // alle Zeichen von 0-127 => 1byte
         if (c<128)
             utftext += String.fromCharCode(c);
        // alle Zeichen von 127 bis 2047 => 2byte
         else if((c>127) && (c<2048)) {
            utftext += String.fromCharCode((c>>6)|192);
             utftext += String.fromCharCode((c&63)|128);}
         // alle Zeichen von 2048 bis 66536 => 3byte
         else {
             utftext += String.fromCharCode((c>>12)|224);
             utftext += String.fromCharCode(((c>>6)&63)|128);
            utftext += String.fromCharCode((c&63)|128);}
         }
   return utftext;
}

function decode_utf8(utftext) {
     var plaintext = ""; var i=0; var c=c1=c2=0;
    // while-Schleife, weil einige Zeichen uebersprungen werden
     while(i<utftext.length)
         {
         c = utftext.charCodeAt(i);
        if (c<128) {
             plaintext += String.fromCharCode(c);
             i++;}
         else if((c>191) && (c<224)) {
             c2 = utftext.charCodeAt(i+1);
             plaintext += String.fromCharCode(((c&31)<<6) | (c2&63));
             i+=2;}
         else {
             c2 = utftext.charCodeAt(i+1); c3 = utftext.charCodeAt(i+2);
             plaintext += String.fromCharCode(((c&15)<<12) | ((c2&63)<<6) | (c3&63));
             i+=3;}
         }
     return plaintext;
}

/* 
 * see: http://addyosmani.com/resources/essentialjsdesignpatterns/book/#observerpatternjavascript
 * Publish/SubscribeImplementation
 */
var PubSub = {};

(function(q){

    var topics = {},
        subUid = -1;
        
    // Publish or broadcast events of interest with a specific topic name and
    // arguments such as the data to pass along
    q.publish = function( topic, args ){
      
        if ( !topics[topic] ){
            return false;
        }
        
        var subscribers = topics[topic],
            len = subscribers ? subscribers.length : 0;
        
        while (len--){
            subscribers[len].func( topic, args );
        }
        
        return this;
    };
    
    // Subscribe to events of interest with a specific topic name and a 
    // callback function, to be exectued when the topic/event is observed
    q.subscribe = function( topic, func ){
        
        if (!topics[topic]){
            topics[topic] = [];
        }
        
        var token = ( ++subUid ).toString();
        topics[topic].push({
            token: token,
            func: func
        });
        return token;
    }
    
    q.unsubscribe = function( token ){
        for ( var m in topics ){
            if ( topics[m] ){
                for (var i = 0, j = topics[m].length; i < j; i++){
                    if ( topics[m][i].token === token){
                        topics[m].splice( i, 1 );
                        return token;
                    }
                }
            }
        }
        return this;
    };
}( PubSub ));

/**
 * methode: Class
 * 
 * @param {type} methods
 * @returns {Class.classObj}
 * 
 * Creates a class for a given javascript object
 */
var Class = function(methods){
    classObj = function(){
        this.initialize.apply(this, arguments);
    };
    
    for (var property in methods){
        classObj.prototype[property] = methods[property];
    }
    
    if (!classObj.prototype.initialize) classObj.prototype.initialize = function(){};
    
    return classObj;
}

/**
 * function: get_url_param
 * 
 * @param {String} name
 * @returns {String}
 * 
 * This function parse the value for a given query parameter from get request
 */
var get_url_param = function( name ){
	name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");

	var regexS = "[\\?&]"+name+"=([^&#]*)";
	var regex = new RegExp( regexS );
	var results = regex.exec( window.location.href );

	if ( results == null )
		return "";
	else
	return results[1];
}

/**
 * function: getHost
 * 
 * @params {String} subdomain
 * @returns {String} - host domain + port + subdomain
 */
var getHost = function(subdomain){
	var host = location.protocol+'//'+location.hostname+(location.port ? ':'+location.port: '');
	if (subdomain.charAt(0) == "/")
		return host+subdomain;
	else
		return host + "/" + subdomain;
}

/**
 * function: routeToTop
 * 
 * @param {String} url
 */
var routeToTop = function(url){
	var a = document.createElement('a');
	a.href = url;
	a.target = '_top';
	document.body.appendChild(a);
	a.click();
}

/** 
 * function: fixControlConflictsOnOLMap
 * 
 * @param - event {OpenLayers.Event}
 */
var fixControlConflictsOnOLMap = function(control){
    // this two rows are important for allowing click and drag the main map 
    // on a selection
    if (typeof(control.handlers) != "undefined") { // OL 2.7
    	control.handlers.feature.stopDown = false;
     } else if (typeof(control.handler) != "undefined") { // OL < 2.7
    	 control.handler.stopDown = false; 
    	 control.handler.stopUp = false; 
     }
}

/**
 * function: getDictionaryValues
 *
 * @param - dict {Object}
 */ 
var getDictionaryValues = function(dictionary){
	list =  [];
	for (var key in dictionary){
		list.push(dictionary[key]);
		return list;
	}
}