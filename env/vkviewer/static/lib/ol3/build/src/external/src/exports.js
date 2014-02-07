goog.require('ol');
goog.require('ol.Attribution');
goog.require('ol.BrowserFeature');
goog.require('ol.Collection');
goog.require('ol.DeviceOrientation');
goog.require('ol.DragBoxEvent');
goog.require('ol.Feature');
goog.require('ol.Geolocation');
goog.require('ol.ImageTile');
goog.require('ol.Kinetic');
goog.require('ol.Map');
goog.require('ol.MapBrowserEvent');
goog.require('ol.Object');
goog.require('ol.Observable');
goog.require('ol.Overlay');
goog.require('ol.OverlayPositioning');
goog.require('ol.RendererHint');
goog.require('ol.RendererHints');
goog.require('ol.Tile');
goog.require('ol.TileCoord');
goog.require('ol.View2D');
goog.require('ol.animation');
goog.require('ol.color');
goog.require('ol.control');
goog.require('ol.control.Attribution');
goog.require('ol.control.Control');
goog.require('ol.control.FullScreen');
goog.require('ol.control.Logo');
goog.require('ol.control.MousePosition');
goog.require('ol.control.ScaleLine');
goog.require('ol.control.ScaleLineUnits');
goog.require('ol.control.Zoom');
goog.require('ol.control.ZoomSlider');
goog.require('ol.control.ZoomToExtent');
goog.require('ol.coordinate');
goog.require('ol.dom.Input');
goog.require('ol.easing');
goog.require('ol.events.condition');
goog.require('ol.extent');
goog.require('ol.format.Format');
goog.require('ol.format.GPX');
goog.require('ol.format.GeoJSON');
goog.require('ol.format.IGC');
goog.require('ol.format.KML');
goog.require('ol.format.TopoJSON');
goog.require('ol.geom.Circle');
goog.require('ol.geom.Geometry');
goog.require('ol.geom.GeometryCollection');
goog.require('ol.geom.LineString');
goog.require('ol.geom.LinearRing');
goog.require('ol.geom.MultiLineString');
goog.require('ol.geom.MultiPoint');
goog.require('ol.geom.MultiPolygon');
goog.require('ol.geom.Point');
goog.require('ol.geom.Polygon');
goog.require('ol.geom.SimpleGeometry');
goog.require('ol.interaction');
goog.require('ol.interaction.DoubleClickZoom');
goog.require('ol.interaction.DragAndDrop');
goog.require('ol.interaction.DragBox');
goog.require('ol.interaction.DragPan');
goog.require('ol.interaction.DragRotate');
goog.require('ol.interaction.DragRotateAndZoom');
goog.require('ol.interaction.DragZoom');
goog.require('ol.interaction.Draw');
goog.require('ol.interaction.KeyboardPan');
goog.require('ol.interaction.KeyboardZoom');
goog.require('ol.interaction.MouseWheelZoom');
goog.require('ol.interaction.Select');
goog.require('ol.interaction.TouchPan');
goog.require('ol.interaction.TouchRotate');
goog.require('ol.interaction.TouchZoom');
goog.require('ol.layer.Group');
goog.require('ol.layer.Image');
goog.require('ol.layer.Layer');
goog.require('ol.layer.Tile');
goog.require('ol.layer.Vector');
goog.require('ol.parser.ogc.WMSCapabilities');
goog.require('ol.proj');
goog.require('ol.proj.METERS_PER_UNIT');
goog.require('ol.proj.Projection');
goog.require('ol.proj.Units');
goog.require('ol.proj.common');
goog.require('ol.render.FeaturesOverlay');
goog.require('ol.render.canvas.Immediate');
goog.require('ol.source.BingMaps');
goog.require('ol.source.GPX');
goog.require('ol.source.GeoJSON');
goog.require('ol.source.IGC');
goog.require('ol.source.ImageCanvas');
goog.require('ol.source.ImageStatic');
goog.require('ol.source.ImageVector');
goog.require('ol.source.ImageWMS');
goog.require('ol.source.KML');
goog.require('ol.source.MapGuide');
goog.require('ol.source.MapQuest');
goog.require('ol.source.OSM');
goog.require('ol.source.Source');
goog.require('ol.source.Stamen');
goog.require('ol.source.State');
goog.require('ol.source.Tile');
goog.require('ol.source.TileDebug');
goog.require('ol.source.TileJSON');
goog.require('ol.source.TileWMS');
goog.require('ol.source.TopoJSON');
goog.require('ol.source.Vector');
goog.require('ol.source.VectorFile');
goog.require('ol.source.WMTS');
goog.require('ol.source.XYZ');
goog.require('ol.source.Zoomify');
goog.require('ol.source.wms.ServerType');
goog.require('ol.style.Circle');
goog.require('ol.style.Fill');
goog.require('ol.style.Icon');
goog.require('ol.style.Image');
goog.require('ol.style.Stroke');
goog.require('ol.style.Style');
goog.require('ol.style.Text');
goog.require('ol.tilegrid.TileGrid');
goog.require('ol.tilegrid.WMTS');
goog.require('ol.tilegrid.XYZ');
goog.require('ol.tilegrid.Zoomify');
goog.require('ol.webgl.Context');


goog.exportSymbol(
    'ol.Attribution',
    ol.Attribution);


goog.exportSymbol(
    'ol.BrowserFeature',
    ol.BrowserFeature);
goog.exportProperty(
    ol.BrowserFeature,
    'DEVICE_PIXEL_RATIO',
    ol.BrowserFeature.DEVICE_PIXEL_RATIO);
goog.exportProperty(
    ol.BrowserFeature,
    'HAS_CANVAS',
    ol.BrowserFeature.HAS_CANVAS);
goog.exportProperty(
    ol.BrowserFeature,
    'HAS_DEVICE_ORIENTATION',
    ol.BrowserFeature.HAS_DEVICE_ORIENTATION);
goog.exportProperty(
    ol.BrowserFeature,
    'HAS_GEOLOCATION',
    ol.BrowserFeature.HAS_GEOLOCATION);
goog.exportProperty(
    ol.BrowserFeature,
    'HAS_TOUCH',
    ol.BrowserFeature.HAS_TOUCH);
goog.exportProperty(
    ol.BrowserFeature,
    'HAS_WEBGL',
    ol.BrowserFeature.HAS_WEBGL);


goog.exportSymbol(
    'ol.Collection',
    ol.Collection);
goog.exportProperty(
    ol.Collection.prototype,
    'clear',
    ol.Collection.prototype.clear);
goog.exportProperty(
    ol.Collection.prototype,
    'extend',
    ol.Collection.prototype.extend);
goog.exportProperty(
    ol.Collection.prototype,
    'forEach',
    ol.Collection.prototype.forEach);
goog.exportProperty(
    ol.Collection.prototype,
    'getArray',
    ol.Collection.prototype.getArray);
goog.exportProperty(
    ol.Collection.prototype,
    'getAt',
    ol.Collection.prototype.getAt);
goog.exportProperty(
    ol.Collection.prototype,
    'getLength',
    ol.Collection.prototype.getLength);
