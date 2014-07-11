goog.provide('vk2.factory.LayerManagementFactory');

goog.require('goog.dom');
goog.require('goog.style');
goog.require('goog.dom.classes');
//goog.require('ol.layer.Vector');
goog.require('vk2.settings');
goog.require('vk2.utils');
goog.require('vk2.tool.OpacitySlider');

/**
 * @param {vk2.layer.HistoricMap} layer
 * @param {number} index
 * @param {ol.Map} map
 * @static
 */
vk2.factory.LayerManagementFactory.getLayerManagementRecord = function(layer, index, map){

	var eventListener = {
			'changevisibility': function(event){
				if (goog.DEBUG)
					console.log('Change visiblity event');
				
				if (goog.dom.classes.has(containerListEl, 'visible')){
					// hide layer
					goog.dom.classes.addRemove(containerListEl, 'visible', 'notvisible');
					layer.setVisible(false);
				} else {
					// display layer
					goog.dom.classes.addRemove(containerListEl, 'notvisible', 'visible');
					layer.setVisible(true);
				};
			},
			'maximize': function(event){
				if (goog.style.getStyle(maximizeList, 'display') !== 'none'){
					if (goog.DEBUG)
						console.log('Minimize view');
					
					$(maximizeList).slideToggle();
				} else {
					if (goog.DEBUG)
						console.log('Maximize view');
					
					$(maximizeList).slideToggle();
				};
				
				// for not trigger other events
				event.stopPropagation();
			},
			'moveontop': function(event){
				map.removeLayer(layer);
				map.addLayer(layer);
				event.stopPropagation();
			},
			'removelayer': function(event){
				map.removeLayer(layer);
				event.stopPropagation();
			}
			
	};
	
	//
	// Build html content
	// 
	var containerListEl = goog.dom.createDom('li', {
		'class':'layermanagement-record visible',
		'id': index,
		'data-id':layer.getId()
	});
	
	// Control Container
	var controlContainer = goog.dom.createDom('div', {'class':'control-container'});
	goog.dom.appendChild(containerListEl, controlContainer);
	
	var moveUp_button = goog.dom.createDom('button', {
		'class':'move-layer-top minimize-tool',
		'type':'button',
		'title':vk2.utils.getMsg('moveToTop'),
		'innerHTML':vk2.utils.getMsg('moveToTop')
	});
	goog.dom.appendChild(controlContainer, moveUp_button);	
	goog.events.listen(moveUp_button, 'click', eventListener['moveontop']);
	
	var disableLayer = goog.dom.createDom('button', {
		'class':'disable-layer minimize-tool',
		'type':'button',
		'title':vk2.utils.getMsg('showLayer'),
		'innerHTML': vk2.utils.getMsg('showLayer')
	});
	goog.dom.appendChild(controlContainer, disableLayer);
	goog.events.listen(disableLayer, 'click', eventListener['changevisibility']);
	
	var delete_button = goog.dom.createDom('button', {
		'class':'remove-layer minimize-tool',
		'type':'button',
		'title':vk2.utils.getMsg('removeLayer'),
		'innerHTML':vk2.utils.getMsg('removeLayer')
	});
	goog.dom.appendChild(controlContainer, delete_button);
	goog.events.listen(delete_button, 'click', eventListener['removelayer']);
	
	var dragContainerEl = goog.dom.createDom('div',{'class':'drag-btn'});
	goog.dom.appendChild(controlContainer, dragContainerEl);
	
	// thumbnail
	var anchor_thumbnail = goog.dom.createDom('a',{
		'class':'thumbnail',
		'href':'#'
	});
	goog.dom.appendChild(containerListEl, anchor_thumbnail);
	
	var img_thumbnail = goog.dom.createDom('img',{
		'onerror':'this.onerror=null;this.src="http://www.deutschefotothek.de/images/noimage/image120.jpg"',
		'alt':'...',
		'src':layer.getThumbnail()
	});
	goog.dom.appendChild(anchor_thumbnail, img_thumbnail);
	
	// metadata container
	metadataContainer = goog.dom.createDom('div',{'class':'metadata-container'});
	goog.dom.appendChild(containerListEl, metadataContainer);

	var title = goog.dom.createDom('h4',{'innerHTML':layer.getTitle()});
	goog.dom.appendChild(metadataContainer, title);
	
	var timestampContainer = goog.dom.createDom('div',{'class':'timestamps'});
	goog.dom.appendChild(metadataContainer, timestampContainer);
	
	if (layer.getAssociations().length == 0){
		var time = goog.dom.createDom('span', {
			'class':'timestamps-label',
			'innerHTML': vk2.utils.getMsg('timestamp') + ' ' + layer.getTime()
		});
		goog.dom.appendChild(timestampContainer, time);
	} else {
		var time = goog.dom.createDom('span', {
			'class':'timestamps-label',
			'innerHTML': vk2.utils.getMsg('timestamp') + ' ' + layer.getTime() + '<b class="caret"></b>'
		});
		goog.dom.appendChild(timestampContainer, time);
		
		var timestampDropdown = goog.dom.createDom('div', {'class':'timestamps-dropdown'});
		goog.dom.appendChild(timestampContainer, timestampDropdown);
		
		var timestampDropdownLabel = goog.dom.createDom('span', {
			'class':'timestamps-intro-text',
			'innerHTML': vk2.utils.getMsg('timestamp_dropdown') + ':'
		});
		goog.dom.appendChild(timestampDropdown, timestampDropdownLabel);
		
		var timestampDropdownList = goog.dom.createDom('ul',{});
		goog.dom.appendChild(timestampDropdown, timestampDropdownList);
				
		// now add for every feature an add mtb event
		var associatedMaps = layer.getAssociations();
		for (var i = 0; i < associatedMaps.length; i++){
			var associatedLayer = associatedMaps[i];
			
			var listEl = goog.dom.createDom('li',{});
			goog.dom.appendChild(timestampDropdownList,listEl);
			
			var anchorEl = goog.dom.createDom('a',{
				'class': 'timestamp',
				'href': '#',
				'innerHTML': associatedLayer.getTime()
			});
			goog.dom.appendChild(listEl,anchorEl);
			
			goog.events.listen(anchorEl, 'click', function(event){
				map.addLayer(this);
				event.stopPropagation();
			}, undefined, associatedLayer);
		};
	};

	// opdacity slider
	var opacitySlider = new vk2.tool.OpacitySlider(containerListEl, layer, 'vertical');
	
	return containerListEl;
};