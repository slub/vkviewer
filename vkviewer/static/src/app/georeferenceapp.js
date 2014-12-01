goog.provide('vk2.app.GeoreferenceApp');

//goog.require('goog.dom');
goog.require('goog.events');
goog.require('goog.events.EventType');
goog.require('goog.Uri');
goog.require('goog.net.XhrIo');

goog.require('vk2.settings');
goog.require('vk2.utils');
goog.require('vk2.viewer.ZoomifyViewer');
goog.require('vk2.georeference.utils');
goog.require('vk2.georeference.GeoreferencerChooser');
goog.require('vk2.georeference.Georeferencer');
goog.require('vk2.georeference.GeoreferencerService');
goog.require('vk2.georeference.ResultViewer');
goog.require('vk2.georeference.MesstischblattGcpHandler');
goog.require('vk2.georeference.utils');
/**
 * @constructor
 * @param {string} originalMapContainerId
 * @param {string} geoMapContainerId
 */
vk2.app.GeoreferenceApp = function(originalMapContainerId, geoMapContainerId){
	vk2.utils.checkIfCookiesAreEnabble();
	vk2.utils.loadModalOverlayBehavior('vk2-modal-anchor');
	vk2.georeference.utils.initializeGeorefenceCRS();
	
	// parse object id
	var url = new goog.Uri(window.location.href);
	
	var objectid = /** @type {string} */ (url.getQueryData().get('id'));
	var georeferenceid = /** @type {string} */ (url.getQueryData().get('georeferenceid'));

	// now load the process and necessary data 
	if (goog.isDef(georeferenceid)){
		this.initializeWithGeoreferenceId_(georeferenceid, originalMapContainerId, geoMapContainerId);
	} else if (goog.isDef(objectid)) {
		this.initializeWithObjectId_(objectid, originalMapContainerId, geoMapContainerId);
	};
};

/**
 * @private
 * @param {Object} params
 * @param {Function} callback
 */
vk2.app.GeoreferenceApp.prototype.fetchProcessDataFromServer_ = function(params, callback){
	goog.net.XhrIo.send(vk2.settings.GEOREFERENCE_GETPROCESS, function(event){
		if (event.target.getStatus() != 200){
			alert('Something went wrong, while trying to get the process information from the server. Please try again or contact the administrator.');
		};
	
		callback(event.target.getResponseJson())
	
	}, 'POST', JSON.stringify(params), {'Content-Type':'application/json;charset=UTF-8'});
};

/**
 * @private
 * @param {string} georeferenceid
 * @param {string} originalMapContainerId
 * @param {string} geoMapContainerId
 */
vk2.app.GeoreferenceApp.prototype.initializeWithGeoreferenceId_ = function(georeferenceid, originalMapContainerId, geoMapContainerId){
	if (goog.DEBUG){
		console.log('Load georeference application for georeferenceid.')
	};
	
	this.fetchProcessDataFromServer_({'georeferenceid':georeferenceid}, goog.bind(this.loaderFunction_, this, originalMapContainerId, geoMapContainerId));
};

/**
 * @private
 * @param {string} objectid
 * @param {string} originalMapContainerId
 * @param {string} geoMapContainerId
 */
vk2.app.GeoreferenceApp.prototype.initializeWithObjectId_ = function(objectid, originalMapContainerId, geoMapContainerId){
	if (goog.DEBUG){
		console.log('Load georeference application for objectid.')
	};
	
	this.fetchProcessDataFromServer_({'objectid':objectid}, goog.bind(this.loaderFunction_, this, originalMapContainerId, geoMapContainerId));
};

/**
 * @private
 * @param {string} originalMapContainerId
 * @param {string} geoMapContainerId
 * @param {Object} data
 */
vk2.app.GeoreferenceApp.prototype.loaderFunction_ = function(originalMapContainerId, geoMapContainerId, data){
	if (goog.DEBUG){
		console.log('Sucessfully fetch data from server - ' + data);
	};
		
	/**
	 *  load unreferenced layer
	 *  @private
	 *  @type {vk2.viewer.ZoomifyViewer}
	 */ 
	this._zoomifyViewer = new vk2.viewer.ZoomifyViewer(originalMapContainerId, data['zoomify']);
	
	/**
	 *  load validation map
	 *  @private
	 *  @type {vk2.georeference.ResultViewer}
	 */ 
	this._resultViewer = new vk2.georeference.ResultViewer(geoMapContainerId, {
		'extent':ol.proj.transformExtent(data['extent'], 'EPSG:4314', vk2.settings.DISPLAY_SRS )
	});		
	
	// before calling this function the zoomify layer has to be loaded
	goog.events.listen(this._zoomifyViewer, 'loadend', function(){

		// load toolbox
		var gcphandler = new vk2.georeference.MesstischblattGcpHandler(this._zoomifyViewer, new ol.source.Vector(), data['gcps'], data['type']);
		if (goog.isDef(this._zoomifyViewer) && goog.isDef(this._resultViewer)){
			this._georeferencer = new vk2.georeference.Georeferencer(originalMapContainerId, {
				'unreferencedviewer': this._zoomifyViewer,
				'referenceviewer': this._resultViewer,
				'validate_menu_container':'georef-validate-menu',
				'objectid': data['objectid'],
				'gcphandler': gcphandler
			});
			this._georeferencer.open();
		};
		
		if (goog.DEBUG){
			window['gcphandler'] = gcphandler;
		};
	},undefined, this);
	
	// if the server response a warn message display it
	if (data.hasOwnProperty('warn')){
		var warnMsg  = data['warn'];
		var warnEl = goog.dom.createDom('div', {
			'innerHTML': warnMsg + ' <a href="' + vk2.settings.MAIN_PAGE + '?georef=on">' + vk2.utils.getMsg('backToMain') + '</a>',
			'class': 'alert alert-danger warn-msg'
		});
		
		var parentContainer = goog.dom.getElement(originalMapContainerId);
		goog.dom.appendChild(parentContainer, warnEl);
	}
};
