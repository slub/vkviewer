goog.provide('vk2.utils.AppLoader');

goog.require('goog.dom');
goog.require('goog.events');
goog.require('goog.events.EventType');
goog.require('goog.Uri');
goog.require('goog.net.XhrIo');

goog.require('vk2.settings');
goog.require('vk2.utils');
goog.require('vk2.utils.Modal');
goog.require('vk2.validation');
goog.require('vk2.controller.MapController');
goog.require('vk2.module.SpatialTemporalSearchModule');
goog.require('vk2.module.LayerManagementModule');
goog.require('vk2.layer.MapSearch');
goog.require('vk2.georeference.GeoreferencerChooser');
goog.require('vk2.georeference.Georeferencer');
goog.require('vk2.georeference.ZoomifyViewer');
goog.require('vk2.georeference.ResultViewer');
goog.require('vk2.georeference.MesstischblattGcpHandler');

/**
 * @param {Object} settings Contains key/value pairs representing the settings
 * @param {Object} init_conf Initialise configuration object, which holds information over the mapping services, etc.
 * @constructor
 * @export
 */
vk2.utils.AppLoader = function(settings){
	vk2.utils.checkIfCookiesAreEnabble()
	vk2.utils.setProxyUrl();
	//vk2.utils.AppLoader.appendIEBehavior();
	
	var isAuthenticate = goog.isDef(settings['authenticate']) && goog.isBoolean(settings['authenticate']) ? settings['authenticate'] : false;
		
	vk2.utils.checkIfCookiesAreEnabble();
	vk2.utils.AppLoader.loadModalOverlayBehavior('vk2-modal-anchor');
	vk2.utils.AppLoader.loadWelcomePage();

	// initialize map
	var map_controller = new vk2.controller.MapController(vk2.settings.MAIN_MAP_SETTINGS, 'mapdiv');
	
	// load modules
	// load spatialsearch
	var featureOverlay = new ol.FeatureOverlay({
		map: map_controller.getMap(),
		style: function(feature, resolution) {
		    return [vk2.utils.Styles.MAP_SEARCH_HOVER_FEATURE];
		}	
	});
	var spatialSearch = new vk2.module.SpatialTemporalSearchModule('vk2MapPanel', featureOverlay);
	map_controller.registerSpatialTemporalSearch(spatialSearch);

	// load layermanagement
	var layermanagement = new vk2.module.LayerManagementModule('mapdiv', map_controller.getMap().getLayers(), map_controller.getMap());
	
	if (isAuthenticate){
		if (goog.DEBUG)
			console.log('The application is loaded in authenticate mode.');
		
		var georeferencerChooser = new vk2.georeference.GeoreferencerChooser('spatialsearch-container', map_controller.getMap());
		
		// check if the georeference is active
		if (vk2.utils.getQueryParam('georef') == 'on'){
			georeferencerChooser.activate();
			map_controller.getMap().getView().getView2D().setCenter(vk2.settings.MAIN_MAP_GEOREFERENCER_VIEW['center']);
			map_controller.getMap().getView().getView2D().setZoom(vk2.settings.MAIN_MAP_GEOREFERENCER_VIEW['zoom']);
		};		
		
		if (vk2.utils.getQueryParam('points') && (parseInt(vk2.utils.getQueryParam('points')) > 0)){
			vk2.utils.showAchievedPoints(goog.dom.getElement('main-page-container'), vk2.utils.getQueryParam('points'));;	
		};
	};	
	
	if(goog.DEBUG){
		window['map'] = map_controller.getMap();		
	};
};

///**
// * 
// */
//vk2.utils.AppLoader.appendIEBehavior = function(){
//	if (goog.isDef(navigator.appName) && navigator.appName == "Microsoft Internet Explorer"){
//	};		
//};

/**
 * @param {string} className
 * @param {Object=} opt_element
 * @static
 * @TODO replace css names
 */
