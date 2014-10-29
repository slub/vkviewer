goog.provide('vk2.app.MapProfileApp');

//goog.require('goog.dom');
//goog.require('goog.events');
//goog.require('goog.events.EventType');
//goog.require('goog.Uri');
//goog.require('goog.net.XhrIo');
goog.require('goog.events');
goog.require('vk2.settings');
<<<<<<< HEAD
goog.require('vk2.viewer.ZoomifyViewer');
goog.require('vk2.viewer.ZoomifyViewer.EventType')
=======
goog.require('vk2.utils');
goog.require('vk2.georeference.ZoomifyViewer');
goog.require('vk2.georeference.ZoomifyViewer.EventType');
>>>>>>> Add functionality to vk2.control.ImageManipulation
goog.require('vk2.tool.MetadataBinding');
goog.require('vk2.viewer.ZoomifyViewer');
goog.require('vk2.viewer.ZoomifyViewerEventType');
goog.require('vk2.control.ImageManipulation');

/**
 * @constructor
 * @param {Object} settings
 * 		{string} metadataId
 * 		{string} metadataContainer
 * 		{string} zoomify
 * 		{string} zoomifyContainer
 */
vk2.app.MapProfileApp = function(settings){
	if (goog.DEBUG)
		console.log(settings);
	
<<<<<<< HEAD
	var zoomifyViewer = new vk2.viewer.ZoomifyViewer(settings['zoomifyContainer'], settings['zoomify']);
=======
	if (!ol.has.WEBGL){
		// load the hole application with a canvas renderer
		var zoomifyViewer = new vk2.viewer.ZoomifyViewer(settings['zoomifyContainer'], settings['zoomify']);
		var metadatbinding = new vk2.tool.MetadataBinding(settings['metadataContainer'], settings['metadataId']);
	};	
	
	// load the hole application with a webgl renderer
	var zoomifyViewer = new vk2.viewer.ZoomifyViewer(settings['zoomifyContainer'], settings['zoomify'], true);
	var metadatbinding = new vk2.tool.MetadataBinding(settings['metadataContainer'], settings['metadataId']);
	
	// append image manipulation tool
	goog.events.listen(zoomifyViewer, vk2.viewer.ZoomifyViewerEventType.LOADEND, function(event){
		zoomifyViewer.getMap().addControl(new vk2.control.ImageManipulation());
	});
	
	return;
};