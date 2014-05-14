goog.provide('VK2.Control.LayerSpy');

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
VK2.Control.LayerSpy = function(opt_options) {

	  var options = opt_options || {};
	
	  this._buildHtmlElement();
	  
	  var this_ = this;
	  
	  var radius = goog.isDef(options.radius)? parseInt(options.radius) : 75;
	  
	  var keyHandler = new goog.events.KeyHandler(document);
	  goog.events.listen(keyHandler, goog.events.KeyHandler.EventType.KEY, function(evt){
		  // for handling this events in webkit
		  if (evt.keyCode === goog.events.KeyCodes.Y) {
			  radius = Math.min(radius + 5, 150);
			  this_.getMap().render();
		  } else if (evt.keyCode === goog.events.KeyCodes.X) {
			  radius = Math.max(radius - 5, 25);
			  debugger;
			  this_.getMap().render();
		  }
	  }, undefined, this);
	
	// get the pixel position with every move
	var mousePosition = null;

	// before rendering the layer, do some clipping
	var handlerPrecompose = function(event) {
		  var ctx = event.context;
		  ctx.save();
		  ctx.beginPath();
		  if (mousePosition) {
		    // only show a circle around the mouse
		    ctx.arc(mousePosition[0], mousePosition[1], radius, 0, 2 * Math.PI);
		    ctx.lineWidth = 5;
		    ctx.strokeStyle = 'rgba(0,0,0,0.5)';
		    ctx.stroke();
		  }
		  ctx.clip();
	};
	
	// after rendering the layer, restore the canvas context
	var handlerPostcompose = function(event) {
		  var ctx = event.context;
		  ctx.restore();
	};
	
	// mousemove events
	var mousemoveHandler = function(evt) {
		mousePosition = this_.getMap().getEventPixel(evt.event_);
		this_.getMap().render();
	};
	
	var mouseoutHandler = function() {
		  mousePosition = null;
		  this_.getMap().render();
	};
	goog.events.listen(this._layerSpyAnchor, goog.events.EventType.CLICK, function(event){
		if (goog.dom.classes.has(this, 'active')){
			options.spyLayer.un('precompose', handlerPrecompose);
			options.spyLayer.un('postcompose', handlerPostcompose);
			this_.getMap().removeLayer(options.spyLayer);
			goog.dom.classes.remove(this, 'active');
			
			goog.events.unlisten(this_.getMap().getViewport(),'mousemove', mousemoveHandler);
			goog.events.unlisten(this_.getMap().getViewport(),'mouseout', mouseoutHandler);
		} else {			
			this_.getMap().addLayer(options.spyLayer);
			options.spyLayer.on('precompose', handlerPrecompose);
			options.spyLayer.on('postcompose', handlerPostcompose);
			goog.dom.classes.add(this, 'active');
			
			goog.events.listen(this_.getMap().getViewport(),'mousemove', mousemoveHandler);
			goog.events.listen(this_.getMap().getViewport(),'mouseout', mouseoutHandler);
		}
	});

  ol.control.Control.call(this, {
    element: this._layerSpyContainer,
    target: options.target
  });

};
goog.inherits(VK2.Control.LayerSpy, ol.control.Control);

/**
 * @private
 */
VK2.Control.LayerSpy.prototype._buildHtmlElement = function(){	
	this._layerSpyAnchor = goog.dom.createDom('a',{'href':'#layerspy','innerHTML':'L'});
	this._layerSpyContainer = goog.dom.createDom('div',{'class':'ol-layerspy ol-unselectable'});
	goog.dom.appendChild(this._layerSpyContainer, this._layerSpyAnchor );
}