goog.provide('VK2.Layer.HoverLayer');

/**
 * @constructor
 */
VK2.Layer.HoverLayer = function(){
	
	var obj = {}
	
	/**
	 * @type {Object}
	 * @public
	 */
	var _style = OpenLayers.Util.extend({}, OpenLayers.Feature.Vector.style['default']) 
	_style.fillOpacity = 0.2;
	_style.strokeColor = "blue";
	_style.fillColor = "blue";
	_style.strokeWidth = 3;
	
	obj = new OpenLayers.Layer.Vector("HoverLayer",{
        'displayInLayerSwitcher':false,
        'maxResolution': 305.74811309814453,
        visibility: false,
        style: _style
    });
	
	obj._style = _style;
	
	
	
	// create initiale geometry for preventing OpenLayers Error 
	obj.updateGeometry = function(geom){
		this.removeAllFeatures();
		var geometry = geom ? geom : new OpenLayers.Bounds(1521175.510958, 6568187.683823, 1539726.583989, 6585780.297411).toGeometry();
		var feature = new OpenLayers.Feature.Vector(geometry);
		this.addFeatures([feature]);
	}

	obj.activate = function(){
		
		if (this.map){
			
			var map = this.map;
			var layerIndex = map.getLayerIndex(this) + 1;
			
			if ( map.getNumLayers() > layerIndex){
				map.setLayerIndex(this, map.getNumLayers() + 1);
			}
			
			this.setVisibility(true);
		}
	}

	obj.deactivate = function(){
		
		if (this.map){		
			this.setVisibility(false);
		}
	}

	return obj;
}
