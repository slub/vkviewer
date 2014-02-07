goog.provide('olx.AttributionOptions');
goog.provide('olx.DeviceOrientationOptions');
goog.provide('olx.GeolocationOptions');
goog.provide('olx.MapOptions');
goog.provide('olx.OverlayOptions');
goog.provide('olx.Proj4jsProjectionOptions');
goog.provide('olx.ProjectionOptions');
goog.provide('olx.View2DOptions');
goog.provide('olx.animation.BounceOptions');
goog.provide('olx.animation.PanOptions');
goog.provide('olx.animation.RotateOptions');
goog.provide('olx.animation.ZoomOptions');
goog.provide('olx.control.AttributionOptions');
goog.provide('olx.control.ControlOptions');
goog.provide('olx.control.DefaultsOptions');
goog.provide('olx.control.FullScreenOptions');
goog.provide('olx.control.LogoOptions');
goog.provide('olx.control.MousePositionOptions');
goog.provide('olx.control.ScaleLineOptions');
goog.provide('olx.control.ZoomOptions');
goog.provide('olx.control.ZoomSliderOptions');
goog.provide('olx.control.ZoomToExtentOptions');
goog.provide('olx.format.GeoJSONOptions');
goog.provide('olx.format.IGCOptions');
goog.provide('olx.format.KMLOptions');
goog.provide('olx.format.TopoJSONOptions');
goog.provide('olx.interaction.DefaultsOptions');
goog.provide('olx.interaction.DoubleClickZoomOptions');
goog.provide('olx.interaction.DragAndDropOptions');
goog.provide('olx.interaction.DragBoxOptions');
goog.provide('olx.interaction.DragPanOptions');
goog.provide('olx.interaction.DragRotateAndZoomOptions');
goog.provide('olx.interaction.DragRotateOptions');
goog.provide('olx.interaction.DragZoomOptions');
goog.provide('olx.interaction.DrawOptions');
goog.provide('olx.interaction.KeyboardPanOptions');
goog.provide('olx.interaction.KeyboardZoomOptions');
goog.provide('olx.interaction.MouseWheelZoomOptions');
goog.provide('olx.interaction.SelectOptions');
goog.provide('olx.interaction.TouchPanOptions');
goog.provide('olx.interaction.TouchRotateOptions');
goog.provide('olx.interaction.TouchZoomOptions');
goog.provide('olx.layer.BaseOptions');
goog.provide('olx.layer.GroupOptions');
goog.provide('olx.layer.LayerOptions');
goog.provide('olx.layer.TileOptions');
goog.provide('olx.layer.VectorOptions');
goog.provide('olx.parser.WFSWriteGetFeatureOptions');
goog.provide('olx.parser.WFSWriteTransactionOptions');
goog.provide('olx.render.FeaturesOverlayOptions');
goog.provide('olx.source.BingMapsOptions');
goog.provide('olx.source.GPXOptions');
goog.provide('olx.source.GeoJSONOptions');
goog.provide('olx.source.IGCOptions');
goog.provide('olx.source.ImageCanvasOptions');
goog.provide('olx.source.ImageStaticOptions');
goog.provide('olx.source.ImageVectorOptions');
goog.provide('olx.source.ImageWMSOptions');
goog.provide('olx.source.KMLOptions');
goog.provide('olx.source.MapGuideOptions');
goog.provide('olx.source.MapQuestOptions');
goog.provide('olx.source.OSMOptions');
goog.provide('olx.source.StamenOptions');
goog.provide('olx.source.TileDebugOptions');
goog.provide('olx.source.TileJSONOptions');
goog.provide('olx.source.TileWMSOptions');
goog.provide('olx.source.TopoJSONOptions');
goog.provide('olx.source.VectorFileOptions');
goog.provide('olx.source.VectorOptions');
goog.provide('olx.source.WMTSOptions');
goog.provide('olx.source.XYZOptions');
goog.provide('olx.source.ZoomifyOptions');
goog.provide('olx.style.CircleOptions');
goog.provide('olx.style.FillOptions');
goog.provide('olx.style.IconOptions');
goog.provide('olx.style.StrokeOptions');
goog.provide('olx.style.StyleOptions');
goog.provide('olx.style.TextOptions');
goog.provide('olx.tilegrid.TileGridOptions');
goog.provide('olx.tilegrid.WMTSOptions');
goog.provide('olx.tilegrid.XYZOptions');
goog.provide('olx.tilegrid.ZoomifyOptions');


