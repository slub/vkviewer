/**
 * This object is based on the modal object from the bootstrap library
 */
goog.provide('vk2.utils.Modal');

goog.require('goog.dom');
goog.require('goog.dom.classes');
goog.require('goog.events');
goog.require('goog.style');

/**
 * @param {string} modal_id
 * @param {Element} parent_el
 * @param {boolean=} opt_onclose_destroy
 * @constructor
 */
vk2.utils.Modal = function(modal_id, parent_el, opt_onclose_destroy){
	
	/**
	 * @type {Element}
	 * @private
	 */
	this.modalEl_ = this._initHtmlContent(modal_id);
	goog.dom.appendChild(parent_el, this.modalEl_);
	
	var onclose_destroy = opt_onclose_destroy || false;
	this._initBehavior(this.modalEl_, onclose_destroy);
};

/**
 * @param {Element} node
 * @private
 */
vk2.utils.Modal.prototype._contentElIsAnchor = function(node){
	return node.nodeName.toLowerCase() === 'a' && node.href !== "";
};

/**
 * @param {string} modal_id
 * @return {Element}
 * @private
 */
vk2.utils.Modal.prototype._initHtmlContent = function(modal_id){
	var modal_parent = goog.dom.createDom('div',{'class':'modal fade '+modal_id,'id':modal_id});
	var modal_dialog = goog.dom.createDom('div',{'class':'modal-dialog'});
	goog.dom.appendChild(modal_parent, modal_dialog);
	var modal_content = goog.dom.createDom('div',{'class':'modal-content'});
	goog.dom.appendChild(modal_dialog, modal_content);
	
	// header
	/**
	 * @type {Element}
	 * @private
	 */
	this._modal_header = goog.dom.createDom('div',{'class':'modal-header'});
	goog.dom.appendChild(modal_content, this._modal_header);
	var header_close = goog.dom.createDom('button',{
		'class':'close',
		'type':'button',
		'data-dismiss':'modal',
		'aria-hidden':'true',
		'innerHTML':'&times;'
	});
	goog.dom.appendChild(this._modal_header, header_close);
	var header_title = goog.dom.createDom('h4',{'class':'modal-title'});
	goog.dom.appendChild(this._modal_header, header_title);
	
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
vk2.utils.Modal.prototype._initBehavior = function(modal_el, onclose_destroy){
	// after close clean up
	$(modal_el).on('hidden.bs.modal', function(e){
		// clean up modal body
		var body_content = goog.dom.getElementByClass('modal-body', this);
		body_content.innerHTML = '';
		
		// clean up header title
		var header_title = goog.dom.getElementByClass('modal-title', this.modalEl_);
		header_title.innerHTML = '';
		
		// clean up content className
		var modal_content = goog.dom.getElementByClass('modal-content', this);
		goog.dom.classes.set(modal_content, 'modal-content');
		
		if (goog.DEBUG)
			console.log('clean up modal content');
		
		// destroy modal on close
		if (onclose_destroy){
			goog.dom.removeNode(this);
			
			if (goog.DEBUG)
				console.log('register onclose destroy behavior');
		}
	});	
};

/**
 * @param {Element} node
 * @param {string} className
 * @private
 */
vk2.utils.Modal.prototype._openAnchorInIframe = function(node, className){
	var modal_content = goog.dom.getElementByClass('modal-content', this.modalEl_);
	if (goog.DEBUG)
		console.log('Append open in iframe behavior');
	
	node.setAttribute('data-href', node.href)
	node.href = '#';
	
	goog.events.listen(node, 'click', function(event){
		var element = event.currentTarget;
		var href = element.getAttribute('data-href');
		this._registerRemoteSrc({
			'href':href,
			'classes':className
		});
		goog.dom.classes.set(modal_content, 'modal-content '+className);
	}, undefined, this);
};

/**
 * @param {Object} remote_src
 *   href (string): href to the remote src 
 *   width (string=): width of the body content
 *   height (string=): height of the body content
 *   classes (string=): class of the iframe
 * @private
 */
vk2.utils.Modal.prototype._registerRemoteSrc = function(remote_src){
	// create iframe and append it to body
	var modal_body = goog.dom.getElementByClass('modal-body', this.modalEl_);
	modal_body.innerHTML = '';
	
	var iframe = goog.dom.createDom('iframe',{
		'frameborder':'0',
		'src':remote_src.href
	});
	
	// set attributes for allowing fullscreen behavior of ol3
	iframe.setAttribute('webkitallowfullscreen',''); // @deprecated
	iframe.setAttribute('mozallowfullscreen',''); // @deprecated
	iframe.setAttribute('allowfullscreen','');
	
	if (goog.isDef(remote_src.width))
		goog.style.setStyle(iframe, 'width',remote_src.width);
	
	if (goog.isDef(remote_src.height))
		goog.style.setStyle(iframe, 'height',remote_src.height);
	
	if (goog.isDef(remote_src.classes))
		goog.dom.classes.add(iframe, remote_src.classes);
		
	goog.dom.appendChild(modal_body, iframe);
};

vk2.utils.Modal.prototype._setTitle = function(title){
	var header_title = goog.dom.getElementByClass('modal-title', this.modalEl_);
	header_title.innerHTML = title;
};

/**
 * 
 */
vk2.utils.Modal.prototype.close = function(){
	if (goog.DEBUG)
		console.log('Close modal ...');
	
	if (goog.isDef(this.modalEl_)){
		$(this.modalEl_).modal('hide');
	};		
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
vk2.utils.Modal.prototype.open = function(opt_title, opt_modal_class, opt_remote_src){
	if (goog.isDefAndNotNull(opt_title) && opt_title){
		this._setTitle(opt_title);
	} else {
		goog.style.setElementShown(this._modal_header, false);
	};
	
	if (goog.isDef(opt_modal_class)){
		var modal_content = goog.dom.getElementByClass('modal-content', this.modalEl_);
		goog.dom.classes.add(modal_content, opt_modal_class);
	};
	
	if (goog.isDef(opt_remote_src))
		this._registerRemoteSrc(opt_remote_src);
	
	// open modal
	$(this.modalEl_).modal('show');
};

/**
 * @param {Element} content
 * @param {string} className
 */
vk2.utils.Modal.prototype.appendToBody = function(content, className){
	var modal_body = goog.dom.getElementByClass('modal-body', this.modalEl_);
	
	if (goog.dom.isElement(content)){
		goog.dom.appendChild(modal_body, content);
		if (this._contentElIsAnchor(content)){
			this._openAnchorInIframe(content, className);
			goog.dom.appendChild(modal_body, goog.dom.createDom('br'));
		};
	};
};

/**
 * @param {string} content
 */
vk2.utils.Modal.prototype.appendStringToBody = function(content){
	var modal_body = goog.dom.getElementByClass('modal-body', this.modalEl_);
	
	if (goog.isString(content))
		modal_body.innerHTML = content;
};
