goog.provide('VK2.Utils.AppLoader');

goog.require('goog.dom');
goog.require('goog.events');
goog.require('goog.events.EventType');

goog.require('VK2.Settings');
goog.require('VK2.Utils');
goog.require('VK2.Utils.Modal');
goog.require('VK2.Controller.MapController');
goog.require('VK2.Controller.SidebarController');
goog.require('VK2.Module.SpatialSearchModule');
goog.require('VK2.Module.LayerBarModule');
goog.require('VK2.Module.ChooseGeoreferenceMapModule');
goog.require('VK2.Layer.HistoricMap');


/**
 * @param {Object} settings Contains key/value pairs representing the settings
 * @param {Object} init_conf Initialise configuration object, which holds information over the mapping services, etc.
 * @constructor
 * @export
 */
VK2.Utils.AppLoader = function(settings){
	VK2.Utils.checkIfCookiesAreEnabble();
	//VK2.Utils.loadModalOverlayBehavior('fancybox-open');
	
	var map_controller = new VK2.Controller.MapController(VK2.Settings.MAIN_MAP_SETTINGS, 'mapdiv');
	var sidebar_controller = new VK2.Controller.SidebarController('vk2SBPanel');
	
	// load module
	var spatialsearch = new VK2.Module.SpatialSearchModule({
		'map':map_controller.getMap(),
		'panel_id': 'vk2LayersearchPanel',
		'control_id': 'vk2LayersearchControl',
		'parentEl': sidebar_controller.getContentElement()
	});
	sidebar_controller.registerModule(spatialsearch);
	
	var layerbar = new VK2.Module.LayerBarModule({
		'map':map_controller.getMap(),
		'panel_id': 'vk2LayerbarPanel',
		'control_id': 'vk2LayerbarControl',
		'parentEl': sidebar_controller.getContentElement()
	});
	sidebar_controller.registerModule(layerbar);
	
	var georef_chooser = new VK2.Module.ChooseGeoreferenceMapModule({
		'map':map_controller.getMap(),
		'control_id': 'vk2GeorefControl'
	});
	sidebar_controller.registerModule(georef_chooser);
		
	// for testing
	if (goog.DEBUG){	
		// for debugging purpose 
		window['sb'] = sidebar_controller;
		window['ssm'] = spatialsearch;
		window['map'] = map_controller.getMap();
//		map_controller.getMap().addLayer(new VK2.Layer.HistoricMap({
//			'time':1912,
//			'projection':'EPSG:900913'
//		}));
//		
//		map_controller.getMap().addLayer(new VK2.Layer.HistoricMap({
//			'time':1913,
//			'projection':'EPSG:900913'
//		}));
	};
	
	VK2.Utils.AppLoader.loadModalOverlayBehavior('vk2-modal-anchor');
};

/**
 * @param {string} className
 * @param {Object=} opt_element
 * @static
 * @TODO replace css names
 */
VK2.Utils.AppLoader.loadModalOverlayBehavior = function(className, opt_element){
	var parent_el = goog.isDef(opt_element) ? opt_element : document.body;
	var modal_anchors = goog.dom.getElementsByClass(className, parent_el.body);
	var modal = new VK2.Utils.Modal('vk2-overlay-modal',document.body, true);
	
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