/**
 * @typedef {{html: string,
 *            tileRanges: (Object.<string, Array.<ol.TileRange>>|undefined)}}
 */
olx.AttributionOptions;


/**
 * @typedef {{tracking: (boolean|undefined)}}
 */
olx.DeviceOrientationOptions;


/**
 * @typedef {{projection: ol.proj.ProjectionLike,
 *            tracking: (boolean|undefined),
 *            trackingOptions: (GeolocationPositionOptions|undefined)}}
 */
olx.GeolocationOptions;


/**
 * @typedef {{controls: (ol.Collection|Array.<ol.control.Control>|undefined),
 *            interactions: (ol.Collection|Array.<ol.interaction.Interaction>|undefined),
 *            keyboardEventTarget: (Element|Document|string|undefined),
 *            layers: (Array.<ol.layer.Base>|ol.Collection|undefined),
 *            ol3Logo: (boolean|undefined),
 *            overlays: (ol.Collection|Array.<ol.Overlay>|undefined),
 *            pixelRatio: (number|undefined),
 *            renderer: (ol.RendererHint|undefined),
 *            renderers: (Array.<ol.RendererHint>|undefined),
 *            target: (Element|string|undefined),
 *            view: (ol.IView|undefined)}}
 */
olx.MapOptions;


/**
 * @typedef {{element: (Element|undefined),
 *            insertFirst: (boolean|undefined),
 *            position: (ol.Coordinate|undefined),
 *            positioning: (ol.OverlayPositioning|undefined),
 *            stopEvent: (boolean|undefined)}}
 */
olx.OverlayOptions;


/**
 * @typedef {{code: string,
 *            extent: (ol.Extent|undefined),
 *            global: (boolean|undefined)}}
 */
olx.Proj4jsProjectionOptions;


/**
 * @typedef {{axisOrientation: (string|undefined),
 *            code: string,
 *            extent: (ol.Extent|undefined),
 *            global: (boolean|undefined),
 *            units: ol.proj.Units}}
 */
olx.ProjectionOptions;


/**
 * @typedef {{center: (ol.Coordinate|undefined),
 *            constrainRotation: (boolean|number|undefined),
 *            enableRotation: (boolean|undefined),
 *            extent: (ol.Extent|undefined),
 *            maxResolution: (number|undefined),
 *            maxZoom: (number|undefined),
 *            projection: ol.proj.ProjectionLike,
 *            resolution: (number|undefined),
 *            resolutions: (Array.<number>|undefined),
 *            rotation: (number|undefined),
 *            zoom: (number|undefined),
 *            zoomFactor: (number|undefined)}}
 */
olx.View2DOptions;


/**
 * @typedef {{duration: (number|undefined),
 *            easing: (function(number):number|undefined),
 *            resolution: number,
 *            start: (number|undefined)}}
 */
olx.animation.BounceOptions;


/**
 * @typedef {{duration: (number|undefined),
 *            easing: (function(number):number|undefined),
 *            source: ol.Coordinate,
 *            start: (number|undefined)}}
 */
olx.animation.PanOptions;


/**
 * @typedef {{duration: (number|undefined),
 *            easing: (function(number):number|undefined),
 *            rotation: number,
 *            start: (number|undefined)}}
 */
olx.animation.RotateOptions;


/**
 * @typedef {{duration: (number|undefined),
 *            easing: (function(number):number|undefined),
 *            resolution: number,
 *            start: (number|undefined)}}
 */
olx.animation.ZoomOptions;


/**
 * @typedef {{className: (string|undefined),
 *            target: (Element|undefined)}}
 */
olx.control.AttributionOptions;


/**
 * @typedef {{element: (Element|undefined),
 *            target: (Element|string|undefined)}}
 */
olx.control.ControlOptions;


/**
 * @typedef {{attribution: (boolean|undefined),
 *            attributionOptions: (olx.control.AttributionOptions|undefined),
 *            logo: (boolean|undefined),
 *            logoOptions: (olx.control.LogoOptions|undefined),
 *            zoom: (boolean|undefined),
 *            zoomOptions: (olx.control.ZoomOptions|undefined)}}
 */
