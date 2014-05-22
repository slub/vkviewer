goog.provide('vk2.georeference.gcp.GcpHandler');

goog.require('goog.object');
goog.require('goog.events');
goog.require('vk2.georeference.gcp.AbstractGcpControl');

/**
 * @param {vk2.georeference.ZoomifyViewer} zoomifyViewer
 * @param {ol.source.Vector} featureSource
 * @param {boolean} isMesstischblatt
 * @constructor
 */
vk2.georeference.gcp.GcpHandler = function(zoomifyViewer, featureSource, isMesstischblatt){
	
	/**
	 * @type {vk2.georeference.ZoomifyViewer}
	 * @private
	 */
	this._zoomifyViewer = zoomifyViewer;
	
	/**
	 * @type {ol.source.Vector}
	 * @private
	 */
	this._featureSource = featureSource;
	
	/**
	 * @type {boolean} 
	 * @private
	 */
	this._isMesstischblatt = goog.isDef(isMesstischblatt) && goog.isBoolean(isMesstischblatt) ? isMesstischblatt : false;
	
	/**
	 * @type {Object}
	 * @private
	 */
	this._gcps = {
			'source':'pixel',
			'target':'EPSG:4314'
	};
	Proj4js.defs["EPSG:4314"] = "+proj=longlat +ellps=bessel +towgs84=598.1,73.7,418.2,0.202,0.045,-2.455,6.7 +no_defs";
	
	if (this._isMesstischblatt){
		/**
		 * @type {Object} 
		 * @private
		 */
		this._corners = {};
		this._parseMtbCornerPoints();
		this._appendUpdateEventBehavior(2);
	};
	
	goog.base(this);
};
goog.inherits(vk2.georeference.gcp.GcpHandler, goog.events.EventTarget);

/**
 * @private
 */
vk2.georeference.gcp.GcpHandler.prototype._parseMtbCornerPoints = function(){
	// parse gcps
	var gcpElements = goog.dom.getElementsByClass('hidden-gcps');
	var parsedGcps = [];
	for (var i = 0; i < gcpElements.length; i++){
		parsedGcps.push(JSON.parse(gcpElements[i].value));
	};
	
	// handling special case that only coordinates are delivered
	if (parsedGcps.length > 0 && parsedGcps[0]['pixel'] === ""){

		
		var coords = [];
		for (var i = 0; i < parsedGcps.length; i++){
			var parsed_coord = parsedGcps[i]['coords'].split(',');
			coords.push([parseFloat(parsed_coord[0]),parseFloat(parsed_coord[1])])
		};
				
		// identifiy  and parse corners
		var lowX = coords[0][0], lowY = coords[0][1]; 
		for (var i = 0; i < coords.length; i++){
			if (coords[i][0] < lowX)
				lowX = coords[i][0];
			if (coords[i][1] < lowY)
				lowY = coords[i][1];
		};
		
		for (var i = 0; i < coords.length; i++){
			if (coords[i][0] === lowX && coords[i][1] === lowY)
				this._corners['llc'] = coords[i];
			if (coords[i][0] === lowX && coords[i][1] > lowY)
				this._corners['ulc'] = coords[i];
			if (coords[i][0] > lowX && coords[i][1] === lowY)
				this._corners['lrc'] = coords[i];
			if (coords[i][0] > lowX && coords[i][1] > lowY)
				this._corners['urc'] = coords[i];
		};
	};
};

/**
 * @param {number} min_count_features
 * @private
 */
vk2.georeference.gcp.GcpHandler.prototype._appendUpdateEventBehavior = function(min_count_features){
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
				if (allFeatures.length < 2)
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
				this.dispatchEvent(new goog.events.Event(vk2.georeference.gcp.GcpHandler.EventType.UPDATE,{'target':this}));
			};
		}, this);
		
		this._featureSource.on('removefeature', function(event){
			if (constraints['min_features'](event)){
				this.dispatchEvent(new goog.events.Event(vk2.georeference.gcp.GcpHandler.EventType.UPDATE,{'target':this}));
			};
		}, this);
		

//	this._featureSource.on('removefeature', function(event){
//		console.log('Fire update event');
//	}, this);
};

/**
 * @param {Array.<number>} coordinates
 * @private
 */
vk2.georeference.gcp.GcpHandler.prototype._getMtbCornerType = function(coordinates){
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
 * @param {Array.<number>} pixel_coordinates
 * @param {number} height
 * @private
 * @returns {Array.<number>}
 */
vk2.georeference.gcp.GcpHandler.prototype._transformPixelToGeoCoords = function(pixel_coordinates, height){
	return [Math.round(pixel_coordinates[0]), Math.round(-1*pixel_coordinates[1])];
};

/**
 * @returns {Array<Object>}
 */
vk2.georeference.gcp.GcpHandler.prototype.getGcps = function(){
	var features = this._featureSource.getFeatures();
	var gcps = [];
	for (var i = 0; i < features.length; i++){
		// detect corner typ and display on reference map
		var unreference_coords = this._transformPixelToGeoCoords(features[i].getGeometry().getCoordinates(), this._zoomifyViewer.getHeight());
		var cornerType = this._getMtbCornerType(unreference_coords);
		
		if (goog.DEBUG)
			console.log('Cornertype: '+cornerType);
		
		var reference_coords = ol.proj.transform(this._corners[cornerType], 'EPSG:900913', 'EPSG:4314');
		gcps.push({'source':unreference_coords,'target':reference_coords});		
	};
	
	var response = goog.object.clone(this._gcps);
	response['gcps'] = gcps;
	console.log(response);
	return gcps;
};

vk2.georeference.gcp.GcpHandler.prototype.isValide = function(){
	if (this._isMesstischblatt){
		if (this._featureSource.getFeatures().length === 4){
			return true
		} 
		return false;
	}
	return true;
};

/**
 * @enum {string}
 */
vk2.georeference.gcp.GcpHandler.EventType = {
		UPDATE: 'update'
};