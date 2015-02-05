// define used namespaces of openlayers
var ol = {};

/**
 * @constructor
 * @param {Object} settings
 */
ol.Collection = function(settings) {};
ol.Collection.clear = {};
ol.Collection.extend = {};
ol.Collection.getArray = {};
ol.Collection.getLength = {};
ol.Collection.insertAt = {};
ol.Collection.on = {};
ol.Collection.removeAt = {};
ol.Collection.un = {};

/**
 * @constructor
 * @param {Object} settings
 */
ol.CollectionEvent = function(settings) {};
ol.control = {};

/**
 * @constructor
 * @param {Object} settings
 */
ol.control.Control = function(settings) {};
ol.control.Control.getMap = {};
ol.control.Attribution = {};
ol.control.Zoom = {};
ol.control.FullScreen = {};
ol.control.ScaleLine = {};

/**
 * @constructor
 * @param {Object} settings
 */
ol.control.ZoomToExtent = function(settings) {};
ol.extent = {};
ol.extent.equals = {};

/**
 * @constructor
 * @param {Object} settings
 */
ol.Feature = function(settings) {};
ol.Feature.get = {};
ol.Feature.getGeometry = {};
ol.Feature.set = {};
ol.Feature.setProperties = {};

/**
 * @constructor
 * @param {Object} settings
 */
ol.FeatureOverlay = function(settings) {};
ol.FeatureOverlay.addFeature = {};
ol.FeatureOverlay.getFeatures = {};
ol.FeatureOverlay.removeFeature = {};
ol.format = {};

/**
 * @constructor
 * @param {Object} settings
 */
ol.format.GeoJSON = function(settings) {};
ol.format.GeoJSON.readFeatures = {};
ol.format.WFS = {};
ol.format.WFS.readFeatures = {};
ol.geom = {};
ol.geom.Point = {};
ol.geom.Point.getCoordinates = {};
ol.geom.Polygon = {};
ol.geom.Polygon.getCoordinates = {};
ol.geom.Polygon.getExtent = {};
ol.has = {};
ol.has.WEBGL = {};
ol.inherits = {};
ol.interaction = {};
ol.interaction.defaults = {};

/**
 * @constructor
 * @param {Object} settings
 */
ol.interaction.Interaction = function(settings) {};

ol.interaction.DragRotateAndZoom = {};
ol.interaction.DragZoom = {};
ol.interaction.Draw = {};
ol.interaction.Modify = {};
ol.interaction.Select = {};
ol.layer = {};

/**
 * @constructor
 * @param {Object} settings
 */
ol.layer.Base = function(settings) {};

/**
 * @constructor
 * @param {Object} settings
 */
ol.layer.Layer = function(settings) {};
ol.layer.Layer.setBrightness = {};
ol.layer.Layer.setContrast = {};
ol.layer.Layer.getHue = {};
ol.layer.Layer.setHue = {};
ol.layer.Layer.getOpacity = {};
ol.layer.Layer.setOpacity = {};
ol.layer.Layer.setSaturation = {};

/**
 * @constructor
 * @param {Object} settings
 */
ol.layer.Image = function(settings) {};

/**
 * @constructor
 * @param {Object} settings
 */
ol.layer.Tile = function(settings) {};
ol.layer.Tile.getSource = {};
ol.layer.Tile.on = {};
ol.layer.Tile.un = {};

/**
 * @constructor
 * @param {Object} settings
 */
ol.layer.Vector = function(settings) {};
ol.layer.Vector.getSource = {};

/**
 * @constructor
 * @param {Object} settings
 */
ol.layer.Group = function(settings) {};
ol.layer.Group.getVisibile = {};
ol.layer.Group.setVisibile = {};

/**
 * @constructor
 * @param {Object} settings
 */
ol.Map = function(settings) {};

/**
 * @param {ol.control.Control} control
 */
ol.Map.prototype.addControl = function(control) {};

/**
 * @param {ol.interaction.Interaction} interaction
 */
ol.Map.prototype.addInteraction = function(interaction) {};

/**
 * @param {ol.layer.Base} layer
 */
ol.Map.prototype.addLayer = function(layer) {};

ol.Map.prototype.forEachFeatureAtPixel = {};
ol.Map.prototype.getCoordinateFromPixel = {};
ol.Map.prototype.getEventPixel = {};
ol.Map.prototype.getLayers = {};
ol.Map.prototype.getPixelFromCoordinate = {};
ol.Map.prototype.getViewport = {};
ol.Map.prototype.getView = {};
ol.Map.prototype.on = {};
ol.Map.prototype.removeControl = {};
ol.Map.prototype.removeInteraction = {};
ol.Map.prototype.removeLayer = {};
ol.Map.prototype.render = {};
ol.Map.prototype.un = {};
ol.proj = {};
ol.proj.Projection = {};
ol.proj.transform = {};
ol.source = {};
ol.source.ImageWMS = {};
ol.source.XYZ = {};
ol.source.OSM = {};
ol.source.MapQuest = {};
ol.source.TileWMS = {};

/**
 * @constructor
 * @param {Object} settings
 */
ol.source.Vector = function(settings) {};
ol.source.Vector.forEachFeatureInExtent = {};
ol.source.Vector.getFeatures = {};
ol.source.Vector.on = {};
ol.source.Vector.removeFeature = {};
ol.source.Vector.un = {};

/**
 * @constructor
 * @param {Object} settings
 */
ol.source.Zoomify = function(settings) {};
ol.style = {};
ol.style.Style = {};
ol.style.Stroke = {};
ol.style.Fill = {};
ol.style.Circle = {};
ol.View = {};
ol.View.calculateExtent = {};
ol.View.fitExtent = {};
ol.View.getCenter = {};
ol.View.getRotation = {};
ol.View.getZoom = {};
ol.View.setCenter = {};
ol.View.setRotation = {};
ol.View.setZoom = {};