olx.control.DefaultsOptions;


/**
 * @typedef {{className: (string|undefined),
 *            keys: (boolean|undefined),
 *            target: (Element|undefined)}}
 */
olx.control.FullScreenOptions;


/**
 * @typedef {{className: (string|undefined),
 *            target: (Element|undefined)}}
 */
olx.control.LogoOptions;


/**
 * @typedef {{className: (string|undefined),
 *            coordinateFormat: (ol.CoordinateFormatType|undefined),
 *            projection: ol.proj.ProjectionLike,
 *            target: (Element|undefined),
 *            undefinedHTML: (string|undefined)}}
 */
olx.control.MousePositionOptions;


/**
 * @typedef {{className: (string|undefined),
 *            minWidth: (number|undefined),
 *            target: (Element|undefined),
 *            units: (ol.control.ScaleLineUnits|undefined)}}
 */
olx.control.ScaleLineOptions;


/**
 * @typedef {{className: (string|undefined),
 *            delta: (number|undefined),
 *            duration: (number|undefined),
 *            target: (Element|undefined)}}
 */
olx.control.ZoomOptions;


/**
 * @typedef {{className: (string|undefined),
 *            maxResolution: (number|undefined),
 *            minResolution: (number|undefined)}}
 */
olx.control.ZoomSliderOptions;


/**
 * @typedef {{className: (string|undefined),
 *            extent: (ol.Extent|undefined),
 *            target: (Element|undefined)}}
 */
olx.control.ZoomToExtentOptions;


/**
 * @typedef {{defaultProjection: ol.proj.ProjectionLike}}
 */
olx.format.GeoJSONOptions;


/**
 * @typedef {{altitudeMode: (ol.format.IGCZ|undefined)}}
 */
olx.format.IGCOptions;


/**
 * @typedef {{defaultStyle: (Array.<ol.style.Style>|undefined)}}
 */
olx.format.KMLOptions;


/**
 * @typedef {{defaultProjection: ol.proj.ProjectionLike}}
 */
olx.format.TopoJSONOptions;


/**
 * @typedef {{altShiftDragRotate: (boolean|undefined),
 *            doubleClickZoom: (boolean|undefined),
 *            dragPan: (boolean|undefined),
 *            keyboard: (boolean|undefined),
 *            mouseWheelZoom: (boolean|undefined),
 *            shiftDragZoom: (boolean|undefined),
 *            touchPan: (boolean|undefined),
 *            touchRotate: (boolean|undefined),
 *            touchZoom: (boolean|undefined),
 *            zoomDelta: (number|undefined),
 *            zoomDuration: (number|undefined)}}
 */
olx.interaction.DefaultsOptions;


/**
 * @typedef {{delta: (number|undefined),
 *            duration: (number|undefined)}}
 */
olx.interaction.DoubleClickZoomOptions;


/**
 * @typedef {{formatConstructors: (Array.<function(new: ol.format.Format)>|undefined),
 *            reprojectTo: ol.proj.ProjectionLike}}
 */
olx.interaction.DragAndDropOptions;


/**
 * @typedef {{condition: (ol.events.ConditionType|undefined),
 *            style: ol.style.Style}}
 */
olx.interaction.DragBoxOptions;


/**
 * @typedef {{condition: (ol.events.ConditionType|undefined),
 *            kinetic: (ol.Kinetic|undefined)}}
 */
olx.interaction.DragPanOptions;


/**
 * @typedef {{condition: (ol.events.ConditionType|undefined)}}
 */
olx.interaction.DragRotateAndZoomOptions;


/**
 * @typedef {{condition: (ol.events.ConditionType|undefined)}}
 */
olx.interaction.DragRotateOptions;


/**
 * @typedef {{condition: (ol.events.ConditionType|undefined),
 *            style: ol.style.Style}}
 */
olx.interaction.DragZoomOptions;


/**
 * @typedef {{snapTolerance: (number|undefined),
 *            source: (ol.source.Vector|undefined),
 *            styleFunction: (ol.feature.StyleFunction|undefined),
 *            type: ol.geom.GeometryType}}
 */
