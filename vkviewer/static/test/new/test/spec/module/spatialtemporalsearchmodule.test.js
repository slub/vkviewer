goog.require('vk2.module.SpatialTemporalSearchModule');
goog.require('goog.dom');
goog.require('goog.events');

describe('Test vk2.module.SpatialTemporalSearchModule', function() {


	
	it('Test if SpatialTemporalSearchModule is initialize correctly', function(){
		var parentEl = goog.dom.createDom('div',{'id':'container'});
		var response = new vk2.module.SpatialTemporalSearchModule(parentEl, {});
		
		console.log('Initialize test response of SpatialTemporalSearchModule');
		console.log(response);
		
		expect(response).toBeTruthy();
		expect(parentEl.innerHTML).toMatch(/<div class="spatialsearch-container">/);
		expect(parentEl.innerHTML).toMatch(/<div class="body-container">/);
		expect(response.getTimesliderTool()).toBeTruthy();
		expect(response.getGazetteerSearchTool()).toBeTruthy();
		expect(response.getMapSearchModule()).toBeTruthy();
	});

});