goog.require('vk2.module.MapSearchModule');
goog.require('goog.dom');
goog.require('goog.events');

describe('Test vk2.module.MapSearchModule', function() {

	var moch_features = [
	      getFeatureMoch({'time':1912,'titel':'CCC','mtbid':112, 'georeference':1}),
	      getFeatureMoch({'time':1911,'titel':'BBB','mtbid':111, 'georeference':1}),
	      getFeatureMoch({'time':1913,'titel':'AAA','mtbid':113, 'georeference':1})
	];
	
	it('Test if MapSearchModule is initialize correctly', function(){
		var parentEl = goog.dom.createDom('div',{'id':'container'});
		var response = new vk2.module.MapSearchModule(parentEl);
		
		console.log('Initialize test response of MapSearchModule');
		console.log(response);
		
		expect(response).toBeTruthy();
		expect(parentEl.innerHTML).toMatch(/<div class="mapsearch-container">/);
		expect(parentEl.innerHTML).toMatch(/<div data-type="time" class="sort-element time">time <span class="caret caret-reversed"><\/span><\/div>/);
		expect(parentEl.innerHTML).toMatch(/<div data-type="title" class="sort-element title">title <span class="caret caret-reversed"><\/span><\/div>/);
		expect(parentEl.innerHTML).toMatch(/<div data-type="georeference" class="sort-element georeference">georeference <span class="caret caret-reversed"><\/span><\/div>/);
	});
	
	it('Test if MapSearchModule correctly update features', function(){
		var parentEl = goog.dom.createDom('div',{'id':'container'});
		var mapsearchModule = new vk2.module.MapSearchModule(parentEl);
		mapsearchModule.updateFeatures(moch_features);
		
		var featureList = goog.dom.getElementByClass('mapsearch-contentlist', parentEl);
		
		console.log('Feature list of MapSearchModule');
		console.log(featureList);
		
		expect(parentEl.innerHTML).toMatch(/<img alt="" src="http:\/\/fotothek.slub-dresden.de\/thumbs\/df\/dk\/0010000\/undefined.jpg">/);
		expect(parentEl.innerHTML).toMatch(/<li class="mapsearch-record" id="111">/);
		expect(parentEl.innerHTML).toMatch(/<li class="mapsearch-record" id="112">/);
		expect(parentEl.innerHTML).toMatch(/<li class="mapsearch-record" id="113">/);
	});
	
	it('Test if MapSearchModule sort behavior is function', function(){
		var parentEl = goog.dom.createDom('div',{'id':'container'});
		var mapsearchModule = new vk2.module.MapSearchModule(parentEl);
		mapsearchModule.updateFeatures(moch_features);
		
		// sort for time
		mapsearchModule._searchFeatures.sortFeatures('time');		
		var features = mapsearchModule.getFeatures();
		expect(features[1].get('time')).toEqual(1912);
		
		// sort for titel
		mapsearchModule._searchFeatures.sortFeatures('title');		
		var features = mapsearchModule.getFeatures();
		expect(features[0].get('titel')).toEqual('AAA');
	});
	
	it('Test if MapSearchModule sort and update list behavior is function', function(){
		var parentEl = goog.dom.createDom('div',{'id':'container'});
		var mapsearchModule = new vk2.module.MapSearchModule(parentEl);
		mapsearchModule.updateFeatures(moch_features);
		
		// sort for time
		mapsearchModule._sortFeatures('time');	
		var list_elements = goog.dom.getElementsByClass('mapsearch-record', parentEl);
		expect(list_elements[0].id).toEqual('111');	
	});
	
	it('Test if MapSearchModule click event works', function(){
		var parentEl = goog.dom.createDom('div',{'id':'container'});
		var mapsearchModule = new vk2.module.MapSearchModule(parentEl);
		mapsearchModule.updateFeatures(moch_features);
		
		// register event
		var counter = 0;
		goog.events.listen(mapsearchModule, 'addmtb', function(e){
			counter++;
		});
		
		var list_elements = goog.dom.getElementsByClass('mapsearch-record', parentEl);
		for (var i = 0; i < list_elements.length; i++){
			$(list_elements[i]).click();
		};
		
		expect(i).toEqual(3);
	});
});