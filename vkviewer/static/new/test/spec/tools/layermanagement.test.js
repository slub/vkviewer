goog.require('VK2.Tools.LayerManagement');

describe('Test VK2.Tools.LayerManagement', function() {
	
	it('Test if the LayerManagement object is correctly loaded', function(){
		var parentElement = goog.dom.createElement('div');
		var testLayer = new VK2.Layer.HistoricMap({
			'time':1912,
			'projection':'EPSG:900913'
		});
	
		var layerMan = new VK2.Tools.LayerManagement(parentElement, testLayer);
		expect(layerMan).toBeTruthy();
		
		// check if container element is added
		var testEl = goog.dom.getElementByClass('overlayElemDiv', parentElement);
		expect(testEl).toBeTruthy();
	});
});