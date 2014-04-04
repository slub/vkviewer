goog.provide('VK2.Tools.TimestampSwitcher');

goog.require('goog.net.XhrIo');
goog.require('goog.dom');
/**
 * @param {string} list_id
 * @param {string} messtischblatt_id
 * @constructor
 */
VK2.Tools.TimestampSwitcher = function(list_id, messtischblatt_id){
	
	var success_callback = function(data){
		var list_object = goog.dom.getElement(list_id);
		list_object.innerHTML = '';
		var length = data.maps.length;
		
		// create list elements
		var list_header = goog.dom.createDom('li', {
			'class':'dropdown-header',
			'innerHTML': length+' '+VK2.Utils.get_I18n_String('timestamps')
		});
		goog.dom.appendChild(list_object, list_header);
		
		for (var i = 0; i < length; i++){
			var list_element = goog.dom.createDom('li',{});
			goog.dom.appendChild(list_object, list_element);
			
			var href = '/vkviewer/profile/mtb?extent='+data.maps[i].extent+'&time='+data.maps[i].time+'&id='+data.maps[i].id;
			var anchor = goog.dom.createDom('a',{'href':href,'innerHTML':data.maps[i].time});
			goog.dom.appendChild(list_element,anchor);
		};
		
		var list_divider = goog.dom.createDom('li', {'class':'divider'});
		goog.dom.appendChild(list_object, list_divider);
		
		var list_footer = goog.dom.createDom('li', {});
		goog.dom.appendChild(list_object, list_footer);
		
		var anchor = goog.dom.createDom('a',{
			'href':'#',
			'innerHTML': length+' '+VK2.Utils.get_I18n_String('found_timestamp')
		});
		goog.dom.appendChild(list_footer, anchor);
	};
	
	var url = '/vkviewer/gettimestampsforid?id='+messtischblatt_id;
	
	// create request object
	var xhr = new goog.net.XhrIo();
	
	// add listener to request object
	goog.events.listenOnce(xhr, 'success', function(e){
		var xhr = /** @type {goog.net.XhrIo} */ (e.target);
		var data = xhr.getResponseJson() ? xhr.getResponseJson() : '';
		xhr.dispose();
		success_callback(data);
	});
	
	goog.events.listenOnce(xhr, 'error', function(e){
		var xhr = /** @type {goog.net.XhrIo} */ (e.target);
		console.log('Error whily trying to fetch data from server ...')
	});
	
	// send request
	xhr.send(url);	
};