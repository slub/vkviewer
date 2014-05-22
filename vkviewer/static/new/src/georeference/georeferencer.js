goog.provide('vk2.georeference.Georeferencer');

goog.require('goog.dom');
goog.require('goog.Uri');
goog.require('vk2.georeference.ToolBox');
goog.require('vk2.georeference.ZoomifyViewer');
goog.require('vk2.georeference.ResultViewer');

/**
 * @param {string} unreferenced_map_container
 * @param {string} referenced_map_container
 * @constructor
 */
vk2.georeference.Georeferencer = function(unreferenced_map_container, referenced_map_container){
	var url = new goog.Uri(window.location.href);
	
	// parameters for unreferenced map
	var zoomfiy_options = {
		'width':  url.getQueryData().get('zoomify_width'),
		'height': url.getQueryData().get('zoomify_height'),
		'url': url.getQueryData().get('zoomify_prop').substring(0,url.getQueryData().get('zoomify_prop').lastIndexOf("/")+1)
	};
	
	// parse extent
	var unparsed_extent = url.getQueryData().get('extent').split(',');
	var parsed_extent = []
	for (var i = 0; i < unparsed_extent.length; i++){parsed_extent.push(parseFloat(unparsed_extent[i]))};
	var result_options = {
		'extent':parsed_extent
	};
	
	// load unreferenced layer 
	this._zoomifyViewer = new vk2.georeference.ZoomifyViewer(unreferenced_map_container, zoomfiy_options);
	
	// load validation map
	this._resultViewer = new vk2.georeference.ResultViewer(referenced_map_container, result_options);
	
	// load toolbox
	var object_id = url.getQueryData().get('id');
	if (goog.isDef(this._zoomifyViewer) && goog.isDef(this._resultViewer)){
		this._toolbox = new vk2.georeference.ToolBox(unreferenced_map_container, this._zoomifyViewer, 
				this._resultViewer, object_id);
		this._toolbox.open();
	};
};