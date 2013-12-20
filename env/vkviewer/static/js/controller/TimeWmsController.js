VK2.Controller.TimeWmsController = VK2.Class({
	
	/*
	 * attribute: _settings
	 * {Object} - Basic settings
	 */
	_settings: {
			// objects
			timeWmsModule: null,
			timeSlider: null,
			// values
			actualTime: null,
			time_steps_legend: 5,
			timeWmsSpeed: 'normal',
			// html elements
			contentDiv: null,
			timeSliderPanel: null, 
			playTimeWmsEl: null,
			pauseTimeWmsEl: null,
			stopTimeWmsEl: null,
	},
	
	_updateSettings: function(settings){
		for (var key in settings){
			this._settings[key] = settings[key];
		}		
	},
	
	_loadContent: function(){
		if (this._settings.contentDiv){
			// load time slider
			this._settings.timeSliderPanel = document.createElement('div');
			this._settings.timeSliderPanel.id = 'sliderPanel';
			this._settings.timeSliderPanel.className = 'sliderPanel';
			this._settings.contentDiv.appendChild(this._settings.timeSliderPanel);
			
			// initialize timeslider
			this._settings.timeSlider = new TimeSlider({
				containerDiv: this._settings.timeSliderPanel,
				start_time: this._settings.timeWmsModule.getStartTime(),
				end_time: this._settings.timeWmsModule.getEndTime(),
				time_steps_legend: this._settings.time_steps_legend
			}) 		
			
			// element in which the actual timestamp is displayed
			var speedChooser = this._loadSpeedChooser()
			
			// play btn
			this._settings.playTimeWmsEl = document.createElement('div');
			this._settings.playTimeWmsEl.className = 'play controls';	
			
			// pause btn
			this._settings.pauseTimeWmsEl = document.createElement('div');
			this._settings.pauseTimeWmsEl.className = 'pause controls';
			
			// stop btn
			this._settings.stopTimeWmsEl = document.createElement('div');
			this._settings.stopTimeWmsEl.className = 'stop controls';
			
			// append them to the parent container
			this._settings.contentDiv.appendChild(speedChooser);
			this._settings.contentDiv.appendChild(this._settings.playTimeWmsEl);
			this._settings.contentDiv.appendChild(this._settings.pauseTimeWmsEl);
			this._settings.contentDiv.appendChild(this._settings.stopTimeWmsEl);
			return true;
		} else {
			throw "Missing content div for time wms controller!";
		}
	},
	
	_loadEventBehavior: function(){		
		
		var settings = this._settings;
		// callback for changing timestamp
		var callbackStep = function(timestamp, layer){
			
			if (settings.timeSlider){
				settings.timeSlider.setTimeLabelValue(timestamp);
			} else  {
				console.log('Timestamp: ' + timestamp);
			}
		};
		
		var callbackOnEnd = function(){
			settings.timeSlider.clearTimeLabelValue();
		}
		
		$(this._settings.playTimeWmsEl).click(function(){
			var start_time = settings.timeSlider.getStartTime();
			var end_time = settings.timeSlider.getEndTime();
			var timer = settings.timeWmsModule.run(callbackStep, callbackOnEnd, start_time, 
					end_time, settings.timeWmsSpeed);
		});
		
		// behavior pause btn
		$(this._settings.pauseTimeWmsEl).click(function(){
			settings.timeWmsModule.pause();
		});
		
		// behavior stop btn 
		$(this._settings.stopTimeWmsEl).click(function(){
			settings.timeWmsModule.stop();
		});
	},
	
	_loadSpeedChooser: function(){
		var settings = this._settings;
		// container
		
		var container = document.createElement('div');
		container.className = 'speedChooserPanel';
		
		// label & select box
		var label = document.createElement('span');
		label.innerHTML = 'Wähle Geschwindigkeit';
		
		// add onchange event listener to the select box
		var select = document.createElement('select');
		$(select).change(function(){
			var val = $(this).find('option:selected').val();
			settings.timeWmsSpeed = val;
		});
		
		var option_slow = document.createElement('option');
		option_slow.innerHTML = 'langsam';
		option_slow.value = 'slow';
		
		var option_normal = document.createElement('option');
		option_normal.innerHTML = 'normal';
		option_normal.value = 'normal';
		
		var option_fast = document.createElement('option');
		option_fast.innerHTML = 'schnell';
		option_fast.value = 'fast';
		
		select.appendChild(option_normal);
		select.appendChild(option_slow);
		select.appendChild(option_fast);
		container.appendChild(label);
		container.appendChild(select);
		
		return container
	},
	
	initialize: function(settings){
		this._updateSettings(settings);
		
		var contentLoaded = this._loadContent(this._settings.contentDiv);
		
		if (contentLoaded){
			this._loadEventBehavior();	
		}
		
		if (this._settings.timeWmsModule){
			this._settings.actualTime = this._settings.timeWmsModule.getStartTime(); 
		}
		
		return true;
	},
	
	activate: function(){
		console.log("Cooming soon!");
	},
	deactivate: function(){
		console.log("Cooming soon!");
	}

})