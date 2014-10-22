goog.provide('vk2.app.PresentationApp');

goog.require('goog.dom');
goog.require('goog.events');
goog.require('goog.events.EventType');
//goog.require('goog.Uri');
//goog.require('goog.net.XhrIo');

goog.require('vk2.settings');
goog.require('vk2.utils');
goog.require('vk2.utils.Modal');
goog.require('vk2.controller.MapController');
goog.require('vk2.tool.Permalink');
goog.require('vk2.module.SpatialTemporalSearchModule');
goog.require('vk2.module.LayerManagementModule');
goog.require('vk2.georeference.GeoreferencerChooser');

/**
 * @constructor
 * @param {Object} settings
 * 		{boolean} authenticate
 * 		{string} modalAnchorClassName
 * 		{string} mapContainerId
 * 		{string} spatialsearchContainerId
 * 		{string} georefChooserContainerId
 */
vk2.app.PresentationApp = function(settings){
	if (goog.DEBUG)
		console.log(settings);
	
	// define proxy url
	vk2.utils.setProxyUrl();
	vk2.utils.checkIfCookiesAreEnabble();
	
	// append modal behavior to page anchors
	var modalAnchorClassName = goog.isDef(settings['modalAnchorClassName']) ? settings['modalAnchorClassName'] : 'vk2-modal-anchor';
	this.loadModalOverlayBehavior_(modalAnchorClassName);
	
	// check if there is a main page and if yes load it
	this.loadWelcomePage_();
	
	//
	// initialize basic application modules
	//
	var map_controller = new vk2.controller.MapController(vk2.settings.MAIN_MAP_SETTINGS, settings['mapContainerId']);
	
	// load spatialsearch 
	var spatialSearch = new vk2.module.SpatialTemporalSearchModule(settings['spatialsearchContainerId'], map_controller.getMap());
	map_controller.registerSpatialTemporalSearch(spatialSearch);
	
	// load layermanagement
	var layermanagement = new vk2.module.LayerManagementModule(settings['mapContainerId'], map_controller.getMap().getLayers(), map_controller.getMap());
	
	// permalink 
	var permalink = new vk2.tool.Permalink(map_controller.getMap());
	map_controller.registerPermalinkTool(permalink);
	
	// in case of authenticated user load further modules
	var isAuthenticate = goog.isDef(settings['authenticate']) && goog.isBoolean(settings['authenticate']) ? settings['authenticate'] : false;
	
	if (isAuthenticate){
		if (goog.DEBUG)
			console.log('The application is loaded in authenticate mode.');
		
		var georeferencerChooser = new vk2.georeference.GeoreferencerChooser(settings['georefChooserContainerId'], map_controller.getMap());
		
		// check if the georeference is active
		if (vk2.utils.getQueryParam('georef') == 'on'){
			georeferencerChooser.activate();
			map_controller.getMap().getView().setCenter(vk2.settings.MAIN_MAP_GEOREFERENCER_VIEW['center']);
			map_controller.getMap().getView().setZoom(vk2.settings.MAIN_MAP_GEOREFERENCER_VIEW['zoom']);
		};		
		
//		if (vk2.utils.getQueryParam('points') && (parseInt(vk2.utils.getQueryParam('points')) > 0)){
//			vk2.utils.showAchievedPoints(goog.dom.getElement('main-page-container'), vk2.utils.getQueryParam('points'));;	
//		};
	};
	
	if(goog.DEBUG){
		window['map'] = map_controller.getMap();		
		window['spatialsearch'] = spatialSearch;
		window['mapsearch'] = spatialSearch.getMapSearchModule();
	};
	
	// for correct displaying of tooltips
	setTimeout(function(){vk2.utils.overwriteOlTitles(settings['mapContainerId']);}, 500);
};

/**
 * @param {string} className
 * @param {Object=} opt_element
 * @private
 */
vk2.app.PresentationApp.prototype.loadModalOverlayBehavior_ = function(className, opt_element){
	var parent_el = goog.isDef(opt_element) ? opt_element : document.body;
	var modal_anchors = goog.dom.getElementsByClass(className, parent_el.body);
	
	// iteratore over modal_anchors and init the behavior for them
	for (var i = 0; i < modal_anchors.length; i++){
		goog.events.listen(modal_anchors[i], goog.events.EventType.CLICK, function(e){
			try {	
				var modal = new vk2.utils.Modal('vk2-overlay-modal',document.body, true);
				
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

/**
 * @private
 */
vk2.app.PresentationApp.prototype.loadWelcomePage_ = function(){
	// welcome page
	if (goog.dom.getElement("vk2WelcomePage")){
		goog.dom.getElement("vk2WelcomePage").click();
	};
};