goog.require('VK2.Layer.MapSearch');

describe('Test VK2.Layer.MapSearch', function() {
	
	it('Expect timeArr start values to be 1868 and 1945', function(){
		var testLayer = new VK2.Layer.MapSearch({
			'projection':'EPSG:900913'
		});
		var timeArr = testLayer._timeArr;
		expect(timeArr.START).toEqual(1868);
		expect(timeArr.END).toEqual(1945);
	});
	
	it('Test change setTimeFilter function 1', function(){
		var testLayer = new VK2.Layer.MapSearch({
			'projection':'EPSG:900913'
		});		
		testLayer.setTimeFilter(1900, undefined);
		var timeArr = testLayer._timeArr;
		expect(timeArr.START).toEqual(1900);
		expect(timeArr.END).toEqual(1945);
	});
	
	it('Test change setTimeFilter function 2', function(){
		var testLayer = new VK2.Layer.MapSearch({
			'projection':'EPSG:900913'
		});
		testLayer.setTimeFilter(undefined, 1920);
		var timeArr = testLayer._timeArr;
		expect(timeArr.START).toEqual(1868);
		expect(timeArr.END).toEqual(1920);
	});
	
	it('Test change setTimeFilter function 3', function(){
		var testLayer = new VK2.Layer.MapSearch({
			'projection':'EPSG:900913'
		});
		testLayer.setTimeFilter(1900, 1920);
		var timeArr = testLayer._timeArr;
		expect(timeArr.START).toEqual(1900);
		expect(timeArr.END).toEqual(1920);
	});
	
	it('The function should throw a error because of invalide parameters', function(){
		var testLayer = new VK2.Layer.MapSearch({
			'projection':'EPSG:900913'
		});
		var testFunction = function(){
			testLayer.setTimeFilter(1920, 1900);
		};
		
		expect(testFunction).toThrow();
		var timeArr = testLayer._timeArr;
		expect(timeArr.START).toEqual(1868);
		expect(timeArr.END).toEqual(1945);
	});
});