goog.exportProperty(
    ol.Collection.prototype,
    'insertAt',
    ol.Collection.prototype.insertAt);
goog.exportProperty(
    ol.Collection.prototype,
    'pop',
    ol.Collection.prototype.pop);
goog.exportProperty(
    ol.Collection.prototype,
    'push',
    ol.Collection.prototype.push);
goog.exportProperty(
    ol.Collection.prototype,
    'remove',
    ol.Collection.prototype.remove);
goog.exportProperty(
    ol.Collection.prototype,
    'removeAt',
    ol.Collection.prototype.removeAt);
goog.exportProperty(
    ol.Collection.prototype,
    'setAt',
    ol.Collection.prototype.setAt);


goog.exportSymbol(
    'ol.DeviceOrientation',
    ol.DeviceOrientation);
goog.exportProperty(
    ol.DragBoxEvent.prototype,
    'getCoordinate',
    ol.DragBoxEvent.prototype.getCoordinate);


goog.exportSymbol(
    'ol.Feature',
    ol.Feature);
goog.exportProperty(
    ol.Feature.prototype,
    'getGeometryName',
    ol.Feature.prototype.getGeometryName);
goog.exportProperty(
    ol.Feature.prototype,
    'getId',
    ol.Feature.prototype.getId);
goog.exportProperty(
    ol.Feature.prototype,
    'setGeometryName',
    ol.Feature.prototype.setGeometryName);
goog.exportProperty(
    ol.Feature.prototype,
    'setId',
    ol.Feature.prototype.setId);


goog.exportSymbol(
    'ol.Geolocation',
    ol.Geolocation);
goog.exportProperty(
    ol.ImageTile.prototype,
    'getImage',
    ol.ImageTile.prototype.getImage);


goog.exportSymbol(
    'ol.Kinetic',
    ol.Kinetic);


goog.exportSymbol(
    'ol.Map',
    ol.Map);
goog.exportProperty(
    ol.Map.prototype,
    'addControl',
    ol.Map.prototype.addControl);
goog.exportProperty(
    ol.Map.prototype,
    'addInteraction',
    ol.Map.prototype.addInteraction);
goog.exportProperty(
    ol.Map.prototype,
    'addLayer',
    ol.Map.prototype.addLayer);
goog.exportProperty(
    ol.Map.prototype,
    'addOverlay',
    ol.Map.prototype.addOverlay);
goog.exportProperty(
    ol.Map.prototype,
    'beforeRender',
    ol.Map.prototype.beforeRender);
goog.exportProperty(
    ol.Map.prototype,
    'forEachFeatureAtPixel',
    ol.Map.prototype.forEachFeatureAtPixel);
goog.exportProperty(
    ol.Map.prototype,
    'getControls',
    ol.Map.prototype.getControls);
goog.exportProperty(
    ol.Map.prototype,
    'getCoordinateFromPixel',
    ol.Map.prototype.getCoordinateFromPixel);
goog.exportProperty(
    ol.Map.prototype,
    'getEventCoordinate',
    ol.Map.prototype.getEventCoordinate);
goog.exportProperty(
    ol.Map.prototype,
    'getEventPixel',
    ol.Map.prototype.getEventPixel);
goog.exportProperty(
    ol.Map.prototype,
    'getInteractions',
    ol.Map.prototype.getInteractions);
goog.exportProperty(
    ol.Map.prototype,
    'getLayers',
    ol.Map.prototype.getLayers);
goog.exportProperty(
    ol.Map.prototype,
    'getOverlays',
    ol.Map.prototype.getOverlays);
goog.exportProperty(
    ol.Map.prototype,
    'getPixelFromCoordinate',
    ol.Map.prototype.getPixelFromCoordinate);
goog.exportProperty(
    ol.Map.prototype,
    'getViewport',
    ol.Map.prototype.getViewport);
goog.exportProperty(
    ol.Map.prototype,
    'removeControl',
    ol.Map.prototype.removeControl);
goog.exportProperty(
    ol.Map.prototype,
    'removeInteraction',
    ol.Map.prototype.removeInteraction);
goog.exportProperty(
    ol.Map.prototype,
    'removeLayer',
    ol.Map.prototype.removeLayer);
goog.exportProperty(
    ol.Map.prototype,
    'removeOverlay',
    ol.Map.prototype.removeOverlay);
goog.exportProperty(
    ol.Map.prototype,
    'render',
    ol.Map.prototype.render);
goog.exportProperty(
    ol.Map.prototype,
    'requestRenderFrame',
    ol.Map.prototype.requestRenderFrame);
goog.exportProperty(
    ol.Map.prototype,
    'updateSize',
    ol.Map.prototype.updateSize);
goog.exportProperty(
    ol.MapBrowserEvent.prototype,
    'preventDefault',
    ol.MapBrowserEvent.prototype.preventDefault);
goog.exportProperty(
    ol.MapBrowserEvent.prototype,
    'stopPropagation',
    ol.MapBrowserEvent.prototype.stopPropagation);


goog.exportSymbol(
    'ol.Object',
    ol.Object);
goog.exportProperty(
    ol.Object.prototype,
    'bindTo',
    ol.Object.prototype.bindTo);
goog.exportProperty(
    ol.Object.prototype,
    'get',
    ol.Object.prototype.get);
goog.exportProperty(
    ol.Object.prototype,
    'getProperties',
    ol.Object.prototype.getProperties);
goog.exportProperty(
    ol.Object.prototype,
    'notify',
    ol.Object.prototype.notify);
goog.exportProperty(
    ol.Object.prototype,
    'set',
    ol.Object.prototype.set);
goog.exportProperty(
    ol.Object.prototype,
    'setValues',
    ol.Object.prototype.setValues);
goog.exportProperty(
    ol.Object.prototype,
    'unbind',
    ol.Object.prototype.unbind);
goog.exportProperty(
    ol.Object.prototype,
    'unbindAll',
    ol.Object.prototype.unbindAll);


goog.exportSymbol(
    'ol.Observable',
    ol.Observable);
goog.exportProperty(
    ol.Observable.prototype,
    'dispatchChangeEvent',
    ol.Observable.prototype.dispatchChangeEvent);
goog.exportProperty(
    ol.Observable.prototype,
    'on',
    ol.Observable.prototype.on);
goog.exportProperty(
    ol.Observable.prototype,
    'once',
    ol.Observable.prototype.once);
goog.exportProperty(
    ol.Observable.prototype,
    'un',
    ol.Observable.prototype.un);
goog.exportProperty(
    ol.Observable.prototype,
    'unByKey',
    ol.Observable.prototype.unByKey);


goog.exportSymbol(
    'ol.Overlay',
    ol.Overlay);


goog.exportSymbol(
    'ol.OverlayPositioning',
    ol.OverlayPositioning);
goog.exportProperty(
    ol.OverlayPositioning,
    'BOTTOM_CENTER',
    ol.OverlayPositioning.BOTTOM_CENTER);
goog.exportProperty(
    ol.OverlayPositioning,
    'BOTTOM_LEFT',
    ol.OverlayPositioning.BOTTOM_LEFT);
