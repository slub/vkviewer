/**
 * @fileoverview This object create a front end for a gazetteer service, so enable the user to search places
 * by there placenames. It also supports a blattnumber search.
 * @author Jacob.Mendt@slub-dresden.de (Jacob Mendt)
 * 
 * @TODO - consider the type of the poi (city, country, ...) for the choosing of the zoom level at the select event
 */
goog.provide('VK2.Tools.GazetteerSearch');
goog.provide('VK2.Tools.GazetteerSearch.EventType');

goog.require('goog.dom');
goog.require('goog.dom.classes');
goog.require('goog.events');
goog.require('goog.events.EventTarget');
goog.require('goog.events.Event');
goog.require('VK2.Utils');
goog.require('VK2.Validation');

/**
 * Create a front end for a gazetteer service
 * @param {Element} gazetteerElement
 * @constructor 
 * @extends {goog.events.EventTarget}
 */
VK2.Tools.GazetteerSearch = function(gazetteerElement){
	
	/**
	 * @type {Element}
	 * @private
	 */
	this._gazetteerElement = gazetteerElement;
	
	/**
	 * @type {Element}
	 * @private
	 */
	if (goog.isDef(this._gazetteerElement.parentElement)){
		this._parentElement = this._gazetteerElement.parentElement;
	};
	
	/**
	 * @param {Array.<Object>} data
	 */
	var defaultHandler = function(data){
		if (data.length > 0){
			debugger;
			var defaultObject = data[0];
			console.log(defaultObject);
		}
	};

	var this_ = this;
	$(gazetteerElement).autocomplete({
    	source: function( request, response ){
    		this_._requestData(request, response);
    	},
    	delay: 300,
        minLength: 3,
        autoFocus: true,
    	select: goog.bind(function( event, ui ){
    		var jumpto_event = {
    			'location_type':ui.item.type,
    			'lonlat':[ui.item.lonlat.x,ui.item.lonlat.y],
    			'srs':'EPSG:4326'
    		};
    		this.dispatchEvent(new goog.events.Event(VK2.Tools.GazetteerSearch.EventType.JUMPTO,jumpto_event));
    	}, this),
    	open: function(){
    		$( this ).removeClass( "ui-corner-all" ).addClass( "ui-corner-top" );
    	},
    	close: function(){
    		$( this ).removeClass( "ui-corner-top" ).addClass( "ui-corner-all" );
    	},
    })
//    .keydown(function(e){
//    	if (e.keyCode === 13){
//    		
//    		if (goog.DEBUG)
//    			console.log('Enter is pressed');
//    		
//    		if (this.value.length >= 3)
//    			this_._requestData({'term':this.value}, defaultHandler);
//    	};
//    });
	
	goog.base(this);
};
goog.inherits(VK2.Tools.GazetteerSearch, goog.events.EventTarget);

/**
 * @param {Object} request
 * @param {Function} response
 * @private
 */
VK2.Tools.GazetteerSearch.prototype._requestData = function(request, response){
	if (goog.DEBUG)
		console.log('request data is triggered');
	
	// only look for source if is not a blattnumber
	if (!VK2.Validation.isBlattnumber(request.term)){
		this._requestPlacenames(request.term, response);
	} else {
		// this prevents the normal loading behavior
		response();
		this._requestBlattnr(request.term, response);
	};
};

/**
 * @param {string} placename
 * @param {Function} response
 * @private
 */
VK2.Tools.GazetteerSearch.prototype._requestPlacenames = function(placename, response){
	$.ajax({
        url: 'http://open.mapquestapi.com/nominatim/v1/search.php',
        dataType: 'json',
        data: {
        	featureClass: "P",
        	style: "full",
        	maxRows: 8,
            format: 'json',
            q: placename,
            viewbox: '4.35,58.48,27.78,45.97',
            bounded: 1
        },
		success: function( data ){
			// data does the mapping of the response data to objects described below
			response( $.map( data, function( item ){
				return {
					label: item.display_name,
					value: item.display_name,
					lonlat: {'x':item.lon,'y':item.lat},
					type: item.type
				}
			}));
		}
	});
};

/**
 * @param {string} blattnr
 * @param {Function} response
 * @private
 */
VK2.Tools.GazetteerSearch.prototype._requestBlattnr = function(blattnr, response){
	$.ajax({
        url: '/vkviewer/proxy/?url=http://eiger.auf.uni-rostock.de/fgs/vkll/fragblattnr.php?blattnr='+blattnr,
        beforeSend: goog.bind(function(){ goog.dom.classes.add(this._gazetteerElement,'loading'); }, this),
        error: goog.bind(function(){
        	if (goog.dom.classes.has(this._gazetteerElement,'loading'))
        		goog.dom.classes.remove(this._gazetteerElement,'loading');
        }, this),
		success: goog.bind(function( data ){	    				
			if (data != ''){
				var point = JSON.parse(data);
	    		var event = {
	        		'location_type':'blattnr',
	        		'lonlat':[point.coordinates[0],point.coordinates[1]],
	        		'srs':'EPSG:4326'
	        	};
	        	this.dispatchEvent(new goog.events.Event(VK2.Tools.GazetteerSearch.EventType.JUMPTO,event));
			} else {
				alert(VK2.Utils.getMsg('noResultsBlattnr'));
			};
			
			if (goog.dom.classes.has(this._gazetteerElement,'loading'))
        		goog.dom.classes.remove(this._gazetteerElement,'loading');
		}, this)
	});
};

/**
 * @param {Object} event_object
 */
VK2.Tools.GazetteerSearch.prototype.dispatchJumpToEvent = function(event_object){
	var event = goog.isDef(event_object) ? new goog.events.Event(VK2.Tools.GazetteerSearch.JUMPTO,event_object) :
		 new goog.events.Event(VK2.Tools.GazetteerSearch.JUMPTO);
	this.dispatchEvent(event);
};

/**
 * @enum {string}
 */
VK2.Tools.GazetteerSearch.EventType = {
		JUMPTO: 'jumpto'
};

///**
// * @param {Element} parentElement
// * @param {Element} gazetteerElement
// */
//VK2.Tools.GazetteerSearch.prototype._loadSubmitBehavior = function(parentElement, gazetteerElement){
//	
//	var submitBtn = goog.dom.getElementsByTagNameAndClass('BUTTON', 'gazetteer-submit-button', parentElement)
//	
//	if (goog.isDef(submitBtn)){
//		$(submitBtn).click(function(e){
//			$(gazetteerElement).data('ui-autocomplete')._trigger('select');
//		})
//		console.log('Add submit Button to Gazetteersearch.');
//	}
//}

