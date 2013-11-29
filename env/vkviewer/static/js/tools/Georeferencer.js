/**
 * function: addGeoreferencer
 * 
 * This functions adds a sidebar panel + behavior for getting into the georeference process 
 * on the front page.
 */
VK2.Tools.Georeferencer = {
		
		addChooseGeoreferencerMtb: function(linkElement, map){
			
			var _removeGeorefLayer = function(map){
				console.log("Remove Layer!");
				
				// remove the layergrid and select
				var layerGrid = map.getLayersByName("georeferencer_wms_1")[0];
				var select = map.getLayersByName("georeferencer_select_1")[0];
				map.removeLayer(layerGrid);
				map.removeLayer(select);
				
				// remove controls
				var control = map.getControlsBy('name','georeferencer_control_1')[0]
				map.removeControl(control);
			};
			
			var _addGeorefLayer = function(map){
				console.log("Add Layer!");
				
				// add the grid as wms 
				var layerGrid = initConfiguration.georeference_grid.wms;

				// add selectlayer to the map
				var select = new OpenLayers.Layer.Vector("georeferencer_select_1",{
					styleMap: new OpenLayers.Style(OpenLayers.Feature.Vector.style["select"])
				});
				map.addLayers([layerGrid,select]);
				
				// create and register control for handling select feature events
				var control = new OpenLayers.Control.GetFeature({
					name: "georeferencer_control_1",
		            protocol: initConfiguration.georeference_grid.wfs	
				});
				
				control.events.register("featureselected", this, function(e){
					select.addFeatures([e.feature]);
					console.log("MTB "+e.feature.attributes.blattnr+", ID "+e.feature.attributes.id+" holen und anzeigen");

		            // display data in fancybox
					var targetHref = VK2.Utils.getHost('vkviewer/choosegeoref?blattnr=') + e.feature.attributes.blattnr;
		            $.fancybox.open([
		                { 
		                    'href': targetHref,
//		        			'width': '100%',
//		        			'height': '100%',
		        			'type': 'iframe'
		                }
		            ]);
				});
				
				control.events.register("featureunselected", this, function(e) {
					select.removeFeatures([e.feature]);
					console.log("Feature unselected!");
				});
				
				map.addControl(control);
				control.activate();
			};
			
			// on initialize set the status of the linkElement to disabled
			$(linkElement).attr('status','disabled');
			
			// add start and stop georeferencer behavior to the georeferencer sidebar element
			$(linkElement).click(function(){
				var status = $(this).attr('status');
				
				if (status == 'disabled'){
					_addGeorefLayer(map);
					$(this).attr('status','enabled');
				} else if (status == 'enabled'){
					_removeGeorefLayer(map);
					$(this).attr('status','disabled');
				}
			});
		},
		
		initializeGeoreferencerMap: function(mapContainer){
			
			// parse the query parameter from the page call and add a wms to the map
			// via zoomify
			var zoomify_prop = VK2.Utils.get_url_param('zoomify_prop');
			var zoomify_url = VK2.Utils.Georef.getZoomifyUrl(zoomify_prop);
			var zoomify_width = VK2.Utils.get_url_param('zoomify_width');
			var zoomify_height = VK2.Utils.get_url_param('zoomify_height');
			var layer_name = VK2.Utils.get_url_param('layer');

			var zoomify = new OpenLayers.Layer.Zoomify(layer_name, zoomify_url,
					new OpenLayers.Size( zoomify_width, zoomify_height));
			
			// options for the georeferencer map
			var options = {
				units: "pixels",
				maxExtent: new OpenLayers.Bounds(0,0,zoomify_width, zoomify_height),
				maxResolution: Math.pow(2, zoomify.numberOfTiers-1),
				numZoomLevels: 10, //zoomify.numberOfTiers,
		        //resolutions : [12,6,3,1.5,0.75,0.375,0.1875,0.09375],
		        //maxResolution: 12,
				controls: [
		                new OpenLayers.Control.Navigation(),
		                new OpenLayers.Control.PanZoomBar({zoomWorldIcon:true}),
		                new OpenLayers.Control.Attribution()]
			};
			
			var map = new OpenLayers.Map( mapContainer, options);
			map.addLayer(zoomify)
			map.zoomToMaxExtent();
		
			return map;
		}

		
}
	

