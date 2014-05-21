goog.require('vk2.tool.SearchList');
goog.require('goog.dom');
goog.require('goog.events');

describe('Test vk2.tool.SearchList', function() {

	var moch_features = [
	      getFeatureMoch({'time':1912,'titel':'CCC','mtbid':112, 'georeference':1}),
	      getFeatureMoch({'time':1911,'titel':'BBB','mtbid':111, 'georeference':1}),
	      getFeatureMoch({'time':1913,'titel':'AAA','mtbid':113, 'georeference':1})
	];
	
	it('Test if SearchList is initialize correctly', function(){
		var searchrecord = new vk2.tool.SearchList(moch_features);
		expect(searchrecord).toBeTruthy();
	});
	
	it('Test sorting', function(){
		var searchrecord = new vk2.tool.SearchList(moch_features);
		
		searchrecord.sort('time', true);
		features = searchrecord.getAllFeatures();
		expect(features[0].get('time')).toEqual(1911);
		expect(features[2].get('time')).toEqual(1913);
		
		searchrecord.sort('title');
		features = searchrecord.getAllFeatures();
		expect(features[0].get('titel')).toEqual('AAA');
		expect(features[2].get('titel')).toEqual('CCC');
	});
	
	it('Test getFeaturesIncremental() with descending order', function(){
		var moch_features = [
		           	      getFeatureMoch({'time':1912,'titel':'CCC','mtbid':112, 'georeference':1}),
		           	      getFeatureMoch({'time':1911,'titel':'BBB','mtbid':111, 'georeference':1}),
		           	      getFeatureMoch({'time':1913,'titel':'AAA','mtbid':113, 'georeference':1})
		];
		var searchrecord = new vk2.tool.SearchList(moch_features);
		var allFeatures = searchrecord.getAllFeatures();
		expect(allFeatures).toBeTruthy();
		
		// descending
		searchrecord.setInterval(1);
		var features = searchrecord.getFeaturesIncremental();
		expect(features.length).toEqual(1);
		expect(features[0].get('mtbid')).toEqual(112);
		var features = searchrecord.getFeaturesIncremental();
		expect(features.length).toEqual(1);
		expect(features[0].get('mtbid')).toEqual(111);
		var features = searchrecord.getFeaturesIncremental();
		console.log(features)
		expect(features.length).toEqual(1);
		expect(features[0].get('mtbid')).toEqual(113);		
		var features = searchrecord.getFeaturesIncremental();
		expect(features.length).toEqual(0);
		
	});
	
	it('Test getFeaturesIncremental() with ascending order', function(){
		var moch_features = [
		           	      getFeatureMoch({'time':1912,'titel':'CCC','mtbid':112, 'georeference':1}),
		           	      getFeatureMoch({'time':1911,'titel':'BBB','mtbid':111, 'georeference':1}),
		           	      getFeatureMoch({'time':1913,'titel':'AAA','mtbid':113, 'georeference':1})
		];
		var searchrecord = new vk2.tool.SearchList(moch_features);
		var allFeatures = searchrecord.getAllFeatures();
		expect(allFeatures).toBeTruthy();
		
		// ascending
		searchrecord.setInterval(1);
		searchrecord.setSortOrder('ascending');
		var features = searchrecord.getFeaturesIncremental();
		expect(features.length).toEqual(1);
		expect(features[0].get('mtbid')).toEqual(113);
		var features = searchrecord.getFeaturesIncremental();
		expect(features.length).toEqual(1);
		expect(features[0].get('mtbid')).toEqual(111);
		var features = searchrecord.getFeaturesIncremental();
		expect(features.length).toEqual(1);
		expect(features[0].get('mtbid')).toEqual(112);		
		var features = searchrecord.getFeaturesIncremental();
		expect(features.length).toEqual(0);
	});
});