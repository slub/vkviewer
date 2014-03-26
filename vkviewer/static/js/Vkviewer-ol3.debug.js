(function() {
     var scriptName = "Vkviewer-ol3.debug.js";
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
     var jsfiles = new Array("utils/Settings.js","utils/Utils.js","ol3/events/EventType.js","ol3/events/ParsedCswRecordEvent.js","ol3/controls/LayerSpy.js","ol3/controls/RotateNorth.js","ol3/tools/Georeferencer.js","ol3/tools/ReportError.js","ol3/tools/MesstischblattViewer.js","ol3/tools/MetadataVisualizer.js","ol3/tools/ResetGeoreferenceParameter.js","ol3/tools/ZoomifyViewer.js","ol3/tools/SingleMapViewer.js","ol3/requests/Georeferencer.js","ol3/requests/CSW_GetRecordById.js");
     var len = jsfiles.length;
     var allScriptTags = new Array(len);
     var host = getScriptLocation();  
     for (var i=0; i<len; i++) {
         allScriptTags[i] = "<script src='" + host + jsfiles[i] +"'></script>";
     }
     document.write(allScriptTags.join(""));
 })();