goog.provide('vk2.app.AdminEvaluationApp');

goog.require('goog.dom');
goog.require('goog.events');
goog.require('goog.net.XhrIo');
goog.require('goog.net.EventType');
goog.require('vk2.settings');
goog.require('vk2.georeference.utils');
goog.require('vk2.georeference.ResultViewer');
goog.require('vk2.georeference.GeoreferencerService');
//goog.require('ol.proj');

/**
 * @constructor
 * @param {Object} settings
 * 		{string} btn_getallprocess
 * 		{string} process_list
 * 		{string} map_container
 */
vk2.app.AdminEvaluationApp = function(settings){
	if (goog.DEBUG)
		console.log('Create new vk2.app.AdminEvaluationApp');
	
	if (!settings.hasOwnProperty('process_list') || !settings.hasOwnProperty('map_container'))
		throw "Missing parameter in the vk2.app.AdminEvaluationApp settings. Please check the documentation.";
	
	this.initializeEvaluationMap_(settings['map_container']);
	
	if (settings.hasOwnProperty('btn_getallprocess'))
		this.addFetchProcessEvent_(settings['btn_getallprocess'], settings['process_list']);
	
	if (settings.hasOwnProperty('btn_getsingleprocess_mapid'))
		this.addFetchSingleProcessForMapId_(settings['btn_getsingleprocess_mapid'], settings['process_list']);
	
	if (settings.hasOwnProperty('btn_getsingleprocess_userid'))
		this.addFetchSingleProcessForUserId_(settings['btn_getsingleprocess_userid'], settings['process_list']);
};

/**
 * @param {string} idEventTrigger
 * @param {string} resultContainer
 * @private
 */
vk2.app.AdminEvaluationApp.prototype.addFetchProcessEvent_ = function(idEventTrigger, resultContainer){
	var eventTrigger = goog.dom.getElement(idEventTrigger);
	
	// add event to the trigger
	goog.events.listen(eventTrigger, 'click', function(event){
		if (goog.DEBUG)
			console.log('fetch data from server ...');
		
		var xhr = new goog.net.XhrIo();
		
		// add listener to request object
		goog.events.listenOnce(xhr, goog.net.EventType.SUCCESS, function(e){
			var xhr = /** @type {goog.net.XhrIo} */ (e.target);
			this.displayProcesses_(resultContainer, xhr.getResponseJson());
			xhr.dispose();
		}, false, this);
		
		goog.events.listenOnce(xhr, goog.net.EventType.ERROR, function(e){
			alert('Something went wrong, while trying to fetch data from the server.')
		}, false, this);
		
		// send request
		var url = vk2.settings.EVALUATION_GETPROCESS;
		xhr.send(url, 'GET');	
	}, undefined, this);
};

/**
 * @param {string} idEventTrigger
 * @param {string} resultContainer
 * @private
 */
vk2.app.AdminEvaluationApp.prototype.addFetchSingleProcessForMapId_ = function(idEventTrigger, resultContainer){
	var eventTrigger = goog.dom.getElement(idEventTrigger);
	
	// add event to the trigger
	goog.events.listen(eventTrigger, 'click', function(event){
		if (goog.DEBUG)
			console.log('fetch data from server ...');
		
		var inputFieldId = event.currentTarget.getAttribute('data-src');
		var inputFieldEl = goog.dom.getElement(inputFieldId);
		var mapid = inputFieldEl.value;
		
		var xhr = new goog.net.XhrIo();
		
		// add listener to request object
		goog.events.listenOnce(xhr, goog.net.EventType.SUCCESS, function(e){
			var xhr = /** @type {goog.net.XhrIo} */ (e.target);
			this.displayProcesses_(resultContainer, xhr.getResponseJson());
			xhr.dispose();
		}, false, this);
		
		goog.events.listenOnce(xhr, goog.net.EventType.ERROR, function(e){
			alert('Something went wrong, while trying to fetch data from the server.')
		}, false, this);
		
		// send request
		var url = vk2.settings.EVALUATION_GETPROCESS + '?mapid=' + mapid;
		xhr.send(url, 'GET');	
	}, undefined, this);
};

/**
 * @param {string} idEventTrigger
 * @param {string} resultContainer
 * @private
 */