olx.interaction.DrawOptions;


/**
 * @typedef {{condition: (ol.events.ConditionType|undefined),
 *            pixelDelta: (number|undefined)}}
 */
olx.interaction.KeyboardPanOptions;


/**
 * @typedef {{condition: (ol.events.ConditionType|undefined),
 *            delta: (number|undefined),
 *            duration: (number|undefined)}}
 */
olx.interaction.KeyboardZoomOptions;


/**
 * @typedef {{duration: (number|undefined)}}
 */
olx.interaction.MouseWheelZoomOptions;


/**
 * @typedef {{addCondition: (ol.events.ConditionType|undefined),
 *            condition: (ol.events.ConditionType|undefined),
 *            featuresOverlay: ol.render.FeaturesOverlay,
 *            layer: (ol.layer.Layer|undefined),
 *            layerFilter: (function(ol.layer.Layer): boolean|undefined),
 *            layers: (Array.<ol.layer.Layer>|undefined)}}
 */
olx.interaction.SelectOptions;


/**
 * @typedef {{kinetic: (ol.Kinetic|undefined)}}
 */
olx.interaction.TouchPanOptions;


/**
 * @typedef {{threshold: (number|undefined)}}
 */
olx.interaction.TouchRotateOptions;


/**
 * @typedef {{duration: (number|undefined)}}
 */
olx.interaction.TouchZoomOptions;


/**
 * @typedef {{brightness: (number|undefined),
 *            contrast: (number|undefined),
 *            hue: (number|undefined),
 *            maxResolution: (number|undefined),
 *            minResolution: (number|undefined),
 *            opacity: (number|undefined),
 *            saturation: (number|undefined),
 *            visible: (boolean|undefined)}}
 */
olx.layer.BaseOptions;


/**
 * @typedef {{brightness: (number|undefined),
 *            contrast: (number|undefined),
 *            hue: (number|undefined),
 *            layers: (Array.<ol.layer.Base>|ol.Collection|undefined),
 *            maxResolution: (number|undefined),
 *            minResolution: (number|undefined),
 *            opacity: (number|undefined),
 *            saturation: (number|undefined),
 *            visible: (boolean|undefined)}}
 */
olx.layer.GroupOptions;


/**
 * @typedef {{brightness: (number|undefined),
 *            contrast: (number|undefined),
 *            hue: (number|undefined),
 *            maxResolution: (number|undefined),
 *            minResolution: (number|undefined),
 *            opacity: (number|undefined),
 *            saturation: (number|undefined),
 *            source: ol.source.Source,
 *            visible: (boolean|undefined)}}
 */
olx.layer.LayerOptions;


/**
 * @typedef {{brightness: (number|undefined),
 *            contrast: (number|undefined),
 *            hue: (number|undefined),
 *            maxResolution: (number|undefined),
 *            minResolution: (number|undefined),
 *            opacity: (number|undefined),
 *            preload: (number|undefined),
 *            saturation: (number|undefined),
 *            source: ol.source.Source,
 *            visible: (boolean|undefined)}}
 */
olx.layer.TileOptions;


/**
 * @typedef {{brightness: (number|undefined),
 *            contrast: (number|undefined),
 *            hue: (number|undefined),
 *            maxResolution: (number|undefined),
 *            minResolution: (number|undefined),
 *            opacity: (number|undefined),
 *            saturation: (number|undefined),
 *            source: ol.source.Vector,
 *            styleFunction: (ol.feature.StyleFunction|undefined),
 *            visible: (boolean|undefined)}}
 */
olx.layer.VectorOptions;


/**
 * @typedef {{featureNS: string,
 *            featurePrefix: string,
 *            featureTypes: Array.<string>,
 *            handle: (string|undefined),
 *            maxFeatures: number,
 *            outputFormat: (string|undefined),
 *            srsName: (string|undefined)}}
 */
olx.parser.WFSWriteGetFeatureOptions;


/**
 * @typedef {{featureNS: string,
 *            featurePrefix: string,
 *            featureType: string,
 *            handle: (string|undefined),
 *            nativeElements: Array.<Object>,
 *            srsName: (string|undefined)}}
 */
olx.parser.WFSWriteTransactionOptions;


