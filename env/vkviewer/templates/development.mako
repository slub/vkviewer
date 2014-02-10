<%inherit file="basic_page_slim.mako" />

<%block name="header_content">
	  <link rel="stylesheet" type="text/css" href="${request.static_url('vkviewer:static/css/vk2/templates/template_pages.css')}" />
	  <link rel="stylesheet" type="text/css" href="${request.static_url('vkviewer:static/css/vk2/templates/development.css')}" />
	  <link rel="stylesheet" type="text/css" href="${request.static_url('vkviewer:static/lib/min/css/vkviewer-libarys.min.css')}" media="screen" />	  
	  
	  <style>
	  .overlayElem{
	  	position: absolute;
	  	top:50px;
	  }
	  
	  .overlayElem .maximize .layer-max-container{
		    margin-left: 10px;
		    width: 300px;
		    height: 70px;
		    border-radius: 6px;
		    font-size: 12px;
		    font-family: "Helvectica", "Arial", "sans-serif";
		    line-height: 100%;
		    border-width: 1px;
		    border-style: dotted;
		    border-color: rgb(0, 159,227);
		}
	  	
	  	.overlayElem .maximize .layer-max-container .media, .overlayElem .maximize .layer-max-container .media-body{
	  		overflow: visible;
	  	}
	  	
		.overlayElem .maximize .thumbnail{
			margin: 8px;
			padding: 0px;
		}

		/* Css styles for slider div generic */
		.overlayElem .maximize .slider-container{
		    position: relative;
		    float: left;
		    width: 150px;
		    height: 60px;
		}

		.slider-container .slider-outer{
			padding: 5px;
		}
		
		.slider-container .slider-inner{
			margin-left: 7px;
			margin-top: 3px;
			width: 100px;
		}
		
		.slider-container .tooltip{
			top: -33px;
			left: -10px;
			display: none;
		}
		
		.slider-container .label{
		    font-size: 10px;
		    color: #333;
		}

		.slider-container .time .tooltip{
			top: -33px;
			left: -5px;
			display: none;
		}
		
		.slider-container .time .slider-outer{
			padding: 0px 5px 5px 5px;
		}
		
	  </style>
</%block>

<%block name="body_content">
	<div class="overlayElem">
		<div class="maximize">
			<div class="layer-max-container">
				<div class="media">
					<img class="thumbnail pull-left media-object" src="/vkviewer/static/images/layer_default.png" alt="...">
					<div class="media-body slider-container">
							<div class="opacity">
								<div class="slider-outer">
									<div class="label">Opacity:</div>
									<div class="slider-inner" id="sliderContainer">
										<div class="tooltip top in fade">
											<div class="tooltip-arrow"></div>
											<div class="tooltip-inner"></div>
										</div>
									</div>
								</div>
							</div>
							
							<div class="time">
								<div class="slider-outer">
									<div class="label">Time:</div>
									<div class="slider-inner" id="sliderContainer2">
										<div class="tooltip top in fade">
											<div class="tooltip-arrow"></div>
											<div class="tooltip-inner"></div>
										</div>
									</div>
								</div>
							</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</%block>

<%block name="js_content">
	<script src="${request.static_url('vkviewer:static/lib/min/jquery.min.js')}"></script>
	<script src="${request.static_url('vkviewer:static/lib/min/jquery.fancybox.min.js')}"></script>
	<script src="${request.static_url('vkviewer:static/lib/min/jquery-ui-1.10.4.custom.min.js')}"></script>
	<script src="${request.static_url('vkviewer:static/lib/min/bootstrap.min.js')}"></script>
	
	
	<script>
	
		var minValue = 0;
		var maxValue = 100;
		var offset_y = -15;
        var timeSlider = $('#sliderContainer').slider({
            min: minValue,
            max: maxValue,
            value: 0,
            animate: 'slow',
            orientation: 'horizontal',
            step: 1,
            // the next three events are managing the tooltip
            start: function(event, ui){
                $(this.parentElement).find('.tooltip').fadeIn('fast');
            },
            slide: function(event, ui){
            	console.log('slide... ');
            	var tooltip = $(this.parentElement).find('.tooltip');
            	var shift_left = (minValue - ui.value - offset_y) * -1 ;
            	tooltip.css('left', shift_left + 'px');
				tooltip.find('.tooltip-inner').html(ui.value);
            },
            stop: function(event, ui){
                $(this.parentElement).find('.tooltip').fadeOut('fast');
            }
        });
        
        var timeSlider = $('#sliderContainer2').slider({
            min: minValue,
            max: maxValue,
            value: 0,
            animate: 'slow',
            orientation: 'horizontal',
            step: 1,
            // the next three events are managing the tooltip
            start: function(event, ui){
                $(this.parentElement).find('.tooltip').fadeIn('fast');
            },
            slide: function(event, ui){
            	console.log('slide... ');
            	var tooltip = $(this.parentElement).find('.tooltip');
            	var shift_left = (minValue - ui.value - offset_y) * -1 ;
            	tooltip.css('left', shift_left + 'px');
				tooltip.find('.tooltip-inner').html(ui.value);
            },
            stop: function(event, ui){
                $(this.parentElement).find('.tooltip').fadeOut('fast');
            }
        });
		
		
    </script>  
</%block>