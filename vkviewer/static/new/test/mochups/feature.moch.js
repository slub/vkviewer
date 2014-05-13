var getFeatureMoch = function(obj){		
	obj.get = function(key){
		if (this.hasOwnProperty(key))
			return this[key];
	};
	return obj;
};