/**
 * @typedef {{features: (Array.<ol.Feature>|ol.Collection|undefined),
 *            map: (ol.Map|undefined),
 *            styleFunction: (ol.feature.StyleFunction|undefined)}}
 */
olx.render.FeaturesOverlayOptions;


/**
 * @typedef {{culture: (string|undefined),
 *            imagerySet: string,
 *            key: string,
 *            tileLoadFunction: (ol.TileLoadFunctionType|undefined)}}
 */
olx.source.BingMapsOptions;


/**
 * @typedef {{attributions: (Array.<ol.Attribution>|undefined),
 *            doc: (Document|undefined),
 *            extent: (ol.Extent|undefined),
 *            logo: (string|undefined),
 *            projection: ol.proj.ProjectionLike,
 *            text: (string|undefined),
 *            url: (string|undefined),
 *            urls: (Array.<string>|undefined)}}
 */
olx.source.GPXOptions;


/**
 * @typedef {{attributions: (Array.<ol.Attribution>|undefined),
 *            defaultProjection: ol.proj.ProjectionLike,
 *            extent: (ol.Extent|undefined),
 *            logo: (string|undefined),
 *            object: (GeoJSONObject|undefined),
 *            projection: ol.proj.ProjectionLike,
 *            text: (string|undefined),
 *            url: (string|undefined),
 *            urls: (Array.<string>|undefined)}}
 */
olx.source.GeoJSONOptions;


/**
 * @typedef {{altitudeMode: (ol.format.IGCZ|undefined),
 *            text: (string|undefined),
 *            url: (string|undefined),
 *            urls: (Array.<string>|undefined)}}
 */
olx.source.IGCOptions;


/**
 * @typedef {{attributions: (Array.<ol.Attribution>|undefined),
 *            canvasFunction: ol.CanvasFunctionType,
 *            extent: (ol.Extent|undefined),
 *            logo: (string|undefined),
 *            projection: ol.proj.ProjectionLike,
 *            ratio: (number|undefined),
 *            resolutions: (Array.<number>|undefined),
 *            state: (ol.source.State|undefined)}}
 */
olx.source.ImageCanvasOptions;


/**
 * @typedef {{attributions: (Array.<ol.Attribution>|undefined),
 *            crossOrigin: (null|string|undefined),
 *            extent: (ol.Extent|undefined),
 *            imageExtent: (ol.Extent|undefined),
 *            imageSize: (ol.Size|undefined),
 *            logo: (string|undefined),
 *            projection: ol.proj.ProjectionLike,
 *            url: string}}
 */
olx.source.ImageStaticOptions;


/**
 * @typedef {{attributions: (Array.<ol.Attribution>|undefined),
 *            extent: (ol.Extent|undefined),
 *            logo: (string|undefined),
 *            projection: ol.proj.ProjectionLike,
 *            ratio: (number|undefined),
 *            resolutions: (Array.<number>|undefined),
 *            source: ol.source.Vector,
 *            styleFunction: (ol.feature.StyleFunction|undefined)}}
 */
olx.source.ImageVectorOptions;


/**
 * @typedef {{attributions: (Array.<ol.Attribution>|undefined),
 *            crossOrigin: (null|string|undefined),
 *            extent: (ol.Extent|undefined),
 *            hidpi: (boolean|undefined),
 *            logo: (string|undefined),
 *            params: Object.<string,*>,
 *            projection: ol.proj.ProjectionLike,
 *            ratio: (number|undefined),
 *            resolutions: (Array.<number>|undefined),
 *            serverType: (ol.source.wms.ServerType|undefined),
 *            url: (string|undefined)}}
 */
olx.source.ImageWMSOptions;


/**
 * @typedef {{attributions: (Array.<ol.Attribution>|undefined),
 *            defaultStyle: (Array.<ol.style.Style>|undefined),
 *            doc: (Document|undefined),
 *            extent: (ol.Extent|undefined),
 *            logo: (string|undefined),
 *            projection: ol.proj.ProjectionLike,
 *            text: (string|undefined),
 *            url: (string|undefined),
 *            urls: (Array.<string>|undefined)}}
 */
olx.source.KMLOptions;