goog.exportProperty(
    ol.OverlayPositioning,
    'BOTTOM_RIGHT',
    ol.OverlayPositioning.BOTTOM_RIGHT);
goog.exportProperty(
    ol.OverlayPositioning,
    'CENTER_CENTER',
    ol.OverlayPositioning.CENTER_CENTER);
goog.exportProperty(
    ol.OverlayPositioning,
    'CENTER_LEFT',
    ol.OverlayPositioning.CENTER_LEFT);
goog.exportProperty(
    ol.OverlayPositioning,
    'CENTER_RIGHT',
    ol.OverlayPositioning.CENTER_RIGHT);
goog.exportProperty(
    ol.OverlayPositioning,
    'TOP_CENTER',
    ol.OverlayPositioning.TOP_CENTER);
goog.exportProperty(
    ol.OverlayPositioning,
    'TOP_LEFT',
    ol.OverlayPositioning.TOP_LEFT);
goog.exportProperty(
    ol.OverlayPositioning,
    'TOP_RIGHT',
    ol.OverlayPositioning.TOP_RIGHT);


goog.exportSymbol(
    'ol.RendererHint',
    ol.RendererHint);
goog.exportProperty(
    ol.RendererHint,
    'CANVAS',
    ol.RendererHint.CANVAS);
goog.exportProperty(
    ol.RendererHint,
    'DOM',
    ol.RendererHint.DOM);
goog.exportProperty(
    ol.RendererHint,
    'WEBGL',
    ol.RendererHint.WEBGL);


goog.exportSymbol(
    'ol.RendererHints',
    ol.RendererHints);
goog.exportProperty(
    ol.RendererHints,
    'createFromQueryData',
    ol.RendererHints.createFromQueryData);
goog.exportProperty(
    ol.Tile.prototype,
    'getTileCoord',
    ol.Tile.prototype.getTileCoord);
goog.exportProperty(
    ol.TileCoord.prototype,
    'getZXY',
    ol.TileCoord.prototype.getZXY);


goog.exportSymbol(
    'ol.View2D',
    ol.View2D);
goog.exportProperty(
    ol.View2D.prototype,
    'calculateExtent',
    ol.View2D.prototype.calculateExtent);
goog.exportProperty(
    ol.View2D.prototype,
    'constrainResolution',
    ol.View2D.prototype.constrainResolution);
goog.exportProperty(
    ol.View2D.prototype,
    'constrainRotation',
    ol.View2D.prototype.constrainRotation);
goog.exportProperty(
    ol.View2D.prototype,
    'fitExtent',
    ol.View2D.prototype.fitExtent);
goog.exportProperty(
    ol.View2D.prototype,
    'getView2D',
    ol.View2D.prototype.getView2D);
goog.exportProperty(
    ol.View2D.prototype,
    'getZoom',
    ol.View2D.prototype.getZoom);
goog.exportProperty(
    ol.View2D.prototype,
    'setZoom',
    ol.View2D.prototype.setZoom);


goog.exportSymbol(
    'ol.animation.bounce',
    ol.animation.bounce);


goog.exportSymbol(
    'ol.animation.pan',
    ol.animation.pan);


goog.exportSymbol(
    'ol.animation.rotate',
    ol.animation.rotate);


goog.exportSymbol(
    'ol.animation.zoom',
    ol.animation.zoom);


goog.exportSymbol(
    'ol.color.asArray',
    ol.color.asArray);


goog.exportSymbol(
    'ol.color.asString',
    ol.color.asString);


goog.exportSymbol(
    'ol.control.Attribution',
    ol.control.Attribution);
goog.exportProperty(
    ol.control.Attribution.prototype,
    'setMap',
    ol.control.Attribution.prototype.setMap);


goog.exportSymbol(
    'ol.control.Control',
    ol.control.Control);
goog.exportProperty(
    ol.control.Control.prototype,
    'getMap',
    ol.control.Control.prototype.getMap);
goog.exportProperty(
    ol.control.Control.prototype,
    'setMap',
    ol.control.Control.prototype.setMap);


goog.exportSymbol(
    'ol.control.FullScreen',
    ol.control.FullScreen);


goog.exportSymbol(
    'ol.control.Logo',
    ol.control.Logo);
goog.exportProperty(
    ol.control.Logo.prototype,
    'setMap',
    ol.control.Logo.prototype.setMap);


goog.exportSymbol(
    'ol.control.MousePosition',
    ol.control.MousePosition);
goog.exportProperty(
    ol.control.MousePosition.prototype,
    'setMap',
    ol.control.MousePosition.prototype.setMap);


goog.exportSymbol(
    'ol.control.ScaleLine',
    ol.control.ScaleLine);
goog.exportProperty(
    ol.control.ScaleLine.prototype,
    'setMap',
    ol.control.ScaleLine.prototype.setMap);


goog.exportSymbol(
    'ol.control.ScaleLineUnits',
    ol.control.ScaleLineUnits);
goog.exportProperty(
    ol.control.ScaleLineUnits,
    'DEGREES',
    ol.control.ScaleLineUnits.DEGREES);
goog.exportProperty(
    ol.control.ScaleLineUnits,
    'IMPERIAL',
    ol.control.ScaleLineUnits.IMPERIAL);
goog.exportProperty(
    ol.control.ScaleLineUnits,
    'METRIC',
    ol.control.ScaleLineUnits.METRIC);
goog.exportProperty(
    ol.control.ScaleLineUnits,
    'NAUTICAL',
    ol.control.ScaleLineUnits.NAUTICAL);
goog.exportProperty(
    ol.control.ScaleLineUnits,
    'US',
    ol.control.ScaleLineUnits.US);


goog.exportSymbol(
    'ol.control.Zoom',
    ol.control.Zoom);
goog.exportProperty(
    ol.control.Zoom.prototype,
    'setMap',
    ol.control.Zoom.prototype.setMap);


goog.exportSymbol(
    'ol.control.ZoomSlider',
    ol.control.ZoomSlider);


goog.exportSymbol(
    'ol.control.ZoomToExtent',
    ol.control.ZoomToExtent);


goog.exportSymbol(
    'ol.control.defaults',
    ol.control.defaults);


goog.exportSymbol(
    'ol.coordinate.createStringXY',
    ol.coordinate.createStringXY);


goog.exportSymbol(
    'ol.coordinate.format',
    ol.coordinate.format);


goog.exportSymbol(
    'ol.coordinate.fromProjectedArray',
    ol.coordinate.fromProjectedArray);


goog.exportSymbol(
    'ol.coordinate.rotate',
    ol.coordinate.rotate);


goog.exportSymbol(
    'ol.coordinate.toStringHDMS',
    ol.coordinate.toStringHDMS);


goog.exportSymbol(
    'ol.coordinate.toStringXY',
    ol.coordinate.toStringXY);


goog.exportSymbol(
    'ol.dom.Input',
    ol.dom.Input);


goog.exportSymbol(
    'ol.easing.bounce',
    ol.easing.bounce);


goog.exportSymbol(
    'ol.easing.easeIn',
    ol.easing.easeIn);


goog.exportSymbol(
    'ol.easing.easeOut',
    ol.easing.easeOut);


