goog.provide('vk2.control.LayerSpy');

goog.require('goog.events');
goog.require('goog.events.EventType');
goog.require('goog.events.KeyHandler');
goog.require('goog.events.KeyCodes');
goog.require('goog.dom');
goog.require('goog.dom.classes');

/**
 * @constructor
 * @extends {ol.control.Control}
 * @param {Object=} opt_options Control options.
 */
vk2.control.LayerSpy = function(opt_options) {

	  var options = opt_options || {};

	  /**
	   * @type {ol.Layer}
	   */
	  this._spyLayer = goog.isDef(options.spyLayer) ? options.spyLayer : new ol.layer.Tile({
			attribution: undefined,
			source: new ol.source.OSM({'attribution':undefined})
	  });
	  
	  /**
	   * @type {Element}
	   * @private
	   */
	  var activate_button = goog.dom.createDom('a',{'href':'#layerspy','innerHTML':'L'});
	  
	  /**
	   * @type {Element}
	   * @private
	   */
	  var control_container = goog.dom.createDom('div',{'class':'ol-layerspy ol-unselectable'});
	  goog.dom.appendChild(control_container, activate_button);
	  
	  
	  /**
	   * @type {number}
	   * @private
	   */
	  this._clipRadius = goog.isDef(options.radius)? parseInt(options.radius) : 75;
	  
	  // get the pixel position with every move
	  var mousePosition = null;
		
	  /**
	   * @type {Object}
	   * @private
	   */
	  this._eventHandler = {
			  // before rendering the layer, do some clipping
			  'postcompose': function(event) {
				  var ctx = event.context;
				  ctx.restore();
			  },
			  // before rendering the layer, do some clipping
			  'precompose': function(event) {
				  var ctx = event.context;
				  ctx.save();
				  ctx.beginPath();
				  if (mousePosition) {
				    // only show a circle around the mouse
				    ctx.arc(mousePosition[0], mousePosition[1], this._clipRadius, 0, 2 * Math.PI);
				    ctx.lineWidth = 5;
				    ctx.strokeStyle = 'rgba(0,0,0,0.5)';
				    ctx.stroke();
				  }
				  ctx.clip();
			  }, 
			  'mousemove': function(event) {
					mousePosition = this.getMap().getEventPixel(event.event_);
					this.getMap().render();
			  }, 
			  'mouseout': function() {
				  mousePosition = null;
				  this.getMap().render();
			  },
			  'keyhandler': function(event){
				  if (goog.DEBUG)
					  console.log('KeyDown event with code '+event.keyCode);
				  
				  // for handling this events in webkit
				  if (event.keyCode === goog.events.KeyCodes.Y) {
					  this._clipRadius = Math.min(this._clipRadius + 5, 150);
					  this.getMap().render();
				  } else if (event.keyCode === goog.events.KeyCodes.X) {
					  this._clipRadius = Math.max(this._clipRadius - 5, 25);
					  this.getMap().render();
				  }
			  },
			  'addlayer': function(event){	
				  var topLayer = event.target.getArray()[event.target.getLength() - 1];
				  if (topLayer !== this._spyLayer){
					  this.getMap().removeLayer(this._spyLayer);
					  this.getMap().addLayer(this._spyLayer);
				  };
			  }
	  };
	  
	  /**
	   * @type {goog.events.KeyHandler}
	   * @private
	   */
	  this._keyHandler = null;
	
	  goog.events.listen(activate_button, goog.events.EventType.CLICK, function(event){
			if (goog.dom.classes.has(activate_button, 'active')){
				this._deactivate(activate_button);
			} else {			
				this._activate(activate_button);
			}
	  }, undefined, this);
	
	  ol.control.Control.call(this, {
	    element: control_container,
	    target: options.target
	  });
};
ol.inherits(vk2.control.LayerSpy, ol.control.Control);

/**
 * @private
 */
vk2.control.LayerSpy.prototype._buildHtmlElement = function(){	

};

/**
 * @param {Element} activate_button
 * @private
 */
vk2.control.LayerSpy.prototype._activate = function(activate_button){
	// activate critical layerspy behavior
	this.getMap().addLayer(this._spyLayer);
	this._spyLayer.on('precompose', this._eventHandler['precompose'], this);
	this._spyLayer.on('postcompose', this._eventHandler['postcompose'], this);
	goog.events.listen(this.getMap().getViewport(),'mousemove', this._eventHandler['mousemove'], undefined, this);
	goog.events.listen(this.getMap().getViewport(),'mouseout', this._eventHandler['mouseout'], undefined, this);
	goog.dom.classes.add(activate_button, 'active');
	
	// activate advanced layerspy behavior
	this._keyHandler = this._keyHandler || new goog.events.KeyHandler(document);
	goog.events.listen(this._keyHandler, goog.events.KeyHandler.EventType.KEY, this._eventHandler['keyhandler'], undefined, this);
	
	// add event listener for holding the spylayer on top of all other layers
	goog.events.listen(this.getMap().getLayers(), 'add', this._eventHandler['addlayer'], undefined, this);
};

/**
 * @param {Element} activate_button
 * @private
 */
vk2.control.LayerSpy.prototype._deactivate = function(activate_button){
	// deactivate critical layerspy behavior
	this._spyLayer.un('precompose', this._eventHandler['precompose'], this);
	this._spyLayer.un('postcompose', this._eventHandler['postcompose'], this);
	goog.events.unlisten(this.getMap().getViewport(),'mousemove', this._eventHandler['mousemove'], undefined, this);
	goog.events.unlisten(this.getMap().getViewport(),'mouseout', this._eventHandler['mouseout'], undefined, this);
	this.getMap().removeLayer(this._spyLayer);
	goog.dom.classes.remove(activate_button, 'active');
	
	// deactivate advanced layerspy behavior
	goog.events.unlisten(this._keyHandler, goog.events.KeyHandler.EventType.KEY, this._eventHandler['keyhandler'], undefined, this);
	goog.events.unlisten(this.getMap().getLayers(), 'add', this._eventHandler['addlayer'], undefined, this);
};