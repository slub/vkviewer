/**
 * Module: Mediator
 * 
 * This module implement the mediator pattern. It should manage the different control events registered 
 * on the OpenLayers.Map object by the different sidebar tools.
 */
var Mediator = (function(){
	
	var subscribe = function(channel, fn){
		console.log("Channel "+channel+" subscribed!");
		
		// if channel not initialize do it
		if (!Mediator.channels[channel]) Mediator.channels[channel] = [];
		
		// add new subscribe token to channel
		Mediator.channels[channel].push({ context: this, callback: fn });
		return this;		
	};
	
	var publish = function(channel){
		console.log("Channel "+channel+" published!");
		
		if(!Mediator.channels[channel]) return false;
		var args = Array.prototype.slice.call(arguments, 1);
		for (var i = 0, l = Mediator.channels[channel].length; i < l; i++){
			var subscription = Mediator.channels[channel][i];
			subscription.callback.apply(subscription.context, args);
		}
		return this;
	};
	
	
	
	return {
		channels: {},
		publish: publish,
		subscribe: subscribe,
		// the installTo function is for doing pub/sub via a third party mediator
		installTo: function(obj){
			obj.subscribe = subscribe;
			obj.publish = publish;
		}
	}
}());