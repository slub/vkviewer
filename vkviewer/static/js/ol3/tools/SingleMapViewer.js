goog.provide('VK2.Tools.SingleMapViewer');

goog.require('goog.object');
goog.require('goog.Uri');

/**
 * @param {Object} settings
 * @constructor
 */
VK2.Tools.SingleMapViewer = function(settings){
	
	/**
	 * @param {Object} settings
	 * @private
	 */
	this._settings = {
			// parameter for reset georef tool
			reset_georef_id: 'reset-georef-map',
			map_id: null,
			// parameter for bootstrap tab behavior
			tab_list_id:'singlemapview-tab-list',
			// parameter for initializing the MesstischblattViewer
			georef_map_container_id:'map-container',
			opacity_slider_id:'opacity-slider',
			str_extent: '',
			time: null,
			// parameter for initializing the MetadataVisualizer
			metadata_container:'metadata-container',
			metadata_key: null,
			// parameter for ZoomifyViewer
			zoomify_container: 'zoomify-container',
			zoomify_url: null,
			zoomify_width: null,
			zoomify_height: null			
	};
	goog.object.extend(this._settings, settings);
	
	// parse extent from query and initialize messtischblatt viewer
	var str_extent = this._settings.str_extent;
	var str_extent = str_extent.split(',');
	var extent = []
	for (var i = 0; i < str_extent.length; i++){
		extent.push(parseFloat(str_extent[i]));
	};
	
	var mtbViewer = new VK2.Tools.MesstischblattViewer(this._settings.georef_map_container_id, {
		'time': this._settings.time,
		'extent': extent,
		'opacity_slider': this._settings.opacity_slider_id
	});
	
	// initialize metadata visualization
	var mdVisualizer = new VK2.Tools.MetadataVisualizer(this._settings.metadata_container,this._settings.metadata_key,{
		 'csw_url':VK2.Utils.Settings.csw_url});
		 
	// initialize reset georef tool
	if (goog.dom.getElement(this._settings.reset_georef_id)){
		var resetGeoreference = new VK2.Tools.ResetGeoreferenceParameter(this._settings.reset_georef_id, map_id);
	}; 
	
	// initialize zoomify viewer
	var zoomifyViewer = new VK2.Tools.ZoomifyViewer(this._settings.zoomify_container, this._settings.zoomify_url, this._settings.zoomify_width, this._settings.zoomify_height);
	
	/**
	 * @type {VK2.Tools.ZoomifyViewer
	 * @private
	 */
	this._zoomifyViewer = zoomifyViewer;
	
	// this initialize the bootstrap tap behavior
	$('#'+this._settings.tab_list_id+' a').click(function(e){
		  e.preventDefault();
		  $(this).tab('show');
		  
		  // this code is important for refresh the canvas after tab changes
		  var url = new goog.Uri(this.href);
		  var tab_id = url.getFragment();
		  if (tab_id == 'georef-view'){
		  	mtbViewer.getMap().updateSize();
		  } else if (tab_id == 'original-view'){
		  	zoomifyViewer.getMap().updateSize();
		  }
	});
};

/**
 * @return {VK2.Tools.ZoomifyViewer}
 */
VK2.Tools.SingleMapViewer.prototype.getZoomifyViewer = function(){
	return this._zoomifyViewer;
};