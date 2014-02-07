goog.provide('ol3.control.RotateNorth');

/**
 * @constructor
 * @extends {ol.control.Control}
 * @param {Object=} opt_options Control options.
 */
ol3.control.RotateNorth = function(opt_options) {

  var options = opt_options || {};

  var anchor = document.createElement('a');
  anchor.href = '#rotate-north';
  anchor.innerHTML = 'N';

  var this_ = this;
  var handleRotateNorth = function(e) {
    // prevent #rotate-north anchor from getting appended to the url
    e.preventDefault();
    this_.getMap().getView().getView2D().setRotation(0);
  };

  anchor.addEventListener('click', handleRotateNorth, false);
  anchor.addEventListener('touchstart', handleRotateNorth, false);

  var element = document.createElement('div');
  element.className = 'rotate-north ol-unselectable';
  element.appendChild(anchor);

  ol.control.Control.call(this, {
    element: element,
    target: options.target
  });

};
ol.inherits(ol3.control.RotateNorth, ol.control.Control);