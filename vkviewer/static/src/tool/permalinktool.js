goog.provide('vk2.tool.Permalink');

goog.require('goog.Uri');
goog.require('goog.Uri.QueryData');
goog.require('goog.net.XhrIo');
goog.require('goog.events.Event');
goog.require('goog.events.EventTarget');
goog.require('goog.events.EventType');
goog.require('vk2.request.WFS');

/**
 * @param {ol.Map} map
 * @constructor
 * @extends {goog.events.EventTarget}
 */
vk2.tool.Permalink = function(map){
	
	/**
	 * @type {ol.Map}
	 * @private
	 */
	this._map = map;
	
	this._parsePermalink();
	
	goog.base(this);
};
goog.inherits(vk2.tool.Permalink, goog.events.EventTarget);

/**
 * @private
 */
vk2.tool.Permalink.prototype._parsePermalink = function(){
	if (goog.isDef(this._map)){
		var actual_href = new goog.Uri(window.location.href);
		var qData = actual_href.getQueryData();
		
		if (qData.containsKey('z') && qData.containsKey('c')){
			// zoom to given center
			var center = qData.get('c').split(',')
			this._map.getView().setCenter([parseInt(center[0]),parseInt(center[1])]);
			this._map.getView().setZoom(parseInt(qData.get('z')));
		};	
		
		if (qData.containsKey('oid')){
			objectids = qData.get('oid').split(',');
			
			// remove empty strings
			for (var i = 0; i < objectids.length; i++){
				if (objectids[i] == '')
					objectids.splice(i, 1);
			};
			
			var wfsrequest = vk2.request.WFS.getFeatureRequestForObjectIds(objectids);
			
			if (goog.DEBUG){
				console.log(objectids);
				console.log(wfsrequest);
			};
			
			// get features from server
			goog.net.XhrIo.send(wfsrequest, goog.bind(function(e){
				var xhr = /** @type {goog.net.XhrIo} */ (e.target);
		    	var data = xhr.getResponseXml() ? xhr.getResponseXml() : xhr.getResponseText();
		    	xhr.dispose();
		    	var parser = new ol.format.WFS(vk2.settings.WFS_PARSER_CONFIG['mtbows']);
		    	var features = parser.readFeatures(data);
		    	
		    	if (goog.DEBUG)
		    		console.log(features);
		    	
		    	// dispatch addmtb events
		    	for (var i = 0; i < features.length; i++){
		    		this.dispatchEvent(new goog.events.Event(vk2.tool.Permalink.EventType.ADDMTB,{'feature':features[i]}));
		    	};
		    }, this), 'GET');
		}
	};
};

/**
 * @return {string}
 */
vk2.tool.Permalink.prototype.createPermalink = function(){
	if (goog.isDef(this._map)){
		var layers = this._map.getLayers();
		
		// get objectids
		var objectids = '';
		layers.forEach(function(layer){
			if (goog.isDef(layer.getId)){
				objectids += layer.getId() + ',';
			};
		});
		
		// get zoom & center
		var center = this._map.getView().getCenter();
		var zoom = this._map.getView().getZoom();
		
		// create permalink
		var permalink = new goog.Uri(window.location.origin + '/vkviewer/?welcomepage=off');
		var qData = permalink.getQueryData();
		
		// append zoom, center and objectids to queryData
		qData.set('z',zoom);
		qData.set('c',center[0]+','+center[1]);
		qData.set('oid', objectids);
		permalink.setQueryData(qData);
		
		if (goog.DEBUG){
			console.log(objectids);
			console.log(permalink.toString());
		};
		
		return permalink.toString();
	};	
};

/**
 * @enum {string}
 */
vk2.tool.Permalink.EventType = {
		ADDMTB: 'addmtb'
};