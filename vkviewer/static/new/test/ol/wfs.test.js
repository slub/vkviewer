describe('Test OpenLayers WFS parser', function() {
	var test = function(data){
		console.log(data);
		try {
	        var config = {
	                'featureNS': 'http://mapserver.gis.umn.edu/mapserver',
	                'featureType': 'Historische_Messtischblaetter_WFS'
	        };
	        features = new ol.format.WFS(config).readFeatures(data);
		} catch (e) {
			console.log(e);
		}
	};
	
	// send http request for getting the testing data
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function(e){
		var response = e.currentTarget;
		test(response.responseText)
//		if (response.status == 200 && response.readyState == 4) {
//			//txt = xmlhttp.responseText;
//		}
	};
	xmlhttp.open("GET","http://localhost:8765/test/wfs/wfs-data.xml",true);
	xmlhttp.send();
})