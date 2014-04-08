goog.provide('VK2.Utils.AppLoader');

goog.require('VK2.Settings');
goog.require('VK2.Utils');
goog.require('VK2.Source.WFS');
goog.require('VK2.Controller.MapController');
goog.require('VK2.Controller.SidebarController');
goog.require('VK2.Module.SpatialSearchModule');
goog.require('VK2.Module.ChooseGeoreferenceMapModule');

/**
 * @param {Object} settings Contains key/value pairs representing the settings
 * @param {Object} init_conf Initialise configuration object, which holds information over the mapping services, etc.
 * @constructor
 * @export
 */
VK2.Utils.AppLoader = function(settings){
	VK2.Utils.checkIfCookiesAreEnabble();
	VK2.Utils.loadModalOverlayBehavior('fancybox-open');
	
	var map_controller = new VK2.Controller.MapController(VK2.Settings.MAIN_MAP_SETTINGS, 'mapdiv');
	var sidebar_controller = new VK2.Controller.SidebarController('vk2SBPanel');
	
	// load module
	var spatialsearch = new VK2.Module.SpatialSearchModule({
		'map':map_controller.getMap(),
		'panel_id': 'vk2LayersearchPanel',
		'control_id': 'vk2LayersearchControl'
	});
	sidebar_controller.registerModule(spatialsearch);
	
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
	};
	
	var wfs_source = new VK2.Source.WFS();
}