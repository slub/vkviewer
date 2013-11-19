VK2.Utils = {
		/**
		 * Function: jumptolonlat
		 * Jumps to the given longitude / latitude coordiantes
		 * 
		 * @param map {OpenLayers.Map}
		 * @param lon {Float}
		 * @param lat {Float}
		 */
		jumptolonlat: function(map,lon,lat){
		       var LonLat = new OpenLayers.LonLat(lon,lat).transform(new OpenLayers.Projection("EPSG:4326"),map.getProjectionObject());
		       map.setCenter(LonLat,12);
		       return true;
		},

		/* javascript functions from selfhtml */
		encode_utf8: function(rohtext) {
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
		},

		decode_utf8: function(utftext) {
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
		},

		/**
		 * Function: get_url_param
		 * This function parse the value for a given query parameter from get request
		 * 
		 * @param {String} name
		 * @returns {String}
		 */
		get_url_param: function( name ){
			name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");

			var regexS = "[\\?&]"+name+"=([^&#]*)";
			var regex = new RegExp( regexS );
			var results = regex.exec( window.location.href );

			if ( results == null )
				return "";
			else
			return results[1];
		},

		/**
		 * Function: getHost
		 * 
		 * @params {String} subdomain
		 * @returns {String} - host domain + port + subdomain
		 */
		getHost: function(subdomain){
			var host = location.protocol+'//'+location.hostname+(location.port ? ':'+location.port: '');
			if (subdomain.charAt(0) == "/")
				return host+subdomain;
			else
				return host + "/" + subdomain;
		},

		/**
		 * function: routeToTop
		 * 
		 * @param {String} url
		 */
		routeToTop: function(url){
			var a = document.createElement('a');
			a.href = url;
			a.target = '_top';
			document.body.appendChild(a);
			a.click();
		},

		/** 
		 * function: fixControlConflictsOnOLMap
		 * 
		 * @param - event {OpenLayers.Event}
		 */
		fixControlConflictsOnOLMap: function(control){
		    // this two rows are important for allowing click and drag the main map 
		    // on a selection
		    if (typeof(control.handlers) != "undefined") { // OL 2.7
		    	control.handlers.feature.stopDown = false;
		     } else if (typeof(control.handler) != "undefined") { // OL < 2.7
		    	 control.handler.stopDown = false; 
		    	 control.handler.stopUp = false; 
		     }
		},

		/**
		 * function: getDictionaryValues
		 *
		 * @param - dict {Object}
		 */ 
		getDictionaryValues: function(dictionary){
			list =  [];
			for (var key in dictionary){
				list.push(dictionary[key]);
				return list;
			}
		},

		/**
		 * Function: get_I18n_String
		 * This function encapsulate the json lang_dictionary from the locale javascript folder.
		 * 
		 * @param key - {String}
		 * @return {String}
		 */
		get_I18n_String: function(key){
			return lang_dictionary[key];
		}
};

