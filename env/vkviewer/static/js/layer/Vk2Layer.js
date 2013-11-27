/**
 * Function: createVk2LayerObject
 * Creates a Vk2Layer object. 
 * 
 * @params: see initConfiguration.timeParameter
 * @return {Vk2Layer}
 */
VK2.Layer.Vk2Layer = function(params){
	var vk2Layer = new OpenLayers.Layer.WMS(params.layer,
        params.wms,
        {
                layers: params.layer,
                type:	"png",
                format: "image/png",
                transparent: 'true',
                time: params.time
        },{
                isBaseLayer: false,
                visibility: true,
                projection: new OpenLayers.Projection(params.srsName)
        }
    );
	
	vk2Layer.timeFtLayer = new VK2.Layer.TimeFeatureLayer(	
			vk2Layer,
	        new OpenLayers.Protocol.WFS({
	            "url": params.wms,
	            "geometryName": params.geometryName,
	            "featureNS" :  params.featureNS,
	            "featurePrefix": params.featurePrefix,
	            "featureType": params.featureType,
	            "srsName": params.srsName,
	            "maxFeatures": params.maxFeatures,
	            "version": params.serviceVersion
	        })
	);
	
	vk2Layer.wfsLayer = new OpenLayers.Layer.Vector(params.featureType,{
        'displayInLayerSwitcher':false,
        styleMap: new OpenLayers.StyleMap({
            fillColor: "#ee9900",
            fillOpacity: "0.5"
        }),
        strategies: [
            new OpenLayers.Strategy.BBOX(),
            new OpenLayers.Strategy.Refresh({force: true, active: true})
        ],
        protocol: new OpenLayers.Protocol.WFS({
            "url": params.wms,
            "geometryName": params.geometryName,
            "featureNS" :  params.featureNS,
            "featurePrefix": params.featurePrefix,
            "featureType": params.featureType,
            "srsName": params.srsName,
            "maxFeatures": params.maxFeatures,
            "version": params.serviceVersion
         })
    });
	
	vk2Layer.id = OpenLayers.Util.createUniqueID(params.layer.split(" ").join("_") + "_");
	vk2Layer.isTime = true;
	vk2Layer.thumbnail = "/vkviewer/static/images/layer_default.png";
	vk2Layer.extent = params.extent;
    return vk2Layer;
};