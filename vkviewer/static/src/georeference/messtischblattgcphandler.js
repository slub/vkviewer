goog.provide('vk2.georeference.MesstischblattGcpHandler');

goog.require('goog.object');
goog.require('goog.events');

/**
 * @param {vk2.georeference.ZoomifyViewer} zoomifyViewer
 * @param {ol.source.Vector} featureSource
 * @param {Object} opt_gcps
 * @constructor
 */
vk2.georeference.MesstischblattGcpHandler = function(zoomifyViewer, featureSource, opt_gcps){
	
	/**
	 * @type {vk2.georeference.ZoomifyViewer}
	 * @private
	 */
	this._zoomifyViewer = zoomifyViewer;
	
	/**
	 * @type {Object}
	 * @private
	 */
	this._gcps = goog.isDef(opt_gcps) && goog.isObject(opt_gcps)? goog.object.clone(opt_gcps) : {
		'source':'pixel',
		'target':'EPSG:4314'
	};
	
	/**
	 * @type {boolean}
	 * @private
	 */
	this._isUpdateState = this._checkIfUpdateState(this._gcps);

	/**
	 * @type {ol.source.Vector}
	 * @private
	 */
	this._featureSource = this._loadFeatureSource(this._gcps);
	
	/**
	 * @type {Object} 
	 * @private
	 */
	this._corners = {};
	this._parseMtbCornerPoints(this._gcps);
	this._appendUpdateEventBehavior(2);
		
	goog.base(this);
};
goog.inherits(vk2.georeference.MesstischblattGcpHandler, goog.events.EventTarget);

/**
 * @param {Object} gcps
 * @private
 */
vk2.georeference.MesstischblattGcpHandler.prototype._checkIfUpdateState = function(gcps){
	var passpoints = gcps['gcps']
	if (passpoints.length > 0){	
		if (passpoints[0]['source'].length > 0 && passpoints[0]['target'].length > 0)
			return true;
	}
	return false;
};

/**
 * @param {number} min_count_features
 * @private
 */
vk2.georeference.MesstischblattGcpHandler.prototype._appendUpdateEventBehavior = function(min_count_features){
	var constraints = {
			'max_features': function(event){
				var allFeatures = event.target.getFeatures();
				//check for corner point number (<4!)
				if (allFeatures.length > 4){
					alert(vk2.utils.getMsg('checkCornerPoint_count'));
					event.target.removeFeature(allFeatures[4]);
					return undefined;
				}
				return true;
			},
			'min_features': function(event){
				var allFeatures = event.target.getFeatures();
				if (allFeatures.length < 4)
					return false;
				return true;
			},
			'max_corner_features': function(event){
				var alertMsg_counter = 0;
				var allFeatures = event.target.getFeatures();
				var lastFeature_coords = allFeatures[allFeatures.length - 1].getGeometry().getCoordinates();		
				for (var x = 0; x < allFeatures.length-1; x++){
					var tempFeature_coords = allFeatures[x].getGeometry().getCoordinates();
					var distX = (Math.round(lastFeature_coords[0]) - Math.round(tempFeature_coords[0])).toString(); 
					var distY = (Math.round(lastFeature_coords[1]) - Math.round(tempFeature_coords[1])).toString();
					distX = distX.replace(/\-/g, "");
					distY = distY.replace(/\-/g, "");
					//change distance buffer here
					if ((parseInt(distX) < 3000) & (parseInt(distY) < 3000))  {
						alert (vk2.utils.getMsg('checkCornerPoint_distance'));
						event.target.removeFeature(allFeatures[allFeatures.length-1]);
						return undefined;
					}	
				}
				return true;
			}
		};
		
		// add constraint event listener event
		this._featureSource.on('addfeature', function(event){
			if (constraints['max_features'](event) && constraints['max_corner_features'](event) && constraints['min_features'](event)){
				this.dispatchEvent(new goog.events.Event(vk2.georeference.MesstischblattGcpHandler.EventType.UPDATE,{'target':this}));
			};
		}, this);
		
		this._featureSource.on('removefeature', function(event){
			if (constraints['min_features'](event)){
				this.dispatchEvent(new goog.events.Event(vk2.georeference.MesstischblattGcpHandler.EventType.UPDATE,{'target':this}));
			};
		}, this);		
};

/**
 * @param {Array.<number>} coordinates
 * @private
 */
vk2.georeference.MesstischblattGcpHandler.prototype._getMtbCornerType = function(coordinates){
	var cornerType;
	var assumption_MidHeight = this._zoomifyViewer.getHeight() / 2;
	var assumption_MidWidth = this._zoomifyViewer.getWidth() / 2;
	
	// checks
	var xlow = (coordinates[0] - assumption_MidWidth > 0) ? false : true;
	var ylow = (coordinates[1] - assumption_MidHeight > 0) ? false : true;
	
	// detect correct corner typ (recalculate it to pixel coordinates)
	if (xlow && ylow) 
		cornerType = 'ulc';
	if (xlow && !ylow) 
		cornerType = 'llc';	
	if (!xlow && ylow) 
		cornerType = 'urc';		
	if (!xlow && !ylow) 
		cornerType = 'lrc';
	return cornerType;
};

/**
 * @param {Object} source_gcp
 * @param {Object} target_gcp
 * @private
 */
vk2.georeference.MesstischblattGcpHandler.prototype._isSameGcp = function(source_gcp, target_gcp){
	var sameGcp = (source_gcp['source'][0] !== target_gcp['source'][0] || source_gcp['source'][1] !== target_gcp['source'][1]) ||
		(source_gcp['target'][0] !== target_gcp['target'][0] || source_gcp['target'][1] !== target_gcp['target'][1]) ? false : true;
	return sameGcp;	
};

