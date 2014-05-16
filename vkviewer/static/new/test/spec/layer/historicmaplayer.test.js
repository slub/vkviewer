goog.require('vk2.layer.HistoricMap');
goog.require('goog.dom');
goog.require('goog.events');

describe('Test vk2.layer.HistoricMap', function() {

	
	it('Test if HistoricMap is initialize correctly', function(){
		var layer = new vk2.layer.HistoricMap({
			'time':1925,
			'border': [[1521174.279003, 6621076.134534], [1521174.279003,6638782.444995], [1539725.34154, 6638782.444995],
			           [1539725.34154, 6621076.134534], [1521174.279003, 6621076.134534]],
			'map':{},
			'extent': [1521174.279003, 6621076.134534, 1539725.34154, 6638782.444995]
		});
		
		console.log('Initialize test response of HistoricMap');
		console.log(layer);
		
		expect(layer).toBeTruthy();
		expect(layer.getDisplayInLayerManagement()).toEqual(true);
		expect(layer.getTitle()).toEqual(undefined);
		expect(layer.getTime()).toEqual(1925);
		
		var layer1 = new vk2.layer.HistoricMap({
			'title': 'Dresden 1925', 
			'thumbnail': '...',
			'time':1925,
			'border': [[1521174.279003, 6621076.134534], [1521174.279003,6638782.444995], [1539725.34154, 6638782.444995],
			           [1539725.34154, 6621076.134534], [1521174.279003, 6621076.134534]],
			'map':{},
			'extent': [1521174.279003, 6621076.134534, 1539725.34154, 6638782.444995],
			'displayinlayermanagement': false,
			'id': '71055582',
			'metadata': {
				'blattnr':'49_48',
				'original':'http://fotothek.slub-dresden.de/fotos/df/dk/0010000/df_dk_0010001_4948_1930.jpg',
				'permalink':'http://digital.slub-dresden.de/id33591876X'
			}
		});
		expect(layer1).toBeTruthy();
		expect(layer1.getDisplayInLayerManagement()).toEqual(false);
		expect(layer1.getTitle()).toEqual('Dresden 1925');
		expect(layer1.getThumbnail()).toEqual('...');
		expect(layer1.getId()).toEqual('71055582');
		expect(layer1.getMetadata()).toBeTruthy();
	});
});