goog.exportSymbol(
    'ol.easing.elastic',
    ol.easing.elastic);


goog.exportSymbol(
    'ol.easing.inAndOut',
    ol.easing.inAndOut);


goog.exportSymbol(
    'ol.easing.linear',
    ol.easing.linear);


goog.exportSymbol(
    'ol.easing.upAndDown',
    ol.easing.upAndDown);


goog.exportSymbol(
    'ol.events.condition.altKeyOnly',
    ol.events.condition.altKeyOnly);


goog.exportSymbol(
    'ol.events.condition.altShiftKeysOnly',
    ol.events.condition.altShiftKeysOnly);


goog.exportSymbol(
    'ol.events.condition.always',
    ol.events.condition.always);


goog.exportSymbol(
    'ol.events.condition.noModifierKeys',
    ol.events.condition.noModifierKeys);


goog.exportSymbol(
    'ol.events.condition.platformModifierKeyOnly',
    ol.events.condition.platformModifierKeyOnly);


goog.exportSymbol(
    'ol.events.condition.shiftKeyOnly',
    ol.events.condition.shiftKeyOnly);


goog.exportSymbol(
    'ol.events.condition.targetNotEditable',
    ol.events.condition.targetNotEditable);


goog.exportSymbol(
    'ol.extent.boundingExtent',
    ol.extent.boundingExtent);


goog.exportSymbol(
    'ol.extent.buffer',
    ol.extent.buffer);


goog.exportSymbol(
    'ol.extent.containsCoordinate',
    ol.extent.containsCoordinate);


goog.exportSymbol(
    'ol.extent.containsExtent',
    ol.extent.containsExtent);


goog.exportSymbol(
    'ol.extent.createEmpty',
    ol.extent.createEmpty);


goog.exportSymbol(
    'ol.extent.equals',
    ol.extent.equals);


goog.exportSymbol(
    'ol.extent.extend',
    ol.extent.extend);


goog.exportSymbol(
    'ol.extent.getBottomLeft',
    ol.extent.getBottomLeft);


goog.exportSymbol(
    'ol.extent.getBottomRight',
    ol.extent.getBottomRight);


goog.exportSymbol(
    'ol.extent.getCenter',
    ol.extent.getCenter);


goog.exportSymbol(
    'ol.extent.getHeight',
    ol.extent.getHeight);


goog.exportSymbol(
    'ol.extent.getSize',
    ol.extent.getSize);


goog.exportSymbol(
    'ol.extent.getTopLeft',
    ol.extent.getTopLeft);


goog.exportSymbol(
    'ol.extent.getTopRight',
    ol.extent.getTopRight);


goog.exportSymbol(
    'ol.extent.getWidth',
    ol.extent.getWidth);


goog.exportSymbol(
    'ol.extent.intersects',
    ol.extent.intersects);


goog.exportSymbol(
    'ol.extent.isEmpty',
    ol.extent.isEmpty);


goog.exportSymbol(
    'ol.extent.transform',
    ol.extent.transform);
goog.exportProperty(
    ol.format.Format.prototype,
    'readProjection',
    ol.format.Format.prototype.readProjection);


goog.exportSymbol(
    'ol.format.GPX',
    ol.format.GPX);
goog.exportProperty(
    ol.format.GPX.prototype,
    'readFeature',
    ol.format.GPX.prototype.readFeature);
goog.exportProperty(
    ol.format.GPX.prototype,
    'readFeatures',
    ol.format.GPX.prototype.readFeatures);


goog.exportSymbol(
    'ol.format.GeoJSON',
    ol.format.GeoJSON);
goog.exportProperty(
    ol.format.GeoJSON.prototype,
    'readFeature',
    ol.format.GeoJSON.prototype.readFeature);
goog.exportProperty(
    ol.format.GeoJSON.prototype,
    'readFeatures',
    ol.format.GeoJSON.prototype.readFeatures);
goog.exportProperty(
    ol.format.GeoJSON.prototype,
    'readGeometry',
    ol.format.GeoJSON.prototype.readGeometry);
goog.exportProperty(
    ol.format.GeoJSON.prototype,
    'readProjection',
    ol.format.GeoJSON.prototype.readProjection);
goog.exportProperty(
    ol.format.GeoJSON.prototype,
    'writeFeature',
    ol.format.GeoJSON.prototype.writeFeature);
goog.exportProperty(
    ol.format.GeoJSON.prototype,
    'writeFeatures',
    ol.format.GeoJSON.prototype.writeFeatures);
goog.exportProperty(
    ol.format.GeoJSON.prototype,
    'writeGeometry',
    ol.format.GeoJSON.prototype.writeGeometry);


goog.exportSymbol(
    'ol.format.IGC',
    ol.format.IGC);
goog.exportProperty(
    ol.format.IGC.prototype,
    'readFeature',
    ol.format.IGC.prototype.readFeature);
goog.exportProperty(
    ol.format.IGC.prototype,
    'readFeatures',
    ol.format.IGC.prototype.readFeatures);


goog.exportSymbol(
    'ol.format.KML',
    ol.format.KML);
goog.exportProperty(
    ol.format.KML.prototype,
    'readFeature',
    ol.format.KML.prototype.readFeature);
goog.exportProperty(
    ol.format.KML.prototype,
    'readFeatures',
    ol.format.KML.prototype.readFeatures);
goog.exportProperty(
    ol.format.KML.prototype,
    'readGeometry',
    ol.format.KML.prototype.readGeometry);
goog.exportProperty(
    ol.format.KML.prototype,
    'readName',
    ol.format.KML.prototype.readName);
goog.exportProperty(
    ol.format.KML.prototype,
    'readProjection',
    ol.format.KML.prototype.readProjection);


goog.exportSymbol(
    'ol.format.TopoJSON',
    ol.format.TopoJSON);
goog.exportProperty(
    ol.format.TopoJSON.prototype,
    'readFeatures',
    ol.format.TopoJSON.prototype.readFeatures);
goog.exportProperty(
    ol.format.TopoJSON.prototype,
    'readProjection',
    ol.format.TopoJSON.prototype.readProjection);


goog.exportSymbol(
    'ol.geom.Circle',
    ol.geom.Circle);
goog.exportProperty(
    ol.geom.Circle.prototype,
    'clone',
    ol.geom.Circle.prototype.clone);
goog.exportProperty(
    ol.geom.Circle.prototype,
    'getCenter',
    ol.geom.Circle.prototype.getCenter);
goog.exportProperty(
    ol.geom.Circle.prototype,
    'getExtent',
    ol.geom.Circle.prototype.getExtent);
goog.exportProperty(
    ol.geom.Circle.prototype,
    'getRadius',
    ol.geom.Circle.prototype.getRadius);
goog.exportProperty(
    ol.geom.Circle.prototype,
    'getSimplifiedGeometry',
    ol.geom.Circle.prototype.getSimplifiedGeometry);
goog.exportProperty(
    ol.geom.Circle.prototype,
    'getType',
    ol.geom.Circle.prototype.getType);
goog.exportProperty(
    ol.geom.Circle.prototype,
    'setCenter',
    ol.geom.Circle.prototype.setCenter);