/**
 * @param {Object} gcps
 * @private
 * @return {ol.source.Vector} source
 */
vk2.georeference.MesstischblattGcpHandler.prototype._loadFeatureSource = function(gcps){
	if (this._checkIfUpdateState(gcps)){
		var features = [];
		for (var i = 0; i < gcps['gcps'].length; i++){
			var latlon = this._transformGeoCoordsToPixel(gcps['gcps'][i]['source']);
			var feature = new ol.Feature(new ol.geom.Point(latlon));
			features.push(feature);
		};
		return new ol.source.Vector({
			'features': features
		})
	} else {
		return new ol.source.Vector()
	};
};

/**
 * @param {Object} gcps
 * @private
 */
vk2.georeference.MesstischblattGcpHandler.prototype._parseMtbCornerPoints = function(gcps){
	// handling special case that only coordinates are delivered
	var passpoints = gcps['gcps']
	if (passpoints.length > 0){				
		// identifiy  and parse corners
		var lowX = passpoints[0]['target'][0], lowY = passpoints[0]['target'][1]; 
		for (var i = 0; i < passpoints.length; i++){
			if (passpoints[i]['target'][0] < lowX)
				lowX = passpoints[i]['target'][0];
			if (passpoints[i]['target'][1] < lowY)
				lowY = passpoints[i]['target'][1];
		};
		
		for (var i = 0; i < passpoints.length; i++){
			if (passpoints[i]['target'][0] === lowX && passpoints[i]['target'][1] === lowY)
				this._corners['llc'] = passpoints[i]['target'];
			if (passpoints[i]['target'][0] === lowX && passpoints[i]['target'][1] > lowY)
				this._corners['ulc'] = passpoints[i]['target'];
			if (passpoints[i]['target'][0] > lowX && passpoints[i]['target'][1] === lowY)
				this._corners['lrc'] = passpoints[i]['target'];
			if (passpoints[i]['target'][0] > lowX && passpoints[i]['target'][1] > lowY)
				this._corners['urc'] = passpoints[i]['target'];
		};
	};
};

/**
 * @param {Array.<number>} pixel_coordinates
 * @param {number} height
 * @private
 * @returns {Array.<number>}
 */
vk2.georeference.MesstischblattGcpHandler.prototype._transformGeoCoordsToPixel = function(pixel_coordinates, height){
	return [Math.round(pixel_coordinates[0]), Math.round(-1*pixel_coordinates[1])];
};

/**
 * @param {Array.<number>} pixel_coordinates
 * @param {number} height
 * @private
 * @returns {Array.<number>}
 */
vk2.georeference.MesstischblattGcpHandler.prototype._transformPixelToGeoCoords = function(pixel_coordinates, height){
	return [Math.round(pixel_coordinates[0]), Math.round(-1*pixel_coordinates[1])];
};

/**
 * @returns {ol.source.Vector}
 */
vk2.georeference.MesstischblattGcpHandler.prototype.getFeatureSource = function(){
	return this._featureSource;
};

/**
 * @returns {Array.<Object>}
 */
vk2.georeference.MesstischblattGcpHandler.prototype.getGcps = function(){
	var features = this._featureSource.getFeatures();
	var gcps = [];
	for (var i = 0; i < features.length; i++){
		// detect corner typ and display on reference map
		var unreference_coords = this._transformPixelToGeoCoords(features[i].getGeometry().getCoordinates(), this._zoomifyViewer.getHeight());
		var cornerType = this._getMtbCornerType(unreference_coords);
		
		if (goog.DEBUG)
			console.log('Cornertype: '+cornerType);
		
		var reference_coords = this._corners[cornerType]; 
		gcps.push({'source':unreference_coords,'target':reference_coords});		
	};
	
	var response = goog.object.clone(this._gcps);
	response['gcps'] = gcps;
	return response;
};

/**
 * @returns {Array.<Object>}
 */
vk2.georeference.MesstischblattGcpHandler.prototype.getUpdateGcps = function(){
	var response = {};
	var actualGcps = this.getGcps();
	var removeGcp = goog.array.clone(this._gcps['gcps']);
	for (var i = 0; i < actualGcps['gcps'].length; i++){
		// check if new gcp is within the old gcps
		for (var j = 0; j < removeGcp.length; j++){
			if (this._isSameGcp(actualGcps['gcps'][i], removeGcp[j])){
				removeGcp.splice(j, 1);
			}				
		};
	};
	
	// create response
	response['new'] = actualGcps;
	response['remove'] = goog.object.clone(this._gcps);
	response['remove']['gcps'] = removeGcp;
	return response;
};

/**
 * @return {boolean}
 */
vk2.georeference.MesstischblattGcpHandler.prototype.isUpdateState = function(){
	return this._isUpdateState;
};

vk2.georeference.MesstischblattGcpHandler.prototype.isValide = function(){
	if (this._featureSource.getFeatures().length === 4)
		return true
	return false;
};

/**
 * @param {Object} gcps
 */
vk2.georeference.MesstischblattGcpHandler.prototype.registerGcps = function(gcps){
	this._gcps = gcps;
	this._parseMtbCornerPoints(this._gcps);
	this._isUpdateState = this._checkIfUpdateState(this._gcps);
};

/**
 * @enum {string}
 */
vk2.georeference.MesstischblattGcpHandler.EventType = {
		UPDATE: 'update'
};