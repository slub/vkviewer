VK2.Utils.Tasks = {
		
		createDisplayLayerTask: function(layers, onStep, onEnd, speedConf, taskRunner){	
			task = {
					run: function(){
						if (this.counter < this.layers.length){
							// initialize layer and add him to map
							var layer = this.layers[this.counter];
							
							// call callback and slide in the time layer
							onStep(layer.params.TIME);
							
							// fadeIn 
							// check if the layer is visible
							if (!layer.getVisibility()) throw "Visibility of Layer is false!";	
							var taskRunnerFadeIn = new VK2.Utils.TaskRunner();
							var taskFadeIn = VK2.Utils.Tasks.createFadeInTask(layer, speedConf['fadeIn'], taskRunnerFadeIn);
							taskRunnerFadeIn.runTask(taskFadeIn)
							
							// increment counter
							this.counter++;
							return true;
						} else {
							taskRunner.resetTaskRunner();
							onEnd();
						}
					},
					interval: speedConf['layer'],
					counter: 0,
					running: false,
					layers: layers
			};
				
			return task;
		},
		createFadeInTask: function(layer, fadeInTime, taskRunner){
		
			var task = {
					run: function(){
						if (this.opacity <= 1){
							this.opacity += 0.125;
							layer.setOpacity(this.opacity);
							console.log("Opacity: "+this.opacity);
						} else {
							taskRunner.resetTaskRunner();
						}
					}, 
					interval: fadeInTime,
					running: false,
					opacity: -0.125
			}			
			return task;
		}
}