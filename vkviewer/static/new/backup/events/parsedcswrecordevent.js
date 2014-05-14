goog.provide('VK2.Events.ParsedCswRecordEvent');

goog.require('VK2.Events.EventType');
goog.require('goog.events.Event');

VK2.Events.ParsedCswRecordEvent = function(parser, content){
	goog.events.Event.call(this, VK2.Events.EventType.PARSED_RECORD)
	
	/**
	 * @type {Object}
	 * @public
	 */
	this.parser = parser;
	
	/**
	 * @type {Object}
	 * @public
	 */
	this.parsed_content = content;
}
goog.inherits(VK2.Events.ParsedCswRecordEvent, goog.events.Event)