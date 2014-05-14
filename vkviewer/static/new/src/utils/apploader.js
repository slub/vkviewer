goog.provide('vk2.utils.AppLoader');

goog.require('goog.dom');
goog.require('goog.events');
goog.require('goog.events.EventType');

goog.require('vk2.settings');
goog.require('vk2.utils');
goog.require('vk2.utils.Modal');
goog.require('vk2.controller.MapController');
goog.require('vk2.module.SpatialTemporalSearchModule');
goog.require('vk2.layer.MapSearch');
//goog.require('VK2.Module.LayerBarModule');
//goog.require('VK2.Module.ChooseGeoreferenceMapModule');
//goog.require('VK2.Layer.HistoricMap');
//goog.require('VK2.Tools.GazetteerSearch');
//goog.require('VK2.Tools.GazetteerSearch.EventType');


/**
 * @param {Object} settings Contains key/value pairs representing the settings
 * @param {Object} init_conf Initialise configuration object, which holds information over the mapping services, etc.
 * @constructor
 * @export
 */
vk2.utils.AppLoader = function(settings){
	
	vk2.utils.checkIfCookiesAreEnabble();
	vk2.utils.AppLoader.loadModalOverlayBehavior('vk2-modal-anchor');
	
	// initialize map
	var map_controller = new vk2.controller.MapController(vk2.settings.MAIN_MAP_SETTINGS, 'mapdiv');
	
	// load modules
	var featureOverlay = new ol.FeatureOverlay({
		map: map_controller.getMap(),
		style: function(feature, resolution) {
		    return [new ol.style.Style({
		        stroke: new ol.style.Stroke({
		        	color: '#f00',
		        	width: 1
		        }),
		        fill: new ol.style.Fill({
		        	color: 'rgba(255,0,0,0.1)'
		        })
		      })
		    ];
		}	
	});
	var spatialSearch = new vk2.module.SpatialTemporalSearchModule('vk2MapPanel', featureOverlay);
	map_controller.registerSpatialTemporalSearch(spatialSearch);

	
	if(goog.DEBUG){
		window['map'] = map_controller.getMap();
		
		// load dummy data
		var url = 'http://localhost:8080/vkviewer/static/new/test_pages/wfs.xml';
		var parser = new ol.format.WFS(vk2.settings.WFS_PARSER_CONFIG['mtbows'])
		goog.net.XhrIo.send(url, goog.bind(function(e){
			var xhr = /** @type {goog.net.XhrIo} */ (e.target);
			var data = xhr.getResponseXml() ? xhr.getResponseXml() : xhr.getResponseText();
			xhr.dispose();
			var features = parser.readFeatures(data);
			spatialSearch.getMapSearchModule().updateFeatures(features); 

		}));
		
		// test listeners
		goog.events.listen(spatialSearch.getMapSearchModule(), 'addmtb', function(event){
			console.log(event);
		});
		goog.events.listen(spatialSearch.getGazetteerSearchTool(), 'jumpto', function(event){
			console.log(event);
		});
		goog.events.listen(spatialSearch.getTimesliderTool(), 'timechange', function(event){
			console.log(event);
		});
		
		// test mapsearch layer
//		var mapsearchLayer = new vk2.layer.MapSearch({
//			'projection':'EPSG:900913',
//			'loading_start': function(e){
//				console.log('Load start');
//			},
//			'loading_end': function(e){
//				console.log('Load end');
//			}
//		});
//		map.addLayer(mapsearchLayer);
	}
//	
//	// load module
//	var spatialsearch = new VK2.Module.SpatialSearchModule({
//		'map':map_controller.getMap(),
//		'panel_id': 'vk2LayersearchPanel',
//		'control_id': 'vk2LayersearchControl',
//		'parentEl': sidebar_controller.getContentElement()
//	});
//	sidebar_controller.registerModule(spatialsearch);
//	
//	var layerbar = new VK2.Module.LayerBarModule({
//		'map':map_controller.getMap(),
//		'panel_id': 'vk2LayerbarPanel',
//		'control_id': 'vk2LayerbarControl',
//		'parentEl': sidebar_controller.getContentElement()
//	});
//	sidebar_controller.registerModule(layerbar);
//	
//	var gazetter = new VK2.Tools.GazetteerSearch(document.getElementById('vk2GazetteerSearchInput'), map_controller.getMap());
//	goog.events.listen(gazetter, VK2.Tools.GazetteerSearch.EventType.JUMPTO, function(event){
//		console.log(event);
//	});
//
//	if (goog.isDef(settings) && settings.hasOwnProperty('georeference') && settings['georeference'] === true){
//		var georef_chooser = new VK2.Module.ChooseGeoreferenceMapModule({
//			'map':map_controller.getMap(),
//			'control_id': 'vk2GeorefControl'
//		});
//		sidebar_controller.registerModule(georef_chooser);
//	};
		
	// for testing
//	if (goog.DEBUG){	
//		// for debugging purpose 
//		window['map'] = map_controller.getMap();
//		window['gazetter'] = gazetter;
////		map_controller.getMap().addLayer(new VK2.Layer.HistoricMap({
////			'time':1912,
////			'projection':'EPSG:900913'
////		}));
//	};
	

};

/**
 * @param {string} className
 * @param {Object=} opt_element
 * @static
 * @TODO replace css names
 */
vk2.utils.AppLoader.loadModalOverlayBehavior = function(className, opt_element){
	var parent_el = goog.isDef(opt_element) ? opt_element : document.body;
	var modal_anchors = goog.dom.getElementsByClass(className, parent_el.body);
	var modal = new vk2.utils.Modal('vk2-overlay-modal',document.body, true);
	
	// iteratore over modal_anchors and init the behavior for them
	for (var i = 0; i < modal_anchors.length; i++){
		goog.events.listen(modal_anchors[i], goog.events.EventType.CLICK, function(e){
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
};