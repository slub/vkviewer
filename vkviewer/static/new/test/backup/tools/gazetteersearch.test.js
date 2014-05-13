goog.require('VK2.Tools.GazetteerSearch')
//goog.require('VK2.Tools.GazetteerSearch.EventType');
goog.require('goog.dom.classes');

describe('Test VK2.Tools.GazetteerSearch', function() {
	
	it('Test if the GazetteerSearch object is correctly loaded', function(){
		var parentElement = goog.dom.createElement('div');
		var testGazetteer = new VK2.Tools.GazetteerSearch(parentElement);
	
		expect(testGazetteer).toBeTruthy();
		
		// check if container element is added
		expect(goog.dom.classes.has(parentElement, 'ui-autocomplete-input')).toBeTruthy();
	});
	
	it('Test if the GazetteerSearch correctly fires events', function(){
		
		// build up test environment
		var parentElement = goog.dom.createElement('div');
		var testGazetteer = new VK2.Tools.GazetteerSearch(parentElement);
		var flag = false;
		var responseEvent = null;
		var listener = function(event){
			console.log(event);
			responseEvent = event;
			flag = true;
		};
		goog.events.listenOnce(testGazetteer, 'jumpto',listener);
		
		runs(function(){
			testGazetteer.dispatchJumpToEvent();
		});
		
		waitsFor(function(){
			return flag;
		}, 'The waitFor block fails',50);
		
		runs(function(){
			expect(flag).toBeTruthy();
			expect(responseEvent).toBeTruthy();
		});
	});
	
	it('Test if the GazetteerSearch correctly produce the events', function(){
		
		// build up test environment
		var parentElement = goog.dom.createElement('div');
		var testGazetteer = new VK2.Tools.GazetteerSearch(parentElement);
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
			testGazetteer.dispatchJumpToEvent(targetEvent);
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