goog.provide('ol3.control.LayerSpy');

goog.require('goog.events');
goog.require('goog.events.EventType');
goog.require('goog.dom');
goog.require('goog.dom.classes');

/**
 * @constructor
 * @extends {ol.control.Control}
 * @param {Object=} opt_options Control options.
 */
ol3.control.LayerSpy = function(opt_options) {

  var options = opt_options || {};

  this._buildHtmlElement();
  
  var this_ = this;
  
  var radius = 75;
  goog.events.listen(document, goog.events.EventType.KEYDOWN, function(evt){
	if (evt.keyCode === 107 || evt.keyCode === 187) {
		radius = Math.min(radius + 5, 150);
		this_.getMap().requestRenderFrame();
	} else if (evt.keyCode === 109 || evt.keyCode === 189) {
		radius = Math.max(radius - 5, 25);
		this_.getMap().requestRenderFrame();
	}
  });
	
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
	
	goog.events.listen(this._layerSpyAnchor, goog.events.EventType.CLICK, function(event){
		if (goog.dom.classes.has(this, 'active')){
			options.spyLayer.un('precompose', handlerPrecompose);
			options.spyLayer.un('postcompose', handlerPostcompose);
			this_.getMap().removeLayer(options.spyLayer);
			goog.dom.classes.remove(this, 'active');
			

		} else {
			
			this_.getMap().addLayer(options.spyLayer);
			options.spyLayer.on('precompose', handlerPrecompose);
			options.spyLayer.on('postcompose', handlerPostcompose);
			goog.dom.classes.add(this, 'active');
			
			goog.events.listen(this_.getMap().getViewport(),'mousemove', function(evt) {
				mousePosition = this_.getMap().getEventPixel(evt.event_);
				this_.getMap().requestRenderFrame();
			});
			goog.events.listen(this_.getMap().getViewport(),'mouseout', function() {
				  mousePosition = null;
				  this_.getMap().requestRenderFrame();
			});
		}
	});

  ol.control.Control.call(this, {
    element: this._layerSpyContainer,
    target: options.target
  });

};
ol.inherits(ol3.control.LayerSpy, ol.control.Control);

/**
 * @private
 */
ol3.control.LayerSpy.prototype._buildHtmlElement = function(){	
	this._layerSpyAnchor = goog.dom.createDom('a',{'href':'#layerspy','innerHTML':'L'});
	this._layerSpyContainer = goog.dom.createDom('div',{'class':'ol-layerspy ol-unselectable'});
	goog.dom.appendChild(this._layerSpyContainer, this._layerSpyAnchor );
}