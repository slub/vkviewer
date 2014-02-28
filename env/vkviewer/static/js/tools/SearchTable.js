/**
 * @fileoverview SearchTable encapsulate a table with a set or records, where each record is
 * consultable via an identifier.
 * @author jacobmendt@googlemail.de (Jacob Mendt)
 */
goog.provide('VK2.Tools.SearchTable');

goog.require('goog.dom');
goog.require('goog.ui.IdGenerator');
goog.require('VK2.Layer.HoverLayer');
goog.require('VK2.Controller.MapSearchController');

/**
 * Creates a new SearchTable.
 * @param {string} parent Parent dom element to which the table should append.
 * @param {Array.<Object>} headingCol Heading column objects.
 * @param {Object} hoverLayer OpenLayers.Layer.Vector which encapsulate the hover behavior
 * @param {Object} ftLayer OpenLayer.Layer.Vector
 * @param {Function} callbackClick Function for a click callback with the given time
 * @constructor
 */
VK2.Tools.SearchTable = function(parent, headingCol, controller){
	
	/**
	 * @type {string}
	 * @private
	 */
	this._parentId = parent;
	
	/** 
	 * @type {Element}
	 * @private
	 */
	this._parentEl = goog.dom.getElement(parent);
	if (!this._parentEl) console.log('Could not find parent element for SearchTable object.');
	
	if (goog.isDef(headingCol)){
		
		this._headingCol = headingCol;
		this._columnIds = [];
		
		for (var i in this._headingCol){	
			if (this._headingCol.hasOwnProperty(i)){
				this._columnIds.push(this._headingCol[i].id);
			}
		}		
	}	
	
	/**
	 * @type {Object}
	 * @private
	 */
	this._idGenerator = goog.ui.IdGenerator.getInstance();
	
	/**
	 * @type {Element}
	 * @public
	 */
	this.tableId = 'searchTable'+this._idGenerator.getNextUniqueId();
	
	/**
	 * @type {Object}
	 * @private
	 */
	this._controller = controller
	
	this._createTable();
};

/**
 * @private
 */
VK2.Tools.SearchTable.prototype._createTable = function(){
	
	var table = goog.dom.createDom('table', {
		'id': this.tableId,
		'class': 'table zebra-striped tablesorter'
	});
	
	
	// create col group
	var colGroup = goog.dom.createDom('colgroup',{});
	
	var col_time = goog.dom.createDom('col',{
		'class': 'span3',
		'span':'1'
	});
	
	var col_title = goog.dom.createDom('col',{
		'class': 'span6',
		'span':'1'
	});

	goog.dom.appendChild(colGroup ,col_time);
	goog.dom.appendChild(colGroup ,col_title);
	
	// create table header	
	var tableHeading = goog.dom.createDom('thead', {
		'class': 'table-heading'
	});
	
	var tableHeadingRow = goog.dom.createDom('tr', {
		'class': 'table-heading-row'
	});
	
	for (var i in this._headingCol){
		if (this._headingCol.hasOwnProperty(i)){
			var headingCol = goog.dom.createDom('th', {
				'id': 'header-col-'+this._headingCol[i].id,
				'class': 'header-col col-'+this._headingCol[i].id
			})
			
			var headingColContent = goog.dom.createDom('div',{
				'class': this._headingCol[i].id,
				'innerHTML': this._headingCol[i].title
			})
			
			goog.dom.appendChild(headingCol, headingColContent);
			goog.dom.appendChild(tableHeadingRow, headingCol);
		}
	}
	
	// create body element
	/**
	 * @type {Element}
	 * @private
	 */
	this._tableBody = goog.dom.createDom('tbody',{
		'class': 'table-body'
	});
		
	goog.dom.appendChild(tableHeading ,tableHeadingRow);
	goog.dom.appendChild(table, colGroup);
	goog.dom.appendChild(table, tableHeading);
	goog.dom.appendChild(table, this._tableBody);
	goog.dom.appendChild(this._parentEl, table);
	
	// initialize tablesorter
	$(goog.dom.getElement(this.tableId)).tablesorter();
};

/**
 * @static
 */
VK2.Tools.SearchTable._mdFancyBoxClass = 'fancybox-md';

/**
 * @param {Object} object
 */
VK2.Tools.SearchTable.prototype.refreshData = function(object){
	
	// delete all child elements
	goog.dom.removeChildren(this._tableBody)
	var j = 0;
	for (key in object) {
		j++;
		
		var row = goog.dom.createDom('tr', {
			'id': key,
			'class': 'data-row'
		})
	
		for (var i = 0; i < this._columnIds.length; i++){
			
			// special row behavior for column id titel
			var col = goog.dom.createDom('td', {
				'class': 'data-col-'+this._columnIds[i] + ' col-'+this._columnIds[i],
				'innerHTML': object[key][this._columnIds[i]]
			});

			goog.dom.appendChild(row, col);
		}
		
		// add hover/click behavior to row
		this._controller.addRowBehavior(row, object[key]['feature']);
		
		goog.dom.appendChild(this._tableBody, row);
	}
	
	// update tablesorter 
	$(document.getElementById(this.tableId)).trigger('update');

	// activate fancybox events
	VK2.Utils.initializeFancyboxForClass(this._mdFancyBoxClass);
};