/**
 * @typedef {{displayDpi: (number|undefined),
 *            extent: (ol.Extent|undefined),
 *            hidpi: (boolean|undefined),
 *            metersPerUnit: (number|undefined),
 *            params: (Object|undefined),
 *            projection: ol.proj.ProjectionLike,
 *            ratio: (number|undefined),
 *            resolutions: (Array.<number>|undefined),
 *            url: (string|undefined),
 *            useOverlay: (boolean|undefined)}}
 */
olx.source.MapGuideOptions;


/**
 * @typedef {{layer: string,
 *            tileLoadFunction: (ol.TileLoadFunctionType|undefined)}}
 */
olx.source.MapQuestOptions;


/**
 * @typedef {{attributions: (Array.<ol.Attribution>|undefined),
 *            crossOrigin: (null|string|undefined),
 *            maxZoom: (number|undefined),
 *            tileLoadFunction: (ol.TileLoadFunctionType|undefined),
 *            url: (string|undefined)}}
 */
olx.source.OSMOptions;


/**
 * @typedef {{layer: string,
 *            maxZoom: (number|undefined),
 *            minZoom: (number|undefined),
 *            opaque: (boolean|undefined),
 *            tileLoadFunction: (ol.TileLoadFunctionType|undefined),
 *            url: (string|undefined)}}
 */
olx.source.StamenOptions;


/**
 * @typedef {{extent: (ol.Extent|undefined),
 *            projection: ol.proj.ProjectionLike,
 *            tileGrid: (ol.tilegrid.TileGrid|undefined)}}
 */
olx.source.TileDebugOptions;


/**
 * @typedef {{crossOrigin: (null|string|undefined),
 *            tileLoadFunction: (ol.TileLoadFunctionType|undefined),
 *            url: string}}
 */
olx.source.TileJSONOptions;


/**
 * @typedef {{attributions: (Array.<ol.Attribution>|undefined),
 *            crossOrigin: (null|string|undefined),
 *            extent: (ol.Extent|undefined),
 *            gutter: (number|undefined),
 *            hidpi: (boolean|undefined),
 *            logo: (string|undefined),
 *            maxZoom: (number|undefined),
 *            params: Object.<string,*>,
 *            projection: ol.proj.ProjectionLike,
 *            serverType: (ol.source.wms.ServerType|undefined),
 *            tileGrid: (ol.tilegrid.TileGrid|undefined),
 *            tileLoadFunction: (ol.TileLoadFunctionType|undefined),
 *            url: (string|undefined),
 *            urls: (Array.<string>|undefined)}}
 */
olx.source.TileWMSOptions;


/**
 * @typedef {{attributions: (Array.<ol.Attribution>|undefined),
 *            defaultProjection: ol.proj.ProjectionLike,
 *            extent: (ol.Extent|undefined),
 *            logo: (string|undefined),
 *            object: (GeoJSONObject|undefined),
 *            projection: ol.proj.ProjectionLike,
 *            text: (string|undefined),
 *            url: (string|undefined)}}
 */
olx.source.TopoJSONOptions;


/**
 * @typedef {{attributions: (Array.<ol.Attribution>|undefined),
 *            doc: (Document|undefined),
 *            extent: (ol.Extent|undefined),
 *            format: ol.format.Format,
 *            logo: (string|undefined),
 *            node: (Node|undefined),
 *            object: (Object|undefined),
 *            projection: ol.proj.ProjectionLike,
 *            text: (string|undefined),
 *            url: (string|undefined),
 *            urls: (Array.<string>|undefined)}}
 */
olx.source.VectorFileOptions;


/**
 * @typedef {{attributions: (Array.<ol.Attribution>|undefined),
 *            extent: (ol.Extent|undefined),
 *            features: (Array.<ol.Feature>|undefined),
 *            logo: (string|undefined),
 *            projection: ol.proj.ProjectionLike,
 *            state: (ol.source.State|undefined)}}
 */
olx.source.VectorOptions;