vk2.app.AdminEvaluationApp.prototype.addFetchSingleProcessForUserId_ = function(idEventTrigger, resultContainer){
	var eventTrigger = goog.dom.getElement(idEventTrigger);
	
	// add event to the trigger
	goog.events.listen(eventTrigger, 'click', function(event){
		if (goog.DEBUG)
			console.log('fetch data from server ...');
		
		var inputFieldId = event.currentTarget.getAttribute('data-src');
		var inputFieldEl = goog.dom.getElement(inputFieldId);
		var userid = inputFieldEl.value;
		
		var xhr = new goog.net.XhrIo();
		
		// add listener to request object
		goog.events.listenOnce(xhr, goog.net.EventType.SUCCESS, function(e){
			var xhr = /** @type {goog.net.XhrIo} */ (e.target);
			this.displayProcesses_(resultContainer, xhr.getResponseJson());
			xhr.dispose();
		}, false, this);
		
		goog.events.listenOnce(xhr, goog.net.EventType.ERROR, function(e){
			alert('Something went wrong, while trying to fetch data from the server.')
		}, false, this);
		
		// send request
		var url = vk2.settings.EVALUATION_GETPROCESS + '?userid=' + userid;
		xhr.send(url, 'GET');	
	}, undefined, this);
};

/**
 * @param {Object} record
 * @return {Element}
 * @private
 */
vk2.app.AdminEvaluationApp.prototype.createProcessListElement_ = function(record){
	var parentEl = goog.dom.createDom('article', {'id':record['georef_id']});
	
	var helperFactory = function(label, value){
		return goog.dom.createDom('p',{
			'innerHTML':'<strong>' + label + ':</strong><br> ' + value
		});
	};
	
	var helperFactoryAnchors = goog.bind(function(record){
		var phrase = goog.dom.createDom('p');
		
		// set is valid
		var setIsValideBtn = goog.dom.createDom('button', {
			'data-href': vk2.settings.EVALUATION_API + '/setisvalide?georeferenceid=' + record['georef_id'] + '&id=' + record['mapid'],
			'class':'btn btn-primary action-btn',
			'innerHTML': 'Is valide'
		});
		this.registerSetIsValideEventListener_(setIsValideBtn, parentEl);
		goog.dom.appendChild(phrase, setIsValideBtn);
		
		// show map
		var showMapBtn = goog.dom.createDom('button', {
			'data-params': record['georef_params'],
			'data-mapid': record['mapid'],
			'class':'btn btn-primary btn-show-georef',
			'innerHTML': 'Show map'
		});
		this.registerShowMapEventListener_(showMapBtn);
		goog.dom.appendChild(phrase, showMapBtn);
		
		// go to process
		goog.dom.appendChild(phrase, goog.dom.createDom('a', {
			'href': vk2.settings.GEOREFERENCE_PAGE + '?georeferenceid=' + record['georef_id'],
			'class':'btn btn-primary action-btn',
			'target':'_blank',
			'innerHTML': 'Go to process ...'
		}));
		
		// deactivete
		var deactiveBtn = goog.dom.createDom('button', {
			'data-href': vk2.settings.EVALUATION_API + '/setinvalide?georeferenceid=' + record['georef_id'],
			'class':'btn btn-warning action-btn',
			'innerHTML': 'Is invalide'
		});
		this.registerSetIsInvalideEventListener_(deactiveBtn, parentEl);
		goog.dom.appendChild(phrase, deactiveBtn);
		
		return phrase;
	}, this);
	
	// add georeference process id
	goog.dom.appendChild(parentEl, helperFactory('Process-ID', record['georef_id']));
	
	// add admin validation
	goog.dom.appendChild(parentEl, helperFactory('Admin validation', record['adminvalidation']));
	
	// add admin validation
	goog.dom.appendChild(parentEl, helperFactory('Map id', record['mapid']));
	
	// add admin validation
	goog.dom.appendChild(parentEl, helperFactory('User id', record['userid']));
	
	// add admin validation
	goog.dom.appendChild(parentEl, helperFactory('Map sheet description', record['title']));
	
	// add admin validation
	goog.dom.appendChild(parentEl, helperFactory('Georeference parameter (lon:lat)', record['georef_params']));
	
	// add admin validation
	goog.dom.appendChild(parentEl, helperFactory('Type', record['type']));
	
	// add admin validation
	goog.dom.appendChild(parentEl, helperFactory('Processed', record['processed'])); 

	// add admin validation
	goog.dom.appendChild(parentEl, helperFactory('Is active', record['georef_isactive'])); 
	
	// add timestamp 
	goog.dom.appendChild(parentEl, goog.dom.createDom('p',{
		'class':'meta',
		'innerHTML':'Created: ' + record['georef_time']
	}));
	
	// add behavior buttons/anchor
	goog.dom.appendChild(parentEl, helperFactoryAnchors(record));
	
	return parentEl;
};

