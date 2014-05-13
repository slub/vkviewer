goog.require('VK2.Tools.MinimizeMesstischblattView');

goog.require('goog.dom');

describe('Test VK2.Tools.MinimizeMesstischblattView', function() {
	
	it('Test correct initilization of SearchTable', function(){
		var parentElement = goog.dom.createElement('div');
		var minimizeView = new VK2.Tools.MinimizeMesstischblattView(parentElement);
		
		expect(minimizeView).toBeTruthy();
	});
});