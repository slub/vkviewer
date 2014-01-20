/*

GeoExt License
==============

Copyright (c) 2008-2010, The Open Source Geospatial Foundation
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

    * Redistributions of source code must retain the above copyright notice,
      this list of conditions and the following disclaimer.
    * Redistributions in binary form must reproduce the above copyright
      notice, this list of conditions and the following disclaimer in the
      documentation and/or other materials provided with the distribution.
    * Neither the name of the Open Source Geospatial Foundation nor the names
      of its contributors may be used to endorse or promote products derived
      from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE
LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
POSSIBILITY OF SUCH DAMAGE.

Notice about ExtJS
==================

The GeoExt library is for use with the ExtJS library.  ExtJS is distributed
under the terms of the GPL v3.  See http://extjs.com/products/license.php for
details on ExtJS licensing.

*/

Ext.namespace('GeoExt.grid');GeoExt.grid.FeatureSelectionModelMixin={autoActivateControl:true,layerFromStore:true,selectControl:null,bound:false,superclass:null,constructor:function(config){config=config||{};if(config.selectControl instanceof OpenLayers.Control.SelectFeature){if(!config.singleSelect){var ctrl=config.selectControl;config.singleSelect=!(ctrl.multiple||!!ctrl.multipleKey);}}else if(config.layer instanceof OpenLayers.Layer.Vector){this.selectControl=this.createSelectControl(config.layer,config.selectControl);delete config.layer;delete config.selectControl;}
this.superclass=arguments.callee.superclass;this.superclass.constructor.call(this,config);},initEvents:function(){this.superclass.initEvents.call(this);if(this.layerFromStore){var layer=this.grid.getStore()&&this.grid.getStore().layer;if(layer&&!(this.selectControl instanceof OpenLayers.Control.SelectFeature)){this.selectControl=this.createSelectControl(layer,this.selectControl);}}
if(this.selectControl){this.bind(this.selectControl);}},createSelectControl:function(layer,config){config=config||{};var singleSelect=config.singleSelect!==undefined?config.singleSelect:this.singleSelect;config=OpenLayers.Util.extend({toggle:true,multipleKey:singleSelect?null:(Ext.isMac?"metaKey":"ctrlKey")},config);var selectControl=new OpenLayers.Control.SelectFeature(layer,config);layer.map.addControl(selectControl);return selectControl;},bind:function(obj,options){if(!this.bound){options=options||{};this.selectControl=obj;if(obj instanceof OpenLayers.Layer.Vector){this.selectControl=this.createSelectControl(obj,options.controlConfig);}
if(this.autoActivateControl){this.selectControl.activate();}
var layers=this.getLayers();for(var i=0,len=layers.length;i<len;i++){layers[i].events.on({featureselected:this.featureSelected,featureunselected:this.featureUnselected,scope:this});}
this.on("rowselect",this.rowSelected,this);this.on("rowdeselect",this.rowDeselected,this);this.bound=true;}
return this.selectControl;},unbind:function(){var selectControl=this.selectControl;if(this.bound){var layers=this.getLayers();for(var i=0,len=layers.length;i<len;i++){layers[i].events.un({featureselected:this.featureSelected,featureunselected:this.featureUnselected,scope:this});}
this.un("rowselect",this.rowSelected,this);this.un("rowdeselect",this.rowDeselected,this);if(this.autoActivateControl){selectControl.deactivate();}
this.selectControl=null;this.bound=false;}
return selectControl;},featureSelected:function(evt){if(!this._selecting){var store=this.grid.store;var row=store.findBy(function(record,id){return record.data.feature==evt.feature;});if(row!=-1&&!this.isSelected(row)){this._selecting=true;this.selectRow(row,!this.singleSelect);this._selecting=false;this.grid.getView().focusRow(row);}}},featureUnselected:function(evt){if(!this._selecting){var store=this.grid.store;var row=store.findBy(function(record,id){return record.data.feature==evt.feature;});if(row!=-1&&this.isSelected(row)){this._selecting=true;this.deselectRow(row);this._selecting=false;this.grid.getView().focusRow(row);}}},rowSelected:function(model,row,record){var feature=record.data.feature;if(!this._selecting&&feature){var layers=this.getLayers();for(var i=0,len=layers.length;i<len;i++){if(layers[i].selectedFeatures.indexOf(feature)==-1){this._selecting=true;this.selectControl.select(feature);this._selecting=false;break;}}}},rowDeselected:function(model,row,record){var feature=record.data.feature;if(!this._selecting&&feature){var layers=this.getLayers();for(var i=0,len=layers.length;i<len;i++){if(layers[i].selectedFeatures.indexOf(feature)!=-1){this._selecting=true;this.selectControl.unselect(feature);this._selecting=false;break;}}}},getLayers:function(){return this.selectControl.layers||[this.selectControl.layer];}};GeoExt.grid.FeatureSelectionModel=Ext.extend(Ext.grid.RowSelectionModel,GeoExt.grid.FeatureSelectionModelMixin);
Ext.namespace("GeoExt.data");GeoExt.data.FeatureRecord=Ext.data.Record.create([{name:"feature"},{name:"state"},{name:"fid"}]);GeoExt.data.FeatureRecord.create=function(o){var f=Ext.extend(GeoExt.data.FeatureRecord,{});var p=f.prototype;p.fields=new Ext.util.MixedCollection(false,function(field){return field.name;});GeoExt.data.FeatureRecord.prototype.fields.each(function(f){p.fields.add(f);});if(o){for(var i=0,len=o.length;i<len;i++){p.fields.add(new Ext.data.Field(o[i]));}}
f.getField=function(name){return p.fields.get(name);};return f;};
Ext.namespace("GeoExt.data");GeoExt.data.FeatureStoreMixin={layer:null,reader:null,addFeatureFilter:null,addRecordFilter:null,constructor:function(config){config=config||{};config.reader=config.reader||new GeoExt.data.FeatureReader({},config.fields);var layer=config.layer;delete config.layer;if(config.features){config.data=config.features;}
delete config.features;var options={initDir:config.initDir};delete config.initDir;arguments.callee.superclass.constructor.call(this,config);if(layer){this.bind(layer,options);}},bind:function(layer,options){if(this.layer){return;}
this.layer=layer;options=options||{};var initDir=options.initDir;if(options.initDir==undefined){initDir=GeoExt.data.FeatureStore.LAYER_TO_STORE|GeoExt.data.FeatureStore.STORE_TO_LAYER;}
var features=layer.features.slice(0);if(initDir&GeoExt.data.FeatureStore.STORE_TO_LAYER){var records=this.getRange();for(var i=records.length-1;i>=0;i--){this.layer.addFeatures([records[i].get("feature")]);}}
if(initDir&GeoExt.data.FeatureStore.LAYER_TO_STORE){this.loadData(features,true);}
layer.events.on({"featuresadded":this.onFeaturesAdded,"featuresremoved":this.onFeaturesRemoved,"featuremodified":this.onFeatureModified,scope:this});this.on({"load":this.onLoad,"clear":this.onClear,"add":this.onAdd,"remove":this.onRemove,"update":this.onUpdate,scope:this});},unbind:function(){if(this.layer){this.layer.events.un({"featuresadded":this.onFeaturesAdded,"featuresremoved":this.onFeaturesRemoved,"featuremodified":this.onFeatureModified,scope:this});this.un("load",this.onLoad,this);this.un("clear",this.onClear,this);this.un("add",this.onAdd,this);this.un("remove",this.onRemove,this);this.un("update",this.onUpdate,this);this.layer=null;}},getRecordFromFeature:function(feature){var record=null;if(feature.state!==OpenLayers.State.INSERT){record=this.getById(feature.id);}else{var index=this.findBy(function(r){return r.get("feature")===feature;});if(index>-1){record=this.getAt(index);}}
return record;},onFeaturesAdded:function(evt){if(!this._adding){var features=evt.features,toAdd=features;if(typeof this.addFeatureFilter=="function"){toAdd=[];var i,len,feature;for(var i=0,len=features.length;i<len;i++){feature=features[i];if(this.addFeatureFilter(feature)!==false){toAdd.push(feature);}}}
this._adding=true;this.loadData(toAdd,true);delete this._adding;}},onFeaturesRemoved:function(evt){if(!this._removing){var features=evt.features,feature,record,i;for(i=features.length-1;i>=0;i--){feature=features[i];record=this.getRecordFromFeature(feature);if(record!==undefined){this._removing=true;this.remove(record);delete this._removing;}}}},onFeatureModified:function(evt){if(!this._updating){var feature=evt.feature;var record=this.getRecordFromFeature(feature);if(record!==undefined){record.beginEdit();attributes=feature.attributes;if(attributes){var fields=this.recordType.prototype.fields;for(var i=0,len=fields.length;i<len;i++){var field=fields.items[i];var key=field.mapping||field.name;if(key in attributes){record.set(field.name,field.convert(attributes[key]));}}}
record.set("state",feature.state);record.set("fid",feature.fid);record.data["feature"]=feature;this._updating=true;record.endEdit();delete this._updating;}}},addFeaturesToLayer:function(records){var i,len,features,record;if(typeof this.addRecordFilter=="function"){features=[]
for(i=0,len=records.length;i<len;i++){record=records[i];if(this.addRecordFilter(record)!==false){features.push(record.get("feature"));}}}else{features=new Array((len=records.length));for(i=0;i<len;i++){features[i]=records[i].get("feature");}}
if(features.length>0){this._adding=true;this.layer.addFeatures(features);delete this._adding;}},onLoad:function(store,records,options){if(!options||options.add!==true){this._removing=true;this.layer.removeFeatures(this.layer.features);delete this._removing;this.addFeaturesToLayer(records);}},onClear:function(store){this._removing=true;this.layer.removeFeatures(this.layer.features);delete this._removing;},onAdd:function(store,records,index){if(!this._adding){this.addFeaturesToLayer(records);}},onRemove:function(store,record,index){if(!this._removing){var feature=record.get("feature");if(this.layer.getFeatureById(feature.id)!=null){this._removing=true;this.layer.removeFeatures([record.get("feature")]);delete this._removing;}}},onUpdate:function(store,record,operation){if(!this._updating){var defaultFields=new GeoExt.data.FeatureRecord().fields;var feature=record.get("feature");if(record.fields){var cont=this.layer.events.triggerEvent("beforefeaturemodified",{feature:feature});if(cont!==false){var attributes=feature.attributes;record.fields.each(function(field){var key=field.mapping||field.name;if(!defaultFields.containsKey(key)){attributes[key]=record.get(field.name);}});this._updating=true;this.layer.events.triggerEvent("featuremodified",{feature:feature});delete this._updating;if(this.layer.getFeatureById(feature.id)!=null){this.layer.drawFeature(feature);}}}}}};GeoExt.data.FeatureStore=Ext.extend(Ext.data.Store,GeoExt.data.FeatureStoreMixin);GeoExt.data.FeatureStore.LAYER_TO_STORE=1;GeoExt.data.FeatureStore.STORE_TO_LAYER=2;
Ext.namespace('GeoExt','GeoExt.data');GeoExt.data.FeatureReader=function(meta,recordType){meta=meta||{};if(!(recordType instanceof Function)){recordType=GeoExt.data.FeatureRecord.create(recordType||meta.fields||{});}
GeoExt.data.FeatureReader.superclass.constructor.call(this,meta,recordType);};Ext.extend(GeoExt.data.FeatureReader,Ext.data.DataReader,{totalRecords:null,read:function(response){return this.readRecords(response.features);},readRecords:function(features){var records=[];if(features){var recordType=this.recordType,fields=recordType.prototype.fields;var i,lenI,j,lenJ,feature,values,field,v;for(i=0,lenI=features.length;i<lenI;i++){feature=features[i];values={};if(feature.attributes){for(j=0,lenJ=fields.length;j<lenJ;j++){field=fields.items[j];if(/[\[\.]/.test(field.mapping)){try{v=new Function("obj","return obj."+field.mapping)(feature.attributes);}catch(e){v=field.defaultValue;}}
else{v=feature.attributes[field.mapping||field.name]||field.defaultValue;}
if(field.convert){v=field.convert(v);}
values[field.name]=v;}}
values.feature=feature;values.state=feature.state;values.fid=feature.fid;var id=(feature.state===OpenLayers.State.INSERT)?undefined:feature.id;records[records.length]=new recordType(values,id);}}
return{records:records,totalRecords:this.totalRecords!=null?this.totalRecords:records.length};}});