/**
 * @param {string} resultContainer
 * @param {Array.<Object>} data
 * @private
 */
vk2.app.AdminEvaluationApp.prototype.displayProcesses_ = function(resultContainer, data){
		
	// get resultContainer and clear it
	var containerEl = goog.dom.getElement(resultContainer);
	containerEl.innerHTML = '';
	
	// now add processes
	for (var i = 0, ii = data.length; i < ii; i++){
		goog.dom.appendChild(containerEl, this.createProcessListElement_(data[i]));
	};
};

/**
 * @param {string} idMapContainer
 * @private
 */
vk2.app.AdminEvaluationApp.prototype.initializeEvaluationMap_ = function(idMapContainer){
	vk2.georeference.utils.initializeGeorefenceCRS();
	
	/**
	 * @type {vk2.georeference.ResultViewer}
	 * @private
	 */
	this.resultViewer_ = new vk2.georeference.ResultViewer(idMapContainer);
};

/**
 * @param {Element} element
 * @param {Element} parentEl
 * @private
 */
vk2.app.AdminEvaluationApp.prototype.registerSetIsInvalideEventListener_ = function(element, parentEl){
	goog.events.listen(element, 'click', function(event){
		if (goog.DEBUG)
			console.log('Fire set is invalide map event ...');
		
		// add confirm method
		var confirmResponse = confirm('Are you sure you wanna set this georeference process to invalide?');
				
		if (confirmResponse == true) {
			var url = event.currentTarget.getAttribute('data-href');
				
			goog.net.XhrIo.send(url, function(event){
				alert(event.target.getResponseJson()['message']);
				goog.dom.removeNode(parentEl);
			}, 'GET');	
		} else {
			if (goog.DEBUG)
				console.log('No we won\'t will do this.');
		};		
	});
};

/**
 * @param {Element} element
 * @param {Element} parentEl
 * @private
 */
vk2.app.AdminEvaluationApp.prototype.registerSetIsValideEventListener_ = function(element, parentEl){
	goog.events.listen(element, 'click', function(event){
		if (goog.DEBUG)
			console.log('Fire set is valide map event ...');
		
		// add confirm method
		var confirmResponse = confirm('Are you sure you wanna set this georeference process to isvalide?');
				
		if (confirmResponse == true) {
			var url = event.currentTarget.getAttribute('data-href');
				
			goog.net.XhrIo.send(url, function(event){
				alert(event.target.getResponseJson()['message']);
				goog.dom.removeNode(parentEl);
			}, 'GET');	
		} else {
			if (goog.DEBUG)
				console.log('No we won\'t will do this.');
		};		
	});
};

/**
 * @param {Element} element
 * @private
 */
vk2.app.AdminEvaluationApp.prototype.registerShowMapEventListener_ = function(element){
	goog.events.listen(element, 'click', function(event){
		if (goog.DEBUG)
			console.log('Fire show map event ...');
		
		// parse request parameter
		var georefParams = JSON.parse(event.currentTarget.getAttribute('data-params'));
		var mapId = parseInt(event.currentTarget.getAttribute('data-mapid'));
		
		var gcps = goog.isDef(georefParams['new']) ? georefParams['new'] : georefParams;
		var request = {
			'id': mapId,
			'georeference': gcps
		};
		
		// request a validation result
		vk2.georeference.GeoreferencerService.requestValidationResult(request, goog.bind(function(response){
			var data = response.target.getResponseJson();
			this.resultViewer_.displayValidationMap(data['wms_url'], data['layer_id'], 
				ol.proj.transform(data['extent'], 'EPSG:4314', vk2.settings.DISPLAY_SRS ));
		}, this), function(response){
			alert('Something went wrong while trying to fetch a georeference validation result from server ....');
		});
	}, false, this);
};