goog.exportProperty(
    ol.geom.Circle.prototype,
    'setCenterAndRadius',
    ol.geom.Circle.prototype.setCenterAndRadius);
goog.exportProperty(
    ol.geom.Circle.prototype,
    'setRadius',
    ol.geom.Circle.prototype.setRadius);
goog.exportProperty(
    ol.geom.Circle.prototype,
    'transform',
    ol.geom.Circle.prototype.transform);


goog.exportSymbol(
    'ol.geom.Geometry',
    ol.geom.Geometry);
goog.exportProperty(
    ol.geom.Geometry.prototype,
    'getClosestPoint',
    ol.geom.Geometry.prototype.getClosestPoint);
goog.exportProperty(
    ol.geom.Geometry.prototype,
    'getType',
    ol.geom.Geometry.prototype.getType);


goog.exportSymbol(
    'ol.geom.GeometryCollection',
    ol.geom.GeometryCollection);
goog.exportProperty(
    ol.geom.GeometryCollection.prototype,
    'clone',
    ol.geom.GeometryCollection.prototype.clone);
goog.exportProperty(
    ol.geom.GeometryCollection.prototype,
    'getExtent',
    ol.geom.GeometryCollection.prototype.getExtent);
goog.exportProperty(
    ol.geom.GeometryCollection.prototype,
    'getGeometries',
    ol.geom.GeometryCollection.prototype.getGeometries);
goog.exportProperty(
    ol.geom.GeometryCollection.prototype,
    'getSimplifiedGeometry',
    ol.geom.GeometryCollection.prototype.getSimplifiedGeometry);
goog.exportProperty(
    ol.geom.GeometryCollection.prototype,
    'getType',
    ol.geom.GeometryCollection.prototype.getType);
goog.exportProperty(
    ol.geom.GeometryCollection.prototype,
    'setGeometries',
    ol.geom.GeometryCollection.prototype.setGeometries);


goog.exportSymbol(
    'ol.geom.LineString',
    ol.geom.LineString);
goog.exportProperty(
    ol.geom.LineString.prototype,
    'clone',
    ol.geom.LineString.prototype.clone);
goog.exportProperty(
    ol.geom.LineString.prototype,
    'getCoordinates',
    ol.geom.LineString.prototype.getCoordinates);
goog.exportProperty(
    ol.geom.LineString.prototype,
    'getLength',
    ol.geom.LineString.prototype.getLength);
goog.exportProperty(
    ol.geom.LineString.prototype,
    'getType',
    ol.geom.LineString.prototype.getType);
goog.exportProperty(
    ol.geom.LineString.prototype,
    'setCoordinates',
    ol.geom.LineString.prototype.setCoordinates);


goog.exportSymbol(
    'ol.geom.LinearRing',
    ol.geom.LinearRing);
goog.exportProperty(
    ol.geom.LinearRing.prototype,
    'clone',
    ol.geom.LinearRing.prototype.clone);
goog.exportProperty(
    ol.geom.LinearRing.prototype,
    'getArea',
    ol.geom.LinearRing.prototype.getArea);
goog.exportProperty(
    ol.geom.LinearRing.prototype,
    'getCoordinates',
    ol.geom.LinearRing.prototype.getCoordinates);
goog.exportProperty(
    ol.geom.LinearRing.prototype,
    'getType',
    ol.geom.LinearRing.prototype.getType);
goog.exportProperty(
    ol.geom.LinearRing.prototype,
    'setCoordinates',
    ol.geom.LinearRing.prototype.setCoordinates);


goog.exportSymbol(
    'ol.geom.MultiLineString',
    ol.geom.MultiLineString);
goog.exportProperty(
    ol.geom.MultiLineString.prototype,
    'clone',
    ol.geom.MultiLineString.prototype.clone);
goog.exportProperty(
    ol.geom.MultiLineString.prototype,
    'getCoordinates',
    ol.geom.MultiLineString.prototype.getCoordinates);
goog.exportProperty(
    ol.geom.MultiLineString.prototype,
    'getLineStrings',
    ol.geom.MultiLineString.prototype.getLineStrings);
goog.exportProperty(
    ol.geom.MultiLineString.prototype,
    'getType',
    ol.geom.MultiLineString.prototype.getType);
goog.exportProperty(
    ol.geom.MultiLineString.prototype,
    'setCoordinates',
    ol.geom.MultiLineString.prototype.setCoordinates);


goog.exportSymbol(
    'ol.geom.MultiPoint',
    ol.geom.MultiPoint);
goog.exportProperty(
    ol.geom.MultiPoint.prototype,
    'clone',
    ol.geom.MultiPoint.prototype.clone);
goog.exportProperty(
    ol.geom.MultiPoint.prototype,
    'getCoordinates',
    ol.geom.MultiPoint.prototype.getCoordinates);
goog.exportProperty(
    ol.geom.MultiPoint.prototype,
    'getPoints',
    ol.geom.MultiPoint.prototype.getPoints);
goog.exportProperty(
    ol.geom.MultiPoint.prototype,
    'getType',
    ol.geom.MultiPoint.prototype.getType);
goog.exportProperty(
    ol.geom.MultiPoint.prototype,
    'setCoordinates',
    ol.geom.MultiPoint.prototype.setCoordinates);


goog.exportSymbol(
    'ol.geom.MultiPolygon',
    ol.geom.MultiPolygon);
goog.exportProperty(
    ol.geom.MultiPolygon.prototype,
    'clone',
    ol.geom.MultiPolygon.prototype.clone);
goog.exportProperty(
    ol.geom.MultiPolygon.prototype,
    'getArea',
    ol.geom.MultiPolygon.prototype.getArea);
goog.exportProperty(
    ol.geom.MultiPolygon.prototype,
    'getCoordinates',
    ol.geom.MultiPolygon.prototype.getCoordinates);
goog.exportProperty(
    ol.geom.MultiPolygon.prototype,
    'getPolygons',
    ol.geom.MultiPolygon.prototype.getPolygons);
goog.exportProperty(
    ol.geom.MultiPolygon.prototype,
    'getType',
    ol.geom.MultiPolygon.prototype.getType);
goog.exportProperty(
    ol.geom.MultiPolygon.prototype,
    'setCoordinates',
    ol.geom.MultiPolygon.prototype.setCoordinates);


goog.exportSymbol(
    'ol.geom.Point',
    ol.geom.Point);
goog.exportProperty(
    ol.geom.Point.prototype,
    'clone',
    ol.geom.Point.prototype.clone);
goog.exportProperty(
    ol.geom.Point.prototype,
    'getCoordinates',
    ol.geom.Point.prototype.getCoordinates);
goog.exportProperty(
    ol.geom.Point.prototype,
    'getType',
    ol.geom.Point.prototype.getType);
goog.exportProperty(
    ol.geom.Point.prototype,
    'setCoordinates',
    ol.geom.Point.prototype.setCoordinates);


goog.exportSymbol(
    'ol.geom.Polygon',
    ol.geom.Polygon);
goog.exportProperty(
    ol.geom.Polygon.prototype,
    'clone',
    ol.geom.Polygon.prototype.clone);
