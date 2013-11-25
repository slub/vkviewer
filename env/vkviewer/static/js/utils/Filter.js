VK2.Filter = {
		getBoundingBoxFilter: function(extent, projectionName){
			var newFilter = new OpenLayers.Filter.Spatial({
                type: OpenLayers.Filter.Spatial.BBOX,
                value: extent,
                projection: projectionName
			});
			return newFilter;
		},
		
		getTimeFilter: function(extent, projectionName, startTime, endTime){
	        var newFilter = new OpenLayers.Filter.Logical({
	            type: OpenLayers.Filter.Logical.AND,
	            filters: [
	                new OpenLayers.Filter.Spatial({
	                    type: OpenLayers.Filter.Spatial.BBOX,
	                    value: extent,
	                    projection: projectionName
	                }),
	                new OpenLayers.Filter.Logical({
	                    type: OpenLayers.Filter.Logical.AND,
	                    filters: [         
	                        new OpenLayers.Filter.Comparison({
	                            type: OpenLayers.Filter.Comparison.LESS_THAN_OR_EQUAL_TO,
	                            property: "time",
	                            value: endTime
	                        }),
	                        new OpenLayers.Filter.Comparison({
	                            type: OpenLayers.Filter.Comparison.GREATER_THAN_OR_EQUAL_TO,
	                            property: "time",
	                            value: startTime
	                        })
	                    ]
	                })
	            ]
	        });
	        return newFilter;
		}
}