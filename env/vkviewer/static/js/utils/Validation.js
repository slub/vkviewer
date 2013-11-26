VK2.Validation = {
		isBlattnumber: function(string){
			var blattNrParts = [];
			
			var hasDoublePoints = (string.indexOf(':') !== -1)
			var hasUnderscore = (string.indexOf('_') !== -1)
			
			blattNrParts  = hasDoublePoints ? string.split(':') : hasUnderscore ? string.split('_') : [];
			
			if (blattNrParts.length == 2){
				areNumbers = true;
				areNumbers = areNumbers && this.isInt(blattNrParts[0]) ? true : false;
				areNumbers = areNumbers && this.isInt(blattNrParts[1]) ? true : false;
				
				areNumbers = areNumbers && blattNrParts[0].length <= 3 ? true : false;
				areNumbers = areNumbers && blattNrParts[1].length <= 3 ? true : false;
				
				//console.log(blattNrParts + " is "+areNumbers);
				return areNumbers;
			} else {
				return false;
			}
		},
		
		isInt: function(string){
			isValideInteger = /^[0-9]+$/.test(string);
			return isValideInteger;
		}
}