goog.exportProperty(
    ol.geom.Polygon.prototype,
    'getArea',
    ol.geom.Polygon.prototype.getArea);
goog.exportProperty(
    ol.geom.Polygon.prototype,
    'getCoordinates',
    ol.geom.Polygon.prototype.getCoordinates);
goog.exportProperty(
    ol.geom.Polygon.prototype,
    'getLinearRings',
    ol.geom.Polygon.prototype.getLinearRings);
goog.exportProperty(
    ol.geom.Polygon.prototype,
    'getType',
    ol.geom.Polygon.prototype.getType);
goog.exportProperty(
    ol.geom.Polygon.prototype,
    'setCoordinates',
    ol.geom.Polygon.prototype.setCoordinates);


goog.exportSymbol(
    'ol.geom.SimpleGeometry',
    ol.geom.SimpleGeometry);
goog.exportProperty(
    ol.geom.SimpleGeometry.prototype,
    'getExtent',
    ol.geom.SimpleGeometry.prototype.getExtent);
goog.exportProperty(
    ol.geom.SimpleGeometry.prototype,
    'getLayout',
    ol.geom.SimpleGeometry.prototype.getLayout);
goog.exportProperty(
    ol.geom.SimpleGeometry.prototype,
    'getSimplifiedGeometry',
    ol.geom.SimpleGeometry.prototype.getSimplifiedGeometry);
goog.exportProperty(
    ol.geom.SimpleGeometry.prototype,
    'transform',
    ol.geom.SimpleGeometry.prototype.transform);


goog.exportSymbol(
    'ol.inherits',
    ol.inherits);


goog.exportSymbol(
    'ol.interaction.DoubleClickZoom',
    ol.interaction.DoubleClickZoom);


goog.exportSymbol(
    'ol.interaction.DragAndDrop',
    ol.interaction.DragAndDrop);


goog.exportSymbol(
    'ol.interaction.DragBox',
    ol.interaction.DragBox);
goog.exportProperty(
    ol.interaction.DragBox.prototype,
    'getGeometry',
    ol.interaction.DragBox.prototype.getGeometry);


goog.exportSymbol(
    'ol.interaction.DragPan',
    ol.interaction.DragPan);


goog.exportSymbol(
    'ol.interaction.DragRotate',
    ol.interaction.DragRotate);


goog.exportSymbol(
    'ol.interaction.DragRotateAndZoom',
    ol.interaction.DragRotateAndZoom);


goog.exportSymbol(
    'ol.interaction.DragZoom',
    ol.interaction.DragZoom);


goog.exportSymbol(
    'ol.interaction.Draw',
    ol.interaction.Draw);


goog.exportSymbol(
    'ol.interaction.KeyboardPan',
    ol.interaction.KeyboardPan);


goog.exportSymbol(
    'ol.interaction.KeyboardZoom',
    ol.interaction.KeyboardZoom);


goog.exportSymbol(
    'ol.interaction.MouseWheelZoom',
    ol.interaction.MouseWheelZoom);


goog.exportSymbol(
    'ol.interaction.Select',
    ol.interaction.Select);
goog.exportProperty(
    ol.interaction.Select.prototype,
    'getFeaturesOverlay',
    ol.interaction.Select.prototype.getFeaturesOverlay);
goog.exportProperty(
    ol.interaction.Select.prototype,
    'setMap',
    ol.interaction.Select.prototype.setMap);


goog.exportSymbol(
    'ol.interaction.TouchPan',
    ol.interaction.TouchPan);


goog.exportSymbol(
    'ol.interaction.TouchRotate',
    ol.interaction.TouchRotate);


goog.exportSymbol(
    'ol.interaction.TouchZoom',
    ol.interaction.TouchZoom);


goog.exportSymbol(
    'ol.interaction.defaults',
    ol.interaction.defaults);


goog.exportSymbol(
    'ol.layer.Group',
    ol.layer.Group);


goog.exportSymbol(
    'ol.layer.Image',
    ol.layer.Image);


goog.exportSymbol(
    'ol.layer.Layer',
    ol.layer.Layer);
goog.exportProperty(
    ol.layer.Layer.prototype,
    'getSource',
    ol.layer.Layer.prototype.getSource);


goog.exportSymbol(
    'ol.layer.Tile',
    ol.layer.Tile);


goog.exportSymbol(
    'ol.layer.Vector',
    ol.layer.Vector);


goog.exportSymbol(
    'ol.parser.ogc.WMSCapabilities',
    ol.parser.ogc.WMSCapabilities);
goog.exportProperty(
    ol.parser.ogc.WMSCapabilities.prototype,
    'read',
    ol.parser.ogc.WMSCapabilities.prototype.read);


goog.exportSymbol(
    'ol.proj.METERS_PER_UNIT',
    ol.proj.METERS_PER_UNIT);


goog.exportSymbol(
    'ol.proj.Projection',
    ol.proj.Projection);
goog.exportProperty(
    ol.proj.Projection.prototype,
    'getCode',
    ol.proj.Projection.prototype.getCode);
goog.exportProperty(
    ol.proj.Projection.prototype,
    'getExtent',
    ol.proj.Projection.prototype.getExtent);
goog.exportProperty(
    ol.proj.Projection.prototype,
    'getUnits',
    ol.proj.Projection.prototype.getUnits);


goog.exportSymbol(
    'ol.proj.Units',
    ol.proj.Units);
goog.exportProperty(
    ol.proj.Units,
    'DEGREES',
    ol.proj.Units.DEGREES);
goog.exportProperty(
    ol.proj.Units,
    'FEET',
    ol.proj.Units.FEET);
goog.exportProperty(
    ol.proj.Units,
    'METERS',
    ol.proj.Units.METERS);
goog.exportProperty(
    ol.proj.Units,
    'PIXELS',
    ol.proj.Units.PIXELS);


goog.exportSymbol(
    'ol.proj.addProjection',
    ol.proj.addProjection);


goog.exportSymbol(
    'ol.proj.common.add',
    ol.proj.common.add);


goog.exportSymbol(
    'ol.proj.configureProj4jsProjection',
    ol.proj.configureProj4jsProjection);


goog.exportSymbol(
    'ol.proj.get',
    ol.proj.get);


goog.exportSymbol(
    'ol.proj.getTransform',
    ol.proj.getTransform);


goog.exportSymbol(
    'ol.proj.getTransformFromProjections',
    ol.proj.getTransformFromProjections);


goog.exportSymbol(
    'ol.proj.transform',
    ol.proj.transform);


goog.exportSymbol(
    'ol.proj.transformWithProjections',
    ol.proj.transformWithProjections);


goog.exportSymbol(
    'ol.render.FeaturesOverlay',
    ol.render.FeaturesOverlay);
goog.exportProperty(
    ol.render.FeaturesOverlay.prototype,
    'addFeature',
    ol.render.FeaturesOverlay.prototype.addFeature);
goog.exportProperty(
    ol.render.FeaturesOverlay.prototype,
    'getFeatures',
    ol.render.FeaturesOverlay.prototype.getFeatures);
