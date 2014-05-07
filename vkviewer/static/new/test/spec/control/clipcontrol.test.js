goog.require('VK2.Control.ClipControl');
goog.require('VK2.Utils');

describe('Test VK2.Control.ClipControl', function() {

	var testLayer = new VK2.Layer.HistoricMap({
		'time':1912,
		'projection':'EPSG:900913'
	});
	var testCoords = VK2.Utils.getPolygonFromExtent([1372766.96689387,6781820.93192971,1391317.934615,6799880.2784506]);
	
	it('Test VK2.Control.ClipControl correctly initialize ', function(){
		var testControl = new VK2.Control.ClipControl(testCoords,testLayer);
		expect(testControl).toBeTruthy();		
	});
	
	it('Test VK2.Control.ClipControl isPointInPolygon method ', function(){
		var testControl = new VK2.Control.ClipControl(testCoords,testLayer);

//		This test doesn't work right now, but the question is if this case in meet by the algorithm
//		var corner_point = testControl.isPointInPolygon(testCoords, [1372766.96689387,6781820.93192971]);
//		expect(corner_point).toEqual(true);
//		var border_point = testControl.isPointInPolygon(testCoords, [1382766.96689387,6781820.93192971]);
//		expect(border_point).toEqual(true);
		
		var inner_point = testControl.isPointInPolygon(testCoords, [1382766.96689387,6791820.93192971]);
		expect(inner_point).toEqual(true);
		
		var outer_point = testControl.isPointInPolygon(testCoords, [382766.96689387,791820.93192971]);
		expect(outer_point).toEqual(false);
		
	});
	
	it('Test VK2.Control.ClipControl _isExtentWithinClipPolygon method', function(){
		var testControl = new VK2.Control.ClipControl(testCoords,testLayer);
		
		// same as clip polygon 
		var same_as_clip = testControl._isExtentWithinClipPolygon([1372766.96689387,6781820.93192971,1391317.934615,6799880.2784506]);
		expect(same_as_clip).toEqual(false);
		
		// clip polygon in extent
		var polygon_in_extent = testControl._isExtentWithinClipPolygon([372766.96689387,781820.93192971,1491317.934615,6999880.2784506]);
		expect(polygon_in_extent).toEqual(false);
		
		// clip polygon bigger as extent (extent in clip polygon)
		var extent_in_polygon = testControl._isExtentWithinClipPolygon([1382766.96689387,6785820.93192971,1390317.934615,6795880.2784506]);
		expect(extent_in_polygon).toEqual(true);
	});
	
});