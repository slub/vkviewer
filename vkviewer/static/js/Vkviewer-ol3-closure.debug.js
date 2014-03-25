(function() {
     var scriptName = "Vkviewer-ol3-closure.debug.js";
     var getScriptLocation = function() {
         var scriptLocation = "";
         var scripts = document.documentElement.getElementsByTagName('script'); 
         for(var i=0, len=scripts.length; i<len; i++) { 
             var src = scripts[i].getAttribute('src'); 
             if(src) { 
                 var index = src.lastIndexOf(scriptName); 
                 var pathLength = src.lastIndexOf('?'); 
                 if(pathLength < 0) {
                     pathLength = src.length;
                 }
                 if((index > -1) && (index + scriptName.length == pathLength)) {
                     scriptLocation = src.slice(0, pathLength - scriptName.length);
                     break;
                 }
             }
         }
         return scriptLocation;
     };
     var jsfiles = new Array("../lib/closure-library/closure/goog/base.js","utils/Settings.js","../lib/closure-library/closure/goog/debug/error.js","../lib/closure-library/closure/goog/dom/nodetype.js","../lib/closure-library/closure/goog/string/string.js","../lib/closure-library/closure/goog/asserts/asserts.js","../lib/closure-library/closure/goog/array/array.js","../lib/closure-library/closure/goog/object/object.js","../lib/closure-library/closure/goog/structs/structs.js","../lib/closure-library/closure/goog/functions/functions.js","../lib/closure-library/closure/goog/math/math.js","../lib/closure-library/closure/goog/iter/iter.js","../lib/closure-library/closure/goog/structs/map.js","../lib/closure-library/closure/goog/useragent/useragent.js","../lib/closure-library/closure/goog/uri/utils.js","../lib/closure-library/closure/goog/uri/uri.js","../lib/closure-library/closure/goog/net/cookies.js","../lib/closure-library/closure/goog/dom/classes.js","../lib/closure-library/closure/goog/dom/browserfeature.js","../lib/closure-library/closure/goog/dom/tagname.js","../lib/closure-library/closure/goog/math/coordinate.js","../lib/closure-library/closure/goog/math/size.js","../lib/closure-library/closure/goog/dom/dom.js","../lib/closure-library/closure/goog/dom/vendor.js","../lib/closure-library/closure/goog/math/box.js","../lib/closure-library/closure/goog/math/rect.js","../lib/closure-library/closure/goog/style/style.js","../lib/closure-library/closure/goog/debug/entrypointregistry.js","../lib/closure-library/closure/goog/events/browserfeature.js","../lib/closure-library/closure/goog/disposable/idisposable.js","../lib/closure-library/closure/goog/disposable/disposable.js","../lib/closure-library/closure/goog/events/eventid.js","../lib/closure-library/closure/goog/events/event.js","../lib/closure-library/closure/goog/events/eventtype.js","../lib/closure-library/closure/goog/reflect/reflect.js","../lib/closure-library/closure/goog/events/browserevent.js","../lib/closure-library/closure/goog/events/listenable.js","../lib/closure-library/closure/goog/events/listener.js","../lib/closure-library/closure/goog/events/listenermap.js","../lib/closure-library/closure/goog/events/events.js","../lib/closure-library/closure/goog/events/eventtarget.js","../lib/closure-library/closure/goog/timer/timer.js","../lib/closure-library/closure/goog/json/json.js","../lib/closure-library/closure/goog/structs/collection.js","../lib/closure-library/closure/goog/structs/set.js","../lib/closure-library/closure/goog/debug/debug.js","../lib/closure-library/closure/goog/debug/logrecord.js","../lib/closure-library/closure/goog/debug/logbuffer.js","../lib/closure-library/closure/goog/debug/logger.js","../lib/closure-library/closure/goog/log/log.js","../lib/closure-library/closure/goog/net/errorcode.js","../lib/closure-library/closure/goog/net/eventtype.js","../lib/closure-library/closure/goog/net/httpstatus.js","../lib/closure-library/closure/goog/net/xhrlike.js","../lib/closure-library/closure/goog/net/xmlhttpfactory.js","../lib/closure-library/closure/goog/net/wrapperxmlhttpfactory.js","../lib/closure-library/closure/goog/net/xmlhttp.js","../lib/closure-library/closure/goog/net/xhrio.js","utils/Utils.js","ol3/events/EventType.js","ol3/events/ParsedCswRecordEvent.js","../lib/closure-library/closure/goog/events/keycodes.js","../lib/closure-library/closure/goog/events/keyhandler.js","ol3/controls/LayerSpy.js","ol3/controls/RotateNorth.js","ol3/tools/Georeferencer.js","ol3/tools/ReportError.js","ol3/tools/MesstischblattViewer.js","ol3/tools/MetadataVisualizer.js","ol3/tools/ResetGeoreferenceParameter.js","ol3/requests/Georeferencer.js","ol3/requests/CSW_GetRecordById.js");
     var len = jsfiles.length;
     var allScriptTags = new Array(len);
     var host = getScriptLocation();  
     for (var i=0; i<len; i++) {
         allScriptTags[i] = "<script src='" + host + jsfiles[i] +"'></script>";
     }
     document.write(allScriptTags.join(""));
 })();