goog.exportProperty(
    ol.render.FeaturesOverlay.prototype,
    'removeFeature',
    ol.render.FeaturesOverlay.prototype.removeFeature);
goog.exportProperty(
    ol.render.FeaturesOverlay.prototype,
    'setFeatures',
    ol.render.FeaturesOverlay.prototype.setFeatures);
goog.exportProperty(
    ol.render.FeaturesOverlay.prototype,
    'setMap',
    ol.render.FeaturesOverlay.prototype.setMap);
goog.exportProperty(
    ol.render.FeaturesOverlay.prototype,
    'setStyleFunction',
    ol.render.FeaturesOverlay.prototype.setStyleFunction);
goog.exportProperty(
    ol.render.canvas.Immediate.prototype,
    'drawAsync',
    ol.render.canvas.Immediate.prototype.drawAsync);
goog.exportProperty(
    ol.render.canvas.Immediate.prototype,
    'drawFeature',
    ol.render.canvas.Immediate.prototype.drawFeature);
goog.exportProperty(
    ol.render.canvas.Immediate.prototype,
    'drawLineStringGeometry',
    ol.render.canvas.Immediate.prototype.drawLineStringGeometry);
goog.exportProperty(
    ol.render.canvas.Immediate.prototype,
    'drawMultiLineStringGeometry',
    ol.render.canvas.Immediate.prototype.drawMultiLineStringGeometry);
goog.exportProperty(
    ol.render.canvas.Immediate.prototype,
    'drawMultiPointGeometry',
    ol.render.canvas.Immediate.prototype.drawMultiPointGeometry);
goog.exportProperty(
    ol.render.canvas.Immediate.prototype,
    'drawPointGeometry',
    ol.render.canvas.Immediate.prototype.drawPointGeometry);
goog.exportProperty(
    ol.render.canvas.Immediate.prototype,
    'drawPolygonGeometry',
    ol.render.canvas.Immediate.prototype.drawPolygonGeometry);
goog.exportProperty(
    ol.render.canvas.Immediate.prototype,
    'setFillStrokeStyle',
    ol.render.canvas.Immediate.prototype.setFillStrokeStyle);
goog.exportProperty(
    ol.render.canvas.Immediate.prototype,
    'setImageStyle',
    ol.render.canvas.Immediate.prototype.setImageStyle);


goog.exportSymbol(
    'ol.source.BingMaps',
    ol.source.BingMaps);
goog.exportProperty(
    ol.source.BingMaps,
    'TOS_ATTRIBUTION',
    ol.source.BingMaps.TOS_ATTRIBUTION);


goog.exportSymbol(
    'ol.source.GPX',
    ol.source.GPX);


goog.exportSymbol(
    'ol.source.GeoJSON',
    ol.source.GeoJSON);


goog.exportSymbol(
    'ol.source.IGC',
    ol.source.IGC);


goog.exportSymbol(
    'ol.source.ImageCanvas',
    ol.source.ImageCanvas);


goog.exportSymbol(
    'ol.source.ImageStatic',
    ol.source.ImageStatic);


goog.exportSymbol(
    'ol.source.ImageVector',
    ol.source.ImageVector);


goog.exportSymbol(
    'ol.source.ImageWMS',
    ol.source.ImageWMS);
goog.exportProperty(
    ol.source.ImageWMS.prototype,
    'getGetFeatureInfoUrl',
    ol.source.ImageWMS.prototype.getGetFeatureInfoUrl);
goog.exportProperty(
    ol.source.ImageWMS.prototype,
    'getParams',
    ol.source.ImageWMS.prototype.getParams);
goog.exportProperty(
    ol.source.ImageWMS.prototype,
    'setUrl',
    ol.source.ImageWMS.prototype.setUrl);
goog.exportProperty(
    ol.source.ImageWMS.prototype,
    'updateParams',
    ol.source.ImageWMS.prototype.updateParams);


goog.exportSymbol(
    'ol.source.KML',
    ol.source.KML);


goog.exportSymbol(
    'ol.source.MapGuide',
    ol.source.MapGuide);


goog.exportSymbol(
    'ol.source.MapQuest',
    ol.source.MapQuest);


goog.exportSymbol(
    'ol.source.OSM',
    ol.source.OSM);
goog.exportProperty(
    ol.source.OSM,
    'DATA_ATTRIBUTION',
    ol.source.OSM.DATA_ATTRIBUTION);
goog.exportProperty(
    ol.source.OSM,
    'TILE_ATTRIBUTION',
    ol.source.OSM.TILE_ATTRIBUTION);
goog.exportProperty(
    ol.source.Source.prototype,
    'getExtent',
    ol.source.Source.prototype.getExtent);
goog.exportProperty(
    ol.source.Source.prototype,
    'getState',
    ol.source.Source.prototype.getState);


goog.exportSymbol(
    'ol.source.Stamen',
    ol.source.Stamen);


goog.exportSymbol(
    'ol.source.State',
    ol.source.State);
goog.exportProperty(
    ol.source.State,
    'ERROR',
    ol.source.State.ERROR);
goog.exportProperty(
    ol.source.State,
    'LOADING',
    ol.source.State.LOADING);
goog.exportProperty(
    ol.source.State,
    'READY',
    ol.source.State.READY);


goog.exportSymbol(
    'ol.source.Tile',
    ol.source.Tile);
goog.exportProperty(
    ol.source.Tile.prototype,
    'getTileGrid',
    ol.source.Tile.prototype.getTileGrid);


goog.exportSymbol(
    'ol.source.TileDebug',
    ol.source.TileDebug);


goog.exportSymbol(
    'ol.source.TileJSON',
    ol.source.TileJSON);


goog.exportSymbol(
    'ol.source.TileWMS',
    ol.source.TileWMS);
goog.exportProperty(
    ol.source.TileWMS.prototype,
    'getGetFeatureInfoUrl',
    ol.source.TileWMS.prototype.getGetFeatureInfoUrl);
goog.exportProperty(
    ol.source.TileWMS.prototype,
    'getParams',
    ol.source.TileWMS.prototype.getParams);
goog.exportProperty(
    ol.source.TileWMS.prototype,
    'updateParams',
    ol.source.TileWMS.prototype.updateParams);


goog.exportSymbol(
    'ol.source.TopoJSON',
    ol.source.TopoJSON);


goog.exportSymbol(
    'ol.source.Vector',
    ol.source.Vector);
goog.exportProperty(
    ol.source.Vector.prototype,
    'addFeature',
    ol.source.Vector.prototype.addFeature);
goog.exportProperty(
    ol.source.Vector.prototype,
    'addFeatures',
    ol.source.Vector.prototype.addFeatures);
goog.exportProperty(
    ol.source.Vector.prototype,
    'forEachFeature',
    ol.source.Vector.prototype.forEachFeature);
goog.exportProperty(
    ol.source.Vector.prototype,
    'forEachFeatureInExtent',
    ol.source.Vector.prototype.forEachFeatureInExtent);
goog.exportProperty(
    ol.source.Vector.prototype,
    'getAllFeatures',
    ol.source.Vector.prototype.getAllFeatures);
goog.exportProperty(
    ol.source.Vector.prototype,
    'getAllFeaturesAtCoordinate',
    ol.source.Vector.prototype.getAllFeaturesAtCoordinate);
