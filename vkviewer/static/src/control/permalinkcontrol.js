goog.provide('vk2.control.Permalink');

goog.require('goog.events');
goog.require('vk2.utils');
goog.require('vk2.tool.Permalink');

/**
 * @constructor
 * @extends {ol.control.Control}
 * @param {Object=} opt_options Control options.
 */
vk2.control.Permalink = function(opt_options) {

  var options = opt_options || {};

  var element = goog.dom.createDom('div',{'class':'permalink ol-unselectable'});  
  
  var anchor = goog.dom.createDom('a',{
	  'href':'#permalinl',
	  'innerHTML':'P',
	  'class':'ol-has-tooltip'
  });
  goog.dom.appendChild(element, anchor);
  
  var tooltip = goog.dom.createDom('span', {'role':'tooltip','innerHTML':vk2.utils.getMsg('permalink')})
  goog.dom.appendChild(anchor, tooltip);
  
  // form for displaying the permalink stuff
  var permalinkForm = goog.dom.createDom('form',{'id':'permaCopyBox','style':'display:none;'});
  var permaClose = goog.dom.createDom('div',{'class':'permaClose'});
  goog.dom.appendChild(permalinkForm, permaClose);
  var nose = goog.dom.createDom('div',{'class':'nose'});
  goog.dom.appendChild(permalinkForm, nose);
  var moreDots = goog.dom.createDom('div',{'class':'moreDots','innerHTML':'...'});
  goog.dom.appendChild(permalinkForm, moreDots);
  var permaLinkResult = goog.dom.createDom('input',{
	  'type':'text',
	  'id':'permalinkResult',
	  'readonly':'readonly',
	  'value':'#'
  });
  goog.dom.appendChild(permalinkForm, permaLinkResult);
  osCopyKey = (navigator.platform == "MacIntel") ? "&#8984;" : "Strg";
  var label = goog.dom.createDom('label',{
	  'for':'permalinkResult',
	  'innerHTML':vk2.utils.getMsg('permalink_msg') + ' ' + osCopyKey + '+C.'
  });
  goog.dom.appendChild(permalinkForm, label);
  goog.dom.appendChild(element, permalinkForm);
  
  // behavior
  this_ = this;
  var permalink = undefined;
  var handleClick = function(e) {
    // prevent #rotate-north anchor from getting appended to the url
    e.preventDefault();
    
    if (!permalink){
    	permalink = new vk2.tool.Permalink(this_.getMap());
    };
    
    if($(permalinkForm).hasClass('open')){
    	$(permalinkForm).fadeOut().removeClass('open');
		$(permaLinkResult).blur();
    } else {
    	permaLinkResult.setAttribute('value', permalink.createPermalink());
    	$(permalinkForm).fadeIn().addClass('open');
		$(permaLinkResult).focus().select();
    };
  };

  goog.events.listen(anchor, 'click', handleClick);
  goog.events.listen(anchor, 'touchstart', handleClick);

  ol.control.Control.call(this, {
    element: element,
    target: options.target
  });

};
ol.inherits(vk2.control.Permalink, ol.control.Control);