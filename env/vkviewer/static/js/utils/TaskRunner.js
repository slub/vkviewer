/**
 * https://github.com/huncent/Jquery-TaskRunner
 * 
 * modified by Jacob Mendt to publish the TaskRunner in object style
 */
//Fix for IE,Opera and Safari
if (!Array.indexOf) {
  Array.prototype.indexOf = function (obj, start) {
    for (var i = (start || 0); i < this.length; i++) {
      if (this[i] == obj) {
        return i;
      }
    }
    return -1;
  }
}
Array.prototype.remove = function(o) {
  return this.removeFromTo(this.indexOf(o));
};
Array.prototype.removeFromTo = function(from, to) {
  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
};

VK2.Utils.TaskRunner = VK2.Class({
	
	_settings: {
		interval: 0
	},
	
	_taskRunner: null,
	
	_createSlimTaskRunner: function(interval){
		var obj = {
				tasks: [], 
	            removeQueue: [],
	            id: 0,
	            running: false,
	            stopThread: function(){
	            	obj.running = false;
	                clearInterval(obj.id);
	                obj.id = 0;
	            },
	            startThread: function(){
	                if(!obj.running){
	                	obj.running = true;
	                	obj.id = setInterval(obj.runTasks, obj.interval);
	                }
	            },
	            removeTask: function(t){
	            	obj.removeQueue.push(t);
	                if(t.onStop){
	                    t.onStop.apply(t.scope || t);
	                }
	            },
	            runTasks: function(){
	            	var rqLen = obj.removeQueue.length,
	            		now = new Date().getTime();                                                        
	            
	                if(rqLen > 0){
	                    for(var i = 0; i < rqLen; i++){
	                    	obj.tasks.remove(obj.removeQueue[i]);
	                    }
	                    obj.removeQueue = [];
	                    if(obj.tasks.length < 1){
	                    	obj.stopThread();
	                        return;
	                    }
	                }                
	                for(var i = 0, t, itime, rt, len = obj.tasks.length; i < len; ++i){
	                    t = obj.tasks[i];
	                    itime = now - t.taskRunTime;
	                    if(t.interval <= itime){
	                        rt = t.run.apply(t.scope || t, t.args || [++t.taskRunCount]);
	                        t.taskRunTime = now;
	                        if(rt === false || t.taskRunCount === t.repeat){
	                        	obj.removeTask(t);
	                            return;
	                        }
	                    }
	                    if(t.duration && t.duration <= (now - t.taskStartTime)){
	                    	obj.removeTask(t);
	                    }
	                }
	            }
		};
		
		obj.interval = interval || 10;
		
		obj.start = function(task){
			obj.tasks.push(task);
			task.taskStartTime = new Date().getTime();
		    task.taskRunTime = 0;
		    task.taskRunCount = 0;
		    obj.startThread();
		    return task;
		};
		
		obj.stop = function(task){
			obj.removeTask(task);
		    return task;
		};
		
		obj.stopAll = function(){
			obj.stopThread();
			for(var i = 0, len = obj.tasks.length; i < len; i++){
				if(obj.tasks[i].onStop){
					obj.tasks[i].onStop();
				}
			}
			
		    obj.tasks = [];
		    obj.removeQueue = [];
		};
		
		return obj;
	},

	_updateSettings: function(settings){
		for (var key in settings){
			this._settings[key] = settings[key];
		}		
	},
	
	initialize: function(settings){
		this._updateSettings(settings);	
		this._taskRunner = this._createSlimTaskRunner(this._settings.interval);
	},

	runTask: function(task){
		// start task if it is not running
		if (!task.running){
			this._taskRunner.start(task);
			task.running = true;
			return task;
		} else {
			console.log('Task is already running');
		}
	},
	
	stopTask: function(task){		
		// stop task if it is not running
		if (task.running){
			this._taskRunner.stop(task);
			task.running = false;
			return task;
		} else {
			console.log('Task is already stopped');
		}
	},
	
	resetTaskRunner: function(){
		this._taskRunner.stopAll();
		this._taskRunner = this._createSlimTaskRunner(this._settings.interval);
	}
});