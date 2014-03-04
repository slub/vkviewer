goog.provide('VK2.Tools.ReportError');

goog.require('goog.dom');
goog.require('goog.events');
goog.require('goog.events.EventType');
goog.require('goog.net.XhrIo');
goog.require('VK2.Utils');
/**
 * @param {string} display_btn Id of the display button
 * @param {string} dialog_container_id
 * @param {string} key
 * @param {string} reference
 * @constructor
 */
VK2.Tools.ReportError = function(display_btn, dialog_container_id, key, reference){
	
	/**
	 * @type {Element}
	 * @private
	 */
	this._displayBtn = goog.dom.getElement(display_btn);
	
	/**
	 * @type {string}
	 * @private
	 */
	this._key = key;
	
	/**
	 * @type {string}
	 * @private
	 */
	this._reference = reference;
	
	/**
	 * @type {Element}
	 * @private
	 */
	this._parentDialogContainer = goog.dom.getElement(dialog_container_id);
	
	this._loadHtmlContent();
	
	// add click event
	this._loadClickBehavior();
};

/**
 * Uses bootstrap.js modal
 * @private
 */
VK2.Tools.ReportError.prototype._loadHtmlContent = function(){
	
	/**
	 * @type {Element}
	 * @private
	 */
	this._dialogContainer = goog.dom.createDom('div',{
		'id':'myModal',
		'class':'modal fade',
		'tabindex':'-1',
		'role':'dialog',
		'aria-labelledby':'myModalLabel',
		'aria-hidden':'true'
	});
	goog.dom.appendChild(this._parentDialogContainer, this._dialogContainer);
	
	var modalDialog = goog.dom.createDom('div',{'class':'modal-dialog'});
	goog.dom.appendChild(this._dialogContainer, modalDialog);

	var modalContent = goog.dom.createDom('div',{'class':'modal-content'});
	goog.dom.appendChild(modalDialog, modalContent);	
	
	// header
	var modalHeader = goog.dom.createDom('div',{'class':'modal-header'});
	goog.dom.appendChild(modalContent, modalHeader);
	
	var closeBtnHeader = goog.dom.createDom('button',{
		'type':'button',
		'class':'close',
		'data-dismiss':'modal',
		'innerHTML': '&times;',
		'aria-hidden':'true'
	});
	goog.dom.appendChild(modalHeader, closeBtnHeader);
	
	var labelHeader = goog.dom.createDom('h4',{
		'id':'myModalLabel',
		'class':'modal-title',
		'innerHTML': VK2.Utils.get_I18n_String('report_error_titel')+': '+this._key
	});
	goog.dom.appendChild(modalHeader, labelHeader);

	// body
	var modalBody = goog.dom.createDom('div',{'class':'modal-body'});
	goog.dom.appendChild(modalContent, modalBody);
	
	/**
	 * @type {Element}
	 * @private
	 */
	this._textarea = goog.dom.createDom('textarea',{'class':'form-control','rows':'3'});
	goog.dom.appendChild(modalBody, this._textarea);
	
	// footer
	var modalFooter = goog.dom.createDom('div',{'class':'modal-footer'});
	goog.dom.appendChild(modalContent, modalFooter);
	
	var closeBtnFooter = goog.dom.createDom('button',{
		'type':'button',
		'class':'btn btn-default',
		'data-dismiss':'modal',
		'innerHTML': VK2.Utils.get_I18n_String('report_error_btn_cancel')
	});
	goog.dom.appendChild(modalFooter, closeBtnFooter);
	
	/**
	 * @type {Element}
	 * @private
	 */
	this._submitBtn = goog.dom.createDom('button',{
		'type':'button',
		'class':'btn btn-primary',
		'data-dismiss':'modal',
		'innerHTML': VK2.Utils.get_I18n_String('report_error_btn_submit')
	});
	goog.dom.appendChild(modalFooter, this._submitBtn);	
};

/**
 * @private
 */
VK2.Tools.ReportError.prototype._loadClickBehavior = function(){
	// load show error dialog event
	goog.events.listen(this._displayBtn, goog.events.EventType.CLICK, function(event){
		$(this._dialogContainer).modal({
			'show': true,
			'keyboard': true
		})
	}, undefined, this);
	
	// load submit event
	goog.events.listen(this._submitBtn, goog.events.EventType.CLICK, function(event){
		var message = this._textarea.value;
		var reference = this._reference;
		var key = this._key;
		
		var url = '/vkviewer/report/error?message='+message+'&id='+key+'&reference='+reference;
		
		var success_callback = function(xhrio){alert(VK2.Utils.get_I18n_String('report_error_confirmed'));}
		var error_callback = function(xhrio){alert(VK2.Utils.get_I18n_String('report_error_alert'));}
		
		VK2.Utils.sendReport(url, success_callback, error_callback)
	}, undefined, this);
};
