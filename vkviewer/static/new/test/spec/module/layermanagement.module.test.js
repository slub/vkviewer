goog.require('vk2.module.LayerManagementModule');
goog.require('goog.dom');
goog.require('goog.events');

describe('Test vk2.module.LayerManagementModule', function() {

	var getMochMap = function(parentContainer){
		return new ol.Map({
			layers: [new ol.layer.Tile({ source: new ol.source.OSM()})],
			renderer: 'canvas',
			target: parentContainer,
			view: new ol.View2D({
				projection: 'EPSG:900913',
				center: [1531627.8847864927, 6632124.286850829],
				zoom: 7
			})
		})
	};
	
	it('Test if LayerManagementModule is initialize correctly', function(){
		var parentEl = goog.dom.createDom('div',{'id':'container'});
		var map = getMochMap('container');
		var layerbar = new vk2.module.LayerManagementModule(parentEl, map.getLayers());
		
		console.log('Initialize test response of LayerManagementModule');
		console.log(layerbar);
		console.log(map.getLayers());
		
		expect(layerbar).toBeTruthy();
		expect(layerbar.getLayers().length).toEqual(1);
		expect(parentEl.innerHTML).toMatch(/<div class="layermanagement-container"><div class="heading"><span class="header-label">undefined<\/span><\/div><div class="layermanagement-body"><\/div><\/div>/);
	});
});