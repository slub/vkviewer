/**
 * This object is based on the modal object from the bootstrap library
 */
goog.provide('VK2.Utils.Modal');

goog.require('goog.dom');
goog.require('goog.dom.classes');
goog.require('goog.style');

/**
 * @param {string} modal_id
 * @param {Element} parent_el
 * @param {boolean=} opt_onclose_destroy
 * @constructor
 */
VK2.Utils.Modal = function(modal_id, parent_el, opt_onclose_destroy){
	
	/**
	 * @type {Element}
	 * @private
	 */
	this._modalEl = this._initHtmlContent(modal_id);
	goog.dom.appendChild(parent_el, this._modalEl);
	
	var onclose_destroy = opt_onclose_destroy || false;
	this._initBehavior(this._modalEl, onclose_destroy);
};

/**
 * @param {string} modal_id
 * @return {Element}
 * @private
 */
VK2.Utils.Modal.prototype._initHtmlContent = function(modal_id){
	var modal_parent = goog.dom.createDom('div',{'class':'modal fade '+modal_id,'id':modal_id});
	var modal_dialog = goog.dom.createDom('div',{'class':'modal-dialog'});
	goog.dom.appendChild(modal_parent, modal_dialog);
	var modal_content = goog.dom.createDom('div',{'class':'modal-content'});
	goog.dom.appendChild(modal_dialog, modal_content);
	
	// header
	var modal_header = goog.dom.createDom('div',{'class':'modal-header'});
	goog.dom.appendChild(modal_content, modal_header);
	var header_close = goog.dom.createDom('button',{
		'class':'close',
		'type':'button',
		'data-dismiss':'modal',
		'aria-hidden':'true',
		'innerHTML':'&times;'
	});
	goog.dom.appendChild(modal_header, header_close);
	var header_title = goog.dom.createDom('h4',{'class':'modal-title'});
	goog.dom.appendChild(modal_header, header_title);
	
	// body
	var modal_body = goog.dom.createDom('div',{'class':'modal-body'});
	goog.dom.appendChild(modal_content, modal_body);
	
	// footer
	var modal_footer = goog.dom.createDom('div',{'class':'modal-footer'});
	goog.dom.appendChild(modal_content, modal_footer);
	var footer_close = goog.dom.createDom('button',{
		'class':'btn btn-default',
		'type':'button',
		'data-dismiss':'modal',
		'innerHTML':'Close'
	});
	goog.dom.appendChild(modal_footer, footer_close);
	
	return modal_parent;
};

/**
 * @param {Element} modal_el
 * @param {boolean} onclose_destroy
 * @private
 */
VK2.Utils.Modal.prototype._initBehavior = function(modal_el, onclose_destroy){
	// after close clean up
	$(modal_el).on('hidden.bs.modal', function(e){
		// clean up modal body
		var body_content = goog.dom.getElementByClass('modal-body', this);
		body_content.innerHTML = '';
		
		// clean up header title
		var header_title = goog.dom.getElementByClass('modal-title', this._modalEl);
		header_title.innerHTML = '';
		
		// clean up content className
		var modal_content = goog.dom.getElementByClass('modal-content', this);
		goog.dom.classes.set(modal_content, 'modal-content');
		
		if (goog.DEBUG)
			console.log('clean up modal content');
		
		// destroy modal on close
		if (onclose_destroy){
			goog.dom.removeNode(this);
			console.log('register onclose destroy behavior');
		}
	});
	

};

/**
 * @param {Object} remote_src
 *   href (string): href to the remote src 
 *   width (string=): width of the body content
 *   height (string=): height of the body content
 *   classes (string=): class of the iframe
 * @private
 */
VK2.Utils.Modal.prototype._registerRemoteSrc = function(remote_src){
	// create iframe and append it to body
	var modal_body = goog.dom.getElementByClass('modal-body', this._modalEl);
	var iframe = goog.dom.createDom('iframe',{
		'frameborder':'0',
		'src':remote_src.href
	});
	
	if (goog.isDef(remote_src.width))
		goog.style.setStyle(iframe, 'width',remote_src.width);
	
	if (goog.isDef(remote_src.height))
		goog.style.setStyle(iframe, 'height',remote_src.height);
	
	if (goog.isDef(remote_src.classes))
		goog.dom.classes.add(iframe, remote_src.classes);
		
	goog.dom.appendChild(modal_body, iframe);
};

VK2.Utils.Modal.prototype._setTitle = function(title){
	var header_title = goog.dom.getElementByClass('modal-title', this._modalEl);
	header_title.innerHTML = title;
};

/**
 * @param {string=} opt_title
 * @param {string=} opt_modal_class
 * @param {Object=} opt_remote_src
 *   href (string): href to the remote src 
 *   width (string=): width of the body content
 *   height (string=): heihgt of the body content
 *   classes (string=): class of the iframe
 */
VK2.Utils.Modal.prototype.open = function(opt_title, opt_modal_class, opt_remote_src){
	if (goog.isDef(opt_title))
		this._setTitle(opt_title);
	
	if (goog.isDef(opt_modal_class)){
		var modal_content = goog.dom.getElementByClass('modal-content', this._modalEl);
		goog.dom.classes.add(modal_content, opt_modal_class);
	};
	
	if (goog.isDef(opt_remote_src))
		this._registerRemoteSrc(opt_remote_src);
	
	// open modal
	$(this._modalEl).modal('show');
};