/**
 * @typedef {{attributions: (Array.<ol.Attribution>|undefined),
 *            crossOrigin: (string|null|undefined),
 *            dimensions: (Object|undefined),
 *            extent: (ol.Extent|undefined),
 *            format: (string|undefined),
 *            layer: string,
 *            logo: (string|undefined),
 *            matrixSet: string,
 *            maxZoom: (number|undefined),
 *            projection: ol.proj.ProjectionLike,
 *            requestEncoding: (ol.source.WMTSRequestEncoding|undefined),
 *            style: string,
 *            tileGrid: ol.tilegrid.WMTS,
 *            tileLoadFunction: (ol.TileLoadFunctionType|undefined),
 *            url: (string|undefined),
 *            urls: (Array.<string>|undefined),
 *            version: (string|undefined)}}
 */
olx.source.WMTSOptions;


/**
 * @typedef {{attributions: (Array.<ol.Attribution>|undefined),
 *            crossOrigin: (null|string|undefined),
 *            extent: (ol.Extent|undefined),
 *            logo: (string|undefined),
 *            maxZoom: (number|undefined),
 *            minZoom: (number|undefined),
 *            projection: ol.proj.ProjectionLike,
 *            tileLoadFunction: (ol.TileLoadFunctionType|undefined),
 *            tileUrlFunction: (ol.TileUrlFunctionType|undefined),
 *            url: (string|undefined),
 *            urls: (Array.<string>|undefined)}}
 */
olx.source.XYZOptions;


/**
 * @typedef {{attributions: (Array.<ol.Attribution>|undefined),
 *            crossOrigin: (null|string|undefined),
 *            logo: (string|undefined),
 *            size: ol.Size,
 *            url: !string}}
 */
olx.source.ZoomifyOptions;


/**
 * @typedef {{fill: (ol.style.Fill|undefined),
 *            radius: number,
 *            stroke: (ol.style.Stroke|undefined)}}
 */
olx.style.CircleOptions;


/**
 * @typedef {{color: (ol.Color|string|undefined)}}
 */
olx.style.FillOptions;


/**
 * @typedef {{anchor: (Array.<number>|undefined),
 *            anchorXUnits: (ol.style.IconAnchorUnits|undefined),
 *            anchorYUnits: (ol.style.IconAnchorUnits|undefined),
 *            crossOrigin: (null|string|undefined),
 *            rotation: (number|undefined),
 *            scale: (number|undefined),
 *            size: (ol.Size|undefined),
 *            src: string}}
 */
olx.style.IconOptions;


/**
 * @typedef {{color: (ol.Color|string|undefined),
 *            lineCap: (string|undefined),
 *            lineDash: (Array.<number>|undefined),
 *            lineJoin: (string|undefined),
 *            miterLimit: (number|undefined),
 *            width: (number|undefined)}}
 */
olx.style.StrokeOptions;


/**
 * @typedef {{fill: (ol.style.Fill|undefined),
 *            image: (ol.style.Image|undefined),
 *            stroke: (ol.style.Stroke|undefined),
 *            text: (ol.style.Text|undefined),
 *            zIndex: (number|undefined)}}
 */
olx.style.StyleOptions;


/**
 * @typedef {{fill: (ol.style.Fill|undefined),
 *            font: (string|undefined),
 *            rotation: (number|undefined),
 *            scale: (number|undefined),
 *            stroke: (ol.style.Stroke|undefined),
 *            text: (string|undefined),
 *            textAlign: (string|undefined),
 *            textBaseline: (string|undefined)}}
 */
olx.style.TextOptions;


/**
 * @typedef {{minZoom: (number|undefined),
 *            origin: (ol.Coordinate|undefined),
 *            origins: (Array.<ol.Coordinate>|undefined),
 *            resolutions: !Array.<number>,
 *            tileSize: (number|undefined),
 *            tileSizes: (Array.<number>|undefined)}}
 */
olx.tilegrid.TileGridOptions;


/**
 * @typedef {{matrixIds: !Array.<string>,
 *            origin: (ol.Coordinate|undefined),
 *            origins: (Array.<ol.Coordinate>|undefined),
 *            resolutions: !Array.<number>,
 *            tileSize: (number|undefined),
 *            tileSizes: (Array.<number>|undefined)}}
 */
olx.tilegrid.WMTSOptions;


/**
 * @typedef {{maxZoom: number}}
 */
olx.tilegrid.XYZOptions;


/**
 * @typedef {{resolutions: !Array.<number>}}
 */
olx.tilegrid.ZoomifyOptions;
