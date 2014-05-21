// This file was autogenerated by ../lib/closure-library/closure/bin/build/depswriter.py.
// Please do not edit.
goog.addDependency('../../../../new/src/control/layerspycontrol.js', ['vk2.control.LayerSpy'], ['goog.dom', 'goog.dom.classes', 'goog.events', 'goog.events.EventType', 'goog.events.KeyCodes', 'goog.events.KeyHandler']);
goog.addDependency('../../../../new/src/control/rotatenorthcontrol.js', ['vk2.control.RotateNorth'], ['goog.events']);
goog.addDependency('../../../../new/src/controller/mapcontroller.js', ['vk2.controller.MapController'], ['goog.array', 'goog.events', 'goog.object', 'vk2.control.LayerSpy', 'vk2.control.RotateNorth', 'vk2.layer.HistoricMap', 'vk2.module.MapSearchModule', 'vk2.module.SpatialTemporalSearchModule', 'vk2.tool.GazetteerSearch', 'vk2.tool.TimeSlider']);
goog.addDependency('../../../../new/src/factory/layermanagementfactory.js', ['vk2.factory.LayerManagementFactory'], ['goog.dom', 'goog.dom.classes', 'goog.style', 'ol.layer.Vector', 'vk2.settings', 'vk2.tool.OpacitySlider']);
goog.addDependency('../../../../new/src/factory/mapsearchfactory.js', ['vk2.factory.MapSearchFactory'], ['goog.dom', 'goog.dom.classes', 'ol.layer.Vector', 'vk2.settings']);
goog.addDependency('../../../../new/src/georeference/deleteinteraction.js', ['vk2.georeference.DeleteFeatureInteraction'], ['goog.array', 'goog.functions', 'ol.FeatureOverlay', 'ol.events.condition', 'ol.interaction.Interaction']);
goog.addDependency('../../../../new/src/georeference/georeferencer.js', ['vk2.georeference.Georeferencer'], ['goog.dom', 'vk2.georeference.MesstischblattGcp', 'vk2.georeference.ResultViewer', 'vk2.georeference.ToolBox', 'vk2.georeference.ZoomifyViewer']);
goog.addDependency('../../../../new/src/georeference/messtischblattgcp.js', ['vk2.georeference.MesstischblattGcp'], ['goog.events']);
goog.addDependency('../../../../new/src/georeference/resultviewer.js', ['vk2.georeference.ResultViewer'], ['ol.Map', 'ol.View2D', 'ol.control.Attribution', 'ol.control.FullScreen', 'ol.control.Zoom', 'ol.interaction.DragZoom', 'ol.layer.Tile', 'ol.source.OSM']);
goog.addDependency('../../../../new/src/georeference/toolbox.js', ['vk2.georeference.ToolBox'], ['goog.dom', 'goog.dom.classes', 'goog.events', 'goog.events.EventType', 'goog.style', 'vk2.georeference.DeleteFeatureInteraction', 'vk2.utils', 'vk2.utils.Styles']);
goog.addDependency('../../../../new/src/georeference/zoomifyviewer.js', ['vk2.georeference.ZoomifyViewer'], ['ol.Map', 'ol.View2D', 'ol.control.FullScreen', 'ol.control.Zoom', 'ol.interaction.DragZoom', 'ol.layer.Tile', 'ol.proj.Projection', 'ol.source.Zoomify']);
goog.addDependency('../../../../new/src/layer/historicmaplayer.js', ['vk2.layer.HistoricMap'], ['goog.events', 'goog.net.XhrIo', 'goog.object', 'vk2.layer.Messtischblatt', 'vk2.settings', 'vk2.utils', 'vk2.utils.Styles']);
goog.addDependency('../../../../new/src/layer/mapsearchlayer.js', ['vk2.layer.MapSearch'], ['goog.events', 'goog.net.XhrIo', 'vk2.settings', 'vk2.utils.Styles']);
goog.addDependency('../../../../new/src/layer/messtischblattlayer.js', ['vk2.layer.Messtischblatt'], ['ol.Map', 'ol.geom.Polygon', 'ol.layer.Tile', 'vk2.utils']);
goog.addDependency('../../../../new/src/module/layermanagementmodule.js', ['vk2.module.LayerManagementModule'], ['goog.dom', 'goog.events', 'goog.events.EventTarget', 'goog.events.EventType', 'ol.Collection', 'vk2.factory.LayerManagementFactory']);
goog.addDependency('../../../../new/src/module/mapsearchmodule.js', ['vk2.module.MapSearchModule'], ['goog.dom', 'goog.dom.classes', 'goog.events', 'goog.events.EventTarget', 'goog.events.EventType', 'ol.FeatureOverlay', 'vk2.factory.MapSearchFactory', 'vk2.tool.SearchList']);
goog.addDependency('../../../../new/src/module/spatialtemporalsearchmodule.js', ['vk2.module.SpatialTemporalSearchModule'], ['goog.dom', 'goog.dom.classes', 'goog.events', 'goog.events.EventTarget', 'goog.events.EventType', 'ol.FeatureOverlay', 'vk2.factory.MapSearchFactory', 'vk2.module.MapSearchModule', 'vk2.tool.GazetteerSearch', 'vk2.tool.TimeSlider']);
goog.addDependency('../../../../new/src/settings.js', ['vk2.settings'], []);
goog.addDependency('../../../../new/src/tool/gazetteersearchtool.js', ['vk2.tool.GazetteerSearch', 'vk2.tool.GazetteerSearch.EventType'], ['goog.dom', 'goog.dom.classes', 'goog.events', 'goog.events.Event', 'goog.events.EventTarget', 'goog.net.XhrIo', 'vk2.utils', 'vk2.validation']);
goog.addDependency('../../../../new/src/tool/opacityslidertool.js', ['vk2.tool.OpacitySlider'], ['goog.dom']);
goog.addDependency('../../../../new/src/tool/searchlisttool.js', ['vk2.tool.SearchList'], ['goog.object', 'ol.Feature']);
goog.addDependency('../../../../new/src/tool/timeslidertool.js', ['vk2.tool.TimeSlider'], ['goog.dom', 'goog.events', 'goog.events.EventTarget', 'goog.events.EventType']);
goog.addDependency('../../../../new/src/utils.js', ['vk2.utils'], ['goog.dom', 'goog.dom.classes']);
goog.addDependency('../../../../new/src/utils/apploader.js', ['vk2.utils.AppLoader'], ['goog.dom', 'goog.events', 'goog.events.EventType', 'vk2.controller.MapController', 'vk2.layer.MapSearch', 'vk2.module.LayerManagementModule', 'vk2.module.SpatialTemporalSearchModule', 'vk2.settings', 'vk2.utils', 'vk2.utils.Modal']);
goog.addDependency('../../../../new/src/utils/modal.js', ['vk2.utils.Modal'], ['goog.dom', 'goog.dom.classes', 'goog.style']);
goog.addDependency('../../../../new/src/utils/styles.js', ['vk2.utils.Styles'], ['ol.style']);
goog.addDependency('../../../../new/src/validation.js', ['vk2.validation'], ['goog.dom', 'goog.dom.classes']);
goog.addDependency('../../../../new/src/vkviewer.js', ['VK2'], []);