vk2.utils.AppLoader.loadModalOverlayBehavior = function(className, opt_element){
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
 * Function for loading the georeferencer
 * @param {string} unreferenced_map_container
 * @param {string} referenced_map_container
 * @static
 */
vk2.utils.AppLoader.loadGeoreferenceApp = function(unreferenced_map_container, referenced_map_container){
	//Proj4js.defs["EPSG:4314"] = "+proj=longlat +ellps=bessel +towgs84=598.1,73.7,418.2,0.202,0.045,-2.455,6.7 +no_defs";
	Proj4js.defs["EPSG:4314"] = '+proj=longlat +ellps=bessel +datum=potsdam +no_defs';
	Proj4js.defs["EPSG:900913"] = '+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +wktext +over no_defs';

	
	// parse object id
	var url = new goog.Uri(window.location.href);
	var objectid = url.getQueryData().get('id');
	var georeferenceid = url.getQueryData().get('georeferenceid')
	
	goog.net.XhrIo.send(vk2.settings.GEOREFERENCE_GETPROCESS, function(event){
		if (event.target.getStatus() != 200){
			alert('Something went wrong, while trying to get information for the georeference process. Please try again or contact the administrator.');
		};
		
		loaderFunction(event.target.getResponseJson())
		
	}, 'POST', JSON.stringify({'objectid':objectid, 'georeferenceid':georeferenceid}), {'Content-Type':'application/json;charset=UTF-8'});
	
	var loaderFunction = function(data){
		if (goog.DEBUG)
			console.log(data);
		
		// load unreferenced layer 
		this._zoomifyViewer = new vk2.georeference.ZoomifyViewer(unreferenced_map_container, {
			'width':  data['zoomify']['width'],
			'height':data['zoomify']['height'],
			'url': data['zoomify']['properties'].substring(0,data['zoomify']['properties'].lastIndexOf("/")+1)
		});
		
		// load validation map
		this._resultViewer = new vk2.georeference.ResultViewer(referenced_map_container, {
			'extent':ol.proj.transform(data['extent'], 'EPSG:4314', vk2.settings.DISPLAY_SRS )
		});
		
		
		// load toolbox
		var gcphandler = new vk2.georeference.MesstischblattGcpHandler(this._zoomifyViewer, new ol.source.Vector(), data['gcps']);
		if (goog.isDef(this._zoomifyViewer) && goog.isDef(this._resultViewer)){
			this._georeferencer = new vk2.georeference.Georeferencer(unreferenced_map_container, {
				'unreferencedviewer': this._zoomifyViewer,
				'referenceviewer': this._resultViewer,
				'objectid': objectid,
				'gcphandler': gcphandler
			});
			this._georeferencer.open();
		};
		
		if (goog.DEBUG)
			window['gcphandler'] = gcphandler;
	};
};

/**
 * Function for loading the georeferencer
 * @param {string} container_class
 * @static
 */
vk2.utils.AppLoader.loadGeoreferenceProfilePage = function(container_class){
		var url = new goog.Uri(window.location.href);
		var georef_id = url.getQueryData().get('georefid'); 			
		
		// if query parameter is set add class to element with georefid
		if (goog.isDef(georef_id)){
			var article = goog.dom.getElement(georef_id);
			goog.dom.classes.add(georef_id, 'complete');
		}
			
		var container = goog.dom.getElementByClass(container_class);
		var thumbnailsNodeList = goog.dom.getElementsByClass('thumbnail');	
		var thumbnailsArr = vk2.utils.castNodeListToArray(thumbnailsNodeList);
		var lazyLoading = vk2.utils.getLazyImageLoadingFn(thumbnailsArr, 'src', 'data-src');
		var timeout;
		goog.events.listen(container, goog.events.EventType.SCROLL, function(e){
			clearTimeout(timeout);
			timeout = setTimeout(lazyLoading, 1000);
		});
		lazyLoading();
};

/**
 * This function is used by the admin evaluation page. It removes the dom element with the given id through the attribute value
 * @param {string} className
 * @param {string} attributeNameHref
 * @param {string} attributeNameId
 * @static
 */
vk2.utils.AppLoader.loadGeoreferenceEvaluationRecordBehavior = function(className, attributeNameHref, attributeNameId){
	targetElements = goog.dom.getElementsByClass(className);
	for (var i = 0; i < targetElements.length; i++){
		goog.events.listen(targetElements[i], 'click', function(event){
			// remove this record
			var recordEl = goog.dom.getElement(this.getAttribute(attributeNameId));
			
			// send the request
			var url = this.getAttribute(attributeNameHref)
			goog.net.XhrIo.send(url, function(event){
				alert(event.target.getResponseJson()['message']);
				goog.dom.removeNode(recordEl);
			}, 'GET');	
		});
	};
};

/**
 * @static
 */
vk2.utils.AppLoader.loadWelcomePage = function(){	
	// welcome page
	if (goog.dom.getElement("vk2WelcomePage")){
		goog.dom.getElement("vk2WelcomePage").click();
	};
};