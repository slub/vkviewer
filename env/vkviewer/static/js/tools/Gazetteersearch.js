/**
 * @fileoverview This object create a front end for a gazetteer service, so enable the user to search places
 * by there placenames. It also supports a blattnumber search.
 * @author Jacob.Mendt@slub-dresden.de (Jacob Mendt)
 * 
 * @TODO - consider the type of the poi (city, country, ...) for the choosing of the zoom level at the select event
 */

goog.provide('VK2.Tools.Gazetteersearch')

goog.require('goog.dom');

/**
 * Create a front end for a gazetteer service
 * @param {Element} gazetteerElement
 * @param {Object} map OpenLayers.Map
 * @constructor 
 */
VK2.Tools.Gazetteersearch = function(gazetteerElement, map, withSubmit){
	
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
	
	/**
	 * @type {Object}
	 * @private
	 */
	this._map = map;
	
	console.log('Load Gazetteersearch.')
	this._loadGazetteerBehavior(this._gazetteerElement, this._map);
	//this._loadSubmitBehavior(this._parentElement, this._gazetteerElement)
}

/**
 * @param {Element} gazetteerElement
 * @param {Object} map OpenLayers.Map
 */
VK2.Tools.Gazetteersearch.prototype._loadGazetteerBehavior = function(gazetteerElement, map){
	
	var _map = map;
	
	/**
	 * @param {OpenLayers.LonLat} lonlat
	 * @param {number} zoom
	 */
	var jumpToLotLat = function(lonlat, zoom){
		_map.setCenter(lonlat, zoom);
		var activateSearch = goog.dom.getElement(VK2.Utils.Settings.DOM.idControlSearchMap);
		if (goog.isDefAndNotNull(activateSearch))
			activateSearch.click();
	};

	
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
	    						lonlat: new OpenLayers.LonLat(item.lon,item.lat),
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
	                url: '/vkviewer/proxy/?url=http://139.30.111.16/fgs/vkll/fragblattnr.php?blattnr='+request.term,
	    			success: $.proxy(function( data ){
	    				if (data != ''){
	    					var point = JSON.parse(data);
	    					VK2.Utils.jumptolonlat(_map, point.coordinates[0], point.coordinates[1], 12);
	    				} else {
	    					alert(VK2.Utils.get_I18n_String('noResultsBlattnr'));
	    				}
	    			}, this)
	    		});
    		}
    	},
    	delay: 500,
        minLength: 3,
        autoFocus: true,
    	select: function( event, ui ){
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
}

/**
 * @param {Element} parentElement
 * @param {Element} gazetteerElement
 */
VK2.Tools.Gazetteersearch.prototype._loadSubmitBehavior = function(parentElement, gazetteerElement){
	
	var submitBtn = goog.dom.getElementsByTagNameAndClass('BUTTON', 'gazetteer-submit-button', parentElement)
	
	if (goog.isDef(submitBtn)){
		$(submitBtn).click(function(e){
			$(gazetteerElement).data('ui-autocomplete')._trigger('select');
		})
		console.log('Add submit Button to Gazetteersearch.');
	}
}

