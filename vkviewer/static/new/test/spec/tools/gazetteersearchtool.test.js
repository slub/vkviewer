goog.require('vk2.tool.GazetteerSearch');
goog.require('goog.dom');
goog.require('goog.dom.classes');

describe('Test vk2.tool.GazetteerSearch', function() {
	
	it('Test if the GazetteerSearch object is correctly loaded', function(){
		var parentElement = goog.dom.createElement('div');
		var testGazetteer = new vk2.tool.GazetteerSearch(parentElement);
	
		expect(testGazetteer).toBeTruthy();
		expect(goog.dom.getElementByClass('gazetteersearch-input', parentElement)).toBeTruthy();
		// check if container element is added
		expect(goog.dom.getElementByClass('ui-autocomplete-input', parentElement)).toBeTruthy();
	});
	
	it('Test if the GazetteerSearch correctly produce the events', function(){
		
		// build up test environment
		var parentElement = goog.dom.createElement('div');
		var testGazetteer = new vk2.tool.GazetteerSearch(parentElement);
		var flag = false;
		var responseEvent = null;
		var targetEvent = {'lonlat':'testtest'};
		var listener = function(event){
			console.log(event);
			responseEvent = event;
			flag = true;
		};
		goog.events.listenOnce(testGazetteer, 'jumpto',listener);
		
		runs(function(){
			testGazetteer._dispatchJumpToEvent(targetEvent);
		});
		
		waitsFor(function(){
			return flag;
		}, 'The waitFor block fails',50);
		
		runs(function(){
			expect(flag).toBeTruthy();
			expect(responseEvent.target).toEqual(targetEvent);
		});
	});
});