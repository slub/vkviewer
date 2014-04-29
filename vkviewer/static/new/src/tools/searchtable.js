/**
 * @fileoverview SearchTable encapsulate a table with a set or records, where each record is
 * consultable via an identifier.
 * @author jacobmendt@googlemail.de (Jacob Mendt)
 */
goog.provide('VK2.Tools.SearchTable');

goog.require('goog.dom');
goog.require('goog.ui.IdGenerator');

/**
 * Creates a new SearchTable.
 * @param {string} parent Parent dom element to which the table should append.
 * @param {Array.<Object>} headingCol Heading column objects.
 * @constructor
 */
VK2.Tools.SearchTable = function(parent, headingCol){
	
	/**
	 * @type {string}
	 * @private
	 */
	this._parentId = parent;
	
	/** 
	 * @type {Element}
	 * @private
	 */
	this._parentEl = goog.dom.getElement(parent) ? goog.dom.getElement(parent) : undefined;
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
	 * @type {number}
	 * @private
	 */
	this._rowCount = 0;
	
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

	// initialize the html content for the table
	if (goog.isDef(this._parentEl))
		this._createTable();
};

/**
 * @private
 */
VK2.Tools.SearchTable.prototype._createTable = function(){
	
	/**
	 * @type {Element}
	 * @private
	 */
	this._tableEl = goog.dom.createDom('table', {
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
				'innerHTML': this._headingCol[i].title + ' <span class="caret caret-reversed"></span>'
			})
			
			goog.dom.appendChild(headingCol, headingColContent);
			goog.dom.appendChild(tableHeadingRow, headingCol);
		}
	};
	
	// create body element
	/**
	 * @type {Element}
	 * @private
	 */
	this._tableBody = goog.dom.createDom('tbody',{
		'class': 'table-body'
	});
		
	goog.dom.appendChild(tableHeading ,tableHeadingRow);
	goog.dom.appendChild(this._tableEl, colGroup);
	goog.dom.appendChild(this._tableEl, tableHeading);
	goog.dom.appendChild(this._tableEl, this._tableBody);
	goog.dom.appendChild(this._parentEl, this._tableEl);
};

/**
 * @param {VK2.Layer.MapSearch} msLayer
 */
VK2.Tools.SearchTable.prototype.registerMapSearchLayer = function(msLayer){
	/**
	 * @type {VK2.Layer.MapSearch}
	 * @private
	 */
	this._msLayer = msLayer;
};

/**
 * @param {Array<ol.Feature>} data
 * @param {ol.Map} opt_map
 * @param {ol.FeatureOverlay=} opt_hoverLayer
 * @param {Function=} opt_headingCallback
 */
VK2.Tools.SearchTable.prototype.refresh = function(data, opt_map, opt_hoverLayer, opt_headingCallback){
	
	console.log('refresh layer');
	
	// delete all child elements
	goog.dom.removeChildren(this._tableBody);
	for (var i = 0; i < data.length; i++){
		var feature = data[i];
		
		// create table row
		var row = goog.dom.createDom('tr', {
			'id': feature.get('mtbid'),
			'class': 'data-row'
		});
		goog.dom.appendChild(this._tableBody, row);
		
		// add columns to row
		for (var j = 0; j < this._columnIds.length; j++){
			// special row behavior for column id titel
			var col = goog.dom.createDom('td', {
				'class': 'data-col-'+this._columnIds[j] + ' col-'+this._columnIds[j],
				'innerHTML': feature.get([this._columnIds[j]])
			});
			goog.dom.appendChild(row, col);
		};
		
		// add hover behavior 
		if (goog.isDef(opt_hoverLayer))
			this._addRowHoverBehavior(row, feature, opt_hoverLayer);
		
		// add click behavior
		if (goog.isDef(opt_map))
			this._addRowClickBehavior(row, feature, opt_map);
	};
	
	// update row count
	this._rowCount = data.length;
	
	// updating table headering
	if (goog.isDef(opt_headingCallback))
		opt_headingCallback(this._rowCount);
};

/**
 * @param {Element} rowElement
 * @param {ol.Feature} feature
 * @param {ol.FeatureOverlayer} hoverLayer
 * @private
 */
VK2.Tools.SearchTable.prototype._addRowHoverBehavior = function(rowElement, feature, hoverLayer){
	$(rowElement).hover( 
		function(event){
			if (!$(this).hasClass('hover-table')){
				$(this).addClass('hover-table');
				// remove old feature if exists
				var oldFeatures = hoverLayer.getFeatures();
				oldFeatures.forEach(function(feature){
					this.removeFeature(feature);
				}, hoverLayer);
				hoverLayer.addFeature(feature);
			}
		}, 
		function(event){
			if ($(this).hasClass( 'hover-table' )){
				$(this).removeClass( 'hover-table' );
			
				// clear hover feature and redraw the underlying feature
				hoverLayer.removeFeature(feature);
			}
		}
	);
};

/**
 * @param {Element} rowElement
 * @param {ol.Feature} feature
 * @param {ol.Map} map
 * @private
 */
VK2.Tools.SearchTable.prototype._addRowClickBehavior = function(rowElement, feature, map){
	goog.events.listen(rowElement, goog.events.EventType.CLICK, function(event){
		var view = map.getView().getView2D();
		view.setCenter(feature.getGeometry().getInteriorPoint().getCoordinates());
		view.setZoom(5);
	}, undefined, this);
};

/**
 * @return {number}
 */
VK2.Tools.SearchTable.prototype.getRowCount = function(){
	return this._rowCount;
};

/**
 * @return {Element}
 */
VK2.Tools.SearchTable.prototype.getTableDomElement = function(){
	return this._tableEl; 
};