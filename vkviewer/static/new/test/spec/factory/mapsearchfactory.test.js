goog.require('vk2.factory.MapSearchFactory');

describe('Test vk2.factory.MapSearchFactory', function() {

	it('Test if MapSearchFactory correctly produce a search record element', function(){
		var feature = getFeatureMoch({'time':1912,'title':'Zinn','mtbid':111, 'georeference':1});
		var response = vk2.factory.MapSearchFactory.getMapSearchRecord(feature);
		
		console.log('Test response of MapSearchFactory getMapSearchRecord method');
		console.log(response);
		
		expect(response).toBeTruthy();
		expect(response.id).toEqual('111');
		expect(response.innerHTML).toMatch(/<div class="timestamp">1912<\/div>/);
		expect(response.innerHTML).toMatch(/<img alt="..." src="http:\/\/fotothek.slub-dresden.de\/thumbs\/df\/dk\/0010000\/undefined.jpg">/);
	});
	
});
