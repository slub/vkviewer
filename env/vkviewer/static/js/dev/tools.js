var getMap = function(div){
	var map = new OpenLayers.Map(div,{
		projection: new OpenLayers.Projection("EPSG:900913"),
        displayProjection: new OpenLayers.Projection("EPSG:900913"),
        units: "m",
        maxExtent: new OpenLayers.Bounds(1175366.9698897,6434961.1964864,1958082.1394209,6834879.7284188),
        resolutions : [38.21851413574219, 19.109257067871095, 9.5546285339355475, 4.7773142669677737, 2.3886571334838869, 1.1943285667419434],
        maxResolution: 38.21851413574219,
        controls: [
                  new OpenLayers.Control.Navigation(),
                  new OpenLayers.Control.PanZoom(),
                  new OpenLayers.Control.Attribution()
        ] 
	})
	
	// add layer osm mapnik
	//var layerMapnik = new OpenLayers.Layer.OSM("Mapnik");
	//map.addLayer(layerMapnik);
	
	// add layer google street
    var gmap = new OpenLayers.Layer.Google(
            "Google Streets", // the default
            {numZoomLevels: 20}
            // default type, no change needed here
    );
	map.addLayer(gmap);
	
//	var mapnik = new OpenLayers.Layer.OSM("OSM Mapnik");
//	map.addLayer(mapnik);
	
	map.zoomToExtent(new OpenLayers.Bounds(1175366.9698897,6434961.1964864,1958082.1394209,6834879.7284188));
	return map;
}