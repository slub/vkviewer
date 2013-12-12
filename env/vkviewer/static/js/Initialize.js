/**
 * Function:  initVkViewer
 * This method is first called by the application and loads the tools and html content.
 * 
 * @param mapContainer - {String} DOM id of the div which should serve as a map container.
 * @return {Boolean}
 */
var initVkViewerSlim = function(mapContainer){
	
    // init the mainMap object
	VK2.Utils.setGenericOpenLayersPropertys("vkviewer/proxy/?url=");
    var map = VK2.Utils.loadBaseMap(mapContainer,initConfiguration.mapOptions, initConfiguration.mapnikOptions);
    
    // add different behaviour like events to the map
    addEvents();
    
    // add different tools to the mainMap (layersearch/layerbar/gazetteerSearch/sidebar)
    var appLoader = new VK2.Utils.AppLoader({
    	map: map,
    	mapController: VK2.Controller.MapController,
    	timeParameter: initConfiguration.timeParameter
    });
    appLoader.loadSlimApp();
    
    return true;
};

var initVkViewerFat = function(mapContainer){
	
    // init the mainMap object
	VK2.Utils.setGenericOpenLayersPropertys("vkviewer/proxy/?url=");
    var map = VK2.Utils.loadBaseMap(mapContainer,initConfiguration.mapOptions, initConfiguration.mapnikOptions);
    
    // add different behaviour like events to the map
    addEvents();
    
    // add different tools to the mainMap (layersearch/layerbar/gazetteerSearch/sidebar)
    var appLoader = new VK2.Utils.AppLoader({
    	map: map,
    	mapController: VK2.Controller.MapController,
    	timeParameter: initConfiguration.timeParameter
    });
    appLoader.loadFatApp();
    
    return true;
};

/**
 * Function: addEvents
 * Add events to the main map
 */
var addEvents = function(){
	
	// add login event
	if (document.getElementById("vk2UserToolsLogin")){
		$("#vk2UserToolsLogin").fancybox({
			'width': '350px',
			'height': '100%',
			'type': 'iframe'
		});
	}
	
	// links footer
	VK2.Utils.initializeFancyboxForClass('vk2FooterLinks');
	
	// welcome page
	if (document.getElementById("vk2WelcomePage")){
		$("#vk2WelcomePage").fancybox({
			'type': 'iframe'
		}).click();
	}
	
	loadDropDownBehavor();
};

var loadDropDownBehavor = function(){
	
	// Copyright 2006-2007 javascript-array.com

	var timeout	= 500;
	var closetimer	= 0;
	var ddmenuitem	= 0;

	// open hidden layer
	function mopen(id)
	{	
		// cancel close timer
		mcancelclosetime();

		// close old layer
		if(ddmenuitem) ddmenuitem.style.visibility = 'hidden';

		// get new layer and show it
		ddmenuitem = document.getElementById(id);
		ddmenuitem.style.visibility = 'visible';

	}
	// close showed layer
	function mclose()
	{
		if(ddmenuitem) ddmenuitem.style.visibility = 'hidden';
	}

	// go close timer
	function mclosetime()
	{
		closetimer = window.setTimeout(mclose, timeout);
	}

	// cancel close timer
	function mcancelclosetime()
	{
		if(closetimer)
		{
			window.clearTimeout(closetimer);
			closetimer = null;
		}
	}

	// close layer when click-out
	document.onclick = mclose; 
	
	
	
	// init drop down menu in the header
	if (document.getElementById('vk2GeneralLink') != null){
		$(document.getElementById('vk2GeneralLink')).hover(
			function(){
				mopen('vk2GeneralDropDownContent');
			}, 
			function(){
				mclosetime();
			}
		)
		
		$(document.getElementById('vk2GeneralDropDownContent')).hover(
			function(){
				mcancelclosetime();
			}, 
			function(){
				mclosetime();
			}
		)
	}
}

