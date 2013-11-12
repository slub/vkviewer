/*!
 * Copyright (c) 2012 Ben Olson (https://github.com/bseth99/jquery-ui-extensions)
 * jQuery UI LabeledSlider @VERSION
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 *
 * Depends:
 *  jquery.ui.core.js
 *  jquery.ui.widget.js
 *  jquery.ui.mouse.js
 *  jquery.ui.slider.js
 */

(function( $, undefined ) {


    $.widget( "ui.labeledslider", $.ui.slider, {

      version: "@VERSION",

      options: {
         tickInterval: 0,
         tweenLabels: true,
         tickLabels: null
      },

      uiSlider: null,
      tickInterval: 0,
      tweenLabels: true,

      _create: function( ) {

         this._detectOrientation();

         this.uiSlider =
             this.element
                .wrap( '<div class="ui-slider-wrapper ui-widget"></div>' )
                .before( '<div class="ui-slider-labels">' )
                .parent()
                .addClass( this.orientation )
                .css( 'font-size', this.element.css('font-size') );

         this._super();

         this.element.removeClass( 'ui-widget' )

         this._alignWithStep();

         if ( this.orientation == 'horizontal' ) {
            this.uiSlider
               .width( this.element.width() );
         } else {
            this.uiSlider
               .height( this.element.height() );
         }

         this._drawLabels();
      },

      _drawLabels: function () {
    	  var labels = this.options.tickLabels || {},
             $lbl = this.uiSlider.children( '.ui-slider-labels' ),
             dir = this.orientation == 'horizontal' ? 'left' : 'bottom',
             min = this.options.min,
             max = this.options.max,
             inr = this.tickInterval,
             cnt = ( max - min ) / inr,
             i = 0;

    	  $lbl.html('');
    	  for (;i<=cnt; i++) {
        	var positionLeft =  Math.round( i / cnt * 10000 ) / 100
        	var label = Math.round(i*inr+min);

            $('<div>').addClass( 'ui-slider-label-ticks' )
               .css( dir,positionLeft + '%' )
               .html( '<span>'+( labels[label] ? labels[label] : (this.options.tweenLabels ? label : '') )+'</span>' )
               .appendTo( $lbl );
    	  }

      },

      _setOption: function( key, value ) {

          this._super( key, value );

          switch ( key ) {

             case 'tickInterval':
             case 'tickLabels':
             case 'min':
             case 'max':
             case 'step':

                this._alignWithStep();
                this._drawLabels();
                break;

             case 'orientation':

                this.element
                   .removeClass( 'horizontal vertical' )
                   .addClass( this.orientation );

                this._drawLabels();
                break;
          }
       },

       _alignWithStep: function () {
          if ( this.options.tickInterval < this.options.step )
            this.tickInterval = this.options.step;
          else
            this.tickInterval = this.options.tickInterval;
       },

       _destroy: function() {
          this._super();
          this.uiSlider.replaceWith( this.element );
       },

       widget: function() {
          return this.uiSlider;
       }

   });

}(jQuery));

/*!
 * Copyright (c) 2013 Jacob Mendt
 */

var TimeSlider = Class({
	
	/*
	 * attribute: _settings
	 * {Object} - Basic settings
	 */
	_settings: {
			containerDiv: null,
			sliderValueDiv: null,
			sliderDiv: null,
			start_time: 1868,
			end_time: 1945,
			actual_time: [],
			time_steps: 1,
			time_steps_legend: 11
	},
	
	initialize: function(settings){
		// update settings
		for (var key in settings){
			this._settings[key] = settings[key];
		};
		
		// set actual time of not set 
		if (this._settings.actual_time.length == 0){
			this._settings.actual_time = [this._settings.start_time,this._settings.end_time];
		}
		
		// load and create elements
		this._loadContent();
		
		// init time slider
        var timeSlider = $(this._settings.sliderDiv).labeledslider({
            range: true,
            min: this._settings.start_time,
            max: this._settings.end_time,
            tickInterval: this._settings.time_steps_legend,
            values: this._settings.actual_time,
            animate: 'slow',
            orientation: 'horizontal',
            step: this._settings.time_steps,
            slide: function( event, ui ) {
            	console.log("Slider one: " + ui.values[ 0 ]);
            	console.log("Slider two: " + ui.values[ 1 ]);
            },
            change: $.proxy(function( event, ui ){
            	this._settings.actual_time = ui.values;
            	console.log("Slider change event!")
            }, this)
        })
    
	},
	
	_loadContent: function(){
		if (this._settings.containerDiv){
			// div for showing the slider value
			this._settings.sliderValueDiv = document.createElement('div');
			this._settings.sliderValueDiv.id = 'sliderValue';
			this._settings.sliderValueDiv.className = 'sliderValue';
			this._settings.sliderValueDiv.innerHTML = 'Wähle Zeitraum für dynamische Visualisierung';
			
			// jquery slider div
			this._settings.sliderDiv = document.createElement('div');
			this._settings.sliderDiv.id = 'sliderContainer';
			this._settings.sliderDiv.className = 'sliderContainer';
			
			// append them to the parent container
			this._settings.containerDiv.appendChild(this._settings.sliderValueDiv);
			this._settings.containerDiv.appendChild(this._settings.sliderDiv);
			return true;
		} else {
			console.log('Time slider is missing the container div!');
			return false;
		}
	},
	
	setTimeLabelValue: function(value){
		this._settings.sliderValueDiv.innerHTML = value;
	},
	
	clearTimeLabelValue: function(){
		this._settings.sliderValueDiv.innerHTML = 'Wähle Zeitraum für dynamische Visualisierung';
	},
	
	getStartTime: function(){
		return this._settings.actual_time[0];
	},
	
	getEndTime: function(){
		return this._settings.actual_time[1];
	}
});
