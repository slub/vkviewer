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

			var zoomifyParams = VK2.Utils.Georef.parseZoomifyParamsFromUrl();
			var zoomifyLayer = VK2.Utils.Georef.createZoomifyLayer(zoomifyParams['layer_name'], zoomifyParams['zoomify_url'],
					zoomifyParams['zoomify_width'], zoomifyParams['zoomify_height'])
					
			// options for the georeferencer map
			var options = {
				units: "pixels",
				maxExtent: new OpenLayers.Bounds(0,0,zoomifyParams['zoomify_width'], zoomifyParams['zoomify_height']),
				maxResolution: Math.pow(2, zoomifyLayer.numberOfTiers-1),
				numZoomLevels: 10, //zoomify.numberOfTiers,
				controls: [
		                new OpenLayers.Control.Navigation(),
		                new OpenLayers.Control.PanZoomBar({zoomWorldIcon:true}),
		                new OpenLayers.Control.Attribution()]
			};
			
			var map = new OpenLayers.Map( mapContainer, options);
			map.addLayer(zoomifyLayer)
			map.zoomToMaxExtent();
		
			return map;
		}, 
		
		getGeoreferenceTools: function(toolsPanel, toolsHandle, map){
			var vectors = this.loadGeoreferenceTools(map);
			this.loadGeoreferenceTabSlider(toolsPanel, toolsHandle);
			return vectors;
		},
		
		loadGeoreferenceTools: function(map){
			
			// load vector layer with specific stylemap amd specifc renderer
			var renderer = OpenLayers.Util.getParameters(window.location.href).renderer;
			renderer = (renderer) ? [renderer] : OpenLayers.Layer.Vector.prototype.renderers;
			
			var vectors = new OpenLayers.Layer.Vector("Eckpunkte", {
				styleMap: VK2.Styles.FeatureLayerStyles._georeferenceLayerStyles,
				renderers: renderer
			});
			map.addLayer(vectors);
			this.updateVectorPointLayerFromUrl(vectors, 'points');
			return vectors;
		},
		
		loadGeoreferenceTabSlider: function(toolsPanel, toolsHandle){
			$('#'+toolsPanel).tabSlideOut({
			    tabHandle: '.'+toolsHandle,  
			    pathToTabImage: $('#'+toolsHandle).attr('data-open'),       
			    pathToTabImageClose: $('#'+toolsHandle).attr('data-close'),
			    imageHeight: '40px',                               
			    imageWidth: '40px',  
			    speed: 300,           
			    action: 'click',     
			    topPos: '250px',      
			    fixedPosition: false,
			    onLoadSlideOut: true
			});
		},
		
		updateVectorPointLayerFromUrl: function(vectors, queryParam){
			if (VK2.Utils.get_url_param(queryParam) !== ""){
				returnpoints = VK2.Utils.get_url_param(queryParam).split(",");
				for (zaehler in returnpoints) {
					latLon = returnpoints[zaehler];
					latLon = latLon.replace (/:/g, ",");
					latLon = latLon.split(",");
					kringel = new OpenLayers.Geometry.Point(latLon[0], latLon[1]);
					vectors.addFeatures([new OpenLayers.Feature.Vector(kringel)]);
				}	
			}
		},
		

		
		
}
	

