goog.provide('vk2.factory.LayerManagementFactory');

goog.require('goog.dom');
goog.require('goog.style');
goog.require('goog.dom.classes');
//goog.require('ol.layer.Vector');
goog.require('vk2.settings');
goog.require('vk2.tool.OpacitySlider');

/**
 * @param {vk2.layer.HistoricMap} layer
 * @param {ol.Map} map
 * @static
 */
vk2.factory.LayerManagementFactory.getLayerManagementRecord = function(layer, map){

	var eventListener = {
			'changevisibility': function(event){
				if (goog.DEBUG)
					console.log('Change visiblity event');
				
				if (goog.dom.classes.has(containerEl, 'visible')){
					// hide layer
					goog.dom.classes.addRemove(containerEl, 'visible', 'notvisible');
					layer.setVisible(false);
				} else {
					// display layer
					goog.dom.classes.addRemove(containerEl, 'notvisible', 'visible');
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
		'class':'layermanagement-record',
		'id':layer.getId()
	});
	
	var containerEl = goog.dom.createDom('div',{'class':'visible'});
	goog.dom.appendChild(containerListEl, containerEl);
	goog.events.listen(containerEl, 'click', eventListener['changevisibility']);
	
	//
	// minimize view
	//
	var minimizeContainer = goog.dom.createDom('div',{'class':'minimize'});
	goog.dom.appendChild(containerEl, minimizeContainer);
	
	// add visiblechange behavior
	// this.appendChangeVisibilityBehavior(minimizeContainer);
	
	// thumbnail
	var anchor_thumbnail = goog.dom.createDom('a',{
		'class':'thumbnail',
		'href':'#'
	});
	goog.dom.appendChild(minimizeContainer, anchor_thumbnail);
	
	var img_thumbnail = goog.dom.createDom('img',{
		'onerror':'this.onerror=null;this.src="http://www.deutschefotothek.de/images/noimage/image120.jpg"',
		'alt':'...',
		'src':layer.getThumbnail()
	});
	goog.dom.appendChild(anchor_thumbnail, img_thumbnail);
	
	// metadata content 
	var metadata_container = goog.dom.createDom('div',{'class':'metadata-container'});
	goog.dom.appendChild(minimizeContainer, metadata_container);
	
	var title = goog.dom.createDom('h4',{'innerHTML':layer.getTitle()});
	goog.dom.appendChild(metadata_container, title);
	
	var time = goog.dom.createDom('span', {
		'class':'time',
		'innerHTML': layer.getTime()
	});
	goog.dom.appendChild(metadata_container, time);
	// append more timestamps
	
	// control element content 
	var control_container = goog.dom.createDom('div',{'class':'control-container'});
	goog.dom.appendChild(minimizeContainer, control_container);

	var delete_button = goog.dom.createDom('button', {
		'class':'remove-layer minimize-tool',
		'type':'button',
		'title':'Remove Layer',
		'innerHTML':'x'
	});
	goog.dom.appendChild(control_container, delete_button);
	goog.events.listen(delete_button, 'click', eventListener['removelayer']);
	
	var moveUp_button = goog.dom.createDom('button', {
		'class':'move-layer-top minimize-tool',
		'type':'button',
		'title':'Move Layer to Top',
		'innerHTML':'^'
	});
	goog.dom.appendChild(control_container, moveUp_button);	
	goog.events.listen(moveUp_button, 'click', eventListener['moveontop']);
	
	var maximizeView_button = goog.dom.createDom('button', {
		'class':'open-maximize minimize-tool',
		'type':'button',
		'title':'More Layer Tools',
		'innerHTML':'..'
	});
	goog.dom.appendChild(control_container, maximizeView_button);	
	goog.events.listen(maximizeView_button, 'click', eventListener['maximize']);
	
	//
	// maximize view
	//
	var maximizeList = goog.dom.createDom('ul', {'style':'display: none;','class':'maximize-list'});
	goog.dom.appendChild(containerEl, maximizeList);
	
	var maximizeContainer = goog.dom.createDom('div',{'class':'maximize'});
	goog.dom.appendChild(maximizeList, maximizeContainer);
	
	// append opacity slider
	var opacitySlider = new vk2.tool.OpacitySlider(maximizeContainer, layer);
	
	// append new messtischblatt mtb
	if (goog.isDef(layer.getAssociations())){
		var associatedMapsContainer = goog.dom.createDom('div',{'class':'timestamp-container'});
		goog.dom.appendChild(maximizeContainer, associatedMapsContainer);
		
		// now add for every feature an add mtb event
		var associatedMaps = layer.getAssociations();
		for (var i = 0; i < associatedMaps.length; i++){
			var associatedLayer = associatedMaps[i]
			var associatedMap = goog.dom.createDom('a',{
				'class': 'timestamp',
				'href': '#',
				'innerHTML': associatedLayer.getTime()
			});
			goog.dom.appendChild(associatedMapsContainer,associatedMap);
			
			goog.events.listen(associatedMap, 'click', function(event){
				map.addLayer(this);
				event.stopPropagation();
			}, undefined, associatedLayer);
		};
	};
	
	return containerListEl;
};