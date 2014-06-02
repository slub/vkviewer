/* 
 * see: http://addyosmani.com/resources/essentialjsdesignpatterns/book/#observerpatternjavascript
 * Publish/SubscribeImplementation
 */
Vk2.PubSub = {};

(function(q){

    var topics = {},
        subUid = -1;
        
    // Publish or broadcast events of interest with a specific topic name and
    // arguments such as the data to pass along
    q.publish = function( topic, args ){
      
        if ( !topics[topic] ){
            return false;
        }
        
        var subscribers = topics[topic],
            len = subscribers ? subscribers.length : 0;
        
        while (len--){
            subscribers[len].func( topic, args );
        }
        
        return this;
    };
    
    // Subscribe to events of interest with a specific topic name and a 
    // callback function, to be exectued when the topic/event is observed
    q.subscribe = function( topic, func ){
        
        if (!topics[topic]){
            topics[topic] = [];
        }
        
        var token = ( ++subUid ).toString();
        topics[topic].push({
            token: token,
            func: func
        });
        return token;
    }
    
    q.unsubscribe = function( token ){
        for ( var m in topics ){
            if ( topics[m] ){
                for (var i = 0, j = topics[m].length; i < j; i++){
                    if ( topics[m][i].token === token){
                        topics[m].splice( i, 1 );
                        return token;
                    }
                }
            }
        }
        return this;
    };
}( PubSub ));