goog.require('vk2.factory.LayerManagementFactory');

describe('Test vk2.factory.LayerManagementFactory', function() {

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
	
	var getMochHistoMap = function(map){
		return new vk2.layer.HistoricMap({
			'time':1925,
			'border': [[1521174.279003, 6621076.134534], [1521174.279003,6638782.444995], [1539725.34154, 6638782.444995],
			           [1539725.34154, 6621076.134534], [1521174.279003, 6621076.134534]],
			'map':map,
			'extent': [1521174.279003, 6621076.134534, 1539725.34154, 6638782.444995],
			'thumbnail':'http://fotothek.slub-dresden.de/thumbs/df/dk/0010000/df_dk_0010001_4948_1930.jpg',
			'id': '71055582',
			'metadata': {
				'blattnr':'49_48',
				'original':'http://fotothek.slub-dresden.de/fotos/df/dk/0010000/df_dk_0010001_4948_1930.jpg',
				'permalink':'http://digital.slub-dresden.de/id33591876X'
			}
		});
	};
	
	it('Test if LayerManagementFactory correctly produce a search record element', function(){
		var parentEl = goog.dom.createDom('div',{'id':'container'});
		var map = getMochMap('container');
		var layer = getMochHistoMap(map);
		var response = vk2.factory.LayerManagementFactory.getLayerManagementRecord(layer, map);
		
		console.log('Test response of LayerManagementFactory getMapSearchRecord method');
		console.log(response);
		
		expect(response).toBeTruthy();
//		expect(response.id).toEqual('111');
//		expect(response.innerHTML).toMatch(/<div class="timestamp">1912<\/div>/);
//		expect(response.innerHTML).toMatch(/<img alt="..." src="http:\/\/fotothek.slub-dresden.de\/thumbs\/df\/dk\/0010000\/undefined.jpg">/);
	});
	
});
