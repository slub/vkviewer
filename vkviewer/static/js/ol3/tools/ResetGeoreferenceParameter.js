goog.provide('VK2.Tools.ResetGeoreferenceParameter');

goog.require('goog.dom');
goog.require('goog.events');
goog.require('goog.events.EventType');
goog.require('goog.net.XhrIo');
goog.require('VK2.Utils');
/**
 * @param {Element} anchor_element
 * @param {number} messtischblattid
 * @constructor
 */
VK2.Tools.ResetGeoreferenceParameter = function(anchor_element, messtischblattid){
	
	/**
	 * @type {Element}
	 * @private
	 */
	this._anchor_element = anchor_element;
	
	/**
	 * @type {string}
	 * @private
	 */
	this._key = messtischblattid;
	
	this._loadHtmlContent();
	
	// add click event
	this._loadClickBehavior();
};

/**
 * Uses bootstrap.js modal
 * @private
 */
VK2.Tools.ResetGeoreferenceParameter.prototype._loadHtmlContent = function(){
	
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
		'innerHTML': 'VORSICHT - Zurücksetzen der Georeferenzierungsparameter für Messtischblatt '+this._key
	});
	goog.dom.appendChild(modalHeader, labelHeader);

	// body
	var modalBody = goog.dom.createDom('div',{'class':'modal-body'});
	goog.dom.appendChild(modalContent, modalBody);
	
	var warning_message = goog.dom.createDom('p',{
		'class':'bg-danger text-danger',
		'innerHTML':'Sind sie sicher das Sie die Georeferenzierung-Parameter für dieses Messtischblatt zurücksetzen wollen? Dieser Prozess kann nicht Rückgängig gemacht werden.'
	});
	goog.dom.appendChild(modalBody, warning_message);
		
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
VK2.Tools.ResetGeoreferenceParameter.prototype._loadClickBehavior = function(){
	// load show error dialog event
	goog.events.listen(this._anchor_element, goog.events.EventType.CLICK, function(event){
		$(this._dialogContainer).modal({
			'show':true,
			'keyboard':true
		});
	}, undefined, this);
	
	// load submit event
	goog.events.listen(this._submitBtn, goog.events.EventType.CLICK, function(event){
		var key = this._key;
		
		var url = '/vkviewer/report/resetgeorefparameters?mtbid='+key;
		
		var success_callback = function(xhrio){alert('Georeferenzierung Parameter für das Messtischblatt mit der ID '+key+' wurden zurückgesetzt.');}
		var error_callback = function(xhrio){alert('Die Georeferenzierungsparameter für das Messtischblatt mit der ID '+key+' konnten nicht zurückgesetzt werden.');}
		
		VK2.Utils.sendReport(url, success_callback, error_callback)
	}, undefined, this);
};
