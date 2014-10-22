goog.provide('vk2.app.MapProfileApp');

//goog.require('goog.dom');
//goog.require('goog.events');
//goog.require('goog.events.EventType');
//goog.require('goog.Uri');
//goog.require('goog.net.XhrIo');

goog.require('vk2.settings');
goog.require('vk2.viewer.ZoomifyViewer');
goog.require('vk2.tool.MetadataBinding');

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
	
	var zoomifyViewer = new vk2.viewer.ZoomifyViewer(settings['zoomifyContainer'], settings['zoomify']);
	var metadatbinding = new vk2.tool.MetadataBinding(settings['metadataContainer'], settings['metadataId']);
};