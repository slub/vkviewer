goog.require('VK2.Tools.SearchTable');

goog.require('goog.dom');

describe('Test VK2.Tools.SearchTable', function() {
	var headingCols = [{'id':'time', 'title':'Timestamp'},{'id':'titel', 'title':'Title'}];
	var data_moch = function(id, time, title){		
		var obj = {'time':time,'title':title,'mtbid':id};
		obj.get = function(key){
			if (this.hasOwnProperty(key))
				return this.key;
		};
		
		return obj;
	};
	
	it('Test correct initilization of SearchTable', function(){
		var parentElement = goog.dom.createElement('div');

		var searchTable = new VK2.Tools.SearchTable(parentElement, headingCols);
		
		var timeCol = goog.dom.getElementByClass('time', parentElement);
		expect(timeCol).toBeTruthy();
		expect(timeCol.innerHTML).toMatch(/Timestamp/);
		
		var titleCol = goog.dom.getElementByClass('titel', parentElement);
		expect(titleCol).toBeTruthy();
		expect(titleCol.innerHTML).toMatch(/Title/);
	});
	
	it('Simple Test of the refresh methode', function(){
		var parentElement = goog.dom.createElement('div');
		var searchTable = new VK2.Tools.SearchTable(parentElement, headingCols);
		
		var obj1 = data_moch(1,1912,'Hallo1');
		var obj2 = data_moch(2,1913,'Hallo2');
		var obj3 = data_moch(3,1914,'Hallo3');
		var data = [obj1, obj2, obj3];
		
		// check if row count is update correctly
		expect(searchTable.getRowCount()).toEqual(0);
		searchTable.refresh(data);
		expect(searchTable.getRowCount()).toEqual(3);
		
		// check if rows are added
		var testEls = goog.dom.getElementsByClass('data-row', parentElement);
		expect(testEls).toBeTruthy();
		expect(testEls.length).toEqual(3);
	});
})