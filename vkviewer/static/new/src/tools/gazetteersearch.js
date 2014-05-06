/**
 * @fileoverview This object create a front end for a gazetteer service, so enable the user to search places
 * by there placenames. It also supports a blattnumber search.
 * @author Jacob.Mendt@slub-dresden.de (Jacob Mendt)
 * 
 * @TODO - consider the type of the poi (city, country, ...) for the choosing of the zoom level at the select event
 */
goog.provide('VK2.Tools.GazetteerSearch')
goog.provide('VK2.Tools.GazetteerSearch.EventType');

goog.require('goog.dom');
goog.require('goog.dom.classes');
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
	}

	$(gazetteerElement).autocomplete({
    	source: function( request, response ){
    		// only look for source if is not a blattnumber
    		if (!VK2.Validation.isBlattnumber(request.term)){
	    		$.ajax({
	                url: 'http://open.mapquestapi.com/nominatim/v1/search.php',
	                dataType: 'json',
	                data: {
	                	featureClass: "P",
	                	style: "full",
	                	maxRows: 8,
	                    format: 'json',
	                    q: request.term,
	                    viewbox: '4.35,58.48,27.78,45.97',
	                    bounded: 1
	                },
	    			success: function( data ){
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
    		} else {
    			// this prevents the normal loading behavior
    			response();
    	    	// this event is important for handling the blattnumber search
	    		$.ajax({
	                url: '/vkviewer/proxy/?url=http://eiger.auf.uni-rostock.de/fgs/vkll/fragblattnr.php?blattnr='+request.term,
	    			success: $.proxy(function( data ){
	    				if (data != ''){
	    					var point = JSON.parse(data);
	    					debugger;
	    					VK2.Utils.jumptolonlat(_map, point.coordinates[0], point.coordinates[1], 5);
	    				} else {
	    					alert(VK2.Utils.getMsg('noResultsBlattnr'));
	    				}
	    			}, this)
	    		});
    		}
    	},
    	delay: 500,
        minLength: 3,
        autoFocus: true,
    	select: function( event, ui ){
    		debugger;
    		switch (ui.item.type){
    			case 'administrative':
    				jumpToLotLat(ui.item.lonlat.transform(new OpenLayers.Projection("EPSG:4326"),map.getProjectionObject()), 4);
    				break;
    			case 'city':
    				jumpToLotLat(ui.item.lonlat.transform(new OpenLayers.Projection("EPSG:4326"),map.getProjectionObject()), 4);
    				break;
    			case 'village':
    				jumpToLotLat(ui.item.lonlat.transform(new OpenLayers.Projection("EPSG:4326"),map.getProjectionObject()), 4);
    			default:
    				jumpToLotLat(ui.item.lonlat.transform(new OpenLayers.Projection("EPSG:4326"),map.getProjectionObject()), 6);
    		}
    	},
    	open: function(){
    		$( this ).removeClass( "ui-corner-all" ).addClass( "ui-corner-top" );
    	},
    	close: function(){
    		$( this ).removeClass( "ui-corner-top" ).addClass( "ui-corner-all" );
    	},
    });
	
	goog.base(this);
};
goog.inherits(VK2.Tools.GazetteerSearch, goog.events.EventTarget);

/**
 * @param {Object} event_object
 */
VK2.Tools.GazetteerSearch.prototype.dispatchJumpToEvent = function(event_object){
	var event = goog.isDef(event_object) ? new goog.events.Event('jumpto',event_object) :
		 new goog.events.Event('jumpto');
	this.dispatchEvent(event);
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