goog.exportProperty(
    ol.source.Vector.prototype,
    'getClosestFeatureToCoordinate',
    ol.source.Vector.prototype.getClosestFeatureToCoordinate);
goog.exportProperty(
    ol.source.Vector.prototype,
    'getExtent',
    ol.source.Vector.prototype.getExtent);
goog.exportProperty(
    ol.source.Vector.prototype,
    'removeFeature',
    ol.source.Vector.prototype.removeFeature);


goog.exportSymbol(
    'ol.source.VectorFile',
    ol.source.VectorFile);


goog.exportSymbol(
    'ol.source.WMTS',
    ol.source.WMTS);


goog.exportSymbol(
    'ol.source.WMTS.optionsFromCapabilities',
    ol.source.WMTS.optionsFromCapabilities);
goog.exportProperty(
    ol.source.WMTS.prototype,
    'getDimensions',
    ol.source.WMTS.prototype.getDimensions);
goog.exportProperty(
    ol.source.WMTS.prototype,
    'updateDimensions',
    ol.source.WMTS.prototype.updateDimensions);


goog.exportSymbol(
    'ol.source.XYZ',
    ol.source.XYZ);
goog.exportProperty(
    ol.source.XYZ.prototype,
    'setUrl',
    ol.source.XYZ.prototype.setUrl);


goog.exportSymbol(
    'ol.source.Zoomify',
    ol.source.Zoomify);


goog.exportSymbol(
    'ol.source.wms.ServerType',
    ol.source.wms.ServerType);
goog.exportProperty(
    ol.source.wms.ServerType,
    'GEOSERVER',
    ol.source.wms.ServerType.GEOSERVER);
goog.exportProperty(
    ol.source.wms.ServerType,
    'MAPSERVER',
    ol.source.wms.ServerType.MAPSERVER);
goog.exportProperty(
    ol.source.wms.ServerType,
    'QGIS',
    ol.source.wms.ServerType.QGIS);


goog.exportSymbol(
    'ol.style.Circle',
    ol.style.Circle);
goog.exportProperty(
    ol.style.Circle.prototype,
    'getFill',
    ol.style.Circle.prototype.getFill);
goog.exportProperty(
    ol.style.Circle.prototype,
    'getImage',
    ol.style.Circle.prototype.getImage);
goog.exportProperty(
    ol.style.Circle.prototype,
    'getRadius',
    ol.style.Circle.prototype.getRadius);
goog.exportProperty(
    ol.style.Circle.prototype,
    'getStroke',
    ol.style.Circle.prototype.getStroke);


goog.exportSymbol(
    'ol.style.Fill',
    ol.style.Fill);
goog.exportProperty(
    ol.style.Fill.prototype,
    'getColor',
    ol.style.Fill.prototype.getColor);


goog.exportSymbol(
    'ol.style.Icon',
    ol.style.Icon);
goog.exportProperty(
    ol.style.Icon.prototype,
    'getImage',
    ol.style.Icon.prototype.getImage);
goog.exportProperty(
    ol.style.Icon.prototype,
    'getSrc',
    ol.style.Icon.prototype.getSrc);


goog.exportSymbol(
    'ol.style.Image',
    ol.style.Image);
goog.exportProperty(
    ol.style.Image.prototype,
    'getAnchor',
    ol.style.Image.prototype.getAnchor);
goog.exportProperty(
    ol.style.Image.prototype,
    'getRotation',
    ol.style.Image.prototype.getRotation);
goog.exportProperty(
    ol.style.Image.prototype,
    'getScale',
    ol.style.Image.prototype.getScale);
goog.exportProperty(
    ol.style.Image.prototype,
    'getSize',
    ol.style.Image.prototype.getSize);


goog.exportSymbol(
    'ol.style.Stroke',
    ol.style.Stroke);
goog.exportProperty(
    ol.style.Stroke.prototype,
    'getColor',
    ol.style.Stroke.prototype.getColor);
goog.exportProperty(
    ol.style.Stroke.prototype,
    'getLineCap',
    ol.style.Stroke.prototype.getLineCap);
goog.exportProperty(
    ol.style.Stroke.prototype,
    'getLineDash',
    ol.style.Stroke.prototype.getLineDash);
goog.exportProperty(
    ol.style.Stroke.prototype,
    'getLineJoin',
    ol.style.Stroke.prototype.getLineJoin);
goog.exportProperty(
    ol.style.Stroke.prototype,
    'getMiterLimit',
    ol.style.Stroke.prototype.getMiterLimit);
goog.exportProperty(
    ol.style.Stroke.prototype,
    'getWidth',
    ol.style.Stroke.prototype.getWidth);


goog.exportSymbol(
    'ol.style.Style',
    ol.style.Style);
goog.exportProperty(
    ol.style.Style.prototype,
    'getFill',
    ol.style.Style.prototype.getFill);
goog.exportProperty(
    ol.style.Style.prototype,
    'getImage',
    ol.style.Style.prototype.getImage);
goog.exportProperty(
    ol.style.Style.prototype,
    'getStroke',
    ol.style.Style.prototype.getStroke);
goog.exportProperty(
    ol.style.Style.prototype,
    'getText',
    ol.style.Style.prototype.getText);
goog.exportProperty(
    ol.style.Style.prototype,
    'getZIndex',
    ol.style.Style.prototype.getZIndex);


goog.exportSymbol(
    'ol.style.Text',
    ol.style.Text);


goog.exportSymbol(
    'ol.tilegrid.TileGrid',
    ol.tilegrid.TileGrid);
goog.exportProperty(
    ol.tilegrid.TileGrid.prototype,
    'getMinZoom',
    ol.tilegrid.TileGrid.prototype.getMinZoom);
goog.exportProperty(
    ol.tilegrid.TileGrid.prototype,
    'getOrigin',
    ol.tilegrid.TileGrid.prototype.getOrigin);
goog.exportProperty(
    ol.tilegrid.TileGrid.prototype,
    'getResolutions',
    ol.tilegrid.TileGrid.prototype.getResolutions);
goog.exportProperty(
    ol.tilegrid.TileGrid.prototype,
    'getTileSize',
    ol.tilegrid.TileGrid.prototype.getTileSize);


goog.exportSymbol(
    'ol.tilegrid.WMTS',
    ol.tilegrid.WMTS);
goog.exportProperty(
    ol.tilegrid.WMTS.prototype,
    'getMatrixIds',
    ol.tilegrid.WMTS.prototype.getMatrixIds);


goog.exportSymbol(
    'ol.tilegrid.XYZ',
    ol.tilegrid.XYZ);


goog.exportSymbol(
    'ol.tilegrid.Zoomify',
    ol.tilegrid.Zoomify);


goog.exportSymbol(
    'ol.webgl.Context',
    ol.webgl.Context);
goog.exportProperty(
    ol.webgl.Context.prototype,
    'getGL',
    ol.webgl.Context.prototype.getGL);
goog.exportProperty(
    ol.webgl.Context.prototype,
    'useProgram',
    ol.webgl.Context.